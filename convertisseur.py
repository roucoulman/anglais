import cv2
import numpy as np

# =====================================================================
# PARAMÈTRES FACILEMENT RÉGLABLES
# =====================================================================
IMAGE_PATH = "img/photos/tree.png"          # Chemin de ton image source
OUTPUT_PATH = "img/photos/tree_ascii.png"   # Chemin de sauvegarde (si activé)
SAUVEGARDER_PNG = True                         # Passe à True quand tu veux enregistrer le .png

# 1. Densité et proportions
LARGEUR_CARACTERES = 256   # Nombre de caractères en largeur (150 à 350 pour beaucoup de détails)
RATIO_CARACTERE = 1.0      # 1.0 = conserve exactement les proportions rectangulaires de l'image

# 2. Apparence et couleurs
MODE_COULEUR = True             # True = couleurs d'origine | False = monochrome
COULEUR_TEXTE = (255, 255, 255) # Couleur BGR si MODE_COULEUR = False (ex: (0, 255, 70) pour vert Matrix)
COULEUR_FOND = (15, 15, 15)     # Couleur de fond BGR (utilisée si l'image n'a pas de transparence)
INVERSER_LUMINOSITE = False     # True pour fond clair / texte foncé
SEUIL_TRANSPARENCE = 128        # Opacité minimale (0 à 255) pour qu'un pixel soit pris en compte

# 3. Qualité et netteté (Anti-flou pour le web)
TAILLE_CELLULE_PX = 16     # Taille d'une cellule en pixels (16 = haute résolution nette sur le web)
ECHELLE_POLICE = 0.55      # Taille de la police OpenCV (adaptée à TAILLE_CELLULE_PX = 16)
EPAISSEUR_TRAIT = 10       # Épaisseur des caractères (1 ou 2)
CONTRASTE = 1              # 1.0 = normal, > 1.0 = renforce les contrastes
LUMINOSITE = 0             # Décalage de luminosité (-50 à +50)

# Palette ASCII ultra-dense (70 niveaux du plus sombre au plus lumineux)
PALETTE_ASCII = r"$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
# =====================================================================


def image_to_ascii():
    # Chargement de l'image en conservant le canal alpha (transparence) s'il existe
    img = cv2.imread(IMAGE_PATH, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Erreur : Impossible de charger l'image '{IMAGE_PATH}'. Vérifie le chemin.")
        return

    # Séparation des couleurs (BGR) et du canal alpha (transparence)
    a_transparence = (len(img.shape) == 3 and img.shape[2] == 4)
    if a_transparence:
        bgr = img[:, :, :3]
        alpha = img[:, :, 3]
    else:
        bgr = img if len(img.shape) == 3 else cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        alpha = None

    # Ajustement contraste / luminosité uniquement sur les couleurs
    img_ajustee = cv2.convertScaleAbs(bgr, alpha=CONTRASTE, beta=LUMINOSITE)

    # Calcul des dimensions de la grille ASCII en gardant le ratio exact
    h_orig, w_orig = img_ajustee.shape[:2]
    hauteur_caracteres = int((h_orig / w_orig) * LARGEUR_CARACTERES * RATIO_CARACTERE)

    # Redimensionnement de l'image (et du masque alpha) à la taille de la grille
    img_reduite = cv2.resize(
        img_ajustee,
        (LARGEUR_CARACTERES, hauteur_caracteres),
        interpolation=cv2.INTER_AREA
    )
    gris = cv2.cvtColor(img_reduite, cv2.COLOR_BGR2GRAY)

    alpha_reduit = None
    if a_transparence:
        alpha_reduit = cv2.resize(
            alpha,
            (LARGEUR_CARACTERES, hauteur_caracteres),
            interpolation=cv2.INTER_AREA
        )

    # Orientation de la palette selon le fond
    palette = PALETTE_ASCII if INVERSER_LUMINOSITE else PALETTE_ASCII[::-1]
    nb_chars = len(palette)

    # Création du canevas haute résolution (transparent BGRA si l'image source a de la transparence)
    canvas_h = hauteur_caracteres * TAILLE_CELLULE_PX
    canvas_w = LARGEUR_CARACTERES * TAILLE_CELLULE_PX

    if a_transparence:
        canvas = np.zeros((canvas_h, canvas_w, 4), dtype=np.uint8)
    else:
        canvas = np.full((canvas_h, canvas_w, 3), COULEUR_FOND, dtype=np.uint8)

    # Dessin de chaque caractère
    for y in range(hauteur_caracteres):
        pos_y = (y + 1) * TAILLE_CELLULE_PX - 3
        for x in range(LARGEUR_CARACTERES):
            # On ignore la cellule si le pixel d'origine est transparent
            if a_transparence and alpha_reduit[y, x] < SEUIL_TRANSPARENCE:
                continue

            luminosite_pixel = int(gris[y, x])
            index_char = int((luminosite_pixel / 255) * (nb_chars - 1))
            caractere = palette[index_char]

            if caractere == " ":
                continue

            couleur_bgr = tuple(int(c) for c in img_reduite[y, x]) if MODE_COULEUR else COULEUR_TEXTE
            couleur = (*couleur_bgr, 255) if a_transparence else couleur_bgr
            pos_x = x * TAILLE_CELLULE_PX

            cv2.putText(
                canvas,
                caractere,
                (pos_x, pos_y),
                cv2.FONT_HERSHEY_SIMPLEX,
                ECHELLE_POLICE,
                couleur,
                EPAISSEUR_TRAIT,
                lineType=cv2.LINE_AA
            )

    # Sauvegarde optionnelle en PNG sans perte (conserve la transparence)
    if SAUVEGARDER_PNG:
        cv2.imwrite(OUTPUT_PATH, canvas)
        print(f"Image haute résolution enregistrée sous : {OUTPUT_PATH} ({canvas_w}x{canvas_h} px)")

    # Préparation de l'aperçu (OpenCV n'affiche pas la transparence dans imshow)
    if a_transparence:
        alpha_norm = canvas[:, :, 3:4] / 255.0
        fond_apercu = np.full((canvas_h, canvas_w, 3), COULEUR_FOND, dtype=np.uint8)
        apercu = (canvas[:, :, :3] * alpha_norm + fond_apercu * (1 - alpha_norm)).astype(np.uint8)
    else:
        apercu = canvas

    # Affichage proportionnel à l'écran
    nom_fenetre = "Rendu ASCII (Appuie sur Q ou Echap pour fermer)"
    cv2.namedWindow(nom_fenetre, cv2.WINDOW_NORMAL)

    facteur_echelle = min(1400 / canvas_w, 900 / canvas_h, 1.0)
    cv2.resizeWindow(nom_fenetre, int(canvas_w * facteur_echelle), int(canvas_h * facteur_echelle))

    cv2.imshow(nom_fenetre, apercu)
    print(f"Aperçu affiché ({canvas_w}x{canvas_h} px). Appuie sur 'Q' ou 'Échap' pour quitter.")

    while True:
        touche = cv2.waitKey(0) & 0xFF
        if touche in (ord('q'), ord('Q'), 27):
            break

    cv2.destroyAllWindows()


if __name__ == "__main__":
    image_to_ascii()
import cv2
import numpy as np

# =====================================================================
# PARAMÈTRES FACILEMENT RÉGLABLES
# =====================================================================
IMAGE_PATH = "img/photos/cloud.png"        # Image source
OUTPUT_PATH = "img/photos/cloud_ascii.png" # OBLIGATOIREMENT en .png pour garder la transparence
SAUVEGARDER_PNG = True                      # Passe à True pour enregistrer le fichier final

# 1. Densité, proportions et transparence
LARGEUR_CARACTERES =  1024   # Nombre de caractères en largeur
RATIO_CARACTERE = 1.0      # 1.0 = garde les proportions exactes de l'image
SEUIL_TRANSPARENCE = 1     # 1 à 255 : en dessous de cette opacité, aucun caractère n'est dessiné

# 2. Apparence et couleurs
MODE_COULEUR = True             # True = couleurs d'origine | False = monochrome
COULEUR_TEXTE = (255, 255, 255) # Couleur BGR si MODE_COULEUR = False
INVERSER_LUMINOSITE = True      # True si ton sujet est très sombre et que tu veux des caractères denses sur lui

# 3. Qualité et netteté
TAILLE_CELLULE_PX = 16     # Taille interne d'une cellule en pixels pendant le dessin
ECHELLE_POLICE = 0.55      # Taille de la police OpenCV
EPAISSEUR_TRAIT = 4        # Épaisseur des caractères
CONTRASTE = 1              # 1.0 = normal, > 1.0 = renforce les contrastes
LUMINOSITE = 20             # Décalage de luminosité (-50 à +50)

# Palette ASCII ultra-dense
PALETTE_ASCII = r"$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'."
# =====================================================================


def image_to_ascii_transparent():
    # IMREAD_UNCHANGED permet de conserver le 4e canal (Alpha / Transparence)
    img = cv2.imread(IMAGE_PATH, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Erreur : Impossible de charger l'image '{IMAGE_PATH}'. Vérifie le chemin.")
        return

    # Séparation des couleurs (BGR) et de la transparence (Alpha)
    if len(img.shape) == 3 and img.shape[2] == 4:
        bgr = img[:, :, :3]
        alpha = img[:, :, 3]
    else:
        bgr = img
        alpha = np.full(img.shape[:2], 255, dtype=np.uint8)

    # Ajustement contraste / luminosité uniquement sur les couleurs
    bgr_ajustee = cv2.convertScaleAbs(bgr, alpha=CONTRASTE, beta=LUMINOSITE)

    # Dimensions exactes de l'image d'origine
    h_orig, w_orig = bgr_ajustee.shape[:2]
    hauteur_caracteres = int((h_orig / w_orig) * LARGEUR_CARACTERES * RATIO_CARACTERE)

    # Redimensionnement des couleurs et du canal alpha
    img_reduite = cv2.resize(bgr_ajustee, (LARGEUR_CARACTERES, hauteur_caracteres), interpolation=cv2.INTER_AREA)
    alpha_reduit = cv2.resize(alpha, (LARGEUR_CARACTERES, hauteur_caracteres), interpolation=cv2.INTER_AREA)
    gris = cv2.cvtColor(img_reduite, cv2.COLOR_BGR2GRAY)

    # Orientation de la palette
    palette = PALETTE_ASCII if INVERSER_LUMINOSITE else PALETTE_ASCII[::-1]
    nb_chars = len(palette)

    # Création d'un canevas 4 canaux (BGRA) initialisé à (0, 0, 0, 0) -> 100% transparent
    canvas_h = hauteur_caracteres * TAILLE_CELLULE_PX
    canvas_w = LARGEUR_CARACTERES * TAILLE_CELLULE_PX
    canvas = np.zeros((canvas_h, canvas_w, 4), dtype=np.uint8)

    # Dessin de chaque caractère
    for y in range(hauteur_caracteres):
        pos_y = (y + 1) * TAILLE_CELLULE_PX - 3
        for x in range(LARGEUR_CARACTERES):
            if alpha_reduit[y, x] < SEUIL_TRANSPARENCE:
                continue

            luminosite_pixel = int(gris[y, x])
            index_char = int((luminosite_pixel / 255) * (nb_chars - 1))
            caractere = palette[index_char]

            if MODE_COULEUR:
                b, g, r = img_reduite[y, x]
                couleur = (int(b), int(g), int(r), 255)
            else:
                couleur = (*COULEUR_TEXTE, 255)

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

    # --- REDIMENSIONNEMENT À LA TAILLE EXACTE DE L'IMAGE DE BASE ---
    canvas_final = cv2.resize(canvas, (w_orig, h_orig), interpolation=cv2.INTER_AREA)

    # Sauvegarde en PNG
    if SAUVEGARDER_PNG:
        cv2.imwrite(OUTPUT_PATH, canvas_final)
        print(f"Image enregistrée sous : {OUTPUT_PATH} ({w_orig}x{h_orig} px)")

    # Aperçu OpenCV sur fond gris foncé
    apercu = np.full((h_orig, w_orig, 3), (40, 40, 40), dtype=np.uint8)
    masque_alpha = canvas_final[:, :, 3:4] / 255.0
    apercu = (canvas_final[:, :, :3] * masque_alpha + apercu * (1 - masque_alpha)).astype(np.uint8)

    nom_fenetre = "Apercu ASCII Taille Originale (Q ou Echap pour fermer)"
    cv2.namedWindow(nom_fenetre, cv2.WINDOW_NORMAL)
    facteur_echelle = min(1400 / w_orig, 900 / h_orig, 1.0)
    cv2.resizeWindow(nom_fenetre, int(w_orig * facteur_echelle), int(h_orig * facteur_echelle))
    cv2.imshow(nom_fenetre, apercu)

    while True:
        touche = cv2.waitKey(0) & 0xFF
        if touche in (ord('q'), ord('Q'), 27):
            break

    cv2.destroyAllWindows()


if __name__ == "__main__":
    image_to_ascii_transparent()
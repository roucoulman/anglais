import time
import cv2
import numpy as np

# =====================================================================
# PARAMÈTRES FACILEMENT RÉGLABLES
# =====================================================================
IMAGE_PATH = "img/photos/mountain.jpg"          # Chemin de ton image source
OUTPUT_PATH = "img/langues/mountain_ascii.png"   # Chemin de sauvegarde (si activé)
SAUVEGARDER_PNG = False                              # Passe à True quand tu veux enregistrer le .png

# 1. Densité et proportions
LARGEUR_CARACTERES = 256   # Nombre de caractères en largeur (150 à 350 pour beaucoup de détails)
RATIO_CARACTERE = 1.0     # 1.0 = conserve exactement les proportions rectangulaires de l'image

# 2. Apparence et couleurs
MODE_COULEUR = True             # True = couleurs d'origine | False = monochrome
COULEUR_TEXTE = (255, 255, 255) # Couleur BGR si MODE_COULEUR = False (ex: (0, 255, 70) pour vert Matrix)
COULEUR_FOND = (15, 15, 15)     # Couleur de fond BGR (utilisée si l'image n'a pas de transparence)
INVERSER_LUMINOSITE = False     # True pour fond clair / texte foncé
SEUIL_TRANSPARENCE = 128        # Opacité minimale (0 à 255) pour qu'un pixel soit pris en compte

# 3. Qualité et netteté (Anti-flou pour le web)
TAILLE_CELLULE_PX = 16    # Taille d'une cellule en pixels (16 = haute résolution nette sur le web)
ECHELLE_POLICE = 0.7      # Taille de la police OpenCV (adaptée à TAILLE_CELLULE_PX = 16)
EPAISSEUR_TRAIT = 10      # Épaisseur des caractères (1 ou 2)
CONTRASTE = 1.0           # 1.0 = normal, > 1.0 = renforce les contrastes
LUMINOSITE = 10            # Décalage de luminosité (-50 à +50)

# Palette ASCII ultra-dense (70 niveaux du plus sombre au plus lumineux)
PALETTE_ASCII = r"$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
# =====================================================================


def construire_atlas(cw, ch, palette, echelle_police, epaisseur_trait, inverser_luminosite):
    """Pré-rend chaque caractère une seule fois et génère la table de correspondance (LUT)."""
    font = cv2.FONT_HERSHEY_SIMPLEX
    pos_y = ch - 3

    tuiles = []
    for c in palette:
        tuile = np.zeros((ch, cw), dtype=np.uint8)
        if c != " ":
            cv2.putText(
                tuile, c, (0, pos_y), font,
                echelle_police, 255, epaisseur_trait, lineType=cv2.LINE_AA
            )
        tuiles.append(tuile)

    atlas = np.stack(tuiles)  # Shape: (nb_chars, ch, cw)

    # Tri automatique par densité réelle de pixels dessinés (du plus clair au plus sombre ou inversement)
    densites = atlas.reshape(len(atlas), -1).mean(axis=1)
    ordre = np.argsort(densites)
    if inverser_luminosite:
        ordre = ordre[::-1]
    atlas = atlas[ordre]

    # Table de correspondance directe 0..255 -> index dans l'atlas
    lut = (np.arange(256) / 255.0 * (len(atlas) - 1)).astype(np.intp)
    return atlas, lut


def image_to_ascii():
    t0 = time.perf_counter()

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
    hauteur_caracteres = max(1, int((h_orig / w_orig) * LARGEUR_CARACTERES * RATIO_CARACTERE))

    # Redimensionnement de l'image à la taille de la grille
    img_reduite = cv2.resize(
        img_ajustee,
        (LARGEUR_CARACTERES, hauteur_caracteres),
        interpolation=cv2.INTER_AREA
    )
    gris = cv2.cvtColor(img_reduite, cv2.COLOR_BGR2GRAY)

    # Construction de l'atlas de glyphes et du masque haute résolution vectorisé
    atlas, lut = construire_atlas(
        TAILLE_CELLULE_PX, TAILLE_CELLULE_PX,
        PALETTE_ASCII, ECHELLE_POLICE, EPAISSEUR_TRAIT, INVERSER_LUMINOSITE
    )

    canvas_h = hauteur_caracteres * TAILLE_CELLULE_PX
    canvas_w = LARGEUR_CARACTERES * TAILLE_CELLULE_PX

    # Assemblage instantané de la grille de caractères (0 boucle Python)
    # (rows, cols, ch, cw) -> transpose(0, 2, 1, 3) -> (canvas_h, canvas_w)
    masque_chars = atlas[lut[gris]].transpose(0, 2, 1, 3).reshape(canvas_h, canvas_w)

    # Gestion de la transparence : on met à 0 les cellules sous le seuil d'opacité
    if a_transparence:
        alpha_reduit = cv2.resize(
            alpha,
            (LARGEUR_CARACTERES, hauteur_caracteres),
            interpolation=cv2.INTER_AREA
        )
        masque_valide = np.repeat(
            np.repeat(alpha_reduit >= SEUIL_TRANSPARENCE, TAILLE_CELLULE_PX, axis=0),
            TAILLE_CELLULE_PX, axis=1
        )
        masque_chars = np.where(masque_valide, masque_chars, 0)

    # Préparation de la couche couleur en haute résolution (nearest-neighbor = netteté pixel-perfect par cellule)
    if MODE_COULEUR:
        couleurs_hr = cv2.resize(img_reduite, (canvas_w, canvas_h), interpolation=cv2.INTER_NEAREST)
    else:
        couleurs_hr = np.full((canvas_h, canvas_w, 3), COULEUR_TEXTE, dtype=np.uint8)

    # Composition finale du canevas
    if a_transparence:
        # En mode transparent : couleur pure sur les traits + canal alpha porté par le masque antialiasé
        canvas = np.dstack([couleurs_hr, masque_chars])
    else:
        # Fusion propre entre COULEUR_FOND et la couleur du texte via le masque antialiasé
        alpha_f = masque_chars[:, :, None].astype(np.float32) / 255.0
        fond = np.full((canvas_h, canvas_w, 3), COULEUR_FOND, dtype=np.float32)
        canvas = (couleurs_hr.astype(np.float32) * alpha_f + fond * (1.0 - alpha_f)).astype(np.uint8)

    duree_ms = (time.perf_counter() - t0) * 1000

    # Sauvegarde optionnelle en PNG sans perte (conserve la transparence)
    if SAUVEGARDER_PNG:
        cv2.imwrite(OUTPUT_PATH, canvas)
        print(f"Image enregistrée sous : {OUTPUT_PATH} ({canvas_w}x{canvas_h} px) en {duree_ms:.1f} ms")
    else:
        print(f"Rendu généré ({canvas_w}x{canvas_h} px) en {duree_ms:.1f} ms")

    # Préparation de l'aperçu (OpenCV n'affiche pas la transparence dans imshow)
    if a_transparence:
        alpha_norm = canvas[:, :, 3:4].astype(np.float32) / 255.0
        fond_apercu = np.full((canvas_h, canvas_w, 3), COULEUR_FOND, dtype=np.float32)
        apercu = (canvas[:, :, :3].astype(np.float32) * alpha_norm + fond_apercu * (1.0 - alpha_norm)).astype(np.uint8)
    else:
        apercu = canvas

    # Affichage proportionnel à l'écran
    nom_fenetre = "Rendu ASCII (Appuie sur Q ou Echap pour fermer)"
    cv2.namedWindow(nom_fenetre, cv2.WINDOW_NORMAL)

    facteur_echelle = min(1400 / canvas_w, 900 / canvas_h, 1.0)
    cv2.resizeWindow(nom_fenetre, int(canvas_w * facteur_echelle), int(canvas_h * facteur_echelle))

    cv2.imshow(nom_fenetre, apercu)
    print("Appuie sur 'Q' ou 'Échap' pour quitter.")

    while True:
        touche = cv2.waitKey(0) & 0xFF
        if touche in (ord('q'), ord('Q'), 27):
            break

    cv2.destroyAllWindows()


if __name__ == "__main__":
    image_to_ascii()
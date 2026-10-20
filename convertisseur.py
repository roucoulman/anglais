import cv2
import numpy as np

def transformer_en_pixel_art(chemin_image, chemin_sortie, facteur_pixelisation=5):

    image = cv2.imread(chemin_image)
    if image is None:
        print("Erreur : Impossible de charger l'image.")
        return

    h, w = image.shape[:2]

    nouvelle_largeur = max(1, w // facteur_pixelisation)
    nouvelle_hauteur = max(1, h // facteur_pixelisation)

    image_petite = cv2.resize(image, (nouvelle_largeur, nouvelle_hauteur), interpolation=cv2.INTER_NEAREST)
    image_pixelisee = cv2.resize(image_petite, (w, h), interpolation=cv2.INTER_NEAREST)
    cv2.imwrite(chemin_sortie, image_pixelisee)
    print(f"Image pixel art enregistrée avec succès sous : {chemin_sortie}")

noms = ["mount2","saltlake"]
for nom in noms: 
    transformer_en_pixel_art("img/"+nom+".JPEG", "img/peinture_"+nom+".jpg")
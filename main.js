const arrow = document.querySelector("#arrow");
const mainSection = document.querySelector("main"); // Cible la section juste en dessous de la hero

if (arrow && mainSection) {
    arrow.addEventListener("click", () => {
        mainSection.scrollIntoView({ 
            behavior: "smooth" 
        });
    });
}

document.querySelectorAll('.copy-link').forEach(item => {
    // Sauvegarde le texte d'origine (ex: "Annecy, France" ou "Jonathan Morin")
    const originalText = item.textContent.trim();

    // Action au clic (copie)
    item.addEventListener('click', function() {
        const textToCopy = this.getAttribute('data-copy');
        
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Copié dans le presse-papier : ' + textToCopy);
            });
        }
    });

    // Ajout du texte au survol avec condition
    item.addEventListener('mouseover', function() {
        let valeur = "     (cliquer pour copier)";
        
        // Si c'est Jonathan Morin, on change le message de survol
        if (originalText === "Jonathan Morin") {
            valeur = "    (cliquer pour accéder)";
        }

        item.textContent = originalText + valeur;
    });

    // Retrait du texte quand la souris s'en va
    item.addEventListener('mouseout', function() {
        item.textContent = originalText;
    });
});

// Fonction récursive d'effet machine à écrire
function effetMachineAEcrire(balise, vitesse, pauseFin) {
    if (balise.children.length === 0 && balise.innerText.trim() !== "") {
        const texteComplet = balise.innerText;
        balise.innerText = "";
        let index = 0;

        function etape() {
            if (index <= texteComplet.length) {
                balise.innerText = texteComplet.substring(0, index);
                index++;
                setTimeout(etape, vitesse);
            } 
        }

        etape();
        return;
    }

    for (let e of balise.children) {
        effetMachineAEcrire(e, vitesse, pauseFin);
    }
}

// // --- GESTION DU CARROUSEL DE HOBBIES ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. MODIFIEZ UNIQUEMENT CETTE LISTE pour ajouter/supprimer des photos et leurs légendes
    const dossierCarrousel = "img/carroussel/";
    const photosCarrousel = [
        { src: "mount2.JPEG", caption: "French alps during my firt solo two day hike" },
        { src: "saltlake.JPEG", caption: "Salt Lake in the Qinghai province in China" },
        { src: "ice.JPEG", caption: "Tibetan temple at 4500m altitude in Qinghai" },
        { src: "bouquetin.JPEG", caption: "Alpine ibex in the french alps" },
        { src: "singe.JPEG", caption: "proboscis monkey in Malaysia" },
        { src: "moine.JPEG", caption: "photo shooting with tibetan monks" },
        { src: "tortue.jpg", caption: "Sea turtle in Malaysia" }
    ];

    const container = document.getElementById("carousel-container");
    const captionElement = document.getElementById("carousel-caption");
    const prevBtn = document.querySelector("#carousel-right .prev-btn");
    const nextBtn = document.querySelector("#carousel-right .next-btn");

    if (container && photosCarrousel.length > 0) {
        // 2. Génération automatique des balises <img>
        photosCarrousel.forEach((photo, index) => {
            const img = document.createElement("img");
            img.src = dossierCarrousel + photo.src;
            img.alt = photo.caption;
            img.classList.add("carousel-img");
            if (index === 0) img.classList.add("active");
            container.appendChild(img);
        });

        // Initialisation de la première légende
        if (captionElement) {
            captionElement.textContent = photosCarrousel[0].caption;
        }

        // 3. Navigation du carrousel
        let currentIndex = 0;
        const images = container.querySelectorAll(".carousel-img");

        function showImage(index) {
            images[currentIndex].classList.remove("active");
            currentIndex = (index + images.length) % images.length;
            images[currentIndex].classList.add("active");

            // Mise à jour du titre sous le carrousel
            if (captionElement) {
                captionElement.textContent = photosCarrousel[currentIndex].caption;
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                showImage(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                showImage(currentIndex + 1);
            });
        }

        // 4. Défilement automatique toutes les 3 secondes
        setInterval(() => {
            showImage(currentIndex + 1);
        }, 3000);
    }
});


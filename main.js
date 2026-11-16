const arrow = document.querySelector("#arrow");
const mainSection = document.querySelector("main"); // Cible la section juste en dessous de la hero

arrow.addEventListener("click", () => {
    mainSection.scrollIntoView({ 
        behavior: "smooth" 
    });
});

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


//fonction recurvive de la mort

function effetMachineAEcrire(balise, vitesse, pauseFin) {
    // Si l'élément a du texte direct et qu'il n'est pas vide
    if (balise.children.length === 0 && balise.innerText.trim() !== "") {
        const texteComplet = balise.innerText;
        balise.innerText = ""; // On vide pour commencer l'effet
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

    // Sinon, on parcourt récursivement les enfants
    for (let e of balise.children) {
        effetMachineAEcrire(e, vitesse, pauseFin);
    }
}

// --- GESTION DES CARROUSELS DE HOBBIES ---
document.querySelectorAll('.hobby-carousel').forEach(carousel => {
    const images = carousel.querySelectorAll('.carousel-img');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    let currentIndex = 0;

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }

    // Fonction pour passer à l'image suivante
    function imageSuivante() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    // Fonction pour passer à l'image précédente
    function imagePrecedente() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    nextBtn.addEventListener('click', () => {
        imageSuivante();
    });

    prevBtn.addEventListener('click', () => {
        imagePrecedente();
    });

    // Défilement automatique toutes les secondes (1000 ms)
    setInterval(() => {
        imageSuivante();
    }, 3000);
});
const arrow = document.querySelector("#arrow");
const mainSection = document.querySelector("main"); // Cible la section juste en dessous de la hero

arrow.addEventListener("click", () => {
    mainSection.scrollIntoView({ 
        behavior: "smooth" 
    });
});

document.querySelectorAll('.copy-link').forEach(item => {
    item.addEventListener('click', function() {
        const textToCopy = this.getAttribute('data-copy');
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Copié dans le presse-papier : ' + textToCopy);
        })
    });
});

// --- GESTION DU CHARGEMENT MINECRAFT ---
window.addEventListener('load', () => {
    const loader = document.getElementById('minecraft-loader');
    const percentageText = document.getElementById('loading-percentage');
    const fillBar = document.getElementById('loading-fill');

    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 2) + 2; 
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Disparition de l'écran de chargement une fois à 100%
            setTimeout(() => {
                loader.classList.add('loader-hidden');

                // --- LANCEMENT DE LA MACHINE À ÉCRIRE ICI ---
                const body = document.querySelector("body"); 
                if (typeof effetMachineAEcrire === 'function' && body) {
                    effetMachineAEcrire(body, 0, 2000);
                }

            }, 300);
        }

        percentageText.textContent = progress + '%';
        fillBar.style.setProperty('--load-height', progress + '%');
    }, 40); 
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
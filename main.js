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
                const titre = document.querySelector("body"); 
                if (typeof effetMachineAEcrire === 'function' && titre) {
                    effetMachineAEcrire(titre, 50, 2000);
                }

            }, 300);
        }

        percentageText.textContent = progress + '%';
        fillBar.style.setProperty('--load-height', progress + '%');
    }, 40); 
});
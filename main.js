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



document.addEventListener("DOMContentLoaded", () => {
    const homeGrid = document.getElementById("home-summits-grid");
    const allGrid = document.getElementById("all-summits-grid");

    if (!homeGrid && !allGrid) return;

    function createSummitCard(project) {
        const article = document.createElement("article");
        article.className = "skills-section mountain-card summit-card";

        // Récupère les catégories qu'elles soient dans "categories" ou "category"
        const rawCategories = project.categories || project.category || [];
        const categoriesList = Array.isArray(rawCategories)
            ? rawCategories
            : [rawCategories];

        article.dataset.categories = categoriesList.join(",");
        article.dataset.hours = project.hours;

        const descHTML = project.description
            .map(line => `> ${line}`)
            .join("<br>\n");

        const gearHTML = project.gear
            .map(tech => `<span class="gear-badge">${tech}</span>`)
            .join("");

        article.innerHTML = `
            <div class="summit-ascii-peak" aria-hidden="true">${project.asciiPeak}</div>
            <div class="summit-meta">
                <span class="summit-tag">[ ${project.tag} ]</span>
                <span class="summit-alt">ALT. ${project.altitude}</span>
            </div>
            <h2>${project.title}</h2>
            <div class="summit-stats">
                <span>D+ ${project.hours}h</span>
                <span>•</span>
                <span>Status: ${project.status}</span>
            </div>
            <p class="summit-desc">${descHTML}</p>
            <div class="summit-gear">${gearHTML}</div>
            <a href="${project.link}" rel="noopener noreferrer" class="summit-link">--[ More Infos -> ]--</a>
        `;

        return article;
    }

    fetch("projects.json")
        .then(response => {
            if (!response.ok) throw new Error("Erreur HTTP : " + response.status);
            return response.json();
        })
        .then(projects => {
            projects.sort((a, b) => a.id - b.id);

            if (homeGrid) {
                projects.slice(0, 3).forEach(project => {
                    homeGrid.appendChild(createSummitCard(project));
                });
            }

            if (allGrid) {
                projects.forEach(project => {
                    allGrid.appendChild(createSummitCard(project));
                });

                const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
                if (allBtn) {
                    allBtn.textContent = `[ All (${projects.length}) ]`;
                }

                const buttons = document.querySelectorAll(".filter-btn");
                buttons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        buttons.forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");

                        const filter = btn.dataset.filter;
                        const cards = allGrid.querySelectorAll(".summit-card");

                        cards.forEach(card => {
                            const cardCategories = card.dataset.categories.split(",");
                            if (filter === "all" || cardCategories.includes(filter)) {
                                card.style.display = "flex";
                            } else {
                                card.style.display = "none";
                            }
                        });
                    });
                });
            }
        })
        .catch(error => console.error("Impossible de charger projects.json :", error));
});
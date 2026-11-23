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
            <a href="${project.link}" class="summit-link">--[ More Infos -> ]--</a>
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
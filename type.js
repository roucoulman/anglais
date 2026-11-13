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
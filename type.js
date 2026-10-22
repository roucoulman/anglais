function effetMachineAEcrire(balise) {
    // Si l'élément a du texte direct et qu'il n'est pas vide
    if (balise.children.length === 0 && balise.innerText.trim() !== "") { 
        const texteComplet = balise.innerText;
        // Correction : On s'assure que la vitesse est au moins un nombre valide (ex: min 10ms par lettre)
        // Si vous préférez une vitesse fixe par lettre, vous pouvez remplacer par une valeur fixe, ex: 50 ms.
        
        balise.innerText = ""; // On vide pour commencer l'effet
        let index = 0;

        function etape() {
            if (index <= texteComplet.length) {
                balise.innerText = texteComplet.substring(0, index);
                index++;
                setTimeout(etape, 10); // Mettez la vitesse en millisecondes entre chaque lettre (ex: 50ms)
            } 
        }

        etape();
        return;
    }

    // Sinon, on parcourt récursivement les enfants pour lancer les effets en parallèle
    for (let e of balise.children) {
        effetMachineAEcrire(e);
    }
}
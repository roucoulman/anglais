document.addEventListener('DOMContentLoaded', () => {
    const MAX_ALT = 8848;   // Sommet du Mont Blanc
    const MIN_ALT = 450;    // Annecy (bas de la page)
    const STEP = 100;       // une graduation tous les 100 m
    const MAJOR = 500;      // graduation principale tous les 500 m

    const alt = document.createElement('div');
    alt.id = 'altimeter';
    alt.innerHTML = `
        <div class="alt-top">mount Everest</div>
        <div class="alt-ruler"></div>
        <div class="alt-cursor"><div class="alt-readout">8 848 m</div></div>
        <div class="alt-bottom">ANNECY</div>`;
    document.body.appendChild(alt);

    const ruler = alt.querySelector('.alt-ruler');
    const cursor = alt.querySelector('.alt-cursor');
    const readout = alt.querySelector('.alt-readout');

    // altitude -> position en % (0% = sommet, 100% = bas)
    const toPct = (a) => ((MAX_ALT - a) / (MAX_ALT - MIN_ALT)) * 100;

    for (let a = Math.ceil(MIN_ALT / STEP) * STEP; a < MAX_ALT; a += STEP) {
        const line = document.createElement('div');
        line.className = 'alt-line' + (a % MAJOR === 0 ? ' major' : '');
        line.style.top = toPct(a) + '%';
        ruler.appendChild(line);

        if (a % MAJOR === 0) {
            const label = document.createElement('span');
            label.className = 'alt-label';
            label.textContent = a;
            label.style.top = toPct(a) + '%';
            ruler.appendChild(label);
        }
    }

    function update() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
        const current = MAX_ALT - p * (MAX_ALT - MIN_ALT);
        cursor.style.top = (p * 100) + '%';
        readout.textContent = Math.round(current) + ' m';
        readout.style.transform = p > 0.9 ? 'translateY(-100%)' : 'translateY(-50%)';
        readout.style.bottom = 'auto';
        readout.style.top = '0';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
});
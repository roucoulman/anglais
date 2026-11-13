/* ==========================================================
   Alpine portfolio, script.js (Vanilla JS, no dependency)
   1. Project data (edit this list to update the portfolio)
   2. Helpers
   3. Tiles, filters and project modal
   4. CV modal
   5. Navigation, parallax, reveal, skills, contact form
   ========================================================== */

document.documentElement.classList.add('js');

/* ---------- 1. PROJECT DATA ----------
   filters: web | php | cs | sql | python
   Images are optional: put them in ./assets/img/ (see "image" and "shots").
   If a file is missing, a clean illustrated placeholder is displayed instead. */
const PROJECTS = [
  {
    id: 'alpine-trail-planner',
    title: 'Alpine Trail Planner',
    date: 'Sept. 2026 – Present',
    type: 'University team project (SAÉ 3.01)',
    filters: ['php', 'sql', 'web'],
    tech: ['PHP 8', 'Laravel', 'PostgreSQL', 'JavaScript', 'Git', 'Trello'],
    summary: 'A web application that helps hikers plan safe mountain itineraries, built for a local tourism office.',
    context: 'Client project for a tourism office in the Annecy area. Visitors struggle to find trails matching their level, and the office wanted a tool that lists routes with difficulty, elevation and live closures.',
    objectives: [
      'Let users search and filter hiking trails by difficulty, duration and elevation gain.',
      'Give the tourism office an admin area to publish trails and temporary closures.',
      'Deliver a tested, documented and deployed application by the end of the semester.'
    ],
    role: [
      'Designed the PostgreSQL database schema (12 tables) and wrote the migrations and seeders.',
      'Developed the REST API (trails, users, closures) with Laravel, including authentication and validation.',
      'Led the weekly sprint review with the client and wrote the user documentation.',
      'Reviewed my teammates\' pull requests to keep the codebase consistent.'
    ],
    management: 'Team of 4 students working with Agile/Scrum: 2-week sprints, a Trello board for the backlog, GitHub Flow with pull requests and code reviews, and a sprint review with the client.',
    features: ['Trail search with combined filters', 'Interactive elevation profile', 'Admin dashboard with role-based access', 'Closure alerts by email'],
    links: [{ label: 'View on GitHub', url: 'https://github.com/your-username/alpine-trail-planner' }],
    image: './assets/img/alpine-trail-planner-cover.png',
    shots: ['./assets/img/alpine-trail-planner-1.png', './assets/img/alpine-trail-planner-2.png'],
    palette: ['#0284C7', '#0F172A', '#E2E8F0']
  },
  {
    id: 'portfolio-website',
    title: 'This Portfolio Website',
    date: 'Oct. – Nov. 2026',
    type: 'Personal project',
    filters: ['web'],
    tech: ['HTML5', 'CSS3', 'Vanilla JS', 'SVG', 'Responsive design', 'Linux / OVH hosting'],
    summary: 'A case study: my own mountain-themed portfolio, built from scratch without any framework.',
    context: 'Built for my professional communication in English course (R3.12). The goal was to present my profile and my work in a clear, fast and accessible way, using only web standards.',
    objectives: [
      'Use only HTML5, CSS3 and Vanilla JavaScript, with no CMS or framework.',
      'Create a coherent visual identity inspired by the Alps and Annecy.',
      'Make the site responsive, accessible and easy to update.'
    ],
    role: [
      'Designed the identity: a limited palette (night slate, snow, glacier blue) and mountain-ridge SVG dividers.',
      'Wrote all the code: semantic HTML, CSS custom properties, CSS Grid layouts and a mobile-first menu.',
      'Implemented the JavaScript project filters, the native &lt;dialog&gt; modals, the light parallax and the scroll animations.',
      'Deployed the site on an OVH Linux server in the public_html folder, using relative paths only.'
    ],
    management: 'Solo project. Git for version control with small, descriptive commits, a personal Trello board for tasks, and manual tests on Chrome, Firefox and mobile.',
    features: ['Live project filters', 'Detailed modal windows', 'CV preview and download', 'Reduced-motion and keyboard support'],
    links: [{ label: 'Source code', url: 'https://github.com/your-username/portfolio' }],
    image: './assets/img/portfolio-website-cover.png',
    shots: ['./assets/img/portfolio-website-1.png', './assets/img/portfolio-website-2.png'],
    palette: ['#059669', '#0F172A', '#E2E8F0']
  },
  {
    id: 'summit-runner',
    title: 'Summit Runner',
    date: 'Jan. – June 2026',
    type: 'University team project (SAÉ 2.02)',
    filters: ['cs'],
    tech: ['C++', 'SFML', 'Object-oriented design', 'Doxygen', 'Git'],
    summary: 'A 2D mountain-climbing platform game with its own level editor, written in C++.',
    context: 'First-year project to apply object-oriented programming and algorithms in a larger application. Our team chose to create a platform game set in the Alps.',
    objectives: [
      'Build a playable game with several levels and a scoring system.',
      'Apply clean object-oriented design and write unit tests.',
      'Produce technical documentation for future maintainers.'
    ],
    role: [
      'Wrote the collision engine and the player physics (jump, slide, wall grip).',
      'Created the unit tests for the engine and fixed 20+ bugs found in play-testing.',
      'Generated the code documentation with Doxygen.'
    ],
    management: 'Team of 3 students. Weekly meetings, a shared Git repository with feature branches, and tasks tracked on Trello.',
    features: ['Five levels with increasing difficulty', 'Level editor saving to text files', 'Local high-score table'],
    links: [{ label: 'View on GitHub', url: 'https://github.com/your-username/summit-runner' }],
    image: './assets/img/summit-runner-cover.png',
    shots: ['./assets/img/summit-runner-1.png', './assets/img/summit-runner-2.png'],
    palette: ['#38bdf8', '#1E293B', '#F8FAFC']
  },
  {
    id: 'climbing-gym-db',
    title: 'Climbing Gym Database',
    date: 'Mar. – May 2026',
    type: 'University team project (SAÉ 2.04)',
    filters: ['sql'],
    tech: ['PostgreSQL', 'SQL', 'PL/pgSQL', 'UML / MCD', 'Python'],
    summary: 'A relational database to manage members, routes and bookings of a climbing gym.',
    context: 'A fictional climbing gym needed to replace its spreadsheets with a reliable database to track memberships, route setting and session bookings.',
    objectives: [
      'Model the business rules with a conceptual data model.',
      'Implement a normalised schema with constraints and triggers.',
      'Write the queries needed for monthly reports.'
    ],
    role: [
      'Drew the conceptual and relational models and normalised the schema to 3NF.',
      'Wrote the triggers that prevent overbooking and expired memberships.',
      'Wrote 15 analytical queries (occupancy rate, most popular routes) and a Python script to load test data.'
    ],
    management: 'Pair project with weekly reviews by the teacher. Scripts versioned with Git.',
    features: ['12-table schema', 'Triggers for booking rules', 'Reporting views'],
    links: [{ label: 'View on GitHub', url: 'https://github.com/your-username/climbing-gym-db' }],
    image: './assets/img/climbing-gym-db-cover.png',
    shots: ['./assets/img/climbing-gym-db-1.png', './assets/img/climbing-gym-db-2.png'],
    palette: ['#059669', '#0F172A', '#E2E8F0']
  },
  {
    id: 'lake-temperature',
    title: 'Lake Annecy Temperature Analysis',
    date: 'Feb. 2026',
    type: 'Personal project',
    filters: ['python'],
    tech: ['Python', 'pandas', 'Matplotlib', 'Open data (CSV)'],
    summary: 'A data analysis of water temperature trends in Lake Annecy using public open data.',
    context: 'I swim and sail on the lake, so I wanted to understand how its temperature has changed over the last decades, using public datasets.',
    objectives: [
      'Clean and merge several open datasets.',
      'Visualise seasonal patterns and long-term trends.',
      'Share clear charts and a short written conclusion.'
    ],
    role: [
      'Wrote the whole analysis alone: data cleaning, aggregation and charts.',
      'Automated the process with a reusable script and documented it in the README.'
    ],
    management: 'Solo project organised in a Jupyter notebook, versioned on GitHub.',
    features: ['Seasonal comparison charts', 'Yearly trend line', 'Reproducible notebook'],
    links: [{ label: 'View on GitHub', url: 'https://github.com/your-username/lake-temperature' }],
    image: './assets/img/lake-temperature-cover.png',
    shots: ['./assets/img/lake-temperature-1.png', './assets/img/lake-temperature-2.png'],
    palette: ['#0284C7', '#1E293B', '#E2E8F0']
  },
  {
    id: 'snow-report',
    title: 'Snow Report Dashboard',
    date: 'Dec. 2025',
    type: 'Personal project',
    filters: ['web', 'python'],
    tech: ['HTML5', 'CSS3', 'JavaScript (Fetch API)', 'Python (Flask)', 'SVG charts'],
    summary: 'A small dashboard showing snow depth and weather for nearby ski resorts.',
    context: 'Created over a winter weekend to check conditions before ski touring, and to practise calling an API from JavaScript.',
    objectives: [
      'Fetch data from a public weather API and display it clearly.',
      'Draw simple charts without any chart library.',
      'Keep the interface fast on mobile.'
    ],
    role: [
      'Built the Flask back-end that caches API responses.',
      'Wrote the front-end, including the SVG charts generated in JavaScript.'
    ],
    management: 'Solo project, with a simple Git workflow and a to-do list in the README.',
    features: ['Snow depth per resort', '3-day forecast', 'Responsive mobile layout'],
    links: [{ label: 'View on GitHub', url: 'https://github.com/your-username/snow-report' }],
    image: './assets/img/snow-report-cover.png',
    shots: ['./assets/img/snow-report-1.png', './assets/img/snow-report-2.png'],
    palette: ['#38bdf8', '#0F172A', '#F8FAFC']
  }
];

const FILTER_LABELS = { all: 'All', web: 'HTML/CSS/JS', php: 'PHP/Laravel', cs: 'C#/C++', sql: 'SQL/PostgreSQL', python: 'Python' };

/* ---------- 2. HELPERS ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* Illustrated placeholder: layered mountains drawn from the project palette */
function coverSvg(project, index) {
  const [main, dark, light] = project.palette;
  const shift = (index * 37) % 120;
  return `
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Decorative illustration for ${escapeHtml(project.title)}">
      <rect width="320" height="180" fill="${dark}"/>
      <circle cx="${250 - shift / 2}" cy="42" r="16" fill="${light}" opacity=".85"/>
      <path d="M0 180V120l50-50 40 40 55-70 60 75 40-40 75 70v35z" fill="${main}" opacity=".55"/>
      <path d="M0 180v-30l60-50 50 40 60-60 70 70 80-50v80z" fill="${main}"/>
      <path d="M150 90l-12 14 9-3 7 7 7-8z" fill="${light}"/>
    </svg>`;
}

function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
}

/* Close a <dialog> when the user clicks on its backdrop or on a [data-close] button */
function setupDialog(dialog, onClose) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    lockScroll(false);
    if (onClose) onClose();
  });
}

/* ---------- 3. TILES, FILTERS AND PROJECT MODAL ---------- */
const tilesContainer = $('#tiles');
const projectModal = $('#projectModal');
let lastTrigger = null;

function renderTiles() {
  tilesContainer.innerHTML = PROJECTS.map((p, i) => `
    <button class="tile" type="button" data-id="${p.id}" data-filters="${p.filters.join(' ')}" aria-haspopup="dialog">
      <span class="tile__media">
        ${coverSvg(p, i)}
        <img src="${p.image}" alt="Screenshot of ${escapeHtml(p.title)}" loading="lazy">
        <span class="tile__type">${escapeHtml(p.type)}</span>
      </span>
      <span class="tile__body">
        <span class="tile__date">${escapeHtml(p.date)}</span>
        <span class="tile__title">${escapeHtml(p.title)}</span>
        <span class="tile__summary">${escapeHtml(p.summary)}</span>
        <span class="tile__tech">
          <span class="tile__tech-label">Technologies used</span>
          <ul class="tags">${p.tech.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
        </span>
        <span class="tile__more">View details →</span>
      </span>
    </button>`).join('');

  // If a screenshot file is missing, remove it so the illustrated cover stays visible
  $$('.tile__media img', tilesContainer).forEach((img) => {
    img.addEventListener('error', () => img.remove());
  });
}

function applyFilter(filter) {
  let visible = 0;
  $$('.tile', tilesContainer).forEach((tile) => {
    const match = filter === 'all' || tile.dataset.filters.split(' ').includes(filter);
    tile.classList.toggle('is-hidden', !match);
    if (match) {
      visible += 1;
      // restart the entrance animation
      tile.style.animation = 'none';
      void tile.offsetWidth;
      tile.style.animation = '';
    }
  });
  $$('.filter').forEach((btn) => {
    const active = btn.dataset.filter === filter;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  const label = FILTER_LABELS[filter];
  $('#filterCount').textContent = filter === 'all'
    ? `Showing all ${visible} projects.`
    : `Showing ${visible} project${visible === 1 ? '' : 's'} using ${label}.`;
}

function listItems(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function openProject(id) {
  const p = PROJECTS.find((project) => project.id === id);
  if (!p) return;
  $('#pmTitle').textContent = p.title;

  const shots = p.shots.map((src, i) => `
    <figure class="pm__shot">
      <img src="${src}" alt="Screenshot ${i + 1} of ${escapeHtml(p.title)}" loading="lazy">
      <figcaption>Screenshot ${i + 1}</figcaption>
    </figure>`).join('');

  $('#pmBody').innerHTML = `
    <div class="pm__meta">
      <span><strong>Date:</strong> ${escapeHtml(p.date)}</span>
      <span><strong>Type:</strong> ${escapeHtml(p.type)}</span>
    </div>
    <section class="pm__section pm__tech">
      <h3>Technologies used</h3>
      <ul class="tags">${p.tech.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
    </section>
    <section class="pm__section"><h3>Context</h3><p>${p.context}</p></section>
    <section class="pm__section"><h3>Objectives</h3>${listItems(p.objectives)}</section>
    <section class="pm__section pm__me"><h3>What I did personally</h3>${listItems(p.role)}</section>
    <section class="pm__section"><h3>Project management</h3><p>${p.management}</p></section>
    <section class="pm__section"><h3>Key features</h3>${listItems(p.features)}</section>
    <section class="pm__section"><h3>Screenshots</h3><div class="pm__shots">${shots}</div></section>
    <section class="pm__section"><h3>Links</h3>
      <div class="pm__links">${p.links.map((l) => `<a class="btn btn--primary btn--sm" href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`).join('')}</div>
    </section>`;

  // Missing screenshots become a neat placeholder instead of a broken image
  $$('.pm__shot img', projectModal).forEach((img) => {
    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'pm__shot-ph';
      placeholder.textContent = 'Screenshot coming soon';
      img.replaceWith(placeholder);
    });
  });

  $('#pmBody').scrollTop = 0;
  lockScroll(true);
  projectModal.showModal();
}

renderTiles();
applyFilter('all');

$('#filters').addEventListener('click', (event) => {
  const button = event.target.closest('.filter');
  if (button) applyFilter(button.dataset.filter);
});

tilesContainer.addEventListener('click', (event) => {
  const tile = event.target.closest('.tile');
  if (!tile) return;
  lastTrigger = tile;
  openProject(tile.dataset.id);
});

setupDialog(projectModal, () => { if (lastTrigger) lastTrigger.focus(); });

/* ---------- 4. CV MODAL ---------- */
const cvModal = $('#cvModal');
const cvFrame = $('iframe', cvModal);

$('#openCv').addEventListener('click', () => {
  // Load the PDF only when needed
  if (!cvFrame.getAttribute('src')) cvFrame.setAttribute('src', cvFrame.dataset.src);
  lockScroll(true);
  cvModal.showModal();
});
setupDialog(cvModal, () => $('#openCv').focus());

/* ---------- 5. NAVIGATION, PARALLAX, REVEAL, SKILLS, FORM ---------- */

/* Mobile menu */
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');

function setMenu(open) {
  navLinks.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
navLinks.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

/* Active link + parallax, throttled with requestAnimationFrame */
const navAnchors = $$('#navLinks a');
const navTargets = navAnchors.map((a) => $(a.getAttribute('href')));
const parallaxLayers = $$('.hero__layer');
const hero = $('#hero');
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const probe = y + window.innerHeight * 0.35;

  let current = 0;
  navTargets.forEach((target, i) => { if (target && target.offsetTop <= probe) current = i; });
  // Bottom of the page always highlights the last item
  if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = navTargets.length - 1;
  navAnchors.forEach((a, i) => {
    a.classList.toggle('is-active', i === current);
    if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });

  if (!prefersReducedMotion && y < hero.offsetHeight) {
    parallaxLayers.forEach((layer) => {
      layer.style.transform = `translateY(${y * Number(layer.dataset.speed)}px)`;
    });
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* Reveal on scroll */
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

/* Skill levels: peaks (1 to 5) + text label */
const LEVEL_NAMES = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];

function peaksHtml(level) {
  return Array.from({ length: 5 }, (_, i) => `<i class="${i < level ? 'on' : ''}"></i>`).join('');
}

$$('.skill-list li').forEach((item) => {
  const level = Number(item.dataset.level);
  const name = $('span', item).textContent;
  item.innerHTML = `
    <span class="skill-row">
      <span>${escapeHtml(name)}</span>
      <span class="peaks" role="img" aria-label="${escapeHtml(name)}: level ${level} out of 5, ${LEVEL_NAMES[level]}">${peaksHtml(level)}</span>
    </span>
    <span class="skill-label">${level}/5 · ${LEVEL_NAMES[level]}</span>`;
});
$$('.legend__peaks').forEach((el) => {
  el.classList.add('peaks');
  el.innerHTML = peaksHtml(Number(el.dataset.peaks));
});

/* Contact form: validation, then opens the visitor's email client (static hosting, no server code) */
const form = $('#contactForm');
const formStatus = $('#formStatus');
const RECIPIENT = 'alex.martin@example.com'; // <- replace with your real professional email

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = ['name', 'email', 'message'].map((n) => form.elements[n]);
  let valid = true;
  fields.forEach((field) => {
    const ok = field.value.trim() !== '' && (field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()));
    field.classList.toggle('is-invalid', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    if (!ok) valid = false;
  });

  formStatus.classList.toggle('is-error', !valid);
  if (!valid) {
    formStatus.textContent = 'Please fill in all fields with a valid email address.';
    return;
  }

  const [name, email, message] = fields.map((f) => f.value.trim());
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
  formStatus.textContent = 'Thank you! Your email application should open with the message ready to send.';
  window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
  form.reset();
});

/* Footer year */
$('#year').textContent = new Date().getFullYear();

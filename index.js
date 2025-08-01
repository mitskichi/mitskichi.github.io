import { Particles } from './utils/particles.js';
import { Typewriter } from './utils/typewriter.js';

new Particles('particles');

const typeEl = document.getElementById('typewriter');
new Typewriter(typeEl, [
    "beautiful melancholy of being a woman",
    "follow me on all my socials :3"
], {
    speed: 100,
    deleteSpeed: 60,
    pauseAfterTyping: 2000,
    pauseAfterDeleting: 1000
});

const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
    } else {
        menuToggle.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
    }
});

menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
    });
});

document.addEventListener('contextmenu', e => e.preventDefault());

document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', false);
    img.addEventListener('touchstart', e => e.preventDefault());
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

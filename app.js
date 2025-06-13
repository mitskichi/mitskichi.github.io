const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const nav = document.getElementById('nav');
const musicToggle = document.getElementById('music-toggle');
const element = document.getElementById('typewriter-text');

const audio = new Audio('/music/Music.mp3');
audio.preload = 'auto';

let isMuted = true;

const texts = [
    "beautiful melancholy of being a woman",
    "follow me on all my socials!"
];

let textIndex = 0;
let index = 0;
let deleting = false;

const typingSpeed = 90;
const deletingSpeed = 40;
const pauseDelay = 1500;

menuToggle.addEventListener('click', () => {
    nav.classList.add('active');
    menuToggle.classList.add('hide');
    menuClose.classList.add('show');
});

menuClose.addEventListener('click', () => {
    nav.classList.remove('active');
    menuToggle.classList.remove('hide');
    menuClose.classList.remove('show');
});

musicToggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (isMuted) {
        audio.play();
        musicToggle.textContent = 'Music: Unmuted';
    } else {
        audio.pause();
        musicToggle.textContent = 'Music: Muted';
    }
    isMuted = !isMuted;
});

function type() {
    const currentText = texts[textIndex];

    if (!deleting) {
        element.textContent = currentText.slice(0, index + 1);
        index++;

        if (index === currentText.length) {
            deleting = true;
            setTimeout(type, pauseDelay);
            return;
        }
    } else {
        element.textContent = currentText.slice(0, index - 1);
        index--;

        if (index === 0) {
            deleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
    }

    setTimeout(type, deleting ? deletingSpeed : typingSpeed);
}

document.addEventListener('DOMContentLoaded', type);

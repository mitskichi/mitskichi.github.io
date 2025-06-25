const canvas = document.getElementById('particles')
const ctx = canvas.getContext('2d')

function setCanvasSize() {
    const dpr = window.devicePixelRatio || 1
    const bodyHeight = document.body.scrollHeight
    canvas.width = window.innerWidth * dpr
    canvas.height = bodyHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = bodyHeight + 'px'
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
}

setCanvasSize()

let particles = []

function random(min, max) {
    return Math.random() * (max - min) + min
}

for (let i = 0; i < 80; i++) {
    particles.push({
        x: random(0, window.innerWidth),
        y: random(0, document.body.scrollHeight),
        radius: random(2, 8),
        speed: random(0.5, 2),
        alpha: random(0.05, 0.2)
    })
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.fill()
        p.y -= p.speed
        if (p.y < -10) {
            p.y = document.body.scrollHeight + 10
            p.x = random(0, window.innerWidth)
        }
    }
    requestAnimationFrame(draw)
}

draw()

window.addEventListener('resize', () => {
    setCanvasSize()
})

const spotifyIcon = document.querySelector('.icon.spotify')

spotifyIcon.addEventListener('click', (e) => {
    e.preventDefault()
    const spotify = document.querySelector('.spotify-embed')
    if (spotify) {
        window.scrollTo({
            top: spotify.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
        })
    }
})

document.addEventListener('contextmenu', e => e.preventDefault())

document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', false)
    img.addEventListener('touchstart', e => e.preventDefault())
})

const typeEl = document.getElementById("typewriter")
const texts = [
    "beautiful melancholy of being a woman",
    "follow me on all my socials :3"
]

let i = 0
let charIndex = 0
let isDeleting = false

function type() {
    const currentText = texts[i]
    const speed = isDeleting ? 60 : 100

    if (!isDeleting) {
        charIndex++
        typeEl.textContent = currentText.substring(0, charIndex)
        if (charIndex === currentText.length) {
            isDeleting = true
            setTimeout(type, 1000)
            return
        }
    } else {
        charIndex--
        typeEl.textContent = currentText.substring(0, charIndex)
        if (charIndex === 0) {
            isDeleting = false
            i = (i + 1) % texts.length
            setTimeout(type, 200)
            return
        }
    }

    setTimeout(type, speed)
}

type()

const targets = [
    { el: document.querySelector('.content'), factor: 6, rotate: true },
    { el: document.querySelector('.experience'), factor: 3, rotate: false },
    { el: document.querySelector('.spotify-embed'), factor: 2, rotate: false }
]

let targetX = 0, targetY = 0
let currentX = 0, currentY = 0

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    targetX = x
    targetY = y
})

function animateParallax() {
    currentX += (targetX - currentX) * 0.05
    currentY += (targetY - currentY) * 0.05

    targets.forEach(({ el, factor, rotate }) => {
        if (!el) return
        const moveX = currentX * factor
        const moveY = currentY * factor
        const rotateX = rotate ? -currentY * 3 : 0
        const rotateY = rotate ? currentX * 3 : 0

        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    })

    requestAnimationFrame(animateParallax)
}
animateParallax()

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        }
    })
}, {
    threshold: 0.15
})

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))

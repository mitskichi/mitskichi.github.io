export class Particles {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) throw new Error(`Canvas with id "${canvasId}" not found`);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.dpr = window.devicePixelRatio || 1;
        this.options = Object.assign({
            count: 80,
            radiusMin: 2,
            radiusMax: 8,
            speedMin: 0.5,
            speedMax: 2,
            alphaMin: 0.05,
            alphaMax: 0.2,
        }, options);
        this.setCanvasSize = this.setCanvasSize.bind(this);
        this.draw = this.draw.bind(this);
        window.addEventListener('resize', this.setCanvasSize);
        this.setCanvasSize();
        this.initParticles();
        this.draw();
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    setCanvasSize() {
        const bodyHeight = document.body.scrollHeight;
        this.canvas.width = window.innerWidth * this.dpr;
        this.canvas.height = bodyHeight * this.dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = bodyHeight + 'px';
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);
    }

    initParticles() {
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push({
                x: this.random(0, window.innerWidth),
                y: this.random(0, document.body.scrollHeight),
                radius: this.random(this.options.radiusMin, this.options.radiusMax),
                speed: this.random(this.options.speedMin, this.options.speedMax),
                alpha: this.random(this.options.alphaMin, this.options.alphaMax),
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let p of this.particles) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            this.ctx.fill();

            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.beginPath();
            this.ctx.arc(p.x + p.radius / 2, p.y, p.radius * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(220, 220, 220, 1)';
            this.ctx.fill();

            this.ctx.restore();

            p.y -= p.speed;
            if (p.y < -10) {
                p.y = document.body.scrollHeight + 10;
                p.x = this.random(0, window.innerWidth);
            }
        }
        requestAnimationFrame(this.draw);
    }
}

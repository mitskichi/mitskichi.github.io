export class Parallax {
    constructor(targetsConfig = []) {
        this.targets = targetsConfig;
        this.targetX = 0;
        this.targetY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.animateParallax = this.animateParallax.bind(this);
        document.addEventListener('mousemove', this.onMouseMove);
        requestAnimationFrame(this.animateParallax);
    }

    onMouseMove(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        this.targetX = x;
        this.targetY = y;
    }

    animateParallax() {
        this.currentX += (this.targetX - this.currentX) * 0.08;
        this.currentY += (this.targetY - this.currentY) * 0.08;

        this.targets.forEach(({ el, factor, rotate }) => {
            if (!el) return;
            const moveX = this.currentX * factor;
            const moveY = this.currentY * factor;
            const rotateX = rotate ? -this.currentY * 5 : 0;
            const rotateY = rotate ? this.currentX * 5 : 0;
            el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        requestAnimationFrame(this.animateParallax);
    }

    destroy() {
        document.removeEventListener('mousemove', this.onMouseMove);
    }
}

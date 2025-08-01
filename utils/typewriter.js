export class Typewriter {
    constructor(element, texts, options = {}) {
        this.el = element;
        if (!this.el) throw new Error('Typewriter element not found');
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.currentTextIndex = 0;
        this.index = 0;
        this.isDeleting = false;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 60;
        this.pauseAfterTyping = options.pauseAfterTyping || 2000;
        this.pauseAfterDeleting = options.pauseAfterDeleting || 1000;
        this.timeoutId = null;
        this.type = this.type.bind(this);
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        let content = currentText.substring(0, this.index);
        this.el.textContent = content === '' ? '\u00A0' : content;

        if (!this.isDeleting && this.index < currentText.length) {
            this.index++;
            this.timeoutId = setTimeout(this.type, this.speed);
        } else if (this.isDeleting && this.index > 0) {
            this.index--;
            this.timeoutId = setTimeout(this.type, this.deleteSpeed);
        } else {
            this.isDeleting = !this.isDeleting;
            if (!this.isDeleting) {
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            }
            this.timeoutId = setTimeout(this.type, this.isDeleting ? this.pauseAfterDeleting : this.pauseAfterTyping);
        }
    }

    stop() {
        if (this.timeoutId) clearTimeout(this.timeoutId);
    }
}

const App = (() => {
    const selectors = {
        headerTitle: 'header-title',
        profileAvatar: 'profile-avatar',
        profileName: 'profile-name',
        subtitleText: 'subtitle-text',
        typewriterElement: 'typewriter-text',
        socialsWrapper: 'socials-wrapper',
    };

    let typewriter = {
        texts: [],
        currentTextIndex: 0,
        currentCharIndex: 0,
        deleting: false,
        timeoutId: null,
    };

    function runTypewriter(element) {
        const { texts, currentTextIndex, currentCharIndex, deleting } = typewriter;
        if (!texts.length) return;

        const fullText = texts[currentTextIndex] || "";

        if (!deleting) {
            element.textContent = fullText.slice(0, currentCharIndex + 1);
            typewriter.currentCharIndex++;

            if (typewriter.currentCharIndex === fullText.length) {
                typewriter.deleting = true;
                typewriter.timeoutId = setTimeout(() => runTypewriter(element), 1500);
                return;
            }
        } else {
            element.textContent = fullText.slice(0, currentCharIndex - 1);
            typewriter.currentCharIndex--;

            if (typewriter.currentCharIndex === 0) {
                typewriter.deleting = false;
                typewriter.currentTextIndex = (currentTextIndex + 1) % texts.length;
            }
        }

        typewriter.timeoutId = setTimeout(() => runTypewriter(element), deleting ? 40 : 90);
    }

    function renderSocialLinks(socials) {
        const container = document.getElementById(selectors.socialsWrapper);
        container.innerHTML = "";
        if (!Array.isArray(socials)) return;

        socials.forEach(({ avatar, username, description, url }) => {
            const socialCard = document.createElement('div');
            socialCard.className = 'testimonial';
            socialCard.onclick = () => url && window.open(url, '_blank');
            socialCard.innerHTML = `
                <div class="user-info">
                    ${avatar ? `<img src="${avatar}" alt="Profile Picture" onerror="this.remove()" />` : ''}
                    <h3>${username || ''}</h3>
                </div>
                <p class="role">${description || ''}</p>
            `;
            container.appendChild(socialCard);
        });
    }

    async function loadConfiguration() {
        try {
            const response = await fetch('profile.json');
            if (!response.ok) throw new Error('Failed to load profile.json');
            const config = await response.json();

            document.getElementById(selectors.headerTitle).textContent = config.title || config.username || "";
            const avatarImg = document.getElementById(selectors.profileAvatar);
            avatarImg.src = config.avatar || "";
            avatarImg.alt = `${config.username || 'User'} avatar`;

            document.getElementById(selectors.profileName).textContent = config.username || "";
            document.getElementById(selectors.subtitleText).textContent = config.subtitle || "";

            if (config.background) {
                document.body.style.setProperty('--bg-url', `url("${config.background}")`);
                document.body.classList.add('has-bg');
            } else {
                document.body.style.removeProperty('--bg-url');
                document.body.classList.remove('has-bg');
            }

            typewriter.texts = Array.isArray(config.description) ? config.description : [];
            typewriter.currentTextIndex = 0;
            typewriter.currentCharIndex = 0;
            typewriter.deleting = false;
            clearTimeout(typewriter.timeoutId);

            runTypewriter(document.getElementById(selectors.typewriterElement));

            renderSocialLinks(config.socials);
        } catch (error) {
            console.error(error);
            document.getElementById(selectors.headerTitle).textContent = "Failed to load data";
        }
    }

    return {
        init: () => {
            loadConfiguration();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

const App = (() => {
    const selectors = {
        headerTitle: 'header-title',
        muteToggle: 'mute-toggle',
        profileAvatar: 'profile-avatar',
        profileName: 'profile-name',
        socialsTitle: 'socials-title',
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

    let isMuted = true;

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
            socialCard.style.cursor = url ? 'pointer' : 'default';
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

    function updateMuteButton() {
        const btn = document.getElementById(selectors.muteToggle);
        btn.style.color = '#fff';

        if (isMuted) {
            btn.textContent = 'Unmute';
        } else {
            btn.textContent = 'Mute';
        }
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
            document.getElementById(selectors.socialsTitle).textContent = config.subtitle || "";

            if (config.background) {
                document.body.style.setProperty('--bg-url', `url("${config.background}")`);
            } else {
                document.body.style.setProperty('--bg-url', 'none');
            }

            typewriter.texts = Array.isArray(config.description) ? config.description : [];
            typewriter.currentTextIndex = 0;
            typewriter.currentCharIndex = 0;
            typewriter.deleting = false;
            clearTimeout(typewriter.timeoutId);

            runTypewriter(document.getElementById(selectors.typewriterElement));

            renderSocialLinks(config.socials);

            const audioPlayer = document.getElementById('background-music-player');
            if (config['background-music'] && config['background-music'].trim() !== "") {
                audioPlayer.src = config['background-music'];
                audioPlayer.volume = 1;
                audioPlayer.loop = true;
                audioPlayer.pause();
                isMuted = true;
                updateMuteButton();
            } else {
                audioPlayer.pause();
                audioPlayer.src = "";
            }
        } catch (error) {
            console.error(error);
            document.getElementById(selectors.headerTitle).textContent = "Failed to load data";
        }
    }

    function toggleMute() {
        const audioPlayer = document.getElementById('background-music-player');
        if (isMuted) {
            audioPlayer.play().catch(() => {});
            isMuted = false;
        } else {
            audioPlayer.pause();
            isMuted = true;
        }
        updateMuteButton();
    }

    return {
        init: () => {
            loadConfiguration();
            document.getElementById(selectors.muteToggle).addEventListener('click', toggleMute);
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

/**
 * HeroRevealManager
 * A specialized utility for animating hero text reveals.
 * Locks the body scroll, plays sequential reveal animations, and then unlocks scrolling.
 */
(function() {
    const css = `
        .hero-marker-wrapper {
            position: relative;
            display: inline-block;
            padding: 0.1em 0.2em;
            --accent-color: #000000;
            --marker-width: 0%;
        }
        .hero-marker-wrapper::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            height: 100%; width: var(--marker-width);
            background-color: var(--accent-color);
            z-index: 1;
            transition: width var(--reveal-duration, 0.6s) cubic-bezier(0.23, 1, 0.32, 1);
        }
        .hero-marker-text {
            position: relative;
            z-index: 2;
            color: #ffffff;
            mix-blend-mode: difference;
            display: inline-block;
        }
        body.body-lock {
            /* overflow: hidden !important;
            touch-action: none; */
        }
    `;

    const injectCSS = () => {
        if (document.getElementById('hero-reveal-styles')) return;
        const style = document.createElement('style');
        style.id = 'hero-reveal-styles';
        style.textContent = css;
        document.head.appendChild(style);
    };

    class HeroRevealManager {
        constructor() {
            this.markers = [];
            injectCSS();
            this.init();
        }

        init() {
            // Target elements inside the hero section (e.g., #hero or .hero-section)
            const heroContainer = document.querySelector('#hero, .hero-section');
            if (!heroContainer) return;

            const elements = heroContainer.querySelectorAll('.hero-marker-wrapper');
            if (elements.length === 0) return;

            this.markers = Array.from(elements).map((el, index) => {
                const color = el.getAttribute('data-marker-color') || '#000';
                const duration = el.getAttribute('data-marker-duration') || '0.6s';
                const delay = parseFloat(el.getAttribute('data-marker-delay')) || (index * 0.3 + 0.5); // Sequential default delay

                el.style.setProperty('--accent-color', color);
                el.style.setProperty('--reveal-duration', duration);

                return { el, delay, duration: parseFloat(duration) * 1000 };
            });

            this.playReveal();
        }

        playReveal() {
            // Lock body scroll
            document.body.classList.add('body-lock');
            console.log('HeroRevealManager: Scroll locked // Starting animations');

            let maxEndTime = 0;

            this.markers.forEach(marker => {
                const delayMs = marker.delay * 1000;
                
                // Animate to 100% after delay
                setTimeout(() => {
                    marker.el.style.setProperty('--marker-width', '100%');
                }, delayMs);

                // Calculate when this transition will finish
                const endTime = delayMs + marker.duration;
                if (endTime > maxEndTime) {
                    maxEndTime = endTime;
                }
            });

            // Unlock scroll after the longest running animation completes (plus small buffer)
            setTimeout(() => {
                document.body.classList.remove('body-lock');
                console.log('HeroRevealManager: Scroll unlocked // Hero reveal complete');
                
                // Dispatch event to notify other scripts that hero animation is done
                window.dispatchEvent(new CustomEvent('heroRevealComplete'));
            }, maxEndTime + 200);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new HeroRevealManager());
    } else {
        new HeroRevealManager();
    }
})();

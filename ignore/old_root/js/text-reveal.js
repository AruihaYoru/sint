/**
 * TextRevealManager
 * A generic utility to reveal highlight markers on scroll.
 */
(function() {
    const css = `
        .marker-wrapper {
            position: relative;
            display: inline-block;
            padding: 0.1em 0.2em;
            --accent-color: #000000;
            --marker-width: 0%;
        }
        .marker-wrapper::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            height: 100%; width: var(--marker-width);
            background-color: var(--accent-color);
            z-index: 1;
            transition: width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .marker-text {
            position: relative;
            z-index: 2;
            color: #ffffff;
            mix-blend-mode: difference;
            display: inline-block;
        }
    `;

    const injectCSS = () => {
        if (document.getElementById('text-reveal-styles')) return;
        const style = document.createElement('style');
        style.id = 'text-reveal-styles';
        style.textContent = css;
        document.head.appendChild(style);
    };

    class TextRevealManager {
        constructor() {
            this.markers = [];
            injectCSS();
            this.init();
        }

        init() {
            const elements = document.querySelectorAll('.marker-wrapper');
            this.markers = Array.from(elements).map(el => {
                const color = el.getAttribute('data-marker-color') || '#000';
                el.style.setProperty('--accent-color', color);
                return {
                    el,
                    trigger: parseFloat(el.getAttribute('data-marker-trigger')) || 0.5
                };
            });

            // Set up scroll and resize listeners using standard browser APIs
            const updateHandler = () => this.update();
            window.addEventListener('scroll', updateHandler, { passive: true });
            window.addEventListener('resize', updateHandler, { passive: true });
            
            this.update();
        }

        update() {
            const vh = window.innerHeight;
            this.markers.forEach(marker => {
                const rect = marker.el.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                const targetPoint = vh * marker.trigger;
                const startThreshold = vh * (marker.trigger + 0.3); 

                if (center > startThreshold) {
                    marker.el.style.setProperty('--marker-width', '0%');
                } else if (center < targetPoint) {
                    marker.el.style.setProperty('--marker-width', '100%');
                } else {
                    const range = startThreshold - targetPoint;
                    const progress = ((startThreshold - center) / range) * 100;
                    marker.el.style.setProperty('--marker-width', `${Math.min(100, Math.max(0, progress))}%`);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new TextRevealManager());
    } else {
        new TextRevealManager();
    }
})();

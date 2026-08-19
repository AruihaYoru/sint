/**
 * ScrollAnimationManager
 * A lightweight, general-purpose scroll reveal library using IntersectionObserver.
 * Triggers CSS transitions by adding the 'is-revealed' class when elements enter the viewport.
 */
(function() {
    class ScrollAnimationManager {
        constructor() {
            this.init();
        }

        init() {
            const targets = document.querySelectorAll('[class*="reveal-"]');
            if (targets.length === 0) return;

            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px', // Triggers slightly before the element fully enters
                threshold: 0.05
            };

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const delay = el.getAttribute('data-reveal-delay') || '0s';
                        const duration = el.getAttribute('data-reveal-duration') || '0.8s';
                        
                        el.style.transitionDelay = delay;
                        el.style.transitionDuration = duration;
                        el.classList.add('is-revealed');
                        
                        // One-shot animation
                        obs.unobserve(el);
                    }
                });
            }, observerOptions);

            targets.forEach(target => {
                observer.observe(target);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ScrollAnimationManager());
    } else {
        new ScrollAnimationManager();
    }
})();

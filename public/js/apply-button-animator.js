/**
 * ApplyButtonAnimator
 * Handles smooth, non-glitching background layer stacking animation for buttons with the class `.apply-button`.
 * Avoids transition bugs when hovering/unhovering repeatedly mid-animation.
 */
class ApplyButtonAnimator {
    constructor() {
        this.buttons = document.querySelectorAll('.apply-button');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            // Remove CSS hover behaviors by setting a data attribute or class
            button.classList.add('js-animated');
            
            // Set styles for relative positioning and overflow
            button.style.position = 'relative';
            button.style.overflow = 'hidden';

            // Ensure the text is on top
            const textSpan = button.querySelector('.apply-button-text');
            if (textSpan) {
                textSpan.style.position = 'relative';
                textSpan.style.zIndex = '10';
            }

            // Track active layers: { element, targetY, isWhite }
            const layers = [];

            // Helper to clean up out-of-view layers
            const cleanupLayers = () => {
                // Find layers that have finished moving off-screen (targetY !== 0 and current transition ended)
                // In our model, layers are removed once they are fully covered or moved out, but to be safe and simple:
                // We keep them in DOM, and if they are fully covered by a newer layer, we can remove them.
            };

            const animateToState = (isHover) => {
                // Determine color of the new sliding layer.
                // Hovering: stack White (or whatever the background/active color is).
                // Let's inspect the current theme to decide colors:
                // Default theme (Dark): background is black/dark, text is white.
                // Light theme: background is white, text is black.
                // In SINT:
                // Dark theme: var(--bg-color) = blackish, var(--text-color) = white
                // Light theme: var(--bg-color) = white, var(--text-color) = blackish
                //
                // Hovering: We want to slide in a layer of var(--bg-color) (which is background color).
                // Unhovering: We want to slide in a layer of var(--text-color) (which is the default button background color).
                const isLightTheme = document.body.classList.contains('light-theme');
                
                // We create a new layer element
                const layer = document.createElement('div');
                layer.className = 'apply-button-layer';
                
                // Color configuration based on hover state
                // When hovering: we transition to the background color (var(--bg-color))
                // When not hovering: we transition to the primary text color (var(--text-color))
                layer.style.position = 'absolute';
                layer.style.top = '0';
                layer.style.left = '0';
                layer.style.width = '100%';
                layer.style.height = '100%';
                layer.style.backgroundColor = isHover ? 'var(--bg-color)' : 'var(--text-color)';
                layer.style.zIndex = (layers.length + 1).toString();
                
                // Start from below (translateY(100%))
                layer.style.transform = 'translateY(100%)';
                layer.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                
                button.appendChild(layer);
                layers.push(layer);

                // Force reflow
                layer.offsetHeight;

                // Animate up to 0%
                layer.style.transform = 'translateY(0%)';

                // Keep DOM clean: remove older layers that are now completely hidden underneath the new layer
                // Once the animation finishes, any layer with a lower z-index than (new z-index - 1) is completely invisible.
                setTimeout(() => {
                    // Remove all layers older than the last two
                    while (layers.length > 2) {
                        const oldLayer = layers.shift();
                        if (oldLayer && oldLayer.parentNode) {
                            oldLayer.parentNode.removeChild(oldLayer);
                        }
                    }
                    // Re-adjust z-indices to prevent them from growing infinitely
                    layers.forEach((l, idx) => {
                        l.style.zIndex = (idx + 1).toString();
                    });
                }, 600);
            };

            button.addEventListener('mouseenter', () => {
                animateToState(true);
            });

            button.addEventListener('mouseleave', () => {
                animateToState(false);
            });
        });
    }
}

// Instantiate on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ApplyButtonAnimator());
} else {
    new ApplyButtonAnimator();
}

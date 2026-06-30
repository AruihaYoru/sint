class SintFramework {
    constructor() {
        this.config = null;
        this.init();
    }
    async init() {
        await this.loadConfig();
        this.injectHeader();
        this.injectFooter();
    }
    async loadConfig() {
        try {
            const basePath = this.resolveBasePath();
            const res = await fetch(basePath + 'site-config.json');
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            this.config = await res.json();
        } catch (e) {
            console.warn('SintFramework: site-config.json の読み込みに失敗。フォールバックを使用します。', e);
            this.config = {
                brand: 'Scratch Institute of Number Theory',
                copyright: 'SINT. All rights reserved.',
                columns: []
            };
        }
    }
    resolveBasePath() {
        const scripts = document.querySelectorAll('script[src*="framework.js"]');
        if (scripts.length > 0) {
            const src = scripts[0].getAttribute('src');
            const lastSlash = src.lastIndexOf('/');
            if (lastSlash !== -1) {
                const jsDir = src.substring(0, lastSlash);
                const parentSlash = jsDir.lastIndexOf('/');
                if (parentSlash !== -1) {
                    return jsDir.substring(0, parentSlash + 1);
                }
                return './';
            }
        }
        return './';
    }
    injectHeader() {
        const headerTarget = document.querySelector('sint-header') || document.getElementById('sint-header');
        if (!headerTarget)
            return;
        const headerHTML = `
            <header class="sint-framework-header">
                <div class="header-logo">
                    <a href="${this.resolveBasePath()}index.html">SINT</a>
                </div>
                <nav class="header-nav" style="margin-left: auto; display: flex; gap: 20px;">
                    <a href="${this.resolveBasePath()}blog/index.html" style="color: var(--text-color); text-decoration: none; font-weight: bold;">BLOG</a>
                </nav>
            </header>
        `;
        if (headerTarget.tagName.toLowerCase() === 'sint-header') {
            headerTarget.outerHTML = headerHTML;
        } else {
            headerTarget.innerHTML = headerHTML;
        }
    }
    injectFooter() {
        const footerTarget = document.querySelector('sint-footer') || document.querySelector('footer');
        if (!footerTarget)
            return;
        const currentYear = new Date().getFullYear();
        const cfg = this.config;
        let columnsHTML = '';
        if (cfg.columns && cfg.columns.length > 0) {
            columnsHTML = cfg.columns.map(col => {
                const linksHTML = col.links.map(link => {
                    const externalAttrs = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
                    const externalIcon = link.external ? ' <span class="footer-external-icon">↗</span>' : '';
                    return `<li><a href="${link.href}"${externalAttrs}>${link.label}${externalIcon}</a></li>`;
                }).join('\n');
                return `
                    <div class="footer-column">
                        <h4 class="footer-column-title">${col.title}</h4>
                        <ul class="footer-column-links">
                            ${linksHTML}
                        </ul>
                    </div>
                `;
            }).join('\n');
        }
        const footerHTML = `
            <footer class="sint-framework-footer">
                <div class="footer-content">
                    <div class="footer-brand-col">
                        <div class="footer-brand">${cfg.brand || 'SINT'}</div>
                        <div class="footer-brand-tagline">THE MATHEMATICAL CRUCIBLE</div>
                    </div>
                    <div class="footer-columns">
                        ${columnsHTML}
                    </div>
                </div>
                <div class="footer-bottom">
                    &copy; ${currentYear} ${cfg.copyright || 'SINT.'}
                </div>
            </footer>
        `;
        if (footerTarget.tagName.toLowerCase() === 'sint-footer') {
            footerTarget.outerHTML = footerHTML;
        } else {
            footerTarget.outerHTML = footerHTML;
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SintFramework());
} else {
    new SintFramework();
}

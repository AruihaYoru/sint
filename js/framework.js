class SintFramework {
    constructor() {
        this.config = null;
        this.init();
    }
    async init() {
        await this.loadConfig();
        this.injectHeader();
        this.injectSideNav();
        this.injectFooter();
        this.setupEventListeners();
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
                    <a href="index.html">SINT</a>
                </div>
                <button class="nav-toggle" aria-label="Toggle Navigation">
                    <span class="nav-toggle-line"></span>
                    <span class="nav-toggle-line"></span>
                </button>
            </header>
        `;
        if (headerTarget.tagName.toLowerCase() === 'sint-header') {
            headerTarget.outerHTML = headerHTML;
        } else {
            headerTarget.innerHTML = headerHTML;
        }
    }
    injectSideNav() {
        if (document.querySelector('.sint-framework-sidenav'))
            return;
        const sideNavHTML = `
            <nav class="sint-framework-sidenav">
                <div class="sidenav-overlay"></div>
                <div class="sidenav-content">
                    <div class="sidenav-header">
                        <span class="sidenav-title">NAVIGATION</span>
                        <button class="nav-close" aria-label="Close Navigation">×</button>
                    </div>
                    <ul class="sidenav-links">
                        <li><a href="index.html" class="nav-link"><span class="nav-num">00</span>HOME</a></li>
                        <li><a href="index.html#hero" class="nav-link"><span class="nav-num">01</span>ABOUT US</a></li>
                        <li><a href="index.html#history" class="nav-link"><span class="nav-num">02</span>HISTORY</a></li>
                        <li><a href="chronicle.html" class="nav-link"><span class="nav-num">03</span>CHRONICLE</a></li>
                        <li><a href="apply.html" class="nav-link"><span class="nav-num">04</span>TESTAMENT (応募)</a></li>
                    </ul>
                    <div class="sidenav-footer">
                        <span>THE MATHEMATICAL CRUCIBLE</span>
                    </div>
                </div>
            </nav>
        `;
        document.body.insertAdjacentHTML('beforeend', sideNavHTML);
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
    setupEventListeners() {
        const toggleBtn = document.querySelector('.nav-toggle');
        const closeBtn = document.querySelector('.nav-close');
        const sideNav = document.querySelector('.sint-framework-sidenav');
        const overlay = document.querySelector('.sidenav-overlay');
        const openNav = () => {
            sideNav.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };
        const closeNav = () => {
            sideNav.classList.remove('is-open');
            document.body.style.overflow = '';
        };
        if (toggleBtn)
            toggleBtn.addEventListener('click', openNav);
        if (closeBtn)
            closeBtn.addEventListener('click', closeNav);
        if (overlay)
            overlay.addEventListener('click', closeNav);
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SintFramework());
} else {
    new SintFramework();
}

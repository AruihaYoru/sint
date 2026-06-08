(function () {
    const css = `
        aruiha {
            position: relative;
            display: inline;
            cursor: pointer;
        }

        aruiha .ak-anchor {
            position: relative;
            display: inline;
        }

        aruiha .ak-display {
            display: inline;
            border-bottom: 2px dashed rgba(0,0,0,0.2);
            transition: border-color 0.2s;
        }
        aruiha:hover .ak-display {
            border-color: rgba(0,0,0,0.55);
        }

        /* ── バッジ ── */
        aruiha .ak-badge {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            font-size: 0.55rem;
            padding: 2px 6px;
            border-radius: 99px;
            background: rgba(0,0,0,0.08);
            vertical-align: middle;
            margin-left: 5px;
            font-weight: 700;
            letter-spacing: 0.06em;
            opacity: 0;
            transform: translateY(1px);
            transition: opacity 0.2s, transform 0.2s;
            user-select: none;
            color: #1a1a1a;
        }
        aruiha:hover .ak-badge {
            opacity: 1;
            transform: translateY(0);
        }

        /* ── ポップアップ本体 ── */
        aruiha .ak-popup {
            position: absolute;
            left: 0;
            top: calc(100% + 10px);
            background: rgba(15, 15, 20, 0.92);
            backdrop-filter: blur(16px) saturate(1.4);
            -webkit-backdrop-filter: blur(16px) saturate(1.4);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 14px;
            padding: 5px;
            min-width: max-content;
            width: max-content;
            flex-direction: column;
            gap: 2px;
            z-index: 9999;
            box-shadow:
                0 2px 8px rgba(0,0,0,0.12),
                0 16px 48px rgba(0,0,0,0.3);
            font-size: 0.8rem;
            font-weight: 400;
            line-height: 1.5;
            letter-spacing: 0.01em;
            color: #f0ede8;

            /* アニメーション */
            display: flex;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-6px) scale(0.98);
            transform-origin: top left;
            transition:
                opacity 0.18s ease,
                visibility 0.18s ease,
                transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: none;
        }
        aruiha:hover .ak-popup {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        /* ── 各アイテム ── */
        aruiha .ak-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.12s;
            white-space: nowrap;
        }
        aruiha .ak-item:hover {
            background: rgba(255,255,255,0.09);
        }
        aruiha .ak-item.is-active {
            background: rgba(255,255,255,0.05);
        }

        /* アクティブドット */
        aruiha .ak-item::before {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: transparent;
            flex-shrink: 0;
            transition: background 0.15s;
        }
        aruiha .ak-item.is-active::before {
            background: #e8e3dc;
        }

        aruiha .ak-item-body {
            display: flex;
            flex-direction: column;
            gap: 1px;
        }

        aruiha .ak-item-label {
            font-size: 0.82rem;
            font-weight: 500;
            color: #f0ede8;
        }
        aruiha .ak-item.is-active .ak-item-label {
            color: #fff;
        }

        aruiha .ak-item-comment {
            font-size: 0.7rem;
            color: rgba(240,237,232,0.4);
            font-weight: 400;
        }
    `;

    const injectCSS = () => {
        const id = 'aruiha-kore-styles';
        if (document.getElementById(id)) return;
        const s = document.createElement('style');
        s.id = id;
        s.textContent = css;
        document.head.appendChild(s);
    };

    const labelFromEl = (el) => el.textContent.replace(/\s+/g, ' ').trim();

    const initAruiha = (aruihaEl) => {
        const koreEls = Array.from(aruihaEl.querySelectorAll(':scope > kore'));
        if (!koreEls.length) return;

        const choices = koreEls.map((k) => ({
            innerHTML: k.innerHTML,
            label:     labelFromEl(k),
            comment:   k.getAttribute('data-comment') || ''
        }));

        aruihaEl.innerHTML = '';

        const anchor  = document.createElement('span');
        anchor.className = 'ak-anchor';

        const display = document.createElement('span');
        display.className = 'ak-display';
        display.innerHTML = choices[0].innerHTML;

        const badge = document.createElement('span');
        badge.className = 'ak-badge';
        badge.textContent = `▾ ${choices.length}`;

        const popup = document.createElement('div');
        popup.className = 'ak-popup';
        popup.setAttribute('role', 'listbox');

        choices.forEach((choice, i) => {
            const item = document.createElement('div');
            item.className = 'ak-item' + (i === 0 ? ' is-active' : '');
            item.setAttribute('role', 'option');

            const body = document.createElement('span');
            body.className = 'ak-item-body';

            const labelEl = document.createElement('span');
            labelEl.className = 'ak-item-label';
            labelEl.textContent = choice.label;
            body.appendChild(labelEl);

            if (choice.comment) {
                const commentEl = document.createElement('span');
                commentEl.className = 'ak-item-comment';
                commentEl.textContent = choice.comment;
                body.appendChild(commentEl);
            }

            item.appendChild(body);

            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                display.innerHTML = choice.innerHTML;
                popup.querySelectorAll('.ak-item').forEach(it => it.classList.remove('is-active'));
                item.classList.add('is-active');

                if (window._textRevealInstance) {
                    window._textRevealInstance.rescan();
                }
            });

            popup.appendChild(item);
        });

        anchor.appendChild(display);
        anchor.appendChild(badge);
        anchor.appendChild(popup);
        aruihaEl.appendChild(anchor);
    };

    const init = () => {
        injectCSS();
        document.querySelectorAll('aruiha').forEach(initAruiha);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.AruihaKore = { init, initAruiha };
})();

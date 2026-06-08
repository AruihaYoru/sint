(function () {
    /**
     * hero-reveal.js
     *
     * ヒーロー内の .marker-wrapper を自動再生する。
     * <br> を含む場合は行ごとに分割し、順番にリビールする。
     * text-reveal.js（lib/）には一切手を加えない。
     *
     * ─ 設定 ──────────────────────────────────────────
     */
    const CONFIG = {
        /** true にするとアニメーション完了までスクロールを固定する */
        SCROLL_LOCK: false,

        /** アニメーション開始までのディレイ (ms) */
        DELAY_MS: 400,

        /** 1行あたりのリビール時間 (ms) — text-reveal.js の transition と合わせる */
        LINE_DURATION_MS: 650,
    };
    /* ─────────────────────────────────────────────── */

    const lockScroll   = () => { document.body.style.overflow = 'hidden'; };
    const unlockScroll = () => { document.body.style.overflow = ''; };

    /**
     * .marker-wrapper 1つを <br> で分割し、単行の wrapper 配列を返す。
     * <br> がない場合はそのまま [wrapper] を返す。
     */
    const splitMarkerByLines = (wrapper) => {
        const textSpan = wrapper.querySelector('.marker-text');
        if (!textSpan) return [wrapper];

        const rawHTML = textSpan.innerHTML;
        const parts   = rawHTML.split(/<br\s*\/?>/i).map(s => s.trim()).filter(Boolean);

        // 改行なし → 元の要素をそのまま使う
        if (parts.length <= 1) return [wrapper];

        const color  = wrapper.getAttribute('data-marker-color') || '#000';
        const parent = wrapper.parentNode;
        const result = [];

        parts.forEach((part, i) => {
            // 2行目以降の前に <br> を挿入
            if (i > 0) parent.insertBefore(document.createElement('br'), wrapper);

            const nw = document.createElement('span');
            nw.className = 'marker-wrapper';
            nw.setAttribute('data-marker-color', color);
            // 初期状態: 非表示（transition は CSS 側に任せる）
            nw.style.setProperty('--accent-color', color);
            nw.style.setProperty('--marker-width', '0%');

            const ns = document.createElement('span');
            ns.className = 'marker-text';
            ns.innerHTML = part;
            nw.appendChild(ns);

            parent.insertBefore(nw, wrapper);
            result.push(nw);
        });

        // 元の（分割元）wrapper を取り除く
        parent.removeChild(wrapper);
        return result;
    };

    const run = () => {
        if (CONFIG.SCROLL_LOCK) lockScroll();

        const hero = document.querySelector('.hero');
        if (!hero) return;

        // aruiha-kore.js が構築した後の .marker-wrapper を収集
        const rawWrappers = Array.from(hero.querySelectorAll('.marker-wrapper'));
        if (!rawWrappers.length) return;

        // 全て 0% にリセットしてから分割
        rawWrappers.forEach(w => w.style.setProperty('--marker-width', '0%'));

        const allLines = [];
        rawWrappers.forEach(w => {
            const lines = splitMarkerByLines(w);
            allLines.push(...lines);
        });

        // 行ごとに順番にアニメーション
        allLines.forEach((line, i) => {
            setTimeout(() => {
                line.style.setProperty('--marker-width', '100%');

                // 最後の行が完了したタイミングでアフター処理
                if (i === allLines.length - 1) {
                    setTimeout(() => {
                        // text-reveal.js に登録し直す（trigger=99 → 常に100%を維持）
                        allLines.forEach(l => l.setAttribute('data-marker-trigger', '99'));
                        if (window._textRevealInstance) {
                            window._textRevealInstance.rescan();
                        }
                        if (CONFIG.SCROLL_LOCK) unlockScroll();
                    }, CONFIG.LINE_DURATION_MS + 100);
                }
            }, CONFIG.DELAY_MS + i * CONFIG.LINE_DURATION_MS);
        });
    };

    // aruiha-kore.js より後に読み込まれることを前提とする（DOM 構築済み）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

    window.HeroReveal = { CONFIG, run };
})();

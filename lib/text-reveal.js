(function() {
    /**
     * ライブラリ専用のコアCSSスタイル
     */
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

    /**
     * スタイルシートの動的インジェクション関数
     */
    const injectCSS = () => {
        const styleId = 'independent-text-reveal-styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    };

    /**
     * テキスト展開管理クラス
     */
    class IndependentTextRevealManager {
        constructor() {
            this.markers = [];
            this.updateBound = this.update.bind(this);
            injectCSS();
            this.init();
        }

        /**
         * 初期化メソッド
         */
        init() {
            this.rescan();

            // ネイティブのウィンドウイベントに更新処理をバインド
            window.addEventListener('scroll', this.updateBound);
            window.addEventListener('resize', this.updateBound);
        }

        /**
         * .marker-wrapper を再スキャンして参照を更新する
         * aruiha などで DOM が差し替わった後に呼ぶ
         */
        rescan() {
            const elements = document.querySelectorAll('.marker-wrapper');
            
            this.markers = Array.from(elements).map(el => {
                // アクセントカラーを取得
                const color = el.getAttribute('data-marker-color') || '#000';
                el.style.setProperty('--accent-color', color);
                
                // 各要素のトリガー位置
                const trigger = parseFloat(el.getAttribute('data-marker-trigger'));
                
                return {
                    el,
                    trigger: isNaN(trigger) ? 0.5 : trigger
                };
            });

            // 再スキャン後に即座に位置判定
            this.update();
        }

        /**
         * スクロールおよびリサイズ時に呼び出される座標計算・スタイル更新メソッド
         */
        update() {
            // ネイティブのビューポート高さを参照
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

        /**
         * クリーンアップメソッド
         */
        destroy() {
            window.removeEventListener('scroll', this.updateBound);
            window.removeEventListener('resize', this.removeEventListener);
        }
    }

    // DOMの構築ステータスに応じて
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window._textRevealInstance = new IndependentTextRevealManager();
        });
    } else {
        window._textRevealInstance = new IndependentTextRevealManager();
    }

    // 外部からの操作を可能にする
    window.IndependentTextRevealManager = IndependentTextRevealManager;
})();
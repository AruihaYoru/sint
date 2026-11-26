# DoJ (Department of Jokes / ジョーク部門) 記述アーカイブ

本ファイルは、サイト本体から退避したジョーク部門（DoJ）に関する全記述・コンポーネントコードのバックアップです。

---

## 1. ナビゲーションメニュー記述 (`src/components/SintHeader.astro`)

```astro
<li><a href="/doj" class="nav-link"><span class="nav-num">04</span>DEPARTMENT OF JOKES (DoJ)</a></li>
```

---

## 2. トップページ記述 (`src/pages/index.astro`)

```astro
    <div class="divider"></div>

    <!-- ジョーク部門 (Department of Jokes) セクション -->
    <section class="content-section doj-home-section">
        <span class="section-num reveal-up">04 / SPECIAL DIVISION</span>
        <div class="doj-home-inner reveal-up" data-reveal-delay="0.1s">
            <div class="doj-home-header">
                <span class="doj-home-badge">DIVISION 02 // DoJ</span>
                <h2 class="section-text" style="font-size: 2.2rem; margin-top: 0.5rem; margin-bottom: 2rem;">
                    ジョーク部門 (Department of Jokes)
                </h2>
            </div>
            
            <div class="doj-home-grid">
                <div class="doj-home-left">
                    <p class="about-desc">
                        本部門は、当会の主軸であるQ1ジャーナル等への査読プロセス長期化（いわゆる<strong>「査読者2号による煉獄」</strong>）に伴う学術的飢餓感を解消し、一般層への数理科学のアウトリーチを促進するために設立された特別研究部門である。
                    </p>
                    <p class="about-desc" style="margin-top: 1.5rem;">
                        最高水準の数論・位相幾何学・確率過程の知見を、日常の些細なライフハックやインターネット・ミームの検証へと惜しみなく投入することで、迅速かつ確実な研究成果の創出を目的とする。
                    </p>
                </div>
                
                <div class="doj-home-right">
                    <blockquote class="doj-home-quote">
                        "Established to mitigate academic withdrawal symptoms caused by prolonged Q1 peer-review purgatory... Our mission is to deliver rapid, empirically grounded, and scientifically rigorous nonsense to the broader public while our primary manuscripts await Reviewer 2's mercy."
                    </blockquote>
                    <a href="/doj" class="doj-home-link">
                        <span>VIEW DoJ SECTOR ↗</span>
                    </a>
                </div>
            </div>
        </div>
    </section>
```

```css
    .doj-home-section {
        position: relative;
    }
    .doj-home-inner {
        border-top: 2px solid var(--text-color);
        padding-top: 3rem;
    }
    .doj-home-badge {
        font-family: var(--font-en);
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--text-muted);
    }
    .doj-home-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 4rem;
        margin-top: 2rem;
    }
    .doj-home-left strong {
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .doj-home-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-left: 1px solid var(--border-color);
        padding-left: 2.5rem;
    }
    .doj-home-quote {
        font-family: var(--font-en);
        font-size: 0.95rem;
        line-height: 1.8;
        color: var(--text-muted);
        font-style: italic;
        margin-bottom: 2rem;
    }
    .doj-home-link {
        display: inline-block;
        font-family: var(--font-en);
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-color);
        text-decoration: none;
        border-bottom: 2px solid var(--text-color);
        padding-bottom: 4px;
        align-self: flex-start;
        transition: opacity 0.2s;
    }
    .doj-home-link:hover {
        opacity: 0.6;
    }
    @media (max-width: 860px) {
        .doj-home-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        .doj-home-right {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border-color);
            padding-top: 2rem;
        }
    }
```

---

## 3. Docs一覧ページ記述 (`src/pages/docs/index.astro`)

```astro
        <!-- ジョーク部門 (DoJ) 案内 -->
        <div class="doj-cross-banner reveal-up">
            <div class="doj-cross-meta">
                <span class="doj-cross-num">DIV-02</span>
                <span class="doj-cross-tag">DEPARTMENT OF JOKES</span>
            </div>
            <div class="doj-cross-info">
                <h3 class="doj-cross-title">
                    <a href="/doj">ジョーク部門 (Department of Jokes / DoJ)</a>
                </h3>
                <p class="doj-cross-desc">
                    Q1査読者2号による煉獄を生き延びるため、最高水準の数理科学をインターネット・ミームや日常の些細な謎へ投入する特別研究部門。
                </p>
                <div class="doj-cross-footer">
                    <a href="/doj" class="docs-readmore">VIEW DEPARTMENT OF JOKES ↗</a>
                </div>
            </div>
        </div>
```

```css
/* ジョーク部門クロスバナー */
.doj-cross-banner {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2.5rem 0;
    margin-bottom: 2rem;
    border-top: 2px solid var(--text-color);
    border-bottom: 1px solid var(--text-color);
}

@media (min-width: 768px) {
    .doj-cross-banner {
        grid-template-columns: 0.3fr 1fr;
        gap: 3rem;
    }
}

.doj-cross-num {
    font-family: var(--font-en);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
}

.doj-cross-tag {
    display: inline-block;
    font-family: var(--font-en);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 3px 8px;
    border: 1px solid var(--text-color);
    align-self: flex-start;
}

.doj-cross-title {
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 0.5rem;
}

.doj-cross-title a {
    color: var(--text-color);
    text-decoration: none;
}

.doj-cross-title a:hover {
    text-decoration: underline;
}

.doj-cross-desc {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-muted);
    margin-bottom: 1rem;
}

.doj-cross-footer {
    display: flex;
    justify-content: flex-end;
}
```

---

## 4. ページファイル本体

- `ignore/doj/index.astro`: ジョーク部門ポータルページ本体
- `ignore/docs/quantum-tunneling-wall.astro`: SPEC-04
- `ignore/docs/orca-despair-conjecture.astro`: SPEC-05

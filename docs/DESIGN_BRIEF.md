# FPKS visual design brief

## Product character

FPKS should feel like a calm, rigorous Chinese-language knowledge garden: scholarly without looking institutional, personal without looking like a social feed, and dense without becoming visually noisy. Reading and finding ideas matter more than decoration.

The current foundation ("warm paper", aligned with the vault's Obsidian Claude Warm theme) is intentionally restrained:

- Noto Serif SC for headings, Noto Sans SC for body text, and IBM Plex Mono for code;
- ivory paper light mode (`#f6f4ec`) and warm charcoal dark mode (`#20201f`);
- terracotta as the only accent: `#a94f2d` / `#d97757` for text, `#c8643f` for decoration only because it is too light for body-size text on paper;
- `def` callouts in terracotta and `done` callouts in green, with square corners and a thin left rule like the vault's callout snippet;
- a desktop knowledge workspace with explorer, search, table of contents, backlinks, and graph, in that order of weight.

## Improvement priorities

1. Make the home page explain the knowledge garden and expose useful entry points quickly.
2. Strengthen hierarchy in the explorer, article header, metadata, headings, and side panels. Open with all directory folders collapsed; hide directory scrollbars while retaining scrolling. Let desktop readers drag the left rail to fit long titles, preserving that width separately from folder state.
3. Make long-form Chinese reading comfortable: sensible measure, rhythm, contrast, and spacing.
4. Treat mobile as a first-class reading experience, especially navigation and long formulas.
5. Improve discoverability without turning the site into a dashboard full of competing cards.
6. Keep interactions subtle, fast, keyboard-accessible, and respectful of reduced-motion preferences.

## Constraints

- Preserve content integrity, Obsidian-style links, LaTeX, code, tables, citations, images, and all Quartz discovery tools.
- Meet reasonable contrast and focus-state expectations in both themes.
- Prefer CSS and existing Quartz composition APIs. Add JavaScript only for an interaction that cannot be achieved cleanly otherwise.
- Avoid heavy animation, generic glassmorphism, oversized marketing hero sections, decorative gradients behind every surface, and font choices that weaken Chinese coverage.
- Do not add analytics, comments, accounts, a database, or external design dependencies without explicit approval.

## Review targets

Evaluate at minimum:

- desktop around 1440 px;
- laptop around 1024 px;
- mobile around 390 px;
- the home page, a math-heavy article, an image-heavy article, and a folder listing;
- light mode, dark mode, keyboard focus, and reduced motion.

When a visual choice is subjective, implement the smallest coherent version, show it in a branch preview, and record the tradeoff rather than inventing unconfirmed brand requirements.

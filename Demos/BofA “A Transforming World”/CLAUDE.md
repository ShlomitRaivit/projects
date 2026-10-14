# Prototype rules

This is a UI prototype built with our design system (DS). Plain HTML, CSS and JS only.

## Before building

- Read `ds/DS-GUIDE.md` first. Use only the components, classes, tokens and icons it documents.
- Build UI from DS components. Style with DS tokens (`var(--ds-*)`). Icons are `<ds-icon name="..." size="16|24">`.
- Never hardcode colors, spacing or font sizes. Never paste SVG icons.

## The ds/ folder is read-only

- Never edit anything in `ds/`. Edits there are blocked in `.claude/settings.json`.
- If the DS lacks something, build it in the prototype using DS tokens, in `app.css` / `app.js`, under a clearly named section, for example `/* ===== Prototype-only: stat tile (DS candidate) ===== */`. Then tell me it's a DS candidate.

## Plain HTML/CSS/JS only

- No build step, no npm, no frameworks. Every page must work by opening it directly (`file://`).
- Multi-page prototypes: one HTML file per screen, linked together with relative links.
- Shared styles go in `app.css`, shared behavior in `app.js`, fake data in `data.js`.
- Images used only by this prototype go in `assets/`.
- Only change files in this repo.

## Updating the DS

1. Run `./update-ds.sh` (latest) or `./update-ds.sh v1.1` (a specific version).
2. Show me the changelog the script prints.
3. Open every page and check for visual problems and console errors.
4. To undo an update, restore `ds/` from the last commit (`git checkout -- ds`).

## DS version

The version in use is in `ds/VERSION`. Tell me when asked.

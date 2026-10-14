# BofA "Breaking the fourth wall" - progress

Live-stage demo for the Bank of America "A Transforming World" event (Nov 10, 2026).
Plain HTML/CSS/JS on the Kaltura DS (`ds/`, v1.0). Open `stage.html` directly (`file://`).
Figma file key: `Oo1Ms2pLtv0YEeus1Shh7b` (page "Demo"). Frame IDs and prototype notes: `figma-frame-map.md`.

## Completed

**Batch 1 - Open: The Wall (W1-W5)** and **Batch 2 - The Experience in Practice (P1-P6)**, 11 scenes in total.

- `stage.html`: one stage shell, a fixed 1440x900 canvas scaled to fit the window. Views: wall, Mighty Tech site, "What's next", quick demo, generated experience (skeleton and registration form). One shared avatar element moves between slots (wall, center, corner, site).
- `stage.js`: scene runner. Mouse and keyboard navigation, After Delay timers, poster fallback when a clip is missing.
- `data.js` (appended `APP_DATA.stage`): scene list, one entry per Figma frame, with view, avatar slot, enter style, timers, poster, clip path and Figma caption.
- `app.css` (appended section "Prototype-only: stage + composer + Mighty Tech site (DS candidate)"): all stage styles, written with DS tokens. The few Mighty Tech brand colors are defined once as `--mt-*`.
- `assets/`: backgrounds (`bg/`), posters W1-W5 and P1-P6 (`posters/`), website art and speaker portraits (`site/`). `assets/avatar/` is empty.
- Template files `index.html` and `app.js` are untouched.

**Controls:** Space / Right arrow / click = next, Left = back, Up / Down = scroll the website (P1), S = skip clip, R = reset, P = presenter panel (shows scene, clip state, next scene and the Figma caption).

**Automated checks (headless Chrome, `file://`, no console errors):**
- Stepping W1 to P6 with Space, Right arrow and click shows the right poster, view, avatar slot and call bar on every step.
- Left goes back, stays put at W1, and stays on P6 at the end. R resets.
- P5 timer: skeleton, then the empty form at 3 s. P6 timer: filled form, then back to the skeleton at 1 s (as in Figma).
- Up / Down call `scrollBy` on the website. Leaving P1 and returning resets the scroll.

## Pending / not verified

- **Header logo (P1):** I replaced the flattened logo with a transparent swoosh image plus "MT" text (`assets/site/logo-swoosh.png`, `.stage-site-logo` in `app.css`). I did not look at the result after this change, and an earlier screenshot showed a broken image. Check this first.
- **Visual match:** P1-P6 were compared with Figma by eye. Not re-checked after the last CSS tweaks (pill gradient, nav spacing, hero paragraph width). The P5 skeleton morph animation and the dissolve / avatar-move transitions were not viewed.
- **Videos:** two Maya clips from Avatar Studio exist in `Avatar videos/` (`Maya-pauseRon-if-the-2026-10-14.mp4`, `Maya-pauseThat-would-have-2026-10-14.mp4`). They match the W3 and W4 lines but are not yet copied or renamed into `assets/avatar/` or wired to `data.js`, and I have not played them in the runner. The other clips do not exist. The 4 Wall clips and 5 Practice clips use placeholder names in `data.js` (`assets/avatar/S01-L01_...` to `S02-L05_...`). The P4 demo video is `assets/video/S02-L03_extra_quick-demo.mp4`. Untested: playback, sound unlock on first key press, `ended` advancing W4.
- **Dialogue:** captions are Figma text, not the approved stage script. W2, W5 and P1 have none. The stage script is still missing.
- **Figma open questions** (see `figma-frame-map.md`): `image 4` (3178:22991) is an empty rectangle; Live 3 has three competing triggers; Practice 3's child 3154:15327 click has no destination.
- **Stand-ins:** Flashcards chip uses the DS `copy` icon, composer text uses DS regular weight (Figma uses Lato Medium).
- **DS rules:** `.claude/settings.json` does not exist, so nothing blocks edits to `ds/`. `.DS_Store` files are not git-ignored.
- **Test harness** lives in `/tmp/bofa_t` and is not in the repo. It is not needed to run the demo.

## Next steps

1. Open `stage.html`, walk W1 to P6, and fix the header logo and any visual differences from Figma.
2. Batch 3: The Live Experience (L1-L14, Figma IDs in `figma-frame-map.md`). It reuses the shared avatar, adds the 5 s auto-advance on most slides, the hover states on L9 and L10, the Processing loop on L13, and tall frames (L1 is 1440x3799, so decide how it scrolls).
3. Copy the two existing Maya clips into `assets/avatar/` under the names in `data.js` (W3 and W4), generate the rest in Avatar Studio, and get the stage script. Test playback, sound and the W4 auto-advance.
4. Answer the open Figma questions above.
5. Later scenes (Post Event, Content Hub, role-play, Avatar Studio, Content Lab, closing) are outside the 34 approved frames. They need new frame IDs and the full stage script.

# BofA "Breaking the fourth wall" - progress

Live-stage demo for the Bank of America "A Transforming World" event (Nov 10, 2026).
Plain HTML/CSS/JS on the Kaltura DS (`ds/`, v1.0). Open `stage.html` directly (`file://`).
Figma file key: `Oo1Ms2pLtv0YEeus1Shh7b` (page "Demo"). Frame IDs and prototype notes: `figma-frame-map.md`.

## Completed (all 34 approved frames, 25 scenes)

- **Batches 1 and 2, Open: The Wall (W1-W5) and The Experience in Practice (P1-P6):** real HTML, now a fluid layout (see "Responsive scope"). First version committed in `bfb65fa`.
- **Batch 3, The Live Experience (L1-L14): rebuilt as real HTML (this change, not committed).** The earlier version used flattened Figma screenshots; those images are deleted.
  - **L2-L13 share one event shell** (`#event`): header, video area, info section, chat/Q&A/Ask-anything side panel, and the rail. The video keeps its aspect ratio and fits the viewport height; the page scrolls inside the shell, and the side panel scrolls inside itself. The panel changes by state (`data-panel`: chat, qa-empty, qa-typed, qa-posted, qa-answered, ask-home, ask-typed, ask-loading, ask-answer).
  - **L1** is a separate scrolling event page (`#home`, 2902 px of scroll at 1440x813): hero, workshop card, promo banner, news, recommended, speakers, spotlight, interactive demos, footer. **Auto-advance is off.** Space / Right arrow / the Join Now button advance.
  - **L14** is the Genie answer panel in the same shell: flashcard carousel (1/3, arrows) and next steps; it scrolls.
  - Poll and thank-you toasts (L4, L5) are real text and slide in from the left; Dismiss works. L10 "Ask anything" turns into "Ask Genie" on hover. L13 loading bars pulse (CSS). L3 is a pass-through frame (Figma fires a child timer after 0.001 s); Left skips it.
  - Interactive controls (tabs, buttons, select) are real DS components or buttons; text can be selected.
- **P1 player** is now HTML too (slide, speaker camera, control bar); the avatar's "Ask me anything" label is real text.

## Interaction rules (changed per your decisions)

- **Click-to-advance is removed** everywhere except the Wall screens W1-W5 and P5, where Figma uses a plain click and there is nothing to explore. On every other scene, advance with **Space or Right arrow**; Left goes back; the P6 Register button and the L1 Join Now button also advance. Clicks never advance scrollable or interactive scenes, so scrolling, selecting text, and buttons work normally.
- **Scrolling:** Up / Down / PageUp / PageDown / Home / End scroll the P1 website, the L1 page and the L2-L14 event page (or use the mouse wheel or trackpad). Scroll position resets when you enter a scene.
- **Auto-advance (5 s)** stays on L2, L4 to L13 (non-interactive in Figma). Off on L1 and L14. `A` pauses or resumes it.

## Responsive scope (your clarification and the "don't scale the interface" rule)

- **Nothing is scaled any more.** The old W1-P6 stage (a fixed 1440x900 canvas shrunk or grown with `transform: scale`) is gone. Every screen is now a normal fluid layout: text, buttons and spacing keep their Figma sizes at every width, and only the boxes that hold video change size.
- **Video keeps its aspect ratio, the HTML around it adapts on its own.** Verified ratios (measured): wall avatar 1.005, call avatar 0.952, P4 demo video 1.778, P1 player video 2.266, L2-L14 video row 2.458. They hold at 1440, 1600, 1920 and 2560 wide and at a short 613 px viewport.
  - W1-W5: avatar grows with the viewport height; "or" and the prompt box sit under it and share its width.
  - P2-P6: the corner avatar grows with the width (358 px at 1440, up to 520 px); the content column beside it (P3, P5, P6) grows to 960 px, is centered in the space left of the avatar, and scrolls on its own when the window is short.
  - P1 website: header, hero and footer flow with the width; the video player widens (1056 px at 1440, up to 1400 px) and keeps its ratio.
  - P4: the demo video is centered and keeps 16:9, never wider than the window.
  - L1-L14: unchanged from before (fluid, video row uses container-query units).
- **Supported widths:** 1440 px and up (1440, 1600, 1920, 2560 tested). Below 1440 the page scrolls sideways; tablet and mobile are not supported, as you said.
- **Heights:** every screen works at short heights. P3, P5, P6 columns, P1, L1 and the event page scroll (P6 Register stays reachable at 613 px).

## Checked (headless Chrome, `file://`, no console errors)

- Navigation W1 to L1 with Space, Right arrow and click; Left back; R reset; clicks on P1, P2, the L1 page and the event page do not advance; P6 Register advances to L1.
- L1: scrolled with Down, Page Down, End, Home (range 2902 px); idle for 7 s without advancing; Space advances; text selection works.
- L2 to L14 auto-advance, about 5 s per frame: L2 to L4 (through L3) to L13 to L14; L14 stays. Left from L4 lands on L2.
- L14 carousel Next/Prev with 1/3, 2/3, 3/3 and no overshoot.
- Layout at 1440x813, 1440x613, 1600x813, 1920x993, 2560x1353: no horizontal scroll, smallest text 11 to 12 px, aspect ratios of every video box measured (see above).
- After the fluid rewrite I re-ran navigation W1 to L1, click rules, L1 and event scrolling, the L14 carousel, the L2-L14 auto-advance and the P6 form reachability: all passed, no console errors.
- Screenshots of L1 (top, middle, bottom), L2, L4/L5 toasts, L7 to L14, P1 and P2 at 1920 compared with Figma by eye.

## Not verified / known differences

- **Fixed along the way:** the "0 attachment available" and "End" labels on P2-P6 disappeared after the rewrite (the DS button animates every property, including visibility, so inside the fading call bar it stayed hidden); fixed by turning that animation off for the two decorative buttons.
- **Not tested in a real browser by me.** Everything above ran in headless Chrome. Please open `stage.html` and step through, especially transitions, the toast slide, hover states and trackpad scrolling.
- **Not pixel-compared with Figma.** Layout, text, colors and sizes follow the Figma values, but spacing was judged by eye. Differences I know of: the L1 header turns solid once the page is scrolled (Figma's is a see-through gradient and would be unreadable over content); the chat list on L2 shows the last messages and scrolls up for the rest (Figma crops at the first bubble); the emoji flags in the chat render as letters on some systems.
- The "Live" tag, thumbs-up illustration, and the reactions button are simplified: the reaction button is a DS `emoji` icon, not Figma's animated hearts and hands. The thumbs-up is a Figma export (an image) with its background made transparent.
- **Still images by design:** speaker and news photos, the slide, the webcam shot, the Maya card and posters (video stand-ins). Real clips are still missing.
- Hover on L10 swaps "Ask anything" to "Ask Genie" with the DS dark colors; L9's Figma hover button is off-screen and was not built.
- Videos, stage script, and the open Figma questions are unchanged (see below).
- Typing on L8 and L12 is a fixed text, not live input.

## Open items (from earlier, unchanged)

- No avatar clips in `assets/avatar/`; `Avatar videos/` holds three Maya files (one, `Muted Avatar.mp4`, untracked). Playback, sound unlock and the W4 auto-advance are untested.
- Captions are Figma text, not the approved stage script.
- Figma loose ends: `image 4` (3178:22991) is an empty rectangle; P3's child 3154:15327 has a click with no destination.
- Flashcards chip uses the DS `copy` icon; composer text uses DS regular weight.
- `.claude/settings.json` does not exist, so nothing blocks edits to `ds/`. `.DS_Store` files are not git-ignored.

## Next steps

1. Open `stage.html` in Chrome at your usual screen size and walk W1 to L14; report anything that looks off.
2. Wire the Maya clips (copy into `assets/avatar/` with the names in `data.js`) and test playback and sound.
3. Provide the stage script to replace the Figma captions.
4. Commit when you have reviewed the implementation.

## Git

Not committed. Changed: `app.css`, `data.js`, `stage.html`, `stage.js`, `PROGRESS.md`. New: `assets/events/`, new files in `assets/live/` and `assets/posters/P1-maya-purple.jpg`. Deleted: the flattened screenshots `assets/live/L*.jpg`, `assets/site/player.png`, `assets/posters/P1.png`. `Avatar videos/Muted Avatar.mp4` is untracked and not part of this work.

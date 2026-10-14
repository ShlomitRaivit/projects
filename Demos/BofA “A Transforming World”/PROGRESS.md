# BofA "Breaking the fourth wall" - progress

Live-stage demo for the Bank of America "A Transforming World" event (Nov 10, 2026).
Plain HTML/CSS/JS on the Kaltura DS (`ds/`, v1.0). Open `stage.html` directly (`file://`).
Figma file key: `Oo1Ms2pLtv0YEeus1Shh7b` (page "Demo"). Frame IDs and prototype notes: `figma-frame-map.md`.

## Completed (all 34 approved frames, 25 scenes)

- **Batch 1, Open: The Wall (W1-W5)** and **Batch 2, The Experience in Practice (P1-P6)**: see earlier notes in git history (`bfb65fa`).
- **Batch 3, The Live Experience (L1-L14)**: each Figma frame is a picture in `assets/live/` with the interactive parts drawn on top.
  - After Delay: L1, L2, L4 to L13 advance after 5 s (as in Figma). L14 has no navigation.
  - **L3 is a pass-through frame.** Figma gives L3 a 5 s timer on the frame, but a child inside it fires after 0.001 s, so Figma never waits 5 s. L3 is the same picture as L2; it hands over to L4 at once, which is when the poll toast slides in. The Left arrow skips over L3.
  - L4 and L5: the poll and thank-you toasts slide in from the left (`assets/live/L04.jpg`, `L05.jpg`, cropped to the toast); L6 slides it out.
  - L10: hovering "Ask anything" shows the "Ask Genie" hover state.
  - L13: the three loading bars pulse in turn (CSS, replaces Figma's Processing component).
  - **L1** shows only the top 961 px of the 3799 px frame. Figma has overflow "none" on it, and it moves on after 5 s, so I did not add scrolling. Figma does mark its header as a fixed child, which suggests scrolling may have been intended once; ask if you want it.
  - Live scenes have no avatar, so the shared avatar fades out. The webcam video (Lorrie) is part of the picture, not a video.
- **New control:** `A` pauses or resumes auto-advance (so a stage pause does not skip slides).

**Controls:** Space / Right arrow / click = next, Left = back, Up / Down = scroll the website (P1), S = skip clip, A = pause or resume auto-advance, R = reset, P = presenter panel.

## Checked (headless Chrome, `file://`, no console errors)

- W1 to L1 with Space, Right arrow and click: right picture, view, avatar slot and call bar at every step.
- Left from L1 returns to P6. Left from L4 lands on L2 (skips L3). Left at W1 stays. R resets.
- P5 and P6 timers (skeleton to form at 3 s; filled form back to skeleton at 1 s).
- L1 to L14 auto-advance: each frame moved on after about 5 s, L3 passed straight to L4, L14 stayed. This ran before the last small CSS change (the L10 hover button's width), and I did not re-run it afterwards.
- Screenshots of L1, L4, L5, L10 (hover), L11, L12, L13 match the Figma frames. P1 header logo now renders correctly.

## Not verified

- **Transitions in motion:** the dissolve, avatar slide and toast slide were not watched live, only their end states. Open `stage.html` in your browser and step through.
- **Videos:** no avatar clips are in `assets/avatar/`, so scenes show posters. `Avatar videos/` holds three Maya files that are not wired in (`Maya-pauseRon-if-the-2026-10-14.mp4`, `Maya-pauseThat-would-have-2026-10-14.mp4`, and the untracked `Muted Avatar.mp4`). Playback, sound unlock on the first key press, and the W4 auto-advance at the end of its clip are untested. The 9 clip names in `data.js` are placeholders.
- **L9 hover:** Figma's L9 has a hover button, but it sits at y=1037 in a 961 px frame, so it is off screen. Not built.
- **Dialogue:** captions are Figma text, not the approved stage script. Still missing.
- **Open Figma questions:** `image 4` (3178:22991) is an empty rectangle; P3's child 3154:15327 has a click with no destination.
- **Stand-ins:** Flashcards chip uses the DS `copy` icon; composer text uses DS regular weight (Figma: Lato Medium).
- **DS rules:** nothing blocks edits to `ds/` (`.claude/settings.json` does not exist). `.DS_Store` files are not git-ignored.
- Hover pill and loader use `#242424`/`#6f4ff4` equivalents through DS tokens and the `--mt-register` variable, not new hex values.

## Next steps

1. Open `stage.html`, walk W1 to L14, and watch the transitions.
2. Copy the Maya clips into `assets/avatar/` under the names in `data.js` (W3 and W4 first), generate the rest in Avatar Studio, and test playback, sound and the W4 auto-advance.
3. Get the stage script and replace the Figma captions.
4. Decide whether L1 should scroll.
5. Later scenes (Post Event, Content Hub, role-play, Avatar Studio, Content Lab, closing) are outside the 34 approved frames and need new frame IDs.

## Git

Batch 3 is not committed yet. Changed: `app.css`, `data.js`, `stage.html`, `stage.js`, `PROGRESS.md`; new: `assets/live/`. `Avatar videos/Muted Avatar.mp4` (13.6 MB) is untracked and not part of this batch.

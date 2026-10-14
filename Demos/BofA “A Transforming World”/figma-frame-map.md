# BofA "Breaking the fourth wall" — Figma frame map (34 frames)

Figma file `Oo1Ms2pLtv0YEeus1Shh7b`, page "Demo" (114:6277), section "Demo" (3131:14864).
Scope = exactly the 34 node IDs supplied by the presenter. Source: read-only Figma MCP inspection (structure, prototype links, delays, media fills). Visual review is tracked separately.

All keyboard advances in Figma use Space (key code 32). Transitions are Smart Animate 300 ms unless noted. "clip" = video fill in Figma (not exportable through Figma MCP).

## Open: The Wall (5 slides, 1440x900)
| # | ID | Media | Advance |
|---|---|---|---|
| W1 | 3131:14672 | none | click / Space -> W2 |
| W2 | 3231:19034 | Avatar clip | click / Space -> W3 |
| W3 | 3231:19120 | Avatar clip | click / Space -> W4 |
| W4 | 3131:14679 | Avatar clip | ON_MEDIA_END -> W5 |
| W5 | 3131:14914 | Avatar clip | click / Space -> P1 (Dissolve 300) |

## The Experience in Practice (6 slides)
| # | ID | Media | Advance |
|---|---|---|---|
| P1 | 3154:15371 (1440x1362) | webcam clip | click / Space -> P2 |
| P2 | 3154:15303 | Avatar clip | Space -> P3 |
| P3 | 3154:15313 | Avatar clip | Space -> P4 (child 3154:15327 click has no destination) |
| P4 | 3154:15338 | Avatar clip + "Extra" 1211x681 clip | Space -> P5 |
| P5 | 3154:15349 | Avatar clip | "Composing your experience..." swaps at 3 s (Dissolve 300); click / Space -> P6 |
| P6 | 3154:15360 | Avatar clip | swap at 1 s; click / Space on Register (3154:15362) -> L1 (Dissolve 300) |

## The Live Experience (14 slides, 1440x961 except L1)
| # | ID | Media | Advance |
|---|---|---|---|
| L1 | 3178:21420 (1440x3799) | Banner + Video clips | After 5 s -> L2 (Dissolve 300) |
| L2 | 3178:21597 | webcam clip | Space or 5 s -> L3 |
| L3 | 3178:21670 | webcam clip | 5 s -> L4; child 0.001 s -> L4; click (3178:21747) -> L5 (CONFLICT) |
| L4 | 3178:21761 | webcam clip | Space or 5 s -> L5 |
| L5 | 3178:21852 | webcam clip | 5 s -> L6 |
| L6 | 3178:21951 | webcam clip | child 3178:22004, 5 s -> L7 |
| L7 | 3178:22045 | webcam clip | 5 s -> L8 |
| L8 | 3178:22123 | webcam clip | 5 s -> L9 |
| L9 | 3178:22201 | webcam clip | 5 s -> L10; hover state on 3178:22270 |
| L10 | 3178:22294 | webcam clip | 5 s -> L11; hover state on 3178:22363 |
| L11 | 3178:22421 | webcam clip | child 3178:22474, 5 s -> L12 |
| L12 | 3178:22495 | webcam clip | child 3178:22548, 5 s -> L13 |
| L13 | 3178:22569 | webcam clip | child 3178:22622, 5 s -> L14; child 3178:22627 starts Processing loop at 0.05 s |
| L14 | 3178:22782 | 8 video fills | end of scope, no navigation |

## Non-slide nodes in the 34
- Dialogue text layers (Figma text, NOT the approved stage script): Agent lines 3131:14860, 3131:14865 (near W3/W4); Maya lines 3154:15648, 3154:15651, 3154:15652, 3154:15653, 3154:15657 (positioned under P2-P6; mapping inferred from x-coordinates).
- 3178:22992 "Processing" component set: 3 variants looping every 1.5 s (Smart Animate 1500). Candidate for a CSS animation.
- 3178:22991 "image 4": 1456x816 rectangle with no fill (possible orphan).

## Open questions
1. Videos cannot be exported through Figma MCP (33 video fills across the 25 slides). Source files needed, or regenerate in Avatar Studio. Durations unknown (W4 timing depends on clip length).
2. Closing line "My agent is there, ready to continue where we left off" is in no text layer. Stage script still needed.
3. `image 4` (3178:22991): needed or orphan?
4. L3 has three competing triggers (5 s -> L4, 0.001 s -> L4, click -> L5). Which is intended?
5. P3 child 3154:15327 click has no destination.
6. Tall frames (P1 1362 px, L1 3799 px): scroll or crop on stage?
7. Visual design vs DS components/tokens: not yet verified beyond W1-W5 (see below once reviewed).

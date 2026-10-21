# Kaltura DS - guide for AI assistants

Read this before writing any UI in a prototype that has a `ds/` folder. It lists every component's exact markup, the JS API, all tokens and all icon names. Everything here is in `ds/styles.css`, `ds/ds.js`, `ds/ds-icons.js`.

<!-- BEGIN GENERATED: version -->
DS version: **1.0.0**
<!-- END GENERATED: version -->

## Rules

1. **Use tokens, never raw values.** Colors, spacing, font size/weight, radius, shadows, durations, z-index: write `var(--ds-*)` from the Tokens section. No hex colors, no `px` for spacing or type, no `font-weight` other than `--ds-font-weight-regular|bold`. Tokens follow dark mode; raw values do not.
2. **Icons: `<ds-icon name="..." size="16|24">` only.** Never paste SVG, never use emoji or icon fonts. Use only names from the Icons section. Default size is 24. Icons take `currentColor`, so color them via the parent's `color`.
3. **Never edit anything in `ds/`.** It is a copy of a frozen release. If a component or token is missing, build it in your own CSS from `--ds-*` tokens, and tell the user the DS lacks it.
4. **Only use classes listed here.** Do not invent `ds-` classes. Do not restyle DS components with overrides; pick a documented variant.
5. **Do not write JS for DS behavior.** Select, tabs, segmented control, switch, table selection, pagination, toast, modal and theme already work (event delegation, also for elements added later). React to them with the `ds-change` / `ds-open` / `ds-close` events or the `window.DS` API.
6. **No frameworks needed; must work from `file://`.** Classic `<script>` tags only (no `type="module"`, no `fetch`).
7. Copy markup exactly, including `role`, `aria-*` and the `hidden` attribute. The JS and CSS select on them.

## Setup

```html
<link rel="stylesheet" href="ds/styles.css">
<script src="ds/ds-icons.js"></script>   <!-- before ds.js -->
<script src="ds/ds.js"></script>
```

Font is Lato, loaded by `styles.css` from Google Fonts (needs network; falls back to sans-serif). The DS does not reset page margins; set your own `body { margin: 0; }` if you want that.

## Dark theme

`<html data-theme="dark">` switches every token. `DS.setTheme('dark'|'light')`, `DS.getTheme()`, or any `<button data-ds-theme-toggle>`. Fires `ds-theme-change` on `document` with `detail: { theme }`.

## Tokens

All defined in `:root` in `styles.css`. `/* dark: x */` marks tokens that change in dark theme. Semantics used by the components: `tone-1` main text, `tone-2` secondary text, `tone-3` placeholder/field border, `tone-4` disabled text and strong borders, `tone-5` hover fills and dividers, `tone-6` secondary-button bg and light dividers, `tone-7` subtle bg and row hover, `tone-8` field/surface bg (white in light, black in dark). `--ds-background` page, `--ds-paper` cards/panels, `--ds-elevated` menus and modals. Spacing: `--ds-space-N` = N x 4px; a dash in the name is a decimal point (`1-5` = 1.5 x 4 = 6px). Always use `var(--ds-primary)` etc., never the hex values below.

<!-- BEGIN GENERATED: tokens -->
```css
/* Primary */
--ds-primary: #006efa;
--ds-primary-darker: #004cad;
--ds-primary-brighter: #4798ff;
--ds-primary-text-contrast: #ffffff;

/* Danger */
--ds-danger: #ca1c2d;
--ds-danger-darker: #9d1523;
--ds-danger-brighter: #e33547;
--ds-danger-text-contrast: #ffffff;

/* Acknowledgement */
--ds-warning: #E86925;
--ds-warning-text-contrast: #ffffff;
--ds-success: #23803a;
--ds-success-text-contrast: #ffffff;

/* Brand */
--ds-stream-blue: #006EFA;
--ds-screen-green: #00A078;

/* Accent (selected-tab indicator) */
--ds-accent: #ffaa00;

/* Secondary text (menu item descriptions) */
--ds-text-subtle: #888888;
--ds-text-subtle-disabled: #cccccc;

/* Tints — translucent brand colors for hover / selected backgrounds */
--ds-primary-tint-6: rgba(0,110,250,0.06);
--ds-primary-tint-10: rgba(0,110,250,0.1);
--ds-danger-tint-10: rgba(202,28,45,0.1);

/* Tones — Light Theme */
--ds-tone-1: #333333;   /* dark: #FFFFFF */
--ds-tone-2: #707070;   /* dark: #CCCCCC */
--ds-tone-3: #878787;   /* dark: #999999 */
--ds-tone-4: #bdbdbd;   /* dark: #666666 */
--ds-tone-5: #d9d9d9;   /* dark: #525252 */
--ds-tone-6: #ebebeb;   /* dark: #383838 */
--ds-tone-7: #f5f5f5;   /* dark: #212121 */
--ds-tone-8: #ffffff;   /* dark: #000000 */

/* Surfaces */
--ds-background: #ffffff;   /* dark: #121212 */
--ds-paper: #f5f5f5;   /* dark: #242424 */
--ds-elevated: #ffffff;   /* dark: #333333 */

/* Opacity — Black */
--ds-b-20: rgba(0,0,0,0.2);
--ds-b-30: rgba(0,0,0,0.3);
--ds-b-40: rgba(0,0,0,0.4);
--ds-b-60: rgba(0,0,0,0.6);
--ds-b-70: rgba(0,0,0,0.7);
--ds-b-100: #000000;

/* Opacity — White */
--ds-w-20: rgba(255,255,255,0.2);
--ds-w-40: rgba(255,255,255,0.4);
--ds-w-60: rgba(255,255,255,0.6);
--ds-w-70: rgba(255,255,255,0.7);
--ds-w-80: rgba(255,255,255,0.8);
--ds-w-100: #ffffff;

/* Hover Mode */
--ds-hover-black: #000000;

/* Radius */
--ds-roundness-tiny: 3px;
--ds-roundness-1: 4px;
--ds-roundness-2: 8px;
--ds-roundness-3: 12px;

/* Spacing — 4px base. space-N = N x 4px. Half steps use a dash: 1-5 = 1.5 x 4px = 6px. */
--ds-space-0-25: 1px;
--ds-space-0-5: 2px;
--ds-space-0-75: 3px;
--ds-space-1: 4px;
--ds-space-1-5: 6px;
--ds-space-2: 8px;
--ds-space-2-5: 10px;
--ds-space-3: 12px;
--ds-space-3-5: 14px;
--ds-space-4: 16px;
--ds-space-4-5: 18px;
--ds-space-5: 20px;
--ds-space-5-5: 22px;
--ds-space-6: 24px;
--ds-space-7: 28px;
--ds-space-8: 32px;
--ds-space-16: 64px;

/* Typography */
--ds-font-family: 'Lato', sans-serif;
--ds-font-size-1: 11px;
--ds-font-size-2: 12px;
--ds-font-size-3: 13px;
--ds-font-size-4: 14px;
--ds-font-size-5: 16px;
--ds-font-size-6: 18px;
--ds-font-size-7: 48px;
--ds-font-weight-regular: 400;
--ds-font-weight-bold: 700;
--ds-line-height-solid: 1;
--ds-line-height-16: 16px;
--ds-line-height-18: 18px;
--ds-line-height-20: 20px;
--ds-line-height-21: 21px;
--ds-line-height-24: 24px;

/* Shadows */
--ds-shadow-menu: 0 0 0 1px var(--ds-b-20), 0 4px 30px -8px var(--ds-b-20);
--ds-shadow-floating: 0 0 0 0 var(--ds-b-20), 0 4px 30px 0 var(--ds-b-20);

/* Motion */
--ds-duration-fast: 0.1s;
--ds-duration-base: 0.15s;
--ds-duration-slow: 0.2s;
--ds-duration-exit: 0.35s;
--ds-duration-enter: 0.5s;
--ds-duration-spin: 0.8s;
--ds-ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Opacity */
--ds-opacity-disabled: 0.5;

/* Layering */
--ds-z-dropdown: 100;
--ds-z-tooltip: 100;
--ds-z-modal: 1000;
--ds-z-toast: 9999;

/* Modal widths */
--ds-modal-width-sm: 400px;
--ds-modal-width-md: 560px;
--ds-modal-width-lg: 800px;
```
<!-- END GENERATED: tokens -->

## Icons

`<ds-icon name="settings" size="16"></ds-icon>`. An unknown name renders nothing and logs a console warning. If a name has no 16px version, `size="16"` falls back to the 24px artwork scaled to 16. Inside a button, put the icon before or after the text; the button already has a gap.

<!-- BEGIN GENERATED: icons -->
**24px (189):**
add, align-center, align-left, align-right, analytics, arrow-down, arrow-left, arrow-right, arrow-up, banner, blur, bolt, breakout, brush, bullet-list, calendar, camera, camera-off, captions, chat, check, chevron-down, chevron-left, chevron-right, chevron-up, chrome, clean, clear, clips, cloud, collapse-menu, color-palette, contrast, copy, create, credit-card, customize, delete, desktop, diamond, dislike, dislike-hollow, document, download, drag, edge, edit, embed, emoji, excel, executives, exit, exit-alt, expand, expert, external-link, facebook, feedback, file, filter, firefox, fit-frame, folder, folder-item, folder-item-alt, formal, gen-ai, github, globe, group, hand, heart, help, hidden, home, image, import, info, informative-gallery, instagram, instagram-2, integrations, interactive-room, internet, invisible, italic, key, levels, light, like, like-hollow, line, link, linkedin, live-broadcast, lock, mail, menu, metadata-enrichment, microphone, microphone-muted, minimize, minus, mobile, more-horizontal, more-vertical, multiple-video, mute-notification, neutral, no-access, notes, notification, online, ordered-list, pdf, phone, pin, pinterest, play, playlist, poll, pop-out, post, presenter, privacy, public, question-mark, quiz, redo, refresh, remove, remove-alt, remove-contact, resolved, sad, score, search, self-served-live, settings, share, share-screen, share-screen-close, shuffle, simulive, slack, slide, sound, speaker, speaker-muted, stack-overflow, star-full, star-hollow, style, subscribe, subscribed, switch, switch-camera, tablet, target, text, text-color, text-highlight, time, time-hollow, timeline, trim, twitch, twitter, twitter-new, underline, undo, unlock, unpin, upload, user, verified, video, visible, volume-mute, volume-on, warning-circle, warning-triangle, wave, webcast, webhook, youtube, zip-file, zoom-in, zoom-out

**16px (47):**
arrow-right, bookmark, bullet, business-card, chat, check, chevron-down, chevron-left, chevron-right, chevron-up, close, double-chevron-down, download, edit, expand, external-link, file, folder, general-spinner, globe, grip, info-circle, link, microphone, microphone-muted, more, more-horizontal, partial, plus, pop-out, progression, question-mark, redo, regression, score, settings, silent, sound-wave, speaker, speaker-muted, tag, verified, voice, warning, warning-circle, warning-triangle, wave

**16px-only icons (no 24px version, so ALWAYS write `size="16"` for them):** bookmark, bullet, business-card, close, double-chevron-down, general-spinner, grip, info-circle, more, partial, plus, progression, regression, silent, sound-wave, tag, voice, warning
<!-- END GENERATED: icons -->

## Components

Sizes and variants are modifier classes on the base class. Disabled = the `disabled` attribute (or `aria-disabled="true"` where noted). Every example below is the exact markup to copy.

### Button
Base `ds-btn` + size (`ds-btn-sm` 24px | `-md` 32px | `-lg` 40px | `-xl` 48px) + variant (`ds-btn-primary` | `-secondary` | `-danger`). Optional `ds-btn-borderless` (transparent bg, colored text, tint on hover). Icon-only: add `ds-btn-icon` (square) and give it `aria-label`. States: hover, focus-visible ring, `disabled` / `aria-disabled="true"` (grey, not clickable).
```html
<button class="ds-btn ds-btn-md ds-btn-primary">Save</button>
<button class="ds-btn ds-btn-md ds-btn-secondary ds-btn-borderless">Cancel</button>
<button class="ds-btn ds-btn-md ds-btn-primary"><ds-icon name="plus" size="16"></ds-icon> New</button>
<button class="ds-btn ds-btn-md ds-btn-secondary ds-btn-icon" aria-label="More"><ds-icon name="more-horizontal" size="24"></ds-icon></button>
<button class="ds-btn ds-btn-md ds-btn-danger" disabled>Delete</button>
```
Icon-only sizing: the CSS forces the icon to 24px in `-md` and `-lg` icon buttons; use `size="16"` in `-sm`.

Circular (media overlay buttons, dark translucent bg): `ds-btn-circular` + `ds-btn-circular-sm` (32px, icon 24) | `-md` (48px, icon 36) | `-lg` (56px, icon 36). Supports `disabled`.
```html
<button class="ds-btn-circular ds-btn-circular-sm" aria-label="Play"><ds-icon name="play"></ds-icon></button>
```

### Input and Textarea
`ds-input` + size `ds-input-md` (32px) | `-lg` (40px) | `-xl` (48px). Error: add `ds-input-error`. Both are `width: 100%`; set a width on a wrapper or inline. Textarea: `ds-textarea` (+ `ds-textarea-error`), min-height 88px, resizes vertically.
```html
<input class="ds-input ds-input-md" placeholder="Email">
<input class="ds-input ds-input-md ds-input-error" value="bad">
<input class="ds-input ds-input-md" disabled value="Locked">
<textarea class="ds-textarea" placeholder="Message..."></textarea>
```

### FormField (label + control + hint/error)
`ds-form-field` has a 20px bottom margin. Inside: `ds-form-label` (optionally holding `ds-form-counter`, pushed right), then optional `ds-form-desc`, then the control, then optional `ds-form-error` (red text).
```html
<div class="ds-form-field">
  <label class="ds-form-label" for="email">Email <span class="ds-form-counter">0/100</span></label>
  <p class="ds-form-desc">We'll never share your email.</p>
  <input class="ds-input ds-input-md ds-input-error" id="email">
  <p class="ds-form-error">Enter a valid email.</p>
</div>
```

### Checkbox
The check mark is an inline SVG inside `.ds-checkbox-indicator` (the CSS shows it when checked or indeterminate). This is the one place inline SVG is expected: copy it exactly. Checked = `checked`; indeterminate = set `input.indeterminate = true` in JS. Label span is `ds-checkbox-label`.
```html
<label class="ds-checkbox">
  <input type="checkbox" class="ds-checkbox-input">
  <span class="ds-checkbox-indicator"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  <span class="ds-checkbox-label">Remember me</span>
</label>
```
Use the native `change` event on the input (the DS adds nothing except inside select menus and tables).

### Radio
Same structure, no SVG. Group radios with the same `name`.
```html
<label class="ds-radio">
  <input type="radio" name="plan" class="ds-radio-input" checked>
  <span class="ds-radio-indicator"></span>
  <span class="ds-radio-label">Free</span>
</label>
```

### Switch
A `<button role="switch">`. Size `ds-switch-sm` (32x16) | `ds-switch-lg` (44x24). State classes AND `aria-checked` must agree: `ds-switch-on` + `aria-checked="true"`, or `ds-switch-off` + `aria-checked="false"`. `ds.js` toggles both on click. Optional label block. Event: `ds-change` fires on the button, `detail: { value: true|false, label }`.
```html
<div class="ds-switch">
  <button class="ds-switch-track ds-switch-lg ds-switch-off" role="switch" aria-checked="false"><span class="ds-switch-handle"></span></button>
  <div class="ds-switch-content">
    <span class="ds-switch-label">Notifications</span>
    <span class="ds-switch-description">Receive email updates</span>
  </div>
</div>
```

### Select (dropdown)
Wrapper `ds-select-wrapper` holds the trigger `button.ds-select` and the menu `div.ds-select-menu[role=listbox]` (menu is hidden until `ds-select-open` is on the wrapper; `ds.js` manages it plus `aria-expanded`). Items are `button.ds-select-item[role=option]` with a `span.ds-select-item-label`. Picking an item sets the trigger's first `<span>` text to the label, moves the check mark (`ds-select-item-trailing`) and fires `ds-change` on the wrapper. `detail.value` = the item's `data-value` if present, else the label. The trigger text is only the placeholder until the user picks; to preselect, put the label in the trigger `<span>` yourself and add the check icon + `aria-selected="true"` to that item.

Variants: `ds-select-borderless` on the trigger; `ds-select-icon-only` on the trigger (no label span, padding 4px). Leading icon: `<ds-icon class="ds-select-icon" name="...">` in trigger or item. Trailing: `<ds-icon class="ds-select-item-trailing" name="check|chevron-right" size="16">`. Item description: `<span class="ds-select-item-desc">`. Disabled trigger: `disabled`. Disabled item: `aria-disabled="true"`. Divider with title: `div.ds-select-separator > hr.ds-select-separator-line + span.ds-select-separator-title`. Menu is 260px wide, max 320px tall (scrolls), opens below-left. Keyboard: ArrowDown/Up open and move, Home/End, Enter/Space pick, Escape closes, Tab out closes.
```html
<div class="ds-select-wrapper">
  <button class="ds-select" aria-haspopup="listbox">
    <span>Sort by</span>
    <ds-icon class="ds-select-chevron" name="chevron-down" size="16"></ds-icon>
  </button>
  <div class="ds-select-menu" role="listbox">
    <button class="ds-select-item" role="option" data-value="name"><span class="ds-select-item-label">Name</span></button>
    <button class="ds-select-item" role="option" data-value="date"><span class="ds-select-item-label">Date</span></button>
    <div class="ds-select-separator"><hr class="ds-select-separator-line"><span class="ds-select-separator-title">Archive</span></div>
    <button class="ds-select-item" role="option" aria-disabled="true"><span class="ds-select-item-label">Older</span></button>
  </div>
</div>
```
Switch rows inside a menu (menu has no `role`, trigger `aria-haspopup="true"`): items are `div.ds-select-item` containing a label span and a small switch (`ds-switch-track ds-switch-sm`). Each switch fires its own `ds-change`.
```html
<div class="ds-select-item"><span class="ds-select-item-label">Notifications</span>
  <button class="ds-switch-track ds-switch-sm ds-switch-off" role="switch" aria-checked="false"><span class="ds-switch-handle"></span></button></div>
```
Multi-select: menu gets `aria-multiselectable="true"`; each item is a `<label class="ds-select-item">` wrapping a checkbox (`<label class="ds-checkbox" style="pointer-events:none">` + the checkbox markup above) and the label span. The menu stays open; every change fires `ds-change` on the wrapper with `detail.value` = array of all checked values, `detail.label` = checked labels joined by ", ". The trigger text does NOT update; update it yourself in a `ds-change` listener.

### Tabs
`div.ds-tabs[role=tablist]` > `button.ds-tab[role=tab][aria-selected]`. Exactly one `aria-selected="true"`. Optional icon `<ds-icon class="ds-tab-icon" name="...">` with the text in a `<span>`. Disabled: `disabled`. Tabs do not show/hide panels; do that in a `ds-change` listener. `ds-change` fires on the tablist, `detail: { value, label }` (value = `data-value` or the label), only when the selection actually changes. Arrow keys, Home and End move and select.
```html
<div class="ds-tabs" role="tablist">
  <button class="ds-tab" role="tab" aria-selected="true">Overview</button>
  <button class="ds-tab" role="tab" aria-selected="false" data-value="activity">Activity</button>
  <button class="ds-tab" role="tab" aria-selected="false" disabled>Locked</button>
</div>
```

### Segmented control
`div.ds-segmented[role=radiogroup][aria-label]` > `button.ds-segmented-item[role=radio][aria-checked]`. One `aria-checked="true"`. Text in a `<span>`; an icon-only item needs `aria-label` (its value/label come from it). Icon: `<ds-icon class="ds-segmented-icon" name="...">`. Disabled: `disabled`. `ds-change` fires on the radiogroup. Same keyboard as tabs.
```html
<div class="ds-segmented" role="radiogroup" aria-label="Period">
  <button class="ds-segmented-item" role="radio" aria-checked="true"><span>Monthly</span></button>
  <button class="ds-segmented-item" role="radio" aria-checked="false"><span>Yearly</span></button>
</div>
```

### Data table
`div.ds-table` wraps an optional `ds-table-action-bar` (search input, `ds-table-action-bar-spacer`, buttons), a plain `<table>`, and an optional `ds-table-pagination`. Column helper classes on `th`/`td`: `ds-table-col-checkbox` (50px), `ds-table-col-icon` (40px, icon in `<ds-icon class="ds-table-icon">`), `ds-table-col-action` (56px, centered). Bold cell: `ds-table-cell-highlight`. Header `th` with `ds-table-sortable` is only styled (pointer + hover); **sorting is not implemented**, do it yourself. `ds-table-sorted` marks the active column; put a chevron icon in `<ds-icon class="ds-table-sort-icon" name="chevron-down|chevron-up" size="16">`.

Built-in behavior: a row checkbox must have the extra class `ds-table-row-cb`; checking it adds `ds-table-row-selected` to its `<tr>`. The checkbox in `<thead>` selects/clears all row checkboxes. No event is fired (use the native `change`). `ds-table-bulk-bar` (+ `ds-table-bulk-bar-count`) is styling only; show/hide it yourself.

Status dot+text: `ds-table-status` + `-green` | `-orange` | `-red` | `-grey`. States instead of the table: `ds-table-empty` (with `p.ds-table-empty-title`), `ds-table-loader` > `div.ds-table-spinner`, `ds-table-error` (with `p.ds-table-error-title`).
```html
<div class="ds-table">
  <div class="ds-table-action-bar">
    <input class="ds-input ds-input-md" placeholder="Search" style="width:160px">
    <div class="ds-table-action-bar-spacer"></div>
    <button class="ds-btn ds-btn-md ds-btn-primary">Create</button>
  </div>
  <table>
    <thead><tr>
      <th class="ds-table-col-checkbox"><label class="ds-checkbox" style="margin:0"><input type="checkbox" class="ds-checkbox-input"><span class="ds-checkbox-indicator"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></label></th>
      <th class="ds-table-col-icon"></th>
      <th style="width:auto">Name</th>
      <th class="ds-table-sortable ds-table-sorted">Date <ds-icon class="ds-table-sort-icon" name="chevron-down" size="16"></ds-icon></th>
      <th class="ds-table-col-action"></th>
    </tr></thead>
    <tbody><tr>
      <td class="ds-table-col-checkbox"><label class="ds-checkbox" style="margin:0"><input type="checkbox" class="ds-checkbox-input ds-table-row-cb"><span class="ds-checkbox-indicator"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></label></td>
      <td class="ds-table-col-icon"><ds-icon class="ds-table-icon" name="file"></ds-icon></td>
      <td class="ds-table-cell-highlight">Document 1</td>
      <td>10/09/21</td>
      <td class="ds-table-col-action"><button class="ds-btn ds-btn-md ds-btn-secondary ds-btn-borderless ds-btn-icon" aria-label="More actions"><ds-icon name="more-horizontal" size="16"></ds-icon></button></td>
    </tr></tbody>
  </table>
  <div class="ds-table-pagination">
    <button class="ds-table-page" aria-label="Previous page"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button class="ds-table-page" aria-current="page">1</button>
    <button class="ds-table-page">2</button>
    <span class="ds-table-page-ellipsis">...</span>
    <button class="ds-table-page">14</button>
    <button class="ds-table-page" aria-label="Next page"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>
</div>
<span class="ds-table-status ds-table-status-green">Confirmed</span>
```
Pagination: clicking a numbered `ds-table-page` moves `aria-current="page"` and fires `ds-change` on the `ds-table-pagination` bar, `detail: { value: <number>, label: "<n>" }`. The previous/next arrows and ellipsis are visual only: wire the arrows yourself (`disabled` greys an arrow).

### User picture
`span.ds-user-picture` + size `-sm` (24) | `-md` (36) | `-lg` (48) | `-xl` (96). Content is an `<img>` or up to two initials (uppercased by CSS). Square with rounded corners; add `ds-user-picture-round` for a circle.
```html
<span class="ds-user-picture ds-user-picture-md ds-user-picture-round"><img src="avatar.png" alt="Jane Doe"></span>
<span class="ds-user-picture ds-user-picture-md">JD</span>
```

### Acknowledgement (inline message) and toast
`div.ds-ack` + severity `ds-ack-info` | `-error` | `-success` | `-warning`. Children, in order: `span.ds-ack-icon` > `<ds-icon>`, `span.ds-ack-text`, optional `a.ds-ack-link`, optional `button.ds-ack-dismiss` > `<ds-icon name="clear">`. Icons used: info -> `info`, error -> `warning-circle`, success -> `resolved`, warning -> `warning-triangle`. The inline dismiss button has no built-in behavior (remove the element yourself).
```html
<div class="ds-ack ds-ack-info">
  <span class="ds-ack-icon"><ds-icon name="info"></ds-icon></span>
  <span class="ds-ack-text">This is an information message!</span>
  <a class="ds-ack-link" href="#">Link</a>
  <button class="ds-ack-dismiss" aria-label="Dismiss"><ds-icon name="clear"></ds-icon></button>
</div>
```
Floating/toast: add `ds-ack-floating` (solid colored bg, white text, 48px, icon hidden). Two ways to show one as a fixed toast at the top center:
- Markup trigger: put `data-ds-toast` on a `.ds-ack.ds-ack-floating` element; clicking it clones it into a fixed toast that stays until dismissed.
- JS: `DS.showToast({ type: 'info'|'success'|'warning'|'error', message: 'Saved', linkText: 'Undo', linkHref: '#', duration: 5000 })`. Auto-dismisses after `duration` ms (default 5000; `0` = stay). Only one toast at a time; showing a new one replaces the old.

### Hint (tooltip)
`div.ds-hint` + direction `ds-hint-top` | `-bottom` | `-left` | `-right` containing `div.ds-hint-body` and `div.ds-hint-arrow` (inline SVG triangle; copy it). Standalone, the direction is the arrow's look: `-top` body above, arrow below pointing down; `-bottom` arrow above pointing up; `-right` arrow on the right pointing right; `-left` arrow on the left pointing left. For hover tooltips wrap trigger + hint in `div.ds-hint-trigger`; the hint shows on hover (CSS only). Inside a trigger, `-top` places the hint ABOVE the trigger and `-bottom` BELOW it (arrow points at the trigger; use the arrow SVGs shown). Prefer those two. A hint to the right of the trigger needs `ds-hint-left` (arrow on its left) plus `style="left:calc(100% + 4px); right:auto; top:50%; translate:0 -50%;"`; a hint to the left needs `ds-hint-right` plus `style="right:calc(100% + 4px); left:auto; top:50%; translate:0 -50%;"`. Arrow SVGs for those: left `<svg width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M9 0L2 5.4Q0 7 2 8.6L9 14Z" fill="currentColor"/></svg>`, right `<svg width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M0 0L7 5.4Q9 7 7 8.6L0 14Z" fill="currentColor"/></svg>`. `ds-text-truncate` = one-line ellipsis, max 260px.
```html
<div class="ds-hint-trigger">
  <button class="ds-btn ds-btn-md ds-btn-secondary ds-btn-icon" aria-label="Add"><ds-icon name="plus" size="16"></ds-icon></button>
  <div class="ds-hint ds-hint-top">
    <div class="ds-hint-body">Add item</div>
    <div class="ds-hint-arrow"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M0 0L5.4 7Q7 9 8.6 7L14 0Z" fill="currentColor"/></svg></div>
  </div>
</div>
```
Bottom arrow: `<svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M0 9L5.4 2Q7 0 8.6 2L14 9Z" fill="currentColor"/></svg>`.

### Badges, tags, chips
```html
<span class="ds-badge ds-badge-sm">Label</span>           <!-- sm is the default; ds-badge-lg for large -->
<span class="ds-badge-live">Live</span>                    <!-- red, uppercase; add ds-badge-lg for large -->
<span class="ds-badge-duration">02:34</span>               <!-- dark translucent pill for video length -->
<span class="ds-tag">Label <button class="ds-tag-close" aria-label="Remove"><ds-icon name="close" size="16"></ds-icon></button></span>
<span class="ds-tag ds-tag-disabled">Label</span>
<span class="ds-chip"><img class="ds-chip-picture" src="a.png" alt=""><span class="ds-chip-content">Label <span class="ds-chip-status">Blocked</span> <button class="ds-chip-close" aria-label="Remove"><ds-icon name="close" size="16"></ds-icon></button></span></span>
<span class="ds-chip ds-chip-disabled"><span class="ds-chip-content">Label</span></span>
```
Tag/chip close buttons have no built-in behavior. `ds-chip-picture` and `ds-chip-status` are optional; the `.ds-chip-content` wrapper is required. For a disabled tag/chip use the class (`ds-tag-disabled`, `ds-chip-disabled`) or the `disabled` attribute.

### Modal
Dismissable dialog. It closes on: a click on the backdrop (the backdrop carries `data-ds-close`), the Escape key, any `[data-ds-close]` element inside it (header X, Cancel button), or `DS.closeModal()`. (Newer DS versions make modals static; this copy is v1.0, where all of these close it.) A Save/Delete button that should also close needs `data-ds-close`.

Structure: `div.ds-modal` + size (`ds-modal-sm` 400px | `-md` 560px | `-lg` 800px; there is no `-xl`) with `id` and the `hidden` attribute (keep it; `ds.js` removes it on open) > `div.ds-modal-backdrop[data-ds-close]` + `div.ds-modal-dialog[role=dialog][aria-modal=true][aria-labelledby]` > `ds-modal-header` (left-aligned 18px `h2.ds-modal-title` + `button.ds-modal-close` X, bottom border), `ds-modal-body` (24px padding; the only part that scrolls), `ds-modal-footer` (top border, buttons right-aligned; no footer-note class). Open with `<button data-ds-open="id">` or `DS.openModal('id')`. Focus is trapped while open, moves to `[autofocus]` or the first focusable element, and returns to the opener on close. The page behind does not scroll. An open select inside a modal closes on Escape first (the modal stays); a second Escape closes the modal.
```html
<button class="ds-btn ds-btn-md ds-btn-primary" data-ds-open="rename-modal">Rename</button>

<div class="ds-modal ds-modal-md" id="rename-modal" hidden>
  <div class="ds-modal-backdrop" data-ds-close></div>
  <div class="ds-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="rename-title">
    <div class="ds-modal-header">
      <h2 class="ds-modal-title" id="rename-title">Rename document</h2>
      <button class="ds-modal-close" data-ds-close aria-label="Close"><ds-icon name="clear"></ds-icon></button>
    </div>
    <div class="ds-modal-body">
      <div class="ds-form-field">
        <label class="ds-form-label" for="rename-input">Name</label>
        <input class="ds-input ds-input-md" id="rename-input" placeholder="Enter a name">
      </div>
    </div>
    <div class="ds-modal-footer">
      <button class="ds-btn ds-btn-md ds-btn-secondary" data-ds-close>Cancel</button>
      <button class="ds-btn ds-btn-md ds-btn-primary" data-ds-close>Save</button>
    </div>
  </div>
</div>
```
Events on the `.ds-modal` element (bubble): `ds-open` `detail: { id }`; `ds-close` `detail: { id, reason }` where `reason` is `'backdrop'` (backdrop click), `'escape'`, `'button'` (another `[data-ds-close]` click) or `'api'` (`DS.closeModal()`). Nested modals stack; `DS.closeModal()` closes the top one.

## Events

All bubble, so listen on `document` and use `e.target`. Fired only on a user change, once per change.

| Event | Fired on | `detail` |
|---|---|---|
| `ds-change` | select wrapper | `{ value, label }` - `value` = item `data-value` or the label text |
| `ds-change` | multi-select wrapper | `{ value: [values], label: "A, B" }` - all checked items |
| `ds-change` | `.ds-tabs` / `.ds-segmented` | `{ value, label }` - `value` = item `data-value` or its label (segmented icon-only: its `aria-label`); not fired if the item was already selected |
| `ds-change` | switch button | `{ value: true\|false, label }` - label = nearest `.ds-switch-label` / `.ds-select-item-label` text |
| `ds-change` | `.ds-table-pagination` | `{ value: <number>, label: "<number>" }` |
| `ds-open` / `ds-close` | `.ds-modal` | `{ id }` / `{ id, reason }` |
| `ds-theme-change` | `document` | `{ theme: 'light'\|'dark' }` |

```js
document.addEventListener('ds-change', e => {
  if (e.target.matches('.ds-tabs')) showPanel(e.detail.value);
});
```
Checkbox, radio, input and textarea fire only the native `change` / `input` events.

## JS API (`window.DS`)

| Call | Effect |
|---|---|
| `DS.version` | version string, e.g. `'1.0.0'` |
| `DS.setTheme('light'\|'dark')` | set theme (warns on other values), fires `ds-theme-change` |
| `DS.getTheme()` | `'light'` or `'dark'` |
| `DS.showToast({ type, message, linkText, linkHref, duration })` | build and show a toast; returns the element. `type` `info`(default)/`success`/`warning`/`error`; `duration` ms, default 5000, `0` = stay |
| `DS.showToast(element)` | clone a `.ds-ack-floating` element into a toast that stays until dismissed |
| `DS.openModal('id')` | open a `.ds-modal` (warns if the id is not a modal); returns the element |
| `DS.closeModal()` / `DS.closeModal('id')` | close the top modal / a specific one |

Data attributes (no JS needed): `data-ds-open="modal-id"`, `data-ds-close`, `data-ds-toast`, `data-ds-theme-toggle`, `data-value` (select item, tab, segmented item).

## What the DS does not have
No grid, layout, spacing-utility, heading, paragraph or link classes, and no card, sidebar, navbar, date picker, accordion, progress bar or loading-spinner component (the table spinner is table-only). For layout use your own `display:flex|grid` with `gap: var(--ds-space-N)`. For text use `font-size: var(--ds-font-size-N)`, `font-weight: var(--ds-font-weight-bold)`, `color: var(--ds-tone-1|2)`. Surfaces: `background: var(--ds-paper)` for panels, `var(--ds-elevated)` for floating layers, `border: 1px solid var(--ds-tone-5)`.


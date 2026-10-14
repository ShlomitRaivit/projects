/* data.js - fake data for the prototype, as plain JS objects.
   Loaded before app.js, which reads it from window.APP_DATA.
   Replace with your own data; keep it plain objects and arrays. */

window.APP_DATA = {
  product: {
    name: 'My Product'
  },

  // Sidebar items. `icon` must be a 24px icon name from ds/DS-GUIDE.md.
  // For a multi-page prototype, point `href` at the other HTML files.
  nav: [
    { label: 'Home',      icon: 'home',      href: 'index.html', current: true },
    { label: 'Videos',    icon: 'video',     href: '#' },
    { label: 'Library',   icon: 'folder',    href: '#' },
    { label: 'Analytics', icon: 'analytics', href: '#' },
    { label: 'Settings',  icon: 'settings',  href: '#' }
  ],

  project: {
    name: 'Product launch video',
    visibilityOptions: [
      { value: 'private', label: 'Private' },
      { value: 'team',    label: 'My team' },
      { value: 'public',  label: 'Public', selected: true }
    ]
  }
};

/* ===== Stage: Open: The Wall (W1-W5) + The Experience in Practice (P1-P6) =====
   One entry per Figma frame, in presentation order.
   view      which screen layout is shown: wall | site | next | demo | gen (null = avatar only)
   slot      where the avatar sits: wall | site | center | corner (the avatar animates between slots)
   enter     how this scene is entered: cut (no animation) | dissolve (fade) | smart (fade + avatar move)
   advance   'input' = next on click / Space / Right arrow
             'media-end' = next when the clip ends (input also works, as a safety net)
   gen       (view 'gen' only) starting state: compose | form | filled
   timers    After Delay from Figma: [{ at: seconds, gen: state }]
   controls  show the call bar (attachments, mic, End)
   clip      avatar clip, named S<scene>-L<line>_<who>_<slug>.mp4 (S01 = Wall, S02 = Practice).
             Files do not exist yet: until they do, the poster stays and input still advances.
   extraPoster / extraClip   the large demo video on P4 (not an avatar clip)
   caption   text from the Figma file, NOT the approved stage script. Presenter panel (P) only. */
window.APP_DATA.stage = {
  after: 'L1 (The Live Experience, not built yet)',
  scenes: [
    { id: 'W1', figma: '3131:14672', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W1.png', clip: null, advance: 'input', caption: '' },
    { id: 'W2', figma: '3231:19034', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W2.png', clip: 'assets/avatar/S01-L01_maya_wall-appears.mp4',
      advance: 'input', caption: '' },
    { id: 'W3', figma: '3231:19120', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W3.png', clip: 'assets/avatar/S01-L02_maya_not-in-the-room.mp4',
      advance: 'input',
      caption: 'Agent: "Ron, if the point is dialogue, perhaps you should stop talking about me as though I am not in the room."' },
    { id: 'W4', figma: '3131:14679', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W4.png', clip: 'assets/avatar/S01-L03_maya_traditional-journey.mp4',
      advance: 'media-end',
      caption: 'Agent: "That would have been a very traditional user journey."' },
    { id: 'W5', figma: '3131:14914', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W5.png', clip: 'assets/avatar/S01-L04_maya_wall-handoff.mp4',
      advance: 'input', caption: '' },

    { id: 'P1', figma: '3154:15371', view: 'site', slot: 'site', enter: 'dissolve', controls: false,
      poster: 'assets/posters/P1.png', clip: null, advance: 'input',
      caption: 'Mighty Tech website. Up / Down scrolls the page.' },
    { id: 'P2', figma: '3154:15303', view: null, slot: 'center', enter: 'smart', controls: true,
      poster: 'assets/posters/P2.png', clip: 'assets/avatar/S02-L01_maya_how-can-i-help.mp4',
      advance: 'input', caption: 'Avatar: "Hey Ron, how can I help you today?"' },
    { id: 'P3', figma: '3154:15313', view: 'next', slot: 'corner', enter: 'smart', controls: true,
      poster: 'assets/posters/P3.png', clip: 'assets/avatar/S02-L02_maya_overview-options.mp4',
      advance: 'input',
      caption: 'Avatar: "Absolutely. Mighty Tech provides advanced cybersecurity solutions that detect threats, reduce risk, and respond in real time. Would you like a quick overview, explore key capabilities, or see how it works in practice?"' },
    { id: 'P4', figma: '3154:15338', view: 'demo', slot: 'corner', enter: 'smart', controls: true,
      poster: 'assets/posters/P4.png', clip: 'assets/avatar/S02-L03_maya_key-capabilities.mp4',
      extraPoster: 'assets/site/ssh-demo.png', extraClip: 'assets/video/S02-L03_extra_quick-demo.mp4',
      advance: 'input',
      caption: 'Avatar: "Mighty Tech combines real-time threat detection, AI-driven risk analysis, and automated response workflows — so you can monitor anomalies, prioritize risks, and act instantly, all from a unified platform."' },
    { id: 'P5', figma: '3154:15349', view: 'gen', gen: 'compose', slot: 'corner', enter: 'smart', controls: true,
      morph: true, timers: [{ at: 3, gen: 'form' }],
      poster: 'assets/posters/P5.png', clip: 'assets/avatar/S02-L04_maya_event-recommendation.mp4',
      advance: 'input',
      caption: 'Avatar: "Based on your interest in cybersecurity, I\'d recommend our upcoming Mighty Tech event on cyber defense and risk management I can register you right now, I already have your details, so I\'ll just confirm them and you\'re in."' },
    { id: 'P6', figma: '3154:15360', view: 'gen', gen: 'filled', slot: 'corner', enter: 'smart', controls: true,
      timers: [{ at: 1, gen: 'compose' }],
      poster: 'assets/posters/P6.png', clip: 'assets/avatar/S02-L05_maya_all-set.mp4',
      advance: 'input',
      caption: 'Avatar: "Done, you\'re all set. I\'ve sent the event details, and based on your company and interests, I\'ll recommend the agenda that best fits your background"' }
  ]
};

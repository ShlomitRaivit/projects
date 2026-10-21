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
  after: 'end of the approved frames',
  scenes: [
    { id: 'W1', clickAdvance: true, figma: '3131:14672', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W1.png', clip: null, advance: 'input', caption: '' },
    { id: 'W2', clickAdvance: true, figma: '3231:19034', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W2.png', clip: 'assets/avatar/Slide 2 - OPEN THE WALL.mp4', muted: true,
      advance: 'input', caption: '' },
    { id: 'W3', clickAdvance: true, figma: '3231:19120', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W3.png', clip: 'assets/avatar/S01-L02_maya_not-in-the-room.mp4',
      advance: 'input',
      caption: 'Agent: "Ron, if the point is dialogue, perhaps you should stop talking about me as though I am not in the room."' },
    { id: 'W4', clickAdvance: true, figma: '3131:14679', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W4.png', clip: 'assets/avatar/S01-L03_maya_traditional-journey.mp4',
      advance: 'media-end',
      caption: 'Agent: "That would have been a very traditional user journey."' },
    { id: 'W5', clickAdvance: true, figma: '3131:14914', view: 'wall', slot: 'wall', enter: 'cut', controls: false,
      poster: 'assets/posters/W5.png', clip: 'assets/avatar/S01-L04_maya_wall-handoff.mp4',
      advance: 'input', caption: '' },

    { id: 'P1', figma: '3154:15371', view: 'site', slot: 'site', enter: 'dissolve', controls: false,
      poster: 'assets/posters/P1-maya-purple.jpg', label: 'Ask me anything', clip: null, advance: 'input',
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
    { id: 'P5', clickAdvance: true, figma: '3154:15349', view: 'gen', gen: 'compose', slot: 'corner', enter: 'smart', controls: true,
      morph: true, timers: [{ at: 3, gen: 'form' }],
      poster: 'assets/posters/P5.png', clip: 'assets/avatar/S02-L04_maya_event-recommendation.mp4',
      advance: 'input',
      caption: 'Avatar: "Based on your interest in cybersecurity, I\'d recommend our upcoming Mighty Tech event on cyber defense and risk management I can register you right now, I already have your details, so I\'ll just confirm them and you\'re in."' },
    { id: 'P6', figma: '3154:15360', view: 'gen', gen: 'filled', slot: 'corner', enter: 'smart', controls: true,
      timers: [{ at: 1, gen: 'compose' }],
      poster: 'assets/posters/P6.png', clip: 'assets/avatar/S02-L05_maya_all-set.mp4',
      advance: 'input',
      caption: 'Avatar: "Done, you\'re all set. I\'ve sent the event details, and based on your company and interests, I\'ll recommend the agenda that best fits your background"' },
    // ----- The Live Experience (L1-L14), all real HTML. view: 'home' = L1 event page, 'event' = live shell with a
    // panel (chat | qa-* | ask-*). auto = After Delay in seconds. toast = poll | thanks. passthrough = a frame
    // Figma leaves after ~0.001 s (Left skips it). slot null = no avatar. -----
    { id: 'L1', figma: '3178:21420', view: 'home', slot: null, enter: 'dissolve',
      controls: false, scrollable: true, advance: 'input', caption: 'Event page. Scrolls; advance with Space / Right arrow (auto-advance off).' },
    { id: 'L2', figma: '3178:21597', view: 'event', slot: null, panel: 'chat', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Live stage, Chat tab.' },
    { id: 'L3', figma: '3178:21670', view: 'event', slot: null, panel: 'chat', enter: 'smart',
      controls: false, auto: 0.001, passthrough: true, advance: 'input',
      caption: 'Pass-through frame (same picture as L2). Figma moves on after 0.001 s so the poll toast can slide in.' },
    { id: 'L4', figma: '3178:21761', view: 'event', slot: null, panel: 'chat', toast: 'poll', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Poll toast: "Which of these cybersecurity trends excites (or worries) you the most?"' },
    { id: 'L5', figma: '3178:21852', view: 'event', slot: null, panel: 'chat', toast: 'thanks', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Toast: "Thank you for your participation! Feel free to ask anything in the Q&A!"' },
    { id: 'L6', figma: '3178:21951', view: 'event', slot: null, panel: 'chat', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Toast slides out.' },
    { id: 'L7', figma: '3178:22045', view: 'event', slot: null, panel: 'qa-empty', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Q&A tab: "Ask the expert any question".' },
    { id: 'L8', figma: '3178:22123', view: 'event', slot: null, panel: 'qa-typed', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Question typed in the Q&A box.' },
    { id: 'L9', figma: '3178:22201', view: 'event', slot: null, panel: 'qa-posted', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Question posted: "Hi! How do I explain the business value of Enhanced Data Encryption to a non-technical client?"' },
    { id: 'L10', figma: '3178:22294', view: 'event', slot: null, panel: 'qa-answered', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Answer with an "Ask anything" button. Hover it to see "Ask Genie".' },
    { id: 'L11', figma: '3178:22421', view: 'event', slot: null, panel: 'ask-home', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Ask anything panel with Maya and "Start conversation".' },
    { id: 'L12', figma: '3178:22495', view: 'event', slot: null, panel: 'ask-typed', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Prompt typed: "Explaining Enhanced Data Encryption\'s value?"' },
    { id: 'L13', figma: '3178:22569', view: 'event', slot: null, panel: 'ask-loading', enter: 'smart',
      controls: false, auto: 5, advance: 'input', caption: 'Loading placeholders pulse (Processing loop).' },
    { id: 'L14', figma: '3178:22782', view: 'event', panel: 'ask-answer', slot: null, enter: 'smart',
      controls: false, advance: 'input', caption: 'Genie answer: flashcards (use the arrows) and next steps. Press Space to advance to Post Event.' },

    // ===== Post Event (PE1-PE9) =====
    { id: 'PE1', figma: '3286:8964', view: 'email', slot: null, enter: 'dissolve',
      controls: false, advance: 'input',
      caption: 'Outlook email with personalized MT Live recap invitation. Click "Your Personal Recap" or Space.' },
    { id: 'PE2', figma: '3286:8880', view: 'recap', slot: null, enter: 'smart',
      controls: false, scrollable: true, advance: 'input',
      caption: 'Personalized MT Live recap portal. Scrollable. Click floating Maya card or Space.' },
    { id: 'PE3', figma: '3286:8890', view: 'pe-call', peSub: 'none', slot: 'center', enter: 'smart',
      controls: true, talkInterrupt: true,
      clip: 'assets/avatar/BofA_Agent_08_Welcome_back_Ron_I_hope.mp4', poster: 'assets/posters/P2.png', advance: 'input',
      caption: 'Avatar: "Welcome back, Ron, I hope you enjoyed MT Live. Based on the sessions you attended, I\'ve pulled together a personalized set of highlights and next steps."' },
    { id: 'PE4', figma: '3286:8937', view: 'pe-call', peSub: 'slide', slot: 'corner', enter: 'smart',
      controls: true, talkInterrupt: true,
      clip: 'assets/avatar/BofA_Agent_09_Of_course_Based_on_the.mp4', poster: 'assets/posters/P3.png', advance: 'input',
      caption: 'Avatar: "Of course. Based on the MT Live sessions you explored, MT enables real-time decisioning with AI - analyzing complex signals, detecting anomalies, and helping teams reduce risk and scale efficiently."' },
    { id: 'PE5', figma: '3286:8913', view: 'pe-call', peSub: 'loader', slot: 'corner', enter: 'smart',
      controls: true, talkInterrupt: true,
      poster: 'assets/posters/P5.png', advance: 'input',
      caption: 'Generating handouts and recording...' },
    { id: 'PE6', figma: '3286:9127', view: 'pe-call', peSub: 'handouts', slot: 'corner', enter: 'smart',
      controls: true, talkInterrupt: true,
      poster: 'assets/posters/P6.png', advance: 'input',
      caption: 'Handouts and recording ready.' },
    { id: 'PE7', figma: '3288:18637', view: 'pe-isabella', slot: null, enter: 'dissolve',
      controls: false, advance: 'input',
      caption: 'Isabella, Marketing manager, MT' },
    { id: 'PE8', figma: '3288:18792', view: 'rev', slot: null, enter: 'dissolve',
      controls: false, scrollable: true, advance: 'input',
      caption: 'Revenue Intelligence - Individual Buyer: Ron @ Loopify. Scrollable.' },
    { id: 'PE9', figma: '3288:18647', view: 'sf', slot: null, enter: 'dissolve',
      controls: false, scrollable: true, advance: 'input',
      caption: 'Salesforce - Account: Loopify with PathFactory integration. Scrollable.' }
  ]
};

/* frame-shared.js - shared by the Figma frame pages (frame.html, frame2.html, frame3.html).
   - Answers are kept for the browser session (sessionStorage), so moving back to an earlier page keeps them.
   - The five-stage progress bar: stages before the current one are full, the current one fills as you answer.
   - The "X" button and the bottom-bar counter.
   - Moving between questions and pages: the question slides out and the next one slides in.
   - The stepper is also navigation: a stage already reached opens with a click. */

window.WZFrame = (function () {
  const A = window.ASSESSMENT;
  const KEY = 'wz-frames';
  let all = {};
  try { all = JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { /* no storage: in memory only */ }

  function answers(groupId) {
    if (!all[groupId]) all[groupId] = {};
    return all[groupId];
  }
  function save() {
    try { sessionStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* ignore */ }
  }
  // an answer counts once it has text, both fields have text, or an oral answer is recorded
  const filled = (value) => {
    if (!value) return false;
    if (typeof value === 'object') {
      if (value.recorded) return true;
      return Object.keys(value).length > 0 && Object.values(value).every((v) => String(v).trim() !== '');
    }
    return String(value || '').trim() !== '';
  };

  // Row A / Row B versions (data.js): ?variant=B in the URL, else ASSESSMENT.variant
  const variant = (new URLSearchParams(location.search).get('variant') || A.variant || 'A').toUpperCase();
  const unitsOf = (group) => (Array.isArray(group.units) ? group.units : group.units[variant] || group.units.A);

  // Share of the stage's items that have an answer (a likert unit counts each statement)
  function stageFraction(si) {
    const keys = [];
    A.stages[si].groups.forEach((group) => unitsOf(group).forEach((unit) => {
      if (unit.type === 'likert') unit.items.forEach((item) => keys.push([group.id, item.id]));
      else keys.push([group.id, unit.id]);
    }));
    return keys.filter(([g, id]) => filled(answers(g)[id])).length / keys.length;
  }

  // ---- The stepper as navigation ----------------------------------------------------------------
  // As usual in step-by-step forms: a stage the student already reached opens with a click (back to an
  // earlier stage, or forward again to one reached before going back); stages not reached yet stay locked,
  // so no stage is skipped. A stage opens at its first screen.
  const STAGE_PAGES = ['frame.html', 'frame2.html', 'frame4.html', 'frame6.html', 'frame10.html', 'frame-oral.html'];
  const REACHED_KEY = 'wz-frames-reached';
  // the furthest stage reached so far (this page's stage counts; the finish screen reaches them all)
  function reachedUpTo(current) {
    let reached = -1;
    try { reached = Number(sessionStorage.getItem(REACHED_KEY) || -1); } catch (e) { /* in memory only */ }
    reached = Math.max(reached, Math.min(current, A.stages.length - 1));
    try { sessionStorage.setItem(REACHED_KEY, String(reached)); } catch (e) { /* ignore */ }
    return reached;
  }
  // clicks on a reached stage (any [data-stage] in the list) open it, sliding in from its side
  function navigable(list, current) {
    list.addEventListener('click', (e) => {
      const target = e.target.closest('[data-stage]');
      if (!target) return;
      const si = Number(target.dataset.stage);
      go(STAGE_PAGES[si], si < current ? 'prev' : 'next');
    });
  }

  // Builds the stepper into `list`; returns update(overrideFraction) that refreshes the current stage's fill
  // current: the stage index; stages.length = past the last one (the finish screen: every stage full, a ✓ by its name)
  function stepper(list, current) {
    const finished = current >= A.stages.length;
    const size = 'inlineSize';
    const reached = reachedUpTo(current);
    navigable(list, current);
    const fills = A.stages.map((stage, si) => {
      const state = si < current ? 'wz-step-done wz-fr-step'
        : si === current ? 'wz-step-current wz-fr-step-current'
        : si <= reached ? 'wz-step-open wz-fr-step'
        : 'wz-step-upcoming wz-fr-step';
      // a reached stage (not this one) is a button that opens it
      const open = si !== current && si <= reached;
      const tag = open ? 'button' : 'div';
      const li = document.createElement('li');
      li.innerHTML = `
        <${tag} class="wz-step ${state}" ${open ? `type="button" data-stage="${si}"` : ''} ${si === current ? 'aria-current="step"' : ''}>
          <span class="wz-step-track"><span class="wz-step-fill"></span></span>
          <span class="wz-step-label">${finished ? '<ds-icon name="check" size="16"></ds-icon>' : ''}${stage.title}</span>
        </${tag}>`;
      list.append(li);
      const fill = li.querySelector('.wz-step-fill');
      if (si < current || finished) fill.style[size] = '100%';
      else if (si > current && si <= reached) fill.style[size] = `${stageFraction(si) * 100}%`; // reached before
      return fill;
    });
    const update = (overrideFraction) => {
      if (fills[current]) {
        const frac = typeof overrideFraction === 'number' ? overrideFraction : stageFraction(current);
        fills[current].style[size] = `${Math.min(100, Math.max(0, frac * 100))}%`;
      }
    };
    update();
    return update;
  }

  // toasts for controls that lead nowhere yet (the X)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-toast]');
    if (trigger) DS.showToast({ type: 'info', message: trigger.dataset.toast });
  });

  // a page opened with #last starts at its last question (coming back with "הקודם")
  const startAtLast = location.hash === '#last';

  // ---- Moving between questions ----------------------------------------------------------------
  // The question slides out and the next one slides in, so a new question is noticed even when the layout
  // stays the same. Only the question moves (the panel's content); the frame, the reading text and the footer
  // stay. "Next" brings the new question in from the inline end (the left in Hebrew), "previous" from the
  // other side. With reduced motion: a short fade only. Between pages the new page's question slides in too.
  const rootStyle = getComputedStyle(document.documentElement);
  const token = (name) => rootStyle.getPropertyValue(name).trim();
  const seconds = (name) => parseFloat(token(name)) * 1000;              // '0.15s' -> 150
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const NAV_KEY = 'wz-frames-nav';
  let swapping = false;

  // what moves: the stage's content; the "בלי מילון" tag stays, the question tab only fades
  const movers = (stage) => [...stage.children].filter((el) => !el.matches('.wz-fr-tag:not(.wz-fr-tag-question)'));
  function offset(stage, el, dir) {
    if (reduceMotion.matches || el.classList.contains('wz-fr-tag-question')) return 0;
    const towardEnd = getComputedStyle(stage).direction === 'rtl' ? -1 : 1;
    return towardEnd * (dir === 'next' ? 1 : -1) * parseFloat(token('--ds-space-6')); // 24px
  }
  const easing = () => token('--ds-ease-out');

  function enter(stage, dir) {
    movers(stage).forEach((el) => el.animate(
      [{ opacity: 0, transform: `translateX(${offset(stage, el, dir)}px)` }, { opacity: 1, transform: 'none' }],
      { duration: seconds('--ds-duration-slow'), easing: easing(), fill: 'backwards' }));
  }
  // swap(stage, 'next' | 'prev', change): the question leaves, change() shows the next one, it comes in
  async function swap(stage, dir, change) {
    if (swapping || !stage) { change(); return; } // a fast second click: no waiting
    swapping = true;
    const duration = seconds('--ds-duration-base');
    const outs = movers(stage).map((el) => el.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-offset(stage, el, dir)}px)` }],
      { duration, easing: easing(), fill: 'forwards' }));
    // the question changes when the animation ends, or by its duration at the latest (a busy or hidden
    // page can hold animations back; the click must never wait on them)
    await Promise.race([
      Promise.all(outs.map((a) => a.finished.catch(() => {}))),
      new Promise((done) => { setTimeout(done, duration); }),
    ]);
    change();
    outs.forEach((a) => a.cancel());
    enter(stage, dir);
    swapping = false;
  }
  // to another page: the new page slides its question in from the same side
  function go(url, dir) {
    try { sessionStorage.setItem(NAV_KEY, dir); } catch (e) { /* ignore */ }
    location.href = url;
  }
  // on a page: did we come here with next / previous? (read once)
  function arrived() {
    let dir = null;
    try { dir = sessionStorage.getItem(NAV_KEY); sessionStorage.removeItem(NAV_KEY); } catch (e) { /* ignore */ }
    return dir;
  }
  // focus moves to the new question's title, so screen readers read it (no ring after a mouse click)
  function focusTitle(title) {
    if (!title) return;
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
  }

  return { answers, save, filled, stepper, startAtLast, unitsOf, swap, enter, go, arrived, focusTitle };
})();

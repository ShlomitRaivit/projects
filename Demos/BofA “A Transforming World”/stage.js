/* stage.js - presenter-driven scene runner for stage.html.
   Reads window.APP_DATA.stage (data.js). Classic script, works from file://. */
(function () {
  'use strict';

  var data = window.APP_DATA.stage;
  var scenes = data.scenes;
  var stage = document.getElementById('stage');
  var avatar = document.getElementById('stage-avatar');
  var controls = document.getElementById('stage-controls');
  var extra = document.getElementById('stage-extra');
  var siteScroll = document.getElementById('site-scroll');
  var hud = document.getElementById('stage-hud');
  var eventEl = document.getElementById('event');
  var homeEl = document.getElementById('home');
  var homeScroll = document.getElementById('home-scroll');
  var eventScroll = document.getElementById('live-scroll');
  var eventToast = document.getElementById('live-toast');
  var eventInput = document.getElementById('live-input');
  var askText = document.getElementById('live-ask-text');
  var emailEl = document.getElementById('email');
  var recapEl = document.getElementById('recap');
  var recapScroll = document.getElementById('recap-scroll');
  var revEl = document.getElementById('rev');
  var revScroll = document.getElementById('rev-scroll');
  var sfEl = document.getElementById('sf');
  var sfScroll = document.getElementById('sf-scroll');
  var peLeft = document.getElementById('pe-call-left');
  var gen = stage.querySelector('[data-view="gen"]');
  var genCompose = gen.querySelector('.stage-gen-compose');
  var genInputs = gen.querySelectorAll('input[data-fill]');

  var views = {};
  [].forEach.call(stage.querySelectorAll('.stage-view'), function (v) { views[v.getAttribute('data-view')] = v; });

  var poster = document.createElement('img');
  poster.className = 'stage-poster';
  poster.alt = '';
  poster.draggable = false;
  avatar.appendChild(poster);

  var index = 0;
  var timers = [];
  var autoTimer = null;
  var autoOn = true;
  var clipState = {}; // scene id -> 'none' | 'loading' | 'playing' | 'ended' | 'missing'

  function makeVideo(src, onPlaying, onError, onEnded, muted) {
    var v = document.createElement('video');
    v.className = 'stage-clip';
    v.src = src;
    v.preload = 'auto';
    v.playsInline = true;
    if (muted) {
      v.muted = true;
      v.setAttribute('muted', '');
    }
    v.addEventListener('playing', onPlaying);
    v.addEventListener('error', onError);
    if (onEnded) v.addEventListener('ended', onEnded);
    return v;
  }

  // One <video> per scene, created up front so the files are preloaded.
  scenes.forEach(function (scene) {
    clipState[scene.id] = scene.clip ? 'loading' : 'none';

    if (scene.clip) {
      scene.video = makeVideo(scene.clip,
        function () { clipState[scene.id] = 'playing'; scene.video.classList.add('is-playing'); renderHud(); },
        function () { clipState[scene.id] = 'missing'; scene.video.classList.remove('is-playing'); renderHud(); },
        function () {
          clipState[scene.id] = 'ended';
          renderHud();
          if (scenes[index] === scene && scene.advance === 'media-end') next();
        },
        scene.muted);
      if (scene.id) scene.video.setAttribute('data-scene', scene.id);
      avatar.appendChild(scene.video);
    }

    // P4: the large demo video next to the avatar
    if (scene.extraPoster) {
      var ex = document.createElement('img');
      ex.className = 'stage-poster';
      ex.alt = '';
      ex.src = scene.extraPoster;
      extra.appendChild(ex);
      if (scene.extraClip) {
        scene.extraVideo = makeVideo(scene.extraClip,
          function () { scene.extraVideo.classList.add('is-playing'); },
          function () { scene.extraVideo.classList.remove('is-playing'); });
        extra.appendChild(scene.extraVideo);
      }
    }
  });

  function stopAllClips() {
    scenes.forEach(function (scene) {
      [scene.video, scene.extraVideo].forEach(function (v) {
        if (!v) return;
        v.pause();
        v.classList.remove('is-playing');
      });
      if (clipState[scene.id] === 'playing' || clipState[scene.id] === 'ended') clipState[scene.id] = 'loading';
    });
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function play(v) {
    if (!v) return;
    try { v.currentTime = 0; } catch (e) { /* not seekable yet */ }
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* blocked or missing: the poster stays */ });
  }

  function setSlot(slot) {
    avatar.className = avatar.className.replace(/\bslot-\S+/g, '').trim() + ' slot-' + slot;
  }

  // Generated experience: compose (skeleton) | form (empty fields) | filled (Navi's details)
  function setGen(state) {
    gen.setAttribute('data-gen', state);
    [].forEach.call(genInputs, function (input) {
      input.value = state === 'filled' ? input.getAttribute('data-fill') : '';
    });
  }

  function armAuto(scene) {
    clearTimeout(autoTimer);
    if (scene.passthrough) autoTimer = setTimeout(next, scene.auto * 1000);
    else if (autoOn && scene.auto) autoTimer = setTimeout(next, scene.auto * 1000);
  }

  // Texts typed into the Live Experience panels
  var TYPED_QA = 'How do I explain the business value of Enhanced Data Encryption to a non-technical client?';
  var TYPED_ASK = 'Explaining Enhanced Data Encryption\'s value?';

  function showEvent(scene) {
    eventEl.setAttribute('data-panel', scene.panel);
    eventEl.setAttribute('aria-hidden', 'false');
    eventEl.setAttribute('data-input', scene.panel === 'qa-typed' ? 'typed' : '');
    eventInput.value = scene.panel === 'qa-typed' ? TYPED_QA : '';
    askText.textContent = scene.panel === 'ask-typed' ? TYPED_ASK : '';
    eventToast.setAttribute('data-kind', scene.toast || eventToast.getAttribute('data-kind'));
    eventToast.classList.remove('is-dismissed');
    eventToast.classList.toggle('is-open', !!scene.toast);
    [].forEach.call(eventEl.querySelectorAll('.live-chat, .live-thread'), function (el) { el.scrollTop = el.scrollHeight; });
    flashShow(0);
    var tabs = document.getElementById('live-tabs');
    var wantQa = /^qa-/.test(scene.panel);
    [].forEach.call(tabs.querySelectorAll('.ds-tab'), function (t) {
      t.setAttribute('aria-selected', String((t.getAttribute('data-value') === 'qa') === wantQa));
    });
  }

  function hideEvent() {
    eventEl.setAttribute('aria-hidden', 'true');
    eventToast.classList.remove('is-open');
  }

  function go(i, first) {
    index = Math.max(0, Math.min(scenes.length - 1, i));
    var scene = scenes[index];
    clearTimers();
    clearTimeout(autoTimer);
    stopAllClips();

    var instant = first || scene.enter === 'cut';
    if (instant) stage.classList.add('no-anim');

    Object.keys(views).forEach(function (name) {
      views[name].classList.toggle('is-active', name === scene.view);
    });
    var onEvent = scene.view === 'event';
    var onHome = scene.view === 'home';
    var onEmail = scene.view === 'email';
    var onRecap = scene.view === 'recap';
    var onRev = scene.view === 'rev';
    var onSf = scene.view === 'sf';
    document.body.classList.toggle('is-live', onEvent);
    document.body.classList.toggle('is-home', onHome);
    document.body.classList.toggle('is-email', onEmail);
    document.body.classList.toggle('is-recap', onRecap);
    document.body.classList.toggle('is-rev', onRev);
    document.body.classList.toggle('is-sf', onSf);
    if (homeEl) homeEl.setAttribute('aria-hidden', String(!onHome));
    if (emailEl) emailEl.setAttribute('aria-hidden', String(!onEmail));
    if (recapEl) recapEl.setAttribute('aria-hidden', String(!onRecap));
    if (revEl) revEl.setAttribute('aria-hidden', String(!onRev));
    if (sfEl) sfEl.setAttribute('aria-hidden', String(!onSf));
    if (onHome) homeScroll.scrollTop = 0;
    if (onRecap && recapScroll) recapScroll.scrollTop = 0;
    if (onRev && revScroll) revScroll.scrollTop = 0;
    if (onSf && sfScroll) sfScroll.scrollTop = 0;
    if (peLeft) peLeft.setAttribute('data-pe-sub', scene.peSub || 'none');
    if (onEvent) showEvent(scene); else hideEvent();
    controls.classList.toggle('is-visible', !!scene.controls);
    document.body.classList.toggle('has-controls', !!scene.controls);

    if (!scene.slot) {
      // no avatar on this screen: fade it out where it is
      avatar.classList.remove('is-gone');
      avatar.classList.add('is-hidden');
    } else if (scene.enter === 'dissolve' && !instant) {
      // fade the avatar in at its new place instead of sliding it there
      avatar.classList.add('is-gone');
      void avatar.offsetWidth;
      setSlot(scene.slot);
      void avatar.offsetWidth;
      avatar.classList.remove('is-gone');
    } else {
      avatar.classList.remove('is-gone');
      setSlot(scene.slot);
    }
    if (scene.slot) {
      avatar.classList.remove('is-hidden');
      avatar.setAttribute('data-scene', scene.id);
      poster.src = scene.poster;
      avatar.classList.toggle('has-label', !!scene.label);
      if (scene.label) avatar.setAttribute('data-label', scene.label);
    } else {
      avatar.removeAttribute('data-scene');
    }
    document.body.classList.toggle('is-site', scene.view === 'site');

    if (scene.view === 'site') siteScroll.scrollTop = 0;
    if (scene.scrollable || onEvent && (!scenes[index - 1] || scenes[index - 1].view !== 'event')) eventScroll.scrollTop = 0;

    if (scene.view === 'gen') {
      genCompose.classList.remove('is-morphing');
      setGen(scene.gen);
      if (scene.morph) {
        void genCompose.offsetWidth;
        genCompose.classList.add('is-morphing');
      }
      (scene.timers || []).forEach(function (t) {
        timers.push(setTimeout(function () { setGen(t.gen); renderHud(); }, t.at * 1000));
      });
    }

    if (instant) {
      void stage.offsetWidth;
      stage.classList.remove('no-anim');
    }

    if (scene.video && clipState[scene.id] !== 'missing') play(scene.video);
    if (scene.extraVideo) play(scene.extraVideo);
    armAuto(scene);
    renderHud();
    if (history.replaceState) history.replaceState(null, '', '#' + scene.id);
  }

  function next() {
    if (index >= scenes.length - 1) {
      if (window.DS) DS.showToast({ type: 'info', message: 'Last approved frame (' + scenes[index].id + ').', duration: 3000 });
      return;
    }
    go(index + 1);
  }

  function prev() {
    var t = index - 1;
    while (t > 0 && scenes[t].passthrough) t--;
    go(t);
  }

  function toggleAuto() {
    autoOn = !autoOn;
    if (autoOn) armAuto(scenes[index]);
    else if (!scenes[index].passthrough) clearTimeout(autoTimer);
    renderHud();
  }

  function skipClip() {
    var scene = scenes[index];
    if (scene.video) {
      scene.video.pause();
      scene.video.classList.remove('is-playing');
    }
    if (scene.advance === 'media-end') next();
    else renderHud();
  }

  function renderHud() {
    if (hud.hidden) return;
    var scene = scenes[index];
    document.getElementById('hud-scene').textContent = scene.id + '  (' + (index + 1) + '/' + scenes.length + ')';
    document.getElementById('hud-clip').textContent = 'clip: ' + clipState[scene.id] + (scene.advance === 'media-end' ? ' (advances at end)' : '') +
      (scene.view === 'gen' ? ' | state: ' + gen.getAttribute('data-gen') : '') +
      (scene.auto ? ' | auto-advance ' + (autoOn ? 'in ' + scene.auto + ' s' : 'PAUSED') : '');
    document.getElementById('hud-next').textContent = 'next: ' + (index < scenes.length - 1 ? scenes[index + 1].id : data.after);
    document.getElementById('hud-caption').textContent = scene.caption;
  }

  // Resizing the window must not animate the avatar: it only animates between slots.
  var resizeTimer;
  window.addEventListener('resize', function () {
    stage.classList.add('no-anim');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { stage.classList.remove('no-anim'); }, 200);
  });

  // Click-to-advance only on screens Figma advances with a plain click and that have nothing to explore.
  stage.addEventListener('click', function () { if (scenes[index].clickAdvance) next(); });
  document.getElementById('stage-register').addEventListener('click', function () { if (scenes[index].id === 'P6') next(); });
  var slides = document.getElementById('live-slides'), flashCount = document.getElementById('flash-count');
  var flashAt = 0;
  function flashShow(n) {
    flashAt = Math.max(0, Math.min(slides.children.length - 1, n));
    slides.scrollLeft = slides.children[flashAt].offsetLeft - slides.offsetLeft;
    flashCount.textContent = (flashAt + 1) + '/' + slides.children.length;
  }
  function flashGo(dir) { flashShow(flashAt + dir); }
  slides.addEventListener('scroll', function () {
    var w = slides.firstElementChild.getBoundingClientRect().width + 8;
    flashAt = Math.round(slides.scrollLeft / w);
    flashCount.textContent = (flashAt + 1) + '/' + slides.children.length;
  });
  document.getElementById('flash-prev').addEventListener('click', function () { flashGo(-1); });
  document.getElementById('flash-next').addEventListener('click', function () { flashGo(1); });
  homeScroll.addEventListener('scroll', function () { homeScroll.classList.toggle('is-scrolled', homeScroll.scrollTop > 40); });
  document.getElementById('home-join').addEventListener('click', function () { if (scenes[index].id === 'L1') next(); });
  document.getElementById('live-dismiss').addEventListener('click', function () { eventToast.classList.add('is-dismissed'); });
  var emailCta = document.getElementById('email-recap-cta');
  if (emailCta) emailCta.addEventListener('click', function () { if (scenes[index].id === 'PE1') next(); });
  var floatingMaya = document.getElementById('recap-floating-maya');
  if (floatingMaya) floatingMaya.addEventListener('click', function () { if (scenes[index].id === 'PE2') next(); });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // Typing or using a menu: leave the keys alone
    var tgt = e.target;
    if (tgt && tgt.closest && tgt.closest('input, textarea, select, [contenteditable], .ds-select-wrapper')) return;

    // Up / Down / PageUp / PageDown scroll whatever page is on screen; held keys repeat
    var sc = scenes[index].view === 'site' ? siteScroll :
             scenes[index].view === 'event' ? eventScroll :
             scenes[index].view === 'home' ? homeScroll :
             scenes[index].view === 'recap' ? recapScroll :
             scenes[index].view === 'rev' ? revScroll :
             scenes[index].view === 'sf' ? sfScroll : null;
    if (sc && /^(ArrowDown|ArrowUp|PageDown|PageUp|Home|End)$/.test(e.key)) {
      e.preventDefault();
      var page = sc.clientHeight * 0.9;
      var d = { ArrowDown: 80, ArrowUp: -80, PageDown: page, PageUp: -page }[e.key];
      if (e.key === 'Home') sc.scrollTop = 0; else if (e.key === 'End') sc.scrollTop = sc.scrollHeight; else sc.scrollTop += d;
      return;
    }
    if (e.repeat) return;

    switch (e.key) {
      case ' ':
      case 'ArrowRight': e.preventDefault(); next(); break;
      case 'ArrowLeft':  e.preventDefault(); prev(); break;
      case 's': case 'S': skipClip(); break;
      case 'a': case 'A': toggleAuto(); break;
      case 'r': case 'R': go(0); break;
      case 'p': case 'P': hud.hidden = !hud.hidden; renderHud(); break;
    }
  });

  window.__stageGo = go;
  window.__stageIndex = function () { return index; };
  window.__stageScenes = function () { return scenes; };

  window.addEventListener('hashchange', function () {
    if (window.location.hash) {
      var hashId = window.location.hash.replace(/^#/, '');
      for (var h = 0; h < scenes.length; h++) {
        if (scenes[h].id.toLowerCase() === hashId.toLowerCase()) {
          if (index !== h) go(h);
          break;
        }
      }
    }
  });

  var initIndex = 0;
  if (window.location.hash) {
    var hashId = window.location.hash.replace(/^#/, '');
    for (var h = 0; h < scenes.length; h++) {
      if (scenes[h].id.toLowerCase() === hashId.toLowerCase()) {
        initIndex = h;
        break;
      }
    }
  }

  go(initIndex, true);
})();

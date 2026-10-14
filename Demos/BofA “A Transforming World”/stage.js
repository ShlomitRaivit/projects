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
  var live = document.getElementById('stage-live');
  var livePlates = document.getElementById('live-plates');
  var liveToast = document.getElementById('live-toast');
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
  var plates = {}; // image path -> <img> on the Live Experience view
  var clipState = {}; // scene id -> 'none' | 'loading' | 'playing' | 'ended' | 'missing'

  function makeVideo(src, onPlaying, onError, onEnded) {
    var v = document.createElement('video');
    v.className = 'stage-clip';
    v.src = src;
    v.preload = 'auto';
    v.playsInline = true;
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
        });
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

  // The Live Experience pictures are created up front so they are loaded before they are needed.
  scenes.forEach(function (scene) {
    if (!scene.plate || plates[scene.plate]) return;
    var img = document.createElement('img');
    img.className = 'stage-live-layer stage-live-plate';
    img.alt = '';
    img.draggable = false;
    img.src = scene.plate;
    livePlates.appendChild(img);
    plates[scene.plate] = img;
  });

  // Figma gives this hover button no click action, so a click on it must not move the demo on
  [].forEach.call(stage.querySelectorAll('.stage-hover-pill'), function (el) {
    el.addEventListener('click', function (e) { e.stopPropagation(); });
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

  function showLive(scene) {
    live.setAttribute('data-scene', scene.id);
    Object.keys(plates).forEach(function (src) { plates[src].classList.toggle('is-on', src === scene.plate); });
    if (scene.toast) live.setAttribute('data-toast-layer', scene.toast);
    liveToast.classList.toggle('is-open', !!scene.toast);
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
    controls.classList.toggle('is-visible', !!scene.controls);

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
      poster.src = scene.poster;
    }
    if (scene.view === 'live') showLive(scene);

    if (scene.view === 'site') siteScroll.scrollTop = 0;

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

  function fit() {
    var s = Math.min(window.innerWidth / stage.offsetWidth, window.innerHeight / stage.offsetHeight);
    stage.style.setProperty('--stage-scale', s);
  }

  stage.addEventListener('click', next);

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // Up / Down scroll the Mighty Tech website (P1); held keys repeat
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && scenes[index].view === 'site') {
      e.preventDefault();
      siteScroll.scrollBy({ top: e.key === 'ArrowDown' ? 160 : -160, behavior: 'smooth' });
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

  window.addEventListener('resize', fit);
  fit();
  go(0, true);
})();

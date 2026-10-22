/* frame-oral.js - Stage 6: Oral Assessment (דיבור).
   Displays the picnic stimulus picture alongside oral questions 1-5.
   Students record their oral answer, can save, review/play back, and delete/re-record. */

(function () {
  const A = window.ASSESSMENT;
  const $ = (id) => document.getElementById(id);

  // Find stage and group
  const stageIndex = A.stages.findIndex((s) => s.id === 'speaking');
  const stageObj = A.stages[stageIndex];
  const group = stageObj.groups.find((g) => g.id === 'oral');
  const units = WZFrame.unitsOf(group);
  const answers = WZFrame.answers(group.id);
  let current = WZFrame.startAtLast ? units.length - 1 : 0;

  // UI Elements
  const stagePanel = document.querySelector('.wz-fr-oral-panel');
  const questionTag = $('question-tag');
  const questionText = $('oral-question-text');
  const listenQuestionBtn = $('listen-question');
  const countEl = $('count');
  const nextBtn = $('next');
  const prevBtn = $('prev');
  const nextLabel = $('next-label');

  // Recording State Containers
  const stateIdle = $('rec-state-idle');
  const stateRecording = $('rec-state-recording');
  const stateSaved = $('rec-state-saved');

  // Controls
  const startRecBtn = $('start-rec-btn');
  const saveRecBtn = $('save-rec-btn');
  const cancelRecBtn = $('cancel-rec-btn');
  const recTimeVal = $('rec-time-val');
  const recWavesContainer = $('rec-waves-container');
  const dontKnowBtn = $('dont-know');

  // Saved player controls
  const playSavedBtn = $('play-saved-btn');
  const playSavedIcon = $('play-saved-icon');
  const savedScrubTrack = $('saved-scrub-track');
  const savedScrubFill = $('saved-scrub-fill');
  const savedTimeDisplay = $('saved-time-display');
  const deleteRecBtn = $('delete-rec-btn');

  // Audio recording state
  let mediaRecorder = null;
  let audioStream = null;
  let audioChunks = [];
  let recStartTime = 0;
  let recTimer = null;
  let elapsedSeconds = 0;
  let isRecording = false;

  // Waveform visualization
  let audioCtx = null;
  let analyser = null;
  let animFrameId = null;

  // Audio playback state
  let currentPlaybackAudio = null;
  let isPlaying = false;

  const updateProgress = WZFrame.stepper($('stepper'), stageIndex, group.id);

  // Format seconds to M:SS
  function formatTime(sec) {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  }

  // Generate 26 sound wave bars
  const waveBars = [];
  const BAR_COUNT = 26;
  if (recWavesContainer) {
    recWavesContainer.innerHTML = '';
    for (let i = 0; i < BAR_COUNT; i++) {
      const bar = document.createElement('div');
      bar.className = 'wz-fr-wave-bar';
      // Center bars taller by default
      const distFromCenter = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
      const baseH = Math.max(4, Math.round(24 * (1 - distFromCenter * 0.7)));
      bar.style.height = `${baseH}px`;
      recWavesContainer.appendChild(bar);
      waveBars.push(bar);
    }
  }

  // Update Next CTA button disabled state (standard behavior: not disabled)
  function updateNextButton() {
    if (nextBtn) nextBtn.disabled = false;
  }

  // Render question state
  function render() {
    stopCurrentPlayback();
    cancelActiveRecording();

    const unit = units[current];
    if (questionTag) questionTag.textContent = `שאלה ${current + 1}`;
    if (questionText) questionText.textContent = unit.prompt;
    if (countEl) countEl.textContent = `שאלה ${current + 1} מתוך ${units.length}`;

    // Last question CTA label
    if (nextLabel) {
      nextLabel.textContent = current === units.length - 1 ? 'סיום' : 'שאלה הבאה';
    }

    const saved = answers[unit.id];
    if (saved && saved.recorded) {
      showState('saved');
      savedTimeDisplay.textContent = formatTime(saved.duration || 0);
      savedScrubFill.style.width = '0%';
    } else {
      showState('idle');
    }

    updateNextButton();
  }

  function showState(st) {
    stateIdle.hidden = st !== 'idle';
    stateRecording.hidden = st !== 'recording';
    stateSaved.hidden = st !== 'saved';
  }

  // ---- Audio Recording ----
  async function startRecording() {
    stopCurrentPlayback();
    isRecording = true;
    audioChunks = [];
    // 30s countdown as per Figma annotation
    const MAX_RECORDING_SECONDS = 30;
    elapsedSeconds = 0;
    recTimeVal.textContent = '00:30';
    showState('recording');

    // Live countdown timer (30s down to 0)
    recStartTime = Date.now();
    clearInterval(recTimer);
    recTimer = setInterval(() => {
      elapsedSeconds = Math.floor((Date.now() - recStartTime) / 1000);
      const remaining = Math.max(0, MAX_RECORDING_SECONDS - elapsedSeconds);
      recTimeVal.textContent = `00:${remaining < 10 ? '0' : ''}${remaining}`;
      if (remaining <= 0) {
        clearInterval(recTimer);
        saveRecording();
      }
    }, 1000);

    // Audio recording & visualizer
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(audioStream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunks.push(e.data);
        };
        mediaRecorder.start(250);

        // Web Audio API wave analyzer
        try {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const source = audioCtx.createMediaStreamSource(audioStream);
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          function animateWaves() {
            if (!isRecording) return;
            analyser.getByteFrequencyData(dataArray);
            waveBars.forEach((bar, i) => {
              const val = dataArray[i % dataArray.length] || 0;
              const h = Math.max(4, Math.min(28, Math.round((val / 255) * 28)));
              bar.style.height = `${h}px`;
            });
            animFrameId = requestAnimationFrame(animateWaves);
          }
          animateWaves();
        } catch (e) {
          fallbackWaveAnimation();
        }
      } else {
        fallbackWaveAnimation();
      }
    } catch (err) {
      // Fallback for sandboxes or mic denial
      fallbackWaveAnimation();
    }
  }

  function fallbackWaveAnimation() {
    function animateFallback() {
      if (!isRecording) return;
      const t = Date.now() / 200;
      waveBars.forEach((bar, i) => {
        const val = Math.sin(t + i * 0.4) * 0.5 + 0.5;
        const h = Math.max(4, Math.round(4 + val * 22));
        bar.style.height = `${h}px`;
      });
      animFrameId = requestAnimationFrame(animateFallback);
    }
    animateFallback();
  }

  function cancelActiveRecording() {
    isRecording = false;
    clearInterval(recTimer);
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try { mediaRecorder.stop(); } catch (e) { /* ignore */ }
    }
    if (audioStream) {
      audioStream.getTracks().forEach((t) => t.stop());
      audioStream = null;
    }
    if (audioCtx && audioCtx.state !== 'closed') {
      try { audioCtx.close(); } catch (e) { /* ignore */ }
      audioCtx = null;
    }
  }

  function cancelRecording() {
    cancelActiveRecording();
    showState('idle');
    updateNextButton();
  }

  function saveRecording() {
    const finalDuration = Math.max(1, elapsedSeconds);
    const unit = units[current];

    cancelActiveRecording();

    // If real blob was recorded
    let blobUrl = '';
    if (audioChunks.length > 0) {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      blobUrl = URL.createObjectURL(blob);
    }

    answers[unit.id] = {
      recorded: true,
      duration: finalDuration,
      url: blobUrl,
      timestamp: Date.now(),
    };

    WZFrame.save();
    updateProgress();
    showState('saved');
    savedTimeDisplay.textContent = formatTime(finalDuration);
    savedScrubFill.style.width = '0%';
    updateNextButton();

    if (window.DS && window.DS.showToast) {
      DS.showToast({ type: 'success', message: 'ההקלטה נשמרה בהצלחה' });
    }
  }

  // ---- Audio Playback ----
  function stopCurrentPlayback() {
    if (currentPlaybackAudio) {
      currentPlaybackAudio.pause();
      currentPlaybackAudio = null;
    }
    isPlaying = false;
    if (playSavedIcon) playSavedIcon.setAttribute('name', 'speaker');
    if (savedScrubFill) savedScrubFill.style.width = '0%';
  }

  function togglePlaySaved() {
    const unit = units[current];
    const saved = answers[unit.id];
    if (!saved) return;

    if (isPlaying) {
      stopCurrentPlayback();
      return;
    }

    // If real blob URL exists, play it
    if (saved.url) {
      currentPlaybackAudio = new Audio(saved.url);
      isPlaying = true;
      if (playSavedIcon) playSavedIcon.setAttribute('name', 'sound-wave');

      currentPlaybackAudio.addEventListener('timeupdate', () => {
        if (!currentPlaybackAudio) return;
        const cur = currentPlaybackAudio.currentTime;
        const dur = currentPlaybackAudio.duration || saved.duration || 1;
        savedScrubFill.style.width = `${Math.min(100, (cur / dur) * 100)}%`;
        savedTimeDisplay.textContent = formatTime(cur);
      });

      currentPlaybackAudio.addEventListener('ended', () => {
        stopCurrentPlayback();
        savedTimeDisplay.textContent = formatTime(saved.duration);
      });

      currentPlaybackAudio.play().catch(() => {
        simulatePlayback(saved.duration);
      });
    } else {
      simulatePlayback(saved.duration);
    }
  }

  function simulatePlayback(dur) {
    isPlaying = true;
    if (playSavedIcon) playSavedIcon.setAttribute('name', 'sound-wave');
    const total = dur || 5;
    let cur = 0;
    const interval = setInterval(() => {
      cur += 0.2;
      if (cur >= total || !isPlaying) {
        clearInterval(interval);
        stopCurrentPlayback();
        savedTimeDisplay.textContent = formatTime(total);
      } else {
        savedScrubFill.style.width = `${(cur / total) * 100}%`;
        savedTimeDisplay.textContent = formatTime(cur);
      }
    }, 200);
  }

  function deleteSavedRecording() {
    stopCurrentPlayback();
    const unit = units[current];
    delete answers[unit.id];
    WZFrame.save();
    updateProgress();
    showState('idle');
    updateNextButton();
  }

  // ---- Question Speech Synthesis ----
  function speakQuestion() {
    const unit = units[current];
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(unit.prompt);
      utter.lang = 'en-US';
      utter.rate = 0.9;
      if (listenQuestionBtn) listenQuestionBtn.classList.add('wz-fr-play-on');
      utter.onend = () => {
        if (listenQuestionBtn) listenQuestionBtn.classList.remove('wz-fr-play-on');
      };
      utter.onerror = () => {
        if (listenQuestionBtn) listenQuestionBtn.classList.remove('wz-fr-play-on');
      };
      window.speechSynthesis.speak(utter);
    } else if (window.DS) {
      DS.showToast({ type: 'info', message: unit.prompt });
    }
  }

  // Event Listeners
  if (startRecBtn) startRecBtn.addEventListener('click', startRecording);
  if (saveRecBtn) saveRecBtn.addEventListener('click', saveRecording);
  if (cancelRecBtn) cancelRecBtn.addEventListener('click', cancelRecording);
  if (playSavedBtn) playSavedBtn.addEventListener('click', togglePlaySaved);
  if (deleteRecBtn) deleteRecBtn.addEventListener('click', deleteSavedRecording);
  if (listenQuestionBtn) listenQuestionBtn.addEventListener('click', speakQuestion);

  // Stepper navigation
  const show = (i) => () => {
    current = i;
    render();
    WZFrame.focusTitle(questionText);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (current > 0) WZFrame.swap(stagePanel, 'prev', show(current - 1));
      else WZFrame.swap(stagePanel, 'prev', () => WZFrame.go('frame10.html#last', 'prev'));
    });
  }

  function goNext() {
    if (current < units.length - 1) WZFrame.swap(stagePanel, 'next', show(current + 1));
    else WZFrame.swap(stagePanel, 'next', () => WZFrame.go('frame11.html', 'next'));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', goNext);
  }

  // "לא יודע/ת": record it and move on to next question
  if (dontKnowBtn) {
    dontKnowBtn.addEventListener('click', () => {
      answers[units[current].id] = '__dont-know__';
      WZFrame.save();
      updateProgress();
      goNext();
    });
  }

  render();

  const arrivedFrom = WZFrame.arrived();
  if (arrivedFrom) {
    WZFrame.enter(stagePanel, arrivedFrom);
    WZFrame.focusTitle(questionText);
  }
})();

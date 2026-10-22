/* frame-questions.js - the question frames after the feelings questionnaire:
     frame2.html  listen-words      (Figma "שאלון אנגלית 2"): hear a word, choose it from three tiles
     frame3.html  listen-questions  (Figma "שאלון אנגלית 3"): hear a question, type the answer
     frame4.html  amir-note         (Basic reading): read Amir's note, choose True / False
     frame5.html  odd-one-out       (Basic reading): choose the word that doesn't belong
     frame6.html  timetable, t1-t3  (Part II, question 6): the TV-studio timetable, questions 1-3
     frame7.html  timetable, t4     the same timetable, question 4 as an open question with a sentence-size text box
     frame8.html  koalas, k3        "Complete the facts about koalas" beside the koala text (page 11, question 3)
     frame9.html  koalas, k5        "Complete the sentence" with a sentence-size text box (page 11, question 5)
     frame10.html sick-friend       Task C: write a note on ruled paper, with a word count (page 13);
                                    "סיום" opens the finish screen, frame11.html (frame-finish.js)
   Optional: data-units (only these questions), data-field="sentence" (a text box instead of a one-line field).
   The page names its question group on <body data-group>, its neighbours in data-prev / data-next, the
   word for the footer counter in data-counter ("שאלה" when missing), and in data-tiles how choice answers
   look: "word" (listening tiles, the default), "radio" (tiles with a radio circle) or "plain" (frame 1 tiles,
   no radio circle).
   Questions come from data.js. The words / questions the teacher reads are not in the data (they would give
   the answer away). Listening pages have a speaker button (#play) that plays the question's recording
   (data.js audio.src); there are no recordings yet, so it shows that one will be added. */

(function () {
  const A = window.ASSESSMENT;
  const $ = (id) => document.getElementById(id);
  const { group: groupId, prev: prevPage, next: nextPage, counter = 'שאלה', tiles = 'word' } = document.body.dataset;
  const stageIndex = A.stages.findIndex((s) => s.groups.some((g) => g.id === groupId));
  const group = A.stages[stageIndex].groups.find((g) => g.id === groupId);
  // data-units="t4": show only these questions of the group (numbered as in the whole group)
  const allUnits = WZFrame.unitsOf(group); // Row A / Row B
  const only = document.body.dataset.units ? document.body.dataset.units.split(/\s*,\s*/) : null;
  const units = only ? allUnits.filter((u) => only.includes(u.id)) : allUnits;
  // data-field="sentence": one-line answers get a text box sized for a full sentence
  const sentenceField = document.body.dataset.field === 'sentence';
  const answers = WZFrame.answers(groupId);
  const answerEl = $('answer');
  let current = WZFrame.startAtLast ? units.length - 1 : 0;
  const DONT_KNOW = '__dont-know__'; // stored when the student presses "לא יודע/ת"; counts as a response

  const updateProgress = WZFrame.stepper($('stepper'), stageIndex, groupId);

  // the question panel: its content slides when the question changes. A tab on its corner ("שאלה 2") shows
  // the question number right where the student looks (the footer counter says it to screen readers).
  const stage = document.querySelector('.wz-fr-panel');
  let questionTab = null;
  if (stage && allUnits.length > 1) {
    questionTab = document.createElement('p');
    questionTab.className = 'wz-fr-tag wz-fr-tag-question';
    questionTab.setAttribute('aria-hidden', 'true');
    stage.prepend(questionTab);
  }

  // the group's reading text, from data.js: Amir's note (html) or the TV-studio timetable (rows)
  if ($('note-body') && group.material) {
    const m = group.material;
    const sheet = $('note-body').closest('.wz-fr-sheet'); // a paper sheet: title and glossary too
    const glossary = m.glossary
      ? `<dl class="wz-fr-sheet-glossary">${m.glossary.map(([w, he]) => `<div><dt>${w}</dt><dd lang="he" dir="rtl">${he}</dd></div>`).join('')}</dl>`
      : '';
    $('note-body').innerHTML = m.rows
      ? `<h2 class="wz-fr-sheet-title">${m.title}</h2>
         <table class="wz-fr-sheet-table">${m.rows.map(([time, text]) => `<tr><th scope="row">${time}</th><td>${text}</td></tr>`).join('')}</table>
         ${glossary}`
      : sheet ? `<h2 class="wz-fr-sheet-title">${m.title}</h2>${m.html}${glossary}` : m.html;
  }

  // Part II pages (data-heading="unit"): each question has its own instruction (title + Hebrew line)
  // and its question in the sentence box
  const perUnitHeading = document.body.dataset.heading === 'unit';

  // one-line answers (text field) and two-answer questions (labelled fields), built on the page
  const fieldValue = (unit, id) => {
    const v = answers[unit.id];
    return v && typeof v === 'object' ? v[id] || '' : '';
  };
  function textField(label, value, field) {
    const sentence = sentenceField && !field;
    const input = document.createElement(sentence ? 'textarea' : 'input');
    input.className = sentence
      ? 'ds-textarea wz-input-translucent wz-fr-input wz-fr-sentence'
      : 'ds-input ds-input-xl wz-input-translucent wz-fr-input';
    if (sentence) input.rows = 3; // height through the HTML attribute, so the DS textarea stays unstyled
    input.dir = 'auto';
    input.autocomplete = 'off';
    input.placeholder = 'Your answer...';
    input.setAttribute('aria-label', label);
    input.value = value;
    if (field) input.dataset.field = field;
    return input;
  }

  // Frame 1 answer tile: a tile around the untouched DS radio, text next to the radio
  function radioTile(name, value, html) {
    const tile = document.createElement('div');
    tile.className = 'wz-option wz-fr-option';
    tile.innerHTML = `
      <label class="ds-radio">
        <input type="radio" class="ds-radio-input" name="${name}" value="${value}">
        <span class="ds-radio-indicator"></span>
        <span class="ds-radio-label"><span class="wz-fr-text wz-fr-text-start">${html}</span></span>
      </label>`;
    tile.querySelector('input').checked = answers[name] === value;
    return tile;
  }

  // Frame 1 tile without a radio circle: the whole tile is the choice, text centered
  function plainTile(name, value, html) {
    const tile = document.createElement('label');
    tile.className = 'wz-option wz-fr-option wz-fr-option-plain';
    tile.innerHTML = `<input type="radio" class="wz-visually-hidden" name="${name}" value="${value}"><span class="wz-fr-text wz-fr-text-plain">${html}</span>`;
    tile.querySelector('input').checked = answers[name] === value;
    return tile;
  }
  const tile = tiles === 'plain' ? plainTile : radioTile;

  // ---- The recording (listening pages): the speaker button plays this question's recording ----
  // Audio playback for listening questions (#play).
  // Matches Figma component (node 7562:40332): 0:15 duration display, scrub track, circular play button.
  const playButton = $('play');
  const playIcon = $('play-icon');
  const audioTime = $('audio-time');
  const audioFill = $('audio-fill');
  let recording = null;
  let demoTimer = null;
  let demoInterval = null;

  function formatAudioTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  }

  function resetAudioUI() {
    if (playButton) playButton.classList.remove('wz-fr-play-on');
    if (playIcon) playIcon.setAttribute('name', 'play');
    if (audioFill) audioFill.style.width = '0%';
    if (audioTime) audioTime.textContent = '0:15';
  }

  function stopRecording() {
    if (recording) { recording.pause(); recording = null; }
    clearTimeout(demoTimer);
    clearInterval(demoInterval);
    demoTimer = null;
    demoInterval = null;
    resetAudioUI();
  }

  if (playButton) {
    playButton.addEventListener('click', () => {
      // Toggle off if already playing
      if (recording || demoTimer) {
        stopRecording();
        return;
      }

      const src = units[current].audio && units[current].audio.src;
      stopRecording();
      playButton.classList.add('wz-fr-play-on');

      if (src) {
        recording = new Audio(src);
        recording.addEventListener('timeupdate', () => {
          if (!recording) return;
          const cur = recording.currentTime;
          const dur = recording.duration || 15;
          if (audioFill) audioFill.style.width = `${Math.min(100, (cur / dur) * 100)}%`;
          if (audioTime) audioTime.textContent = formatAudioTime(dur - cur);
        });
        recording.addEventListener('ended', stopRecording);
        recording.play().catch(stopRecording);
      } else {
        DS.showToast({ type: 'info', message: 'ההקלטה תתווסף בהמשך' });
        // Smooth simulated playback animation (15s mock duration simulated in 2.5s)
        const simTotalSec = 15;
        const simDurationMs = 2500;
        const startTime = Date.now();
        demoInterval = setInterval(() => {
          const progress = Math.min(1, (Date.now() - startTime) / simDurationMs);
          const remainingSec = Math.round(simTotalSec * (1 - progress));
          if (audioFill) audioFill.style.width = `${progress * 100}%`;
          if (audioTime) audioTime.textContent = formatAudioTime(remainingSec);
        }, 40);
        demoTimer = setTimeout(stopRecording, simDurationMs);
      }
    });
  }

  function render() {
    stopRecording();
    const unit = units[current];
    if (perUnitHeading) {
      // headings have no closing period (the data keeps the sentences as written)
      const noDot = (text) => text.replace(/\.\s*$/, '');
      $('statement').textContent = noDot(unit.instruction.en);
      $('instruction-he').textContent = noDot(unit.instruction.he);
      // the question, or for "complete the sentence" its beginning followed by "…"
      if ($('statement-box')) $('statement-box').innerHTML = unit.prompt || (unit.stem ? `${unit.stem}…` : '');
      // short answers (times) sit 2 x 2, long ones one under the other
      const grid = unit.type === 'choice' && unit.options.every((o) => o.length <= 12);
      answerEl.className = `wz-fr-options wz-fr-tf${grid ? ' wz-fr-options-grid' : ''}`;
    }
    if (unit.type === 'choice' && tiles !== 'word') {
      // frame 1 tiles (with or without a radio circle), e.g. in a 2 x 2 grid (the word that doesn't belong)
      answerEl.replaceChildren(...unit.options.map((option) => tile(unit.id, option, option)));
    } else if (unit.type === 'fields') {
      // e.g. "When will they eat?": two answers on one screen; "Complete the facts": a locked example row first
      answerEl.classList.add('wz-fr-fields');
      answerEl.replaceChildren(...unit.fields.map((field) => {
        const row = document.createElement('label');
        row.className = 'wz-fr-field';
        row.innerHTML = `<span class="wz-fr-field-label" lang="en">${field.label}</span>`;
        if (field.example) {
          const input = textField(`${field.label} (example)`, field.example);
          input.disabled = true;
          row.append(input);
          row.insertAdjacentHTML('beforeend', '<span class="wz-fr-field-note" lang="he" dir="rtl">דוגמה</span>');
        } else {
          row.append(textField(`${unit.prompt} ${field.label}`, fieldValue(unit, field.id), field.id));
          row.insertAdjacentHTML('beforeend', '<span class="wz-fr-field-note"></span>');
        }
        return row;
      }));
    } else if ((unit.type === 'short' || unit.type === 'complete') && !$('answer-input')) {
      const field = textField(unit.prompt || unit.stem || '', answers[unit.id] === DONT_KNOW ? '' : answers[unit.id] || '');
      if (unit.type === 'complete') field.placeholder = 'Complete the sentence...';
      answerEl.replaceChildren(field);
    } else if (unit.type === 'choice') {
      // Figma tiles: no radio circle; a visually hidden radio keeps keyboard and screen-reader support
      answerEl.replaceChildren(...unit.options.map((option) => {
        const tile = document.createElement('label');
        tile.className = 'wz-fr-word';
        tile.innerHTML = `<input type="radio" class="wz-visually-hidden" name="${unit.id}" value="${option}"><span lang="en">${option}</span>`;
        tile.querySelector('input').checked = answers[unit.id] === option;
        return tile;
      }));
    } else if (unit.type === 'truefalse') {
      $('statement-box').textContent = unit.statement;
      answerEl.replaceChildren(
        tile(unit.id, 'true', 'True / <bdi lang="he">נכון</bdi>'),
        tile(unit.id, 'false', 'False / <bdi lang="he">לא נכון</bdi>')
      );
    } else {
      const input = $('answer-input');
      input.value = answers[unit.id] === DONT_KNOW ? '' : answers[unit.id] || '';
      if (unit.placeholder) input.placeholder = unit.placeholder;
    }
    if (questionTab) questionTab.textContent = `${counter} ${allUnits.indexOf(unit) + 1}`;
    // one task on its own (the writing task): just its name
    $('count').textContent = allUnits.length === 1
      ? counter
      : `${counter} ${allUnits.indexOf(unit) + 1} מתוך ${allUnits.length}`;
    updateWordCount();
    // the last question's button: "סיום" when nothing follows, or the page's data-next-label (the writing task)
    const last = current === units.length - 1;
    $('next-label').textContent = last && (!nextPage || document.body.dataset.nextLabel)
      ? document.body.dataset.nextLabel || 'סיום'
      : 'שאלה הבאה';
  }

  // the writing task (data.js words: [min, max]): how many words so far, green once in the range
  function updateWordCount() {
    const out = $('word-count');
    const unit = units[current];
    if (!out || !unit.words) return;
    const text = $('answer-input').value.trim();
    const n = text ? text.split(/\s+/).length : 0;
    const [min, max] = unit.words;
    out.textContent = `מילים: ${n} מתוך ${min}–${max}`;
    out.classList.toggle('wz-fr-wordcount-ok', n >= min && n <= max);
  }

  function onAnswer(e) {
    updateWordCount();
    const unit = units[current];
    if (e.target.dataset.field) {
      // several fields: { a: '...', b: '...' }, every field present so the progress counts it only when all have text
      const value = answers[unit.id] && typeof answers[unit.id] === 'object'
        ? answers[unit.id]
        : Object.fromEntries(unit.fields.filter((f) => !f.example).map((f) => [f.id, '']));
      value[e.target.dataset.field] = e.target.value;
      answers[unit.id] = value;
    } else {
      answers[unit.id] = e.target.value;
    }
    WZFrame.save();
    updateProgress();
  }
  answerEl.addEventListener('change', onAnswer);
  answerEl.addEventListener('input', onAnswer);

  // a click on a radio tile's padding picks its radio too (the DS label covers only the radio and text)
  answerEl.addEventListener('click', (e) => {
    const tile = e.target.closest('.wz-option');
    if (tile && !e.target.closest('.ds-radio')) tile.querySelector('.ds-radio-input').click();
  });

  // the next / previous question slides in, and the focus moves to its title
  const show = (i) => () => { current = i; render(); WZFrame.focusTitle($('statement')); };
  $('prev').addEventListener('click', () => {
    if (current > 0) WZFrame.swap(stage, 'prev', show(current - 1));
    else WZFrame.swap(stage, 'prev', () => WZFrame.go(`${prevPage}#last`, 'prev'));
  });
  function goNext() {
    if (current < units.length - 1) WZFrame.swap(stage, 'next', show(current + 1));
    else if (nextPage) WZFrame.swap(stage, 'next', () => WZFrame.go(nextPage, 'next'));
    else DS.showToast({ type: 'success', message: `סיימת את ${group.label}` });
  }
  $('next').addEventListener('click', goNext);

  // "לא יודע/ת": record it (any answer on this question is cleared) and move on
  if ($('dont-know')) {
    $('dont-know').addEventListener('click', () => {
      answers[units[current].id] = DONT_KNOW;
      WZFrame.save();
      updateProgress();
      goNext();
    });
  }

  render();
  // came from the page before / after: this page's question slides in from the same side
  const arrivedFrom = WZFrame.arrived();
  if (arrivedFrom) { WZFrame.enter(stage, arrivedFrom); WZFrame.focusTitle($('statement')); }

  // every question on the page gets the panel height of the tallest one, so the frame never jumps between
  // questions; on short windows, where the tallest question needs more room than there is, the page scrolls
  // by the same amount on every question
  const panel = answerEl.closest('.wz-fr-panel');
  function contentHeight() {
    const cs = getComputedStyle(panel);
    const kids = [...panel.children].filter((k) => getComputedStyle(k).position !== 'absolute'); // not the tag
    return kids.reduce((h, k) => h + k.getBoundingClientRect().height, 0)
      + parseFloat(cs.rowGap || 0) * (kids.length - 1)
      + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  }
  function equalizeHeight() {
    if (!panel || units.length < 2) return;
    const focused = answerEl.contains(document.activeElement)
      ? [...answerEl.querySelectorAll('input, textarea')].indexOf(document.activeElement) : -1;
    const shown = current;
    let tallest = 0;
    panel.style.minHeight = '';
    units.forEach((_, i) => { current = i; render(); tallest = Math.max(tallest, contentHeight()); });
    current = shown;
    render();
    panel.style.minHeight = `${Math.ceil(tallest)}px`;
    if (focused >= 0) answerEl.querySelectorAll('input, textarea')[focused]?.focus();
  }
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(equalizeHeight, 100); });
  document.fonts.ready.then(equalizeHeight); // measure with the page font in place
})();

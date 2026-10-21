/* frame.js - the Figma frame "שאלון אנגלית": the feelings questionnaire, one statement per screen.
   Statements come from data.js (stage "intro"). Answers are kept for the session (frame-shared.js);
   the first stage segment fills as you answer. After the last statement, "שאלה הבאה" opens frame2.html;
   "הקודם" on the first statement goes back to the welcome screen (frame0.html). */

(function () {
  const A = window.ASSESSMENT;
  const group = A.stages[0].groups[0];
  const items = group.units[0].items;
  const answers = WZFrame.answers(group.id);
  let current = WZFrame.startAtLast ? items.length - 1 : 0;

  const $ = (id) => document.getElementById(id);
  const statement = $('statement');
  const options = $('options');
  const updateProgress = WZFrame.stepper($('stepper'), 0, group.id);

  // ---- One statement ---------------------------------------------------------------------------
  function render() {
    const item = items[current];
    statement.textContent = item.text;
    options.replaceChildren(...item.options.map((option) => {
      // Answer tile without a radio circle: the whole tile is the choice. A visually hidden radio keeps
      // keyboard (arrow keys) and screen-reader support.
      const tile = document.createElement('label');
      tile.className = 'wz-option wz-fr-option wz-fr-option-plain';
      tile.innerHTML = `
        <input type="radio" class="wz-visually-hidden" name="${item.id}" value="${option}">
        <span class="wz-fr-text wz-fr-text-plain">${option}</span>`;
      tile.querySelector('input').checked = answers[item.id] === option;
      return tile;
    }));

    $('count').textContent = `שאלה ${current + 1} מתוך ${items.length}`;
  }

  options.addEventListener('change', (e) => {
    answers[items[current].id] = e.target.value;
    WZFrame.save();
    updateProgress();
  });

  // the next / previous statement slides in (frame-shared.js), and the focus moves to it
  const stage = document.querySelector('.wz-fr-question');
  const show = (i) => () => { current = i; render(); WZFrame.focusTitle(statement); };
  $('prev').addEventListener('click', () => {
    if (current > 0) WZFrame.swap(stage, 'prev', show(current - 1));
    else WZFrame.swap(stage, 'prev', () => WZFrame.go('frame0.html', 'prev')); // back to the welcome screen
  });
  $('next').addEventListener('click', () => {
    if (current < items.length - 1) WZFrame.swap(stage, 'next', show(current + 1));
    else WZFrame.swap(stage, 'next', () => WZFrame.go('frame2.html', 'next')); // next stage: listening
  });

  render();
  // came back from frame2.html: the last statement slides in
  const arrivedFrom = WZFrame.arrived();
  if (arrivedFrom) { WZFrame.enter(stage, arrivedFrom); WZFrame.focusTitle(statement); }
})();

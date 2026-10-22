/* frame-finish.js - the finish screen (frame11.html) with 2 stages:
   Stage 1: Review & Submit ("כל הכבוד, השלמתם את השאלון!", "חזרה לשאלות", "הגשת השאלון")
   Stage 2: Processing ("התשובות נשמרו...", "מעבדים את התשובות בהאזנה…") */

(function () {
  const A = window.ASSESSMENT;
  WZFrame.stepper(document.getElementById('stepper'), A.stages.length); // all stages full and checked

  const stage1 = document.getElementById('finish-stage-1');
  const stage2 = document.getElementById('finish-stage-2');
  const backBtn = document.getElementById('back-to-questions');
  const submitBtn = document.getElementById('submit-assessment');
  const processingText = document.getElementById('processing-text');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      WZFrame.go('frame-oral.html#last', 'prev');
    });
  }

  // Processing stage phrases cycle
  const stagesProcessing = [
    'מעבדים את התשובות בהאזנה…',
    'מעבדים את התשובות בקריאה…',
    'מעבדים את התשובות בדיבור…',
    'מעבדים את התשובות בכתיבה…',
  ];

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      stage1.hidden = true;
      stage2.hidden = false;
      WZFrame.focusTitle(document.getElementById('finish-title-2'));

      let idx = 0;
      setInterval(() => {
        idx = (idx + 1) % stagesProcessing.length;
        if (processingText) processingText.textContent = stagesProcessing[idx];
      }, 3000);
    });
  }

  // Start with focus on main title
  if (WZFrame.arrived()) WZFrame.focusTitle(document.getElementById('finish-title-1'));
})();

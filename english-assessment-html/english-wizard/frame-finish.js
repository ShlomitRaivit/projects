/* frame-finish.js - the finish screen (frame11.html), after the writing task.
   Every stage of the progress bar is full. "חזרה לשאלות" goes back to the last question (the writing task);
   "להמשך הלמידה" leads nowhere yet (a toast, through data-toast in frame-shared.js). */

(function () {
  const A = window.ASSESSMENT;
  WZFrame.stepper(document.getElementById('stepper'), A.stages.length); // past the last stage: all done

  document.getElementById('back-to-questions').addEventListener('click', () => {
    WZFrame.go('frame10.html#last', 'prev');
  });

  // arrived from the writing task: the screen reader starts at the heading
  if (WZFrame.arrived()) WZFrame.focusTitle(document.getElementById('finish-title'));
})();

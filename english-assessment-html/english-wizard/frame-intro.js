/* frame-intro.js - the welcome screen (frame0.html), before the feelings questionnaire.
   "מתחילים" opens frame.html. */

(function () {
  document.getElementById('start').addEventListener('click', () => WZFrame.go('frame.html', 'next'));

  // came back from the first question: the screen reader starts at the heading
  if (WZFrame.arrived()) WZFrame.focusTitle(document.getElementById('intro-title'));
})();

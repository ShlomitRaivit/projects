/* app.js - behavior for the starter page. Replace with your prototype's behavior.
   The DS (ds/ds.js) already handles the select, modal, toast and theme toggle;
   this file only fills the page from data.js and reacts to DS events. */

(function () {
  var data = window.APP_DATA;
  var state = { visibility: '' };

  // ----- Fill the page from data.js -----
  document.title = data.product.name;
  document.getElementById('product-name').textContent = data.product.name;
  document.getElementById('project-name').value = data.project.name;

  // Sidebar navigation
  var nav = document.getElementById('app-nav');
  data.nav.forEach(function (item) {
    var link = document.createElement('a');
    link.className = 'app-nav-item';
    link.href = item.href;
    if (item.current) link.setAttribute('aria-current', 'page');

    var icon = document.createElement('ds-icon');
    icon.setAttribute('name', item.icon);
    var label = document.createElement('span');
    label.textContent = item.label;

    link.appendChild(icon);
    link.appendChild(label);
    nav.appendChild(link);
  });

  // Select options. A preselected option needs its label in the trigger,
  // aria-selected="true" and a check icon (see the Select section of DS-GUIDE.md).
  var menu = document.querySelector('#visibility-select .ds-select-menu');
  var triggerLabel = document.querySelector('#visibility-select .ds-select > span');
  data.project.visibilityOptions.forEach(function (opt) {
    var item = document.createElement('button');
    item.className = 'ds-select-item';
    item.setAttribute('role', 'option');
    item.setAttribute('data-value', opt.value);

    var label = document.createElement('span');
    label.className = 'ds-select-item-label';
    label.textContent = opt.label;
    item.appendChild(label);

    if (opt.selected) {
      item.setAttribute('aria-selected', 'true');
      var check = document.createElement('ds-icon');
      check.className = 'ds-select-item-trailing';
      check.setAttribute('name', 'check');
      check.setAttribute('size', '16');
      item.appendChild(check);
      triggerLabel.textContent = opt.label;
      state.visibility = opt.label;
    }
    menu.appendChild(item);
  });

  // ----- React to DS events -----

  // The select fired ds-change: remember the new choice.
  document.addEventListener('ds-change', function (e) {
    if (e.target.id === 'visibility-select') state.visibility = e.detail.label;
  });

  // The modal opened: show what is about to be saved.
  document.addEventListener('ds-open', function (e) {
    if (e.target.id !== 'save-modal') return;
    var name = document.getElementById('project-name').value;
    document.getElementById('save-summary').textContent =
      'Save "' + name + '" with visibility set to ' + state.visibility + '?';
  });

  // ----- Clicks -----
  document.addEventListener('click', function (e) {
    // Save in the modal: the DS closes the modal, we show the toast.
    if (e.target.closest('[data-action="confirm-save"]')) {
      DS.showToast({ type: 'success', message: 'Changes saved' });
    }
    // Placeholder links (href="#") do nothing. Point them at real pages when you add them.
    var link = e.target.closest('a[href="#"]');
    if (link) e.preventDefault();
  });
})();

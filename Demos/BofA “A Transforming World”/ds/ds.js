/* ============================================
   ds.js - Design System behavior
   Classic script (no modules, no build). Works over file://.
   All behavior is event-delegated on `document`, so components
   added to the page later work with no init call.

   Public API:   window.DS  { version, setTheme, getTheme, showToast, openModal, closeModal }
   Custom events (bubble):
     ds-change        select / tabs / segmented / switch / pagination   detail: { value, label }
     ds-open          modal opened                                       detail: { id }
     ds-close         modal closed                                       detail: { id, reason }
     ds-theme-change  fired on document                                  detail: { theme }
   Web component:  <ds-icon name="settings" size="16|24"></ds-icon>  (needs ds-icons.js)
   ============================================ */
(function () {
  'use strict';

  if (window.DS && window.DS.version) return; // already loaded

  var doc = document;
  var root = doc.documentElement;

  /* ---------- helpers ---------- */

  function emit(el, name, detail) {
    el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail }));
  }

  function textOf(el) {
    return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  // value = data-value if present, otherwise the visible label
  function valueOf(el, label) {
    return el.hasAttribute('data-value') ? el.getAttribute('data-value') : label;
  }

  function isDisabled(el) {
    return el.disabled || el.getAttribute('aria-disabled') === 'true';
  }

  function isVisible(el) {
    return el.getClientRects().length > 0;
  }

  // Move focus along a list. key: ArrowDown/Right = next, ArrowUp/Left = previous, Home, End.
  function stepIndex(key, index, length) {
    if (key === 'Home') return 0;
    if (key === 'End') return length - 1;
    if (key === 'ArrowDown' || key === 'ArrowRight') return (index + 1) % length;
    return (index - 1 + length) % length;
  }

  /* ---------- theme ---------- */

  function getTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn('[DS] setTheme expects "light" or "dark", got:', theme);
      return;
    }
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    emit(doc, 'ds-theme-change', { theme: theme });
  }

  /* ---------- <ds-icon> ---------- */

  var warned = {};

  function renderIcon(el) {
    var size = el.getAttribute('size') === '16' ? 16 : 24;
    var name = el.getAttribute('name');
    var registry = window.DS_ICONS;
    if (!registry || !name) { el.innerHTML = ''; return; }

    var svg = (registry[size] && registry[size][name]) || (registry[24] && registry[24][name]);
    if (!svg) {
      if (!warned[name]) {
        warned[name] = true;
        console.warn('[DS] <ds-icon>: unknown icon "' + name + '"');
      }
      el.innerHTML = '';
      return;
    }
    var attrs = ' width="' + size + '" height="' + size + '"' +
      (el.hasAttribute('aria-label') ? ' role="img"' : ' aria-hidden="true"');
    el.innerHTML = svg.replace('<svg', '<svg' + attrs);
  }

  if (window.customElements && !customElements.get('ds-icon')) {
    customElements.define('ds-icon', class extends HTMLElement {
      static get observedAttributes() { return ['name', 'size']; }
      connectedCallback() { renderIcon(this); }
      attributeChangedCallback() { if (this.isConnected) renderIcon(this); }
    });
  }

  // ds-icons.js may load after ds.js
  doc.addEventListener('ds-icons-ready', function () {
    toArray(doc.querySelectorAll('ds-icon')).forEach(renderIcon);
  });

  /* ---------- select ---------- */

  var OPEN = 'ds-select-open';
  var ITEM_SELECTOR = 'button.ds-select-item, .ds-switch-track, input.ds-checkbox-input';

  function selectItems(wrapper) {
    var menu = wrapper.querySelector('.ds-select-menu');
    if (!menu) return [];
    return toArray(menu.querySelectorAll(ITEM_SELECTOR)).filter(function (el) {
      return !isDisabled(el) && !el.closest('[aria-disabled="true"]');
    });
  }

  function closeSelect(wrapper, returnFocus) {
    var trigger = wrapper.querySelector('.ds-select');
    wrapper.classList.remove(OPEN);
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) trigger.focus();
    }
  }

  function closeSelects(except) {
    toArray(doc.querySelectorAll('.' + OPEN)).forEach(function (w) {
      if (w !== except) closeSelect(w);
    });
  }

  function openSelect(wrapper, focusItem) {
    var trigger = wrapper.querySelector('.ds-select');
    if (!trigger || isDisabled(trigger)) return;
    closeSelects(wrapper);
    wrapper.classList.add(OPEN);
    trigger.setAttribute('aria-expanded', 'true');
    if (focusItem) {
      var items = selectItems(wrapper);
      var el = focusItem === 'last' ? items[items.length - 1] : items[0];
      if (el) el.focus();
    }
  }

  function pickOption(item, viaKeyboard) {
    var wrapper = item.closest('.ds-select-wrapper');
    if (!wrapper) return;
    var trigger = wrapper.querySelector('.ds-select');
    var menu = wrapper.querySelector('.ds-select-menu');
    var label = textOf(item.querySelector('.ds-select-item-label'));

    var triggerLabel = trigger.querySelector('span');
    if (triggerLabel) triggerLabel.textContent = label;

    // move the check mark to the picked item
    toArray(menu.querySelectorAll('.ds-select-item-trailing')).forEach(function (n) { n.remove(); });
    toArray(menu.querySelectorAll('[role="option"]')).forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
    item.setAttribute('aria-selected', 'true');
    var check = doc.createElement('ds-icon');
    check.setAttribute('name', 'check');
    check.setAttribute('size', '16');
    check.className = 'ds-select-item-trailing';
    item.appendChild(check);

    closeSelect(wrapper, viaKeyboard);
    emit(wrapper, 'ds-change', { value: valueOf(item, label), label: label });
  }

  doc.addEventListener('click', function (e) {
    var target = e.target;
    if (!target.closest) return;

    // close every open select except the one we clicked inside
    closeSelects(target.closest('.ds-select-wrapper'));

    var trigger = target.closest('.ds-select-wrapper > .ds-select');
    if (trigger && !isDisabled(trigger)) {
      var wrapper = trigger.parentElement;
      if (wrapper.classList.contains(OPEN)) closeSelect(wrapper);
      else openSelect(wrapper, e.detail === 0 ? 'first' : null); // detail 0 = keyboard activation
      return;
    }

    var item = target.closest('.ds-select-item[role="option"]');
    if (item && !isDisabled(item)) pickOption(item, e.detail === 0);
  });

  // keyboard: Escape / arrows / Home / End / Enter
  doc.addEventListener('keydown', function (e) {
    var key = e.key;
    var wrapper = e.target.closest ? e.target.closest('.ds-select-wrapper') : null;

    if (key === 'Escape') {
      var open = (wrapper && wrapper.classList.contains(OPEN)) ? wrapper : doc.querySelector('.' + OPEN);
      if (open) {
        closeSelect(open, true);
        e.preventDefault(); // tells the modal handler this Escape was already used
      }
      return;
    }
    if (!wrapper) return;

    if (e.target.matches('.ds-select')) {
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        openSelect(wrapper, key === 'ArrowUp' ? 'last' : 'first');
      }
      return;
    }

    if (!wrapper.classList.contains(OPEN)) return;

    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
      var items = selectItems(wrapper);
      if (!items.length) return;
      e.preventDefault();
      var i = items.indexOf(doc.activeElement);
      if (i < 0) i = key === 'ArrowUp' ? 0 : -1;
      items[stepIndex(key, i, items.length)].focus();
    } else if (key === 'Enter' && e.target.matches('.ds-checkbox-input')) {
      e.preventDefault();
      e.target.click(); // checkboxes only toggle on Space natively
    }
  });

  // Tabbing out of an open select closes it
  doc.addEventListener('focusout', function (e) {
    var wrapper = e.target.closest ? e.target.closest('.ds-select-wrapper.' + OPEN) : null;
    if (wrapper && e.relatedTarget && !wrapper.contains(e.relatedTarget)) closeSelect(wrapper);
  });

  // multi-select: checkboxes inside a menu report the full checked set
  doc.addEventListener('change', function (e) {
    var cb = e.target;
    if (!cb.matches || !cb.matches('.ds-select-menu .ds-checkbox-input')) return;
    var wrapper = cb.closest('.ds-select-wrapper');
    if (!wrapper) return;
    var picked = toArray(wrapper.querySelectorAll('.ds-select-menu .ds-checkbox-input:checked')).map(function (c) {
      var item = c.closest('.ds-select-item');
      var label = textOf(item && item.querySelector('.ds-select-item-label'));
      return { value: item ? valueOf(item, label) : label, label: label };
    });
    emit(wrapper, 'ds-change', {
      value: picked.map(function (p) { return p.value; }),
      label: picked.map(function (p) { return p.label; }).join(', ')
    });
  });

  /* ---------- tabs + segmented control (same pattern) ---------- */

  var GROUPS = [
    { item: '.ds-tab[role="tab"]',                   list: '[role="tablist"]',   attr: 'aria-selected' },
    { item: '.ds-segmented-item[role="radio"]',      list: '[role="radiogroup"]', attr: 'aria-checked' }
  ];

  function selectInGroup(cfg, item, focus) {
    var list = item.closest(cfg.list);
    if (!list) return;
    var wasSelected = item.getAttribute(cfg.attr) === 'true';
    toArray(list.querySelectorAll(cfg.item)).forEach(function (i) { i.setAttribute(cfg.attr, 'false'); });
    item.setAttribute(cfg.attr, 'true');
    if (focus) item.focus();
    if (wasSelected) return; // no change, no event
    var label = textOf(item.querySelector('span')) || item.getAttribute('aria-label') || textOf(item);
    emit(list, 'ds-change', { value: valueOf(item, label), label: label });
  }

  GROUPS.forEach(function (cfg) {
    doc.addEventListener('click', function (e) {
      var item = e.target.closest && e.target.closest(cfg.item);
      if (item && !isDisabled(item)) selectInGroup(cfg, item, false);
    });

    doc.addEventListener('keydown', function (e) {
      var item = e.target.closest && e.target.closest(cfg.item);
      if (!item) return;
      var k = e.key;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].indexOf(k) < 0) return;
      var list = item.closest(cfg.list);
      var items = toArray(list.querySelectorAll(cfg.item)).filter(function (i) { return !isDisabled(i); });
      if (!items.length) return;
      e.preventDefault();
      var key = k === 'ArrowUp' ? 'ArrowLeft' : k === 'ArrowDown' ? 'ArrowRight' : k;
      var next = items[stepIndex(key, items.indexOf(item), items.length)];
      selectInGroup(cfg, next, true);
    });
  });

  /* ---------- switch ---------- */

  function setSwitch(btn, on) {
    btn.classList.toggle('ds-switch-on', on);
    btn.classList.toggle('ds-switch-off', !on);
    btn.setAttribute('aria-checked', String(on));
  }

  doc.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.ds-switch-track[role="switch"]');
    if (!btn || btn.disabled) return;
    var on = !btn.classList.contains('ds-switch-on');
    setSwitch(btn, on);
    var content = btn.closest('.ds-switch, .ds-select-item');
    var label = textOf(content && content.querySelector('.ds-switch-label, .ds-select-item-label'));
    emit(btn, 'ds-change', { value: on, label: label });
  });

  /* ---------- data table ---------- */

  function setRowSelected(cb) {
    var row = cb.closest('tr');
    if (row) row.classList.toggle('ds-table-row-selected', cb.checked);
  }

  doc.addEventListener('change', function (e) {
    var cb = e.target;
    if (!cb.matches) return;

    if (cb.matches('.ds-table-row-cb')) {
      setRowSelected(cb);
      return;
    }
    // select-all: a checkbox in the table header
    if (cb.matches('.ds-table thead .ds-checkbox-input')) {
      var table = cb.closest('.ds-table');
      toArray(table.querySelectorAll('.ds-table-row-cb')).forEach(function (r) {
        r.checked = cb.checked;
        setRowSelected(r);
      });
    }
  });

  /* ---------- pagination ---------- */

  doc.addEventListener('click', function (e) {
    var page = e.target.closest && e.target.closest('.ds-table-page');
    if (!page || page.disabled || !/^\d+$/.test(page.textContent.trim())) return;
    var bar = page.closest('.ds-table-pagination');
    if (!bar || page.getAttribute('aria-current') === 'page') return;
    toArray(bar.querySelectorAll('.ds-table-page')).forEach(function (p) { p.removeAttribute('aria-current'); });
    page.setAttribute('aria-current', 'page');
    var n = page.textContent.trim();
    emit(bar, 'ds-change', { value: Number(n), label: n });
  });

  /* ---------- toast ----------
     DS.showToast(element)   clone a .ds-ack-floating and show it fixed at the top (stays until dismissed)
     DS.showToast({ type: 'info'|'error'|'success'|'warning', message, linkText, linkHref, duration })
                             build one from options; duration in ms (default 5000, 0 = stay)
     Markup trigger: <div class="ds-ack ds-ack-floating ds-ack-info" data-ds-toast>…</div>  */

  var toastTimer = null;

  function dismissToast(toast) {
    if (!toast || !toast.parentNode || toast.getAttribute('data-leaving')) return;
    toast.setAttribute('data-leaving', 'true');
    clearTimeout(toastTimer);
    toast.style.animation = 'ds-toast-out var(--ds-duration-exit) var(--ds-ease-out) forwards';
    var removed = false;
    function remove() { if (!removed) { removed = true; toast.remove(); } }
    toast.addEventListener('animationend', remove);
    setTimeout(remove, 600); // fallback when animations are disabled
  }

  function buildToast(opts) {
    var type = ['info', 'error', 'success', 'warning'].indexOf(opts.type) >= 0 ? opts.type : 'info';
    var toast = doc.createElement('div');
    toast.className = 'ds-ack ds-ack-floating ds-ack-' + type;

    var text = doc.createElement('span');
    text.className = 'ds-ack-text';
    text.textContent = opts.message || '';
    toast.appendChild(text);

    if (opts.linkText) {
      var link = doc.createElement('a');
      link.className = 'ds-ack-link';
      link.href = opts.linkHref || '#';
      link.textContent = opts.linkText;
      toast.appendChild(link);
    }

    var dismiss = doc.createElement('button');
    dismiss.className = 'ds-ack-dismiss';
    dismiss.setAttribute('aria-label', 'Dismiss');
    var x = doc.createElement('ds-icon');
    x.setAttribute('name', 'clear');
    dismiss.appendChild(x);
    toast.appendChild(dismiss);
    return toast;
  }

  function showToast(arg) {
    var fromElement = arg instanceof Element;
    if (fromElement && arg.classList.contains('ds-toast-active')) return;

    var existing = doc.querySelector('.ds-toast-active');
    if (existing) existing.remove();
    clearTimeout(toastTimer);

    var toast;
    if (fromElement) {
      toast = arg.cloneNode(true);
      toast.style.cursor = '';
      toast.removeAttribute('data-ds-toast');
      toast.removeAttribute('onclick');
    } else {
      toast = buildToast(arg || {});
    }
    toast.classList.add('ds-toast-active');
    toast.setAttribute('role', 'status');
    doc.body.appendChild(toast);

    var duration = fromElement ? 0 : (arg && typeof arg.duration === 'number' ? arg.duration : 5000);
    if (duration > 0) toastTimer = setTimeout(function () { dismissToast(toast); }, duration);
    return toast;
  }

  doc.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var dismiss = t.closest('.ds-toast-active .ds-ack-dismiss');
    if (dismiss) {
      e.stopPropagation();
      dismissToast(dismiss.closest('.ds-toast-active'));
      return;
    }
    var trigger = t.closest('[data-ds-toast]');
    if (trigger) showToast(trigger);
  });

  // theme toggle button: <button data-ds-theme-toggle>
  doc.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-ds-theme-toggle]')) {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    }
  });

  /* ---------- modal ----------
     Open:   DS.openModal('my-modal')   or   <button data-ds-open="my-modal">
     Close:  DS.closeModal()            or   any element with [data-ds-close] inside the modal
             (the backdrop and the header close button already have it), or press Escape.
     Focus is trapped inside while open and returned to the opener on close. */

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var modalStack = []; // { el, opener }

  function focusableIn(el) {
    return toArray(el.querySelectorAll(FOCUSABLE)).filter(function (n) {
      return isVisible(n) && !n.closest('[aria-disabled="true"]');
    });
  }

  function topModal() {
    return modalStack.length ? modalStack[modalStack.length - 1] : null;
  }

  function openModal(id, opener) {
    var el = typeof id === 'string' ? doc.getElementById(id) : id;
    if (!el || !el.classList.contains('ds-modal')) {
      console.warn('[DS] openModal: no .ds-modal with id "' + id + '"');
      return;
    }
    if (!el.hasAttribute('hidden')) return; // already open

    el.removeAttribute('hidden');
    modalStack.push({ el: el, opener: opener || doc.activeElement });
    root.classList.add('ds-modal-open');

    var dialog = el.querySelector('.ds-modal-dialog');
    if (dialog && !dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
    var first = el.querySelector('[autofocus]') || focusableIn(dialog || el)[0] || dialog;
    if (first) first.focus();

    emit(el, 'ds-open', { id: el.id });
    return el;
  }

  function closeModal(id, reason) {
    var entry = null;
    if (id) {
      var target = typeof id === 'string' ? doc.getElementById(id) : id;
      for (var i = modalStack.length - 1; i >= 0; i--) {
        if (modalStack[i].el === target) { entry = modalStack.splice(i, 1)[0]; break; }
      }
    } else {
      entry = modalStack.pop();
    }
    if (!entry) return;

    entry.el.setAttribute('hidden', '');
    if (!modalStack.length) root.classList.remove('ds-modal-open');
    if (entry.opener && entry.opener.focus && doc.contains(entry.opener)) entry.opener.focus();
    emit(entry.el, 'ds-close', { id: entry.el.id, reason: reason || 'api' });
  }

  doc.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;

    var opener = t.closest('[data-ds-open]');
    if (opener) {
      e.preventDefault();
      openModal(opener.getAttribute('data-ds-open'), opener);
      return;
    }
    var closer = t.closest('[data-ds-close]');
    if (closer) {
      var modal = closer.closest('.ds-modal');
      if (modal) closeModal(modal, closer.classList.contains('ds-modal-backdrop') ? 'backdrop' : 'button');
    }
  });

  doc.addEventListener('keydown', function (e) {
    var top = topModal();
    if (!top) return;

    if (e.key === 'Escape') {
      if (e.defaultPrevented) return; // an open select inside the modal used this Escape
      e.preventDefault();
      closeModal(top.el, 'escape');
      return;
    }

    if (e.key === 'Tab') {
      var dialog = top.el.querySelector('.ds-modal-dialog') || top.el;
      var items = focusableIn(dialog);
      if (!items.length) { e.preventDefault(); dialog.focus(); return; }
      var firstEl = items[0];
      var lastEl = items[items.length - 1];
      var active = doc.activeElement;
      if (e.shiftKey && (active === firstEl || active === dialog)) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      } else if (!dialog.contains(active)) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  });

  // If focus escapes the dialog (click on the page, script), pull it back. Toasts are allowed.
  doc.addEventListener('focusin', function (e) {
    var top = topModal();
    if (!top || top.el.contains(e.target)) return;
    if (e.target.closest && e.target.closest('.ds-toast-active')) return;
    var dialog = top.el.querySelector('.ds-modal-dialog') || top.el;
    var items = focusableIn(dialog);
    (items[0] || dialog).focus();
  });

  /* ---------- public API ---------- */

  window.DS = {
    version: '1.0.0',
    setTheme: setTheme,
    getTheme: getTheme,
    showToast: showToast,
    openModal: openModal,
    closeModal: closeModal
  };
})();

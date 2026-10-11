/* ------------------------------------------------------------
   Modal — reusable dialog with optional type-to-confirm
   Usage:
     Modal.show({
       title: 'Reset?',
       message: 'HTML-safe string from developer',
       confirmText: 'Reset',
       cancelText: 'Cancel',
       danger: true,
       requireTypedText: 'DELETE',
       onConfirm: () => { ... },
       onCancel: () => { ... }
     })
   ------------------------------------------------------------ */
const Modal = (() => {
  let overlayEl = null;

  function close() {
    if (overlayEl && overlayEl.parentNode) {
      overlayEl.parentNode.removeChild(overlayEl);
    }
    overlayEl = null;
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') close();
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function show(opts) {
    close();
    const o = Object.assign({
      title: 'Confirm',
      message: '',            /* developer-provided HTML — safe */
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      danger: false,
      requireTypedText: null, /* string, or null to disable */
      onConfirm: null,
      onCancel: null
    }, opts || {});

    overlayEl = document.createElement('div');
    overlayEl.className = 'modal-overlay';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');

    const typedBlock = o.requireTypedText
      ? `<div class="modal-typed">
           <label for="modal-typed-input" class="modal-typed-label">
             Type <code>${escapeHtml(o.requireTypedText)}</code> to confirm:
           </label>
           <input type="text" id="modal-typed-input" class="modal-typed-input"
                  autocomplete="off" spellcheck="false" autocapitalize="characters">
         </div>`
      : '';

    overlayEl.innerHTML = `
      <div class="modal-card ${o.danger ? 'modal-danger' : ''}">
        <div class="modal-header">
          <h3 class="modal-title">${escapeHtml(o.title)}</h3>
          <button class="modal-close" type="button" aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          ${o.message || ''}
          ${typedBlock}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-modal-cancel type="button">${escapeHtml(o.cancelText)}</button>
          <button class="btn ${o.danger ? 'btn-danger' : 'btn-primary'}" data-modal-confirm type="button"
                  ${o.requireTypedText ? 'disabled' : ''}>${escapeHtml(o.confirmText)}</button>
        </div>
      </div>`;

    document.body.appendChild(overlayEl);
    document.addEventListener('keydown', onKeyDown);

    const confirmBtn = overlayEl.querySelector('[data-modal-confirm]');
    const cancelBtn  = overlayEl.querySelector('[data-modal-cancel]');
    const closeBtn   = overlayEl.querySelector('.modal-close');
    const typedInput = overlayEl.querySelector('#modal-typed-input');

    function normalize(v) { return String(v || '').trim().toUpperCase(); }

    function doConfirm() {
      if (o.requireTypedText && typedInput &&
          normalize(typedInput.value) !== normalize(o.requireTypedText)) return;
      const cb = o.onConfirm;
      close();
      if (cb) cb();
    }
    function doCancel() {
      const cb = o.onCancel;
      close();
      if (cb) cb();
    }

    confirmBtn.addEventListener('click', doConfirm);
    cancelBtn.addEventListener('click', doCancel);
    closeBtn.addEventListener('click', doCancel);
    overlayEl.addEventListener('click', (e) => {
      if (e.target === overlayEl) doCancel();
    });

    if (typedInput) {
      typedInput.addEventListener('input', () => {
        confirmBtn.disabled = normalize(typedInput.value) !== normalize(o.requireTypedText);
      });
      typedInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !confirmBtn.disabled) doConfirm();
      });
      setTimeout(() => typedInput.focus(), 60);
    }
  }

  return { show, close };
})();

window.Modal = Modal;
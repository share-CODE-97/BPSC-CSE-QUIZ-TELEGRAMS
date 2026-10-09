/* ------------------------------------------------------------
   Keyboard — screen-scoped keybindings
   Screens call Keyboard.bind({...}) to set handlers for keys.
   App.navigate() calls Keyboard.unbind() before each new screen,
   so bindings never leak between views.
   ------------------------------------------------------------ */
const Keyboard = (() => {
  let activeBindings = null;

  function bind(bindings) {
    unbind();
    activeBindings = bindings;
    document.addEventListener('keydown', onKeyDown);
  }

  function unbind() {
    document.removeEventListener('keydown', onKeyDown);
    activeBindings = null;
  }

  function onKeyDown(e) {
    if (!activeBindings) return;
    if (e.repeat) return;

    /* Don't hijack keys while the user is typing in a form field */
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;

    /* Let browser shortcuts (Ctrl+C, etc.) through */
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    /* Don't fire Enter when a real button is focused —
       the browser will click it, and we'd double-navigate. */
    if (e.key === 'Enter' && tag === 'button') return;

    /* Look up by exact key first (ArrowLeft), then lowercase (a → A) */
    const handler =
      activeBindings[e.key] ||
      activeBindings[e.key.toLowerCase()];

    if (handler) {
      e.preventDefault();
      handler(e);
    }
  }

  return { bind, unbind };
})();

window.Keyboard = Keyboard;
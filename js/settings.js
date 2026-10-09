/* ------------------------------------------------------------
   Settings — theme + quiz defaults + settings screen
   ------------------------------------------------------------ */
const Settings = (() => {
  const THEME_KEY = 'cse_quiz_theme';
  const DEFAULTS_KEY = 'cse_quiz_defaults';
    let saveMsgTimer = null;

  const DEFAULT_THEME = 'system';
  const DEFAULT_PREFS = {
    defaultCount: 10,
    defaultPositive: 1,
    defaultNegative: 0.25,
    defaultTimerEnabled: false,
    defaultTimerMinutes: 15
  };

  /* ---------- Theme ---------- */
  function getTheme() {
    return Storage.get(THEME_KEY, DEFAULT_THEME);
  }
  function setTheme(theme) {
    Storage.set(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleButton();
  }
  function toggleTheme() {
    const order = ['system', 'dark', 'light'];
    const current = getTheme();
    const next = order[(order.indexOf(current) + 1) % order.length];
    setTheme(next);
  }
  function updateToggleButton() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const t = getTheme();
    const labels = {
      system: '📱 Auto',
      dark:   '🌙 Dark',
      light:  '☀ Light'
    };
    btn.textContent = labels[t] || labels.system;
    btn.setAttribute('aria-label', `Theme: ${labels[t] || 'Auto'}. Click to change.`);
  }

  /* ---------- Quiz defaults ---------- */
  function getPrefs() {
    return { ...DEFAULT_PREFS, ...Storage.get(DEFAULTS_KEY, {}) };
  }
  function updatePrefs(patch) {
    const next = { ...getPrefs(), ...patch };
    Storage.set(DEFAULTS_KEY, next);
    return next;
  }
  function resetPrefs() {
    Storage.remove(DEFAULTS_KEY);
  }

  /* ---------- Export all data as a .json file ---------- */
  function formatIndianDateTime(d) {
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  function formatIndianFilename(d) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(d);
    const get = t => parts.find(p => p.type === t).value;
    return `${get('year')}-${get('month')}-${get('day')}-${get('hour')}${get('minute')}`;
  }

  function exportData() {
    const keys = [
      'cse_quiz_theme',
      'cse_quiz_defaults',
      'cse_quiz_bookmarks',
      'cse_quiz_wrong',
      'cse_quiz_question_stats',
      'cse_quiz_history',
      'cse_quiz_ai_settings',
      'cse_quiz_ai_explanations',
      'cse_quiz_last_export'
    ];
    const now = new Date();
    const backup = { app: 'CSE Quiz Hub', version: 2, exported: now.toISOString(), data: {} };
    keys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val !== null) backup.data[k] = val;
    });
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cse-quiz-backup-${formatIndianFilename(now)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    Storage.set('cse_quiz_last_export', now.toISOString());
    const el = document.getElementById('data-export-last');
    if (el) el.textContent = 'Last export: ' + formatIndianDateTime(now);
  }


  /* ---------- Restore data from a backup file ---------- */
  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (!parsed || typeof parsed !== 'object' || !parsed.data) {
            alert('This does not look like a valid backup file.');
            return;
          }
          if (!confirm('This will replace all your current data with the backup. Continue?')) return;
          Object.keys(parsed.data).forEach(k => {
            if (typeof parsed.data[k] === 'string') {
              localStorage.setItem(k, parsed.data[k]);
            }
          });
          alert('Backup restored. Reloading…');
          location.reload();
        } catch (e) {
          alert('Could not read that file. Is it a valid backup?');
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }




  /* ---------- Master reset (settings only) ---------- */
  function resetAllData() {
    /* Existing */
    Storage.remove(THEME_KEY);
    Storage.remove(DEFAULTS_KEY);
    Bookmarks.clear();
    WrongQuestions.clear();
    History.clear();
    /* Added in Phase 2 */
    if (window.QuestionStats && QuestionStats.clear) QuestionStats.clear();
    /* Added in Phase E */
    Storage.remove('cse_quiz_ai_settings');
    Storage.remove('cse_quiz_ai_explanations');
    Storage.remove('cse_quiz_last_export');
  }

  /* ---------- Settings screen ---------- */
  function renderScreen() {
    const app = document.getElementById('app');
    if (!app) return;

    const prefs = getPrefs();
    const theme = getTheme();
    const bookmarkCount = Bookmarks.getAll().length;
    const wrongCount = WrongQuestions.getCount();
    const historyCount = History.getAll().length;


    const lastExportISO = Storage.get('cse_quiz_last_export', null);
    const lastExportText = lastExportISO
      ? 'Last export: ' + formatIndianDateTime(new Date(lastExportISO))
      : 'Not exported yet';

    app.innerHTML = `
      <section class="settings-screen">
        <div class="dashboard-header">
          <h1>Settings</h1>
          <p class="text-muted">Customize your quiz experience</p>
        </div>

        <div class="settings-section">
          <h2 class="section-title">Appearance</h2>
          <div class="setting-row">
            <div class="setting-label">
              <strong>Theme</strong>
              <small class="text-muted">Dark mode is easier on the eyes for long sessions.</small>
            </div>
            <div class="setting-control">
              <button class="btn ${theme === 'system' ? 'btn-primary' : 'btn-secondary'}"
                      data-theme-choice="system" type="button">📱 Auto</button>
              <button class="btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}"
                      data-theme-choice="dark" type="button">🌙 Dark</button>
              <button class="btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}"
                      data-theme-choice="light" type="button">☀ Light</button>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h2 class="section-title">Quiz Defaults</h2>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Default question count</strong>
              <small class="text-muted">Pre-filled when opening Practice or Exam setup.</small>
            </div>
            <div class="setting-control">
              <input type="number" id="set-count" min="1" max="500"
                     value="${prefs.defaultCount}">
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Default positive marks</strong>
              <small class="text-muted">Marks added per correct answer in Exam Mode.</small>
            </div>
            <div class="setting-control">
              <input type="number" id="set-positive" step="0.25" min="0"
                     value="${prefs.defaultPositive}">
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Default negative marks</strong>
              <small class="text-muted">Enter as a positive number (e.g., 0.25).</small>
            </div>
            <div class="setting-control">
              <input type="number" id="set-negative" step="0.25" min="0"
                     value="${prefs.defaultNegative}">
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Enable timer by default</strong>
              <small class="text-muted">Applied when opening Exam Mode setup.</small>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" id="set-timer"
                       ${prefs.defaultTimerEnabled ? 'checked' : ''}>
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Default timer duration (minutes)</strong>
            </div>
            <div class="setting-control">
              <input type="number" id="set-minutes" min="1" max="300"
                     value="${prefs.defaultTimerMinutes}">
            </div>
          </div>

          <div class="settings-save">
            <button class="btn btn-primary" id="set-save" type="button">Save Defaults</button>
            <span class="text-muted" id="set-save-msg"></span>
          </div>
        </div>





        <div class="settings-section">
          <h2 class="section-title">App</h2>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Install App</strong>
              <small class="text-muted">Add CSE Quiz Hub to your home screen for offline access.</small>
            </div>
            <div class="setting-control">
              <button class="btn btn-secondary" id="data-install" type="button">Install</button>
            </div>
          </div>
        </div>



        <div class="settings-section">
          <h2 class="section-title">🤖 AI Explanations</h2>

          <div class="setting-row setting-row-column">
            <div class="setting-label">
              <strong>Gemini API Key (Primary)</strong>
              <small class="text-muted">
                Free key from <strong>aistudio.google.com/apikey</strong>.
                Stored only in this browser. Sent only to Google.
              </small>
            </div>
            <div class="ai-key-control">
              ${AI.hasApiKey()
                ? `<div class="ai-key-masked">
                     <code>${AI.maskKey(AI.getApiKey())}</code>
                     <button class="btn btn-secondary btn-sm" data-ai-change="gemini" type="button">Change</button>
                     <button class="btn btn-secondary btn-sm" data-ai-test="gemini" type="button">Test</button>
                     <button class="btn btn-danger btn-sm" data-ai-remove="gemini" type="button">Remove</button>
                   </div>
                   <div class="ai-key-input-wrap" id="ai-gemini-input-wrap" hidden>
                     <input type="password" id="ai-gemini-input" placeholder="Paste Gemini key">
                     <button class="btn btn-primary btn-sm" data-ai-save="gemini" type="button">Save</button>
                     <button class="btn btn-secondary btn-sm" data-ai-cancel="gemini" type="button">Cancel</button>
                   </div>`
                : `<div class="ai-key-input-wrap" id="ai-gemini-input-wrap">
                     <input type="password" id="ai-gemini-input" placeholder="Paste Gemini key (AIza… or AQ.…)">
                     <button class="btn btn-primary btn-sm" data-ai-save="gemini" type="button">Save</button>
                   </div>`}
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Fallback providers</strong>
              <small class="text-muted">
                ✅ <strong>uncloseai</strong> (free, no key needed) — used automatically if Gemini is busy.<br>
                ✅ <strong>Pollinations</strong> (free, no key needed) — last resort if both fail.
              </small>
            </div>
            <div class="setting-control">
              <span class="count-pill" style="background: var(--correct-tint); color: var(--correct);">Enabled</span>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Status</strong>
              <small class="text-muted" id="ai-status">
                ${AI.getSettings().lastTestedAt
                  ? (AI.getSettings().lastTestStatus === 'ok'
                      ? 'Last test: ✅ Successful (' + new Date(AI.getSettings().lastTestedAt).toLocaleString('en-IN') + ')'
                      : 'Last test: ❌ Failed (' + new Date(AI.getSettings().lastTestedAt).toLocaleString('en-IN') + ')')
                  : 'Not tested yet.'}
              </small>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>AI Explanations stored</strong>
              <small class="text-muted">Cached explanations appear instantly without using your API quota.</small>
            </div>
            <div class="setting-control">
              <span class="count-pill">${AI.getCacheCount()}</span>
              <button class="btn btn-secondary btn-sm" id="ai-clear-cache" type="button"
                ${AI.getCacheCount() === 0 ? 'disabled' : ''}>Clear</button>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Privacy</strong>
              <small class="text-muted">
                Only the current question, its options, and the official answer/explanation
                are sent when you request an explanation. No personal data, quiz history, or bookmarks are sent.
              </small>
            </div>
          </div>
        </div>





        <div class="settings-section">
          <h2 class="section-title">Local Data</h2>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Download Backup</strong>
              <small class="text-muted">Save bookmarks, wrong questions, history, and settings to a file.</small>
            </div>
            <div class="setting-control" style="flex-direction: column; align-items: flex-end; gap: 0.3rem;">
              <button class="btn btn-secondary" id="data-export" type="button">Download</button>
              <small class="text-muted" id="data-export-last" style="font-size: 0.7rem; text-align: right;">
                ${lastExportText}
              </small>
            </div>
          </div>


          <div class="setting-row">
            <div class="setting-label">
              <strong>Restore from Backup</strong>
              <small class="text-muted">Load a backup file you downloaded earlier. This will replace your current data.</small>
            </div>
            <div class="setting-control">
              <button class="btn btn-secondary" id="data-import" type="button">Restore</button>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Bookmarks</strong>
              <small class="text-muted">${bookmarkCount} saved</small>
            </div>
            <div class="setting-control">
              <button class="btn btn-secondary" id="data-clear-bookmarks"
                      type="button" ${bookmarkCount === 0 ? 'disabled' : ''}>Clear</button>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Wrong Questions</strong>
              <small class="text-muted">${wrongCount} recorded</small>
            </div>
            <div class="setting-control">
              <button class="btn btn-secondary" id="data-clear-wrong"
                      type="button" ${wrongCount === 0 ? 'disabled' : ''}>Clear</button>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Attempt History</strong>
              <small class="text-muted">${historyCount} entries</small>
            </div>
            <div class="setting-control">
              <button class="btn btn-secondary" id="data-clear-history"
                      type="button" ${historyCount === 0 ? 'disabled' : ''}>Clear</button>
            </div>
          </div>

          <div class="setting-row setting-row-danger">
            <div class="setting-label">
              <strong>Reset All Local Data</strong>
              <small class="text-muted">
                Removes bookmarks, wrong questions, history, and your settings.
                Your question files are never touched.
              </small>
            </div>
            <div class="setting-control">
              <button class="btn btn-danger" id="data-reset-all" type="button">
                Reset Everything
              </button>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn btn-secondary" id="set-back" type="button">
            Back to Dashboard
          </button>
        </div>
      </section>`;

    /* ---------- wire up ---------- */
    document.querySelectorAll('[data-theme-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        setTheme(btn.dataset.themeChoice);
        renderScreen();
      });
    });

    document.getElementById('set-back')
      .addEventListener('click', () => App.navigate('dashboard'));

    const installBtn = document.getElementById('data-install');
    if (installBtn) {
      installBtn.addEventListener('click', () => App.triggerInstall());
    }


    /* ---------- AI Settings ---------- */
    const aiStatus = document.getElementById('ai-status');

    function setAiStatus(text) {
      if (aiStatus) aiStatus.textContent = text;
    }

    document.querySelectorAll('[data-ai-save]').forEach(btn => {
      btn.addEventListener('click', () => {
        const which = btn.dataset.aiSave;
        const input = document.getElementById('ai-' + which + '-input');
        const val = (input?.value || '').trim();
        if (!val) { alert('Please paste a key first.'); return; }
        AI.setApiKey(val);
        renderScreen();
        setAiStatus('✅ Key saved. Click Test to verify.');
      });
    });

    document.querySelectorAll('[data-ai-change]').forEach(btn => {
      btn.addEventListener('click', () => {
        const which = btn.dataset.aiChange;
        const wrap = document.getElementById('ai-' + which + '-input-wrap');
        const masked = btn.closest('.ai-key-control')?.querySelector('.ai-key-masked');
        if (wrap) wrap.hidden = false;
        if (masked) masked.hidden = true;
      });
    });

    document.querySelectorAll('[data-ai-cancel]').forEach(btn => {
      btn.addEventListener('click', () => renderScreen());
    });

    document.querySelectorAll('[data-ai-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Remove your Gemini API key?')) return;
        AI.clearApiKey();
        renderScreen();
      });
    });

    document.querySelectorAll('[data-ai-test]').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        const orig = btn.textContent;
        btn.textContent = '…';
        setAiStatus('🔄 Testing Gemini…');
        const res = await AI.testKey();
        setAiStatus(res.message);
        btn.disabled = false;
        btn.textContent = orig;
      });
    });

    const aiClearCache = document.getElementById('ai-clear-cache');
    if (aiClearCache) {
      aiClearCache.addEventListener('click', () => {
        if (!confirm('Clear all cached AI explanations? This does not affect your quiz data.')) return;
        AI.clearCache();
        renderScreen();
      });
    }




    document.getElementById('set-save').addEventListener('click', () => {
      const count = parseInt(document.getElementById('set-count').value, 10);
      const positive = parseFloat(document.getElementById('set-positive').value);
      const negative = parseFloat(document.getElementById('set-negative').value);
      const timerEnabled = document.getElementById('set-timer').checked;
      const minutes = parseInt(document.getElementById('set-minutes').value, 10);

      if (!Number.isFinite(count) || count < 1) { alert('Invalid default question count.'); return; }
      if (!Number.isFinite(positive) || positive < 0) { alert('Invalid positive marks.'); return; }
      if (!Number.isFinite(negative) || negative < 0) { alert('Invalid negative marks.'); return; }
      if (!Number.isFinite(minutes) || minutes < 1) { alert('Invalid timer duration.'); return; }

      updatePrefs({
        defaultCount: count,
        defaultPositive: positive,
        defaultNegative: negative,
        defaultTimerEnabled: timerEnabled,
        defaultTimerMinutes: minutes
      });

      const msg = document.getElementById('set-save-msg');
      clearTimeout(saveMsgTimer);
      msg.textContent = '✓ Saved';
      saveMsgTimer = setTimeout(() => { msg.textContent = ''; }, 2000);
    });

    document.getElementById('data-export').addEventListener('click', exportData);
    document.getElementById('data-import').addEventListener('click', importData);


    document.getElementById('data-clear-bookmarks').addEventListener('click', () => {
      if (confirm('Clear all bookmarks?')) { Bookmarks.clear(); renderScreen(); }
    });
    document.getElementById('data-clear-wrong').addEventListener('click', () => {
      if (confirm('Clear all wrong-question records?')) { WrongQuestions.clear(); renderScreen(); }
    });
    document.getElementById('data-clear-history').addEventListener('click', () => {
      if (confirm('Clear all attempt history?')) { History.clear(); renderScreen(); }
    });
    document.getElementById('data-reset-all').addEventListener('click', () => {
      const ok = confirm(
        'This will permanently delete ALL your local data:\n' +
        '• Bookmarks\n• Wrong questions\n• Attempt history\n• Settings\n\n' +
        'Your question files will NOT be affected.\n\nContinue?'
      );
      if (!ok) return;
      const sure = confirm('Are you absolutely sure? This cannot be undone.');
      if (!sure) return;

      resetAllData();
      setTheme(DEFAULT_THEME);
      alert('All local data has been reset.');
      App.navigate('dashboard');
    });
  }

  /* ---------- Init ---------- */
  function init() {
    document.documentElement.setAttribute('data-theme', getTheme());
    updateToggleButton();

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => App.navigate('settings'));
    }
  }

  return {
    init, getTheme, setTheme, toggleTheme,
    getPrefs, updatePrefs, resetPrefs,
    resetAllData, renderScreen
  };
})();

window.Settings = Settings;
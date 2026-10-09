/* ------------------------------------------------------------
   Mixed Quiz — random revision across sources & subjects
   ------------------------------------------------------------ */
const Mixed = (() => {

  function getAllSubjectPool() {
    const by = {};
    QuestionManager.getAllQuestions().forEach(q => {
      if (!by[q.subject]) by[q.subject] = [];
      by[q.subject].push(q);
    });
    return by;
  }

  function getSelectedSubjectsPool() {
    const selected = [...document.querySelectorAll('.mixed-subject-cb:checked')].map(cb => cb.value);
    const by = {};
    selected.forEach(s => { by[s] = QuestionManager.getQuestionsBySubject(s); });
    return by;
  }

  function getFlatPool(source) {
    if (source === 'weak') return QuestionStats.getWeakQuestions('all');
    if (source === 'bookmarks') return Bookmarks.getQuestions();
    return [];
  }

  function applyRecentFilter(questions, avoid) {
    if (!avoid) return questions;
    const all = QuestionStats.getAll();
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    return questions.filter(q => {
      const rec = all[q.id];
      if (!rec || !rec.lastAttemptAt) return true;
      return (now - new Date(rec.lastAttemptAt).getTime()) > SEVEN_DAYS;
    });
  }

  function getCurrentSource() {
    const el = document.querySelector('input[name="mix-source"]:checked');
    return el ? el.value : 'all';
  }
  function getCurrentDist() {
    const el = document.querySelector('input[name="mix-dist"]:checked');
    return el ? el.value : 'balanced';
  }
  function getCurrentMode() {
    const el = document.querySelector('input[name="mix-mode"]:checked');
    return el ? el.value : 'practice';
  }

  function computePool() {
    const source = getCurrentSource();
    const avoid = document.getElementById('mixed-avoid').checked;

    if (source === 'weak' || source === 'bookmarks') {
      const pool = applyRecentFilter(getFlatPool(source), avoid);
      return { available: pool.length, questions: pool, bySubject: null };
    }

    let by;
    if (source === 'all') {
      by = getAllSubjectPool();
    } else {
      by = getSelectedSubjectsPool();
    }

    Object.keys(by).forEach(s => {
      by[s] = applyRecentFilter(by[s], avoid);
      if (by[s].length === 0) delete by[s];
    });

    let total = 0;
    Object.values(by).forEach(arr => { total += arr.length; });

    return { available: total, questions: null, bySubject: by };
  }

  function pickQuestions(totalCount) {
    const pool = computePool();
    if (pool.available === 0) return [];

    if (pool.questions) {
      return Utils.shuffle(pool.questions).slice(0, Math.min(totalCount, pool.questions.length));
    }

    const subjects = Object.keys(pool.bySubject);
    if (subjects.length === 0) return [];

    const dist = getCurrentDist();

    if (dist === 'random') {
      const all = [];
      subjects.forEach(s => all.push(...pool.bySubject[s]));
      return Utils.shuffle(all).slice(0, Math.min(totalCount, all.length));
    }

    // balanced
    const perSubject = Math.floor(totalCount / subjects.length);
    let remainder = totalCount % subjects.length;
    const picked = [];
    Utils.shuffle(subjects).forEach(s => {
      const take = perSubject + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      picked.push(...Utils.shuffle(pool.bySubject[s]).slice(0, take));
    });
    return Utils.shuffle(picked);
  }

  function updateAvailable() {
    const el = document.getElementById('mixed-available');
    if (!el) return;
    const pool = computePool();
    el.textContent = `${pool.available} question${pool.available === 1 ? '' : 's'} available`;
    const countInput = document.getElementById('mixed-count');
    if (countInput) {
      countInput.max = pool.available;
      const cur = parseInt(countInput.value, 10);
      if (Number.isFinite(cur) && cur > pool.available) countInput.value = pool.available;
    }
  }

  function refreshVisibility() {
    const source = getCurrentSource();
    const subjRow = document.getElementById('mixed-subjects-row');
    const distRow = document.getElementById('mixed-dist-row');
    if (subjRow) subjRow.hidden = source !== 'subjects';
    if (distRow) distRow.hidden = (source !== 'subjects' && source !== 'all');
    updateAvailable();
  }

  function renderSetup() {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const subjects = QuestionManager.getSubjects();

    if (subjects.length === 0) {
      app.innerHTML = `<p class="text-muted">No questions loaded.</p>`;
      return;
    }

    const weakCount = QuestionStats.getWeakQuestions('all').length;
    const bookmarkCount = Bookmarks.getCount();

    app.innerHTML = `
      <section class="practice-setup mixed-setup">
        <div class="dashboard-header">
          <h1>🎲 Mixed Quiz</h1>
          <p class="text-muted">Random revision across subjects and sources</p>
        </div>
        <form id="mixed-form" class="form-card">

          <div class="form-row">
            <label>Question source</label>
            <div class="radio-list">
              <label class="radio-label">
                <input type="radio" name="mix-source" value="all" checked>
                <span>All CSE (every subject)</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="mix-source" value="subjects">
                <span>Selected subjects</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="mix-source" value="weak" ${weakCount === 0 ? 'disabled' : ''}>
                <span>Weak questions <span class="count-pill">${weakCount}</span></span>
              </label>
              <label class="radio-label">
                <input type="radio" name="mix-source" value="bookmarks" ${bookmarkCount === 0 ? 'disabled' : ''}>
                <span>Bookmarked questions <span class="count-pill">${bookmarkCount}</span></span>
              </label>
            </div>
          </div>

          <div class="form-row" id="mixed-subjects-row" hidden>
            <label>Pick subjects</label>
            <div class="mixed-subject-list">
              ${subjects.map(s => `
                <label class="checkbox-label mixed-subject-item">
                  <input type="checkbox" value="${esc(s)}" class="mixed-subject-cb">
                  <span>${esc(s)} <span class="count-pill">${QuestionManager.getQuestionsBySubject(s).length}</span></span>
                </label>`).join('')}
            </div>
            <div class="mixed-subject-actions">
              <button type="button" class="btn-link" id="mix-all-subjects">Select all</button>
              <button type="button" class="btn-link" id="mix-no-subjects">Clear</button>
            </div>
          </div>

          <div class="form-row">
            <label for="mixed-count">Number of questions</label>
            <input type="number" id="mixed-count" min="1" value="${Settings.getPrefs().defaultCount}">
            <small class="text-muted" id="mixed-available"></small>
          </div>

          <div class="form-row">
            <label class="checkbox-label">
              <input type="checkbox" id="mixed-avoid">
              <span>Avoid recently attempted (last 7 days)</span>
            </label>
          </div>

          <div class="form-row" id="mixed-dist-row" hidden>
            <label>Distribution</label>
            <div class="radio-list">
              <label class="radio-label">
                <input type="radio" name="mix-dist" value="balanced" checked>
                <span>Balanced (equal from each subject)</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="mix-dist" value="random">
                <span>Fully random</span>
              </label>
            </div>
          </div>

          <div class="form-row">
            <label>Mode</label>
            <div class="radio-list">
              <label class="radio-label">
                <input type="radio" name="mix-mode" value="practice" checked>
                <span>Practice (instant feedback)</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="mix-mode" value="exam">
                <span>Exam (marked, no feedback)</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="mixed-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Start Mixed Quiz</button>
          </div>
        </form>
      </section>`;

    document.querySelectorAll('input[name="mix-source"]').forEach(el => {
      el.addEventListener('change', refreshVisibility);
    });
    document.querySelectorAll('input[name="mix-dist"]').forEach(el => {
      el.addEventListener('change', updateAvailable);
    });
    document.querySelectorAll('.mixed-subject-cb').forEach(el => {
      el.addEventListener('change', updateAvailable);
    });
    document.getElementById('mixed-avoid').addEventListener('change', updateAvailable);
    document.getElementById('mixed-count').addEventListener('input', updateAvailable);

    document.getElementById('mix-all-subjects').addEventListener('click', () => {
      document.querySelectorAll('.mixed-subject-cb').forEach(cb => { cb.checked = true; });
      updateAvailable();
    });
    document.getElementById('mix-no-subjects').addEventListener('click', () => {
      document.querySelectorAll('.mixed-subject-cb').forEach(cb => { cb.checked = false; });
      updateAvailable();
    });

    document.getElementById('mixed-cancel').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('mixed-form').addEventListener('submit', startMixed);

    refreshVisibility();
  }

  function startMixed(e) {
    e.preventDefault();
    const pool = computePool();
    if (pool.available === 0) {
      alert('No questions available for this selection.');
      return;
    }

    let count = parseInt(document.getElementById('mixed-count').value, 10);
    if (!Number.isFinite(count) || count < 1) { alert('Please enter a valid number.'); return; }
    if (count > pool.available) count = pool.available;

    const picked = pickQuestions(count);
    if (picked.length === 0) { alert('Could not select questions.'); return; }

    const mode = getCurrentMode();
    const source = getCurrentSource();
    const subjectList = source === 'subjects'
      ? [...document.querySelectorAll('.mixed-subject-cb:checked')].map(cb => cb.value)
      : [];

    const title = source === 'all' ? 'Mixed · All CSE'
      : source === 'subjects' ? `Mixed · ${subjectList.length} Subject${subjectList.length === 1 ? '' : 's'}`
      : source === 'weak' ? 'Mixed · Weak Questions'
      : 'Mixed · Bookmarks';

    if (mode === 'exam') Exam.startCustom(picked, title);
    else Practice.startCustom(picked, title);
  }

  return { renderSetup };
})();

window.Mixed = Mixed;
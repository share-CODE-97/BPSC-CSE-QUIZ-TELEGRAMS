/* ------------------------------------------------------------
   Study Mode — read questions, reveal answers, no scoring
   ------------------------------------------------------------ */
const Study = (() => {
  const state = {
    questions: [],
    current: 0,
    revealed: [],
    config: null
  };

  const SAVE_KEY = 'cse_quiz_active_study';

  function saveState() {
    try {
      sessionStorage.setItem(SAVE_KEY, JSON.stringify({
        questions: state.questions,
        current: state.current,
        revealed: state.revealed,
        config: state.config
      }));
    } catch (e) {}
  }

  function clearSavedState() {
    try { sessionStorage.removeItem(SAVE_KEY); } catch (e) {}
  }

  function loadSavedState() {
    try {
      const raw = sessionStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.questions || !parsed.questions.length) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function hasSavedState() { return loadSavedState() !== null; }

  function resumeSaved() {
    const s = loadSavedState();
    if (!s) { App.navigate('dashboard'); return; }
    state.questions = s.questions;
    state.current = s.current;
    state.revealed = s.revealed || new Array(s.questions.length).fill(false);
    state.config = s.config;
    App.navigate('study-quiz');
  }

  /* ============ SETUP ============ */
  function renderSetup(params = {}) {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const subjects = QuestionManager.getSubjects();

    if (subjects.length === 0) {
      app.innerHTML = `<p class="text-muted">No questions loaded.</p>`;
      return;
    }

    app.innerHTML = `
      <section class="practice-setup">
        <div class="dashboard-header">
          <h1>Study Mode</h1>
          <p class="text-muted">Read questions, reveal answers, learn at your own pace</p>
        </div>
        <form id="study-form" class="form-card">
          <div class="form-row">
            <label for="st-subject">Subject</label>
            <select id="st-subject">
              ${subjects.map(s => {
                const count = QuestionManager.getQuestionsBySubject(s).length;
                return `<option value="${esc(s)}">${esc(s)} (${count})</option>`;
              }).join('')}
            </select>
          </div>
          <div class="form-row">
            <label for="st-subtopic">Subtopic</label>
            <select id="st-subtopic"></select>
          </div>
          <div class="form-row">
            <label for="st-count">Number of questions</label>
            <input type="number" id="st-count" min="1" value="${Settings.getPrefs().defaultCount}">
            <small class="text-muted" id="st-available"></small>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="st-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Start Studying</button>
          </div>
        </form>
      </section>`;

    const subjectSel = document.getElementById('st-subject');
    if (params.subject && subjects.includes(params.subject)) subjectSel.value = params.subject;

    subjectSel.addEventListener('change', updateSubtopics);
    document.getElementById('st-subtopic').addEventListener('change', updateAvailable);
    document.getElementById('st-cancel').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('study-form').addEventListener('submit', handleStart);
    updateSubtopics();
  }

  function updateSubtopics() {
    const subject = document.getElementById('st-subject').value;
    const sel = document.getElementById('st-subtopic');
    const totalCount = QuestionManager.getQuestionsBySubject(subject).length;
    sel.innerHTML = `<option value="__ALL__">All Subtopics (${totalCount})</option>`;
    QuestionManager.getSubtopics(subject).forEach(st => {
      const count = QuestionManager.getQuestionsBySubtopic(subject, st).length;
      const opt = document.createElement('option');
      opt.value = st;
      opt.textContent = `${st} (${count})`;
      sel.appendChild(opt);
    });
    updateAvailable();
  }

  function updateAvailable() {
    const subject = document.getElementById('st-subject').value;
    const subtopic = document.getElementById('st-subtopic').value;
    const pool = getPool(subject, subtopic);
    const countInput = document.getElementById('st-count');
    countInput.max = pool.length;
    const currentVal = parseInt(countInput.value, 10) || 10;
    if (currentVal > pool.length) countInput.value = pool.length;
    document.getElementById('st-available').textContent =
      `${pool.length} question${pool.length === 1 ? '' : 's'} available`;
  }

  function getPool(subject, subtopic) {
    if (subtopic === '__ALL__') return QuestionManager.getQuestionsBySubject(subject);
    return QuestionManager.getQuestionsBySubtopic(subject, subtopic);
  }

  function handleStart(e) {
    e.preventDefault();
    const subject = document.getElementById('st-subject').value;
    const subtopic = document.getElementById('st-subtopic').value;
    const requested = parseInt(document.getElementById('st-count').value, 10);
    const pool = getPool(subject, subtopic);

    if (pool.length === 0) { alert('No questions available for this selection.'); return; }
    let count = requested;
    if (!Number.isFinite(count) || count < 1) { alert('Please enter a valid number.'); return; }
    if (count > pool.length) count = pool.length;

    startStudy({
      subject,
      subtopic: subtopic === '__ALL__' ? null : subtopic,
      pool,
      count,
      title: subtopic === '__ALL__' ? subject : `${subject} · ${subtopic}`
    });
  }

  function startStudy(config) {
    const selected = Utils.shuffle(config.pool).slice(0, config.count);
    state.questions = selected.map(q => ({
      id: q.id,
      subject: q.subject,
      subtopic: q.subtopic,
      question: q.question,
      answer: q.answer,
      explanation: q.explanation || '',
      options: Utils.shuffle(q.options.slice())
    }));
    state.current = 0;
    state.revealed = new Array(state.questions.length).fill(false);
    state.config = config;
    App.navigate('study-quiz');
  }

  /* ============ QUIZ ============ */
  function renderQuiz() {
    saveState();
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const total = state.questions.length;
    const q = state.questions[state.current];
    const isRevealed = state.revealed[state.current];
    const isBookmarked = Bookmarks.has(q.id);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const revealedCount = state.revealed.filter(Boolean).length;
    const progressPct = (revealedCount / total) * 100;

    function goPrev() { if (state.current > 0) { state.current--; renderQuiz(); } }
    function goNext() {
      if (state.current < total - 1) { state.current++; renderQuiz(); }
      else App.navigate('study-complete');
    }
    function reveal() {
      state.revealed[state.current] = true;
      renderQuiz();
    }
    function hide() {
      state.revealed[state.current] = false;
      renderQuiz();
    }
    function toggleBookmark() {
      Bookmarks.toggle(q.id);
      renderQuiz();
    }

    const optionsHtml = q.options.map((opt, i) => {
      let cls = 'option-btn';
      let badge = '';
      if (isRevealed) {
        if (opt === q.answer) {
          cls += ' option-correct';
          badge = '<span class="option-badge">✓ Correct</span>';
        } else {
          cls += ' option-disabled';
        }
      }
      return `
        <button class="${cls}" type="button" disabled>
          <span class="option-letter">${letters[i]}</span>
          <span class="option-text">${esc(opt)}</span>
          ${badge}
        </button>`;
    }).join('');

    const answerHtml = isRevealed
      ? `<div class="feedback feedback-correct">
          <div class="feedback-title">✓ Answer: ${esc(q.answer)}</div>
          ${q.explanation ? `<div class="feedback-explanation"><strong>Explanation:</strong> ${esc(q.explanation)}</div>` : ''}
        </div>`
      : `<div class="study-reveal-wrap">
          <button class="btn btn-primary" id="st-reveal" type="button">Show Answer</button>
        </div>`;

    app.innerHTML = `
      <section class="quiz-screen">
        <div class="quiz-topbar">
          <button class="btn btn-secondary" id="st-exit" type="button">← Exit</button>
          <div class="quiz-topbar-info">
            ${state.config.title ? `<div class="quiz-title-tag">${esc(state.config.title)}</div>` : ''}
            <div class="quiz-progress-text">Question ${state.current + 1} of ${total}</div>
          </div>
          <button class="btn-icon ${isBookmarked ? 'active' : ''}" id="st-bookmark"
                  type="button" title="Bookmark this question"
                  aria-label="Bookmark this question">⭐</button>
        </div>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:${progressPct}%"></div>
        </div>
        <div class="quiz-meta">
          <span class="quiz-tag">${esc(q.subject)}</span>
          <span class="quiz-tag">${esc(q.subtopic)}</span>
          <span class="quiz-tag quiz-tag-id" title="Question ID">${esc(q.id)}</span>
        </div>
        <div class="question-card">
          <h2 class="question-text">${esc(q.question)}</h2>
          <div class="options-list">${optionsHtml}</div>
          ${answerHtml}
          ${isRevealed ? `<div class="ai-section" id="ai-section"></div>` : ''}
        </div>
        <div class="quiz-nav">
          <button class="btn btn-secondary" id="st-prev" type="button"
            ${state.current === 0 ? 'disabled' : ''}>← Previous</button>
          <div class="quiz-nav-count">${revealedCount} / ${total} revealed</div>
          <button class="btn btn-primary" id="st-next" type="button">
            ${state.current === total - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
        <div class="keyboard-hint">
          <span class="key">←</span><span class="key">→</span> navigate
          · <span class="key">Space</span> reveal
          · <span class="key">B</span> bookmark
          · <span class="key">Esc</span> exit
        </div>
      </section>`;

    document.getElementById('st-exit').addEventListener('click', () => {
      if (confirm('Exit study session? Your progress will be lost.')) {
        clearSavedState();
        App.navigate('dashboard');
      }
    });
    document.getElementById('st-prev').addEventListener('click', goPrev);
    document.getElementById('st-next').addEventListener('click', goNext);
    document.getElementById('st-bookmark').addEventListener('click', toggleBookmark);
    const revealBtn = document.getElementById('st-reveal');
    if (revealBtn) revealBtn.addEventListener('click', reveal);

    /* AI panel — only after Show Answer */
    const aiSection = document.getElementById('ai-section');
    if (aiSection && isRevealed) {
      AI.attachPanel(aiSection, q);
    }

    /* Swipe */
    let touchStartX = 0;
    const qCard = document.querySelector('.question-card');
    if (qCard) {
      qCard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      qCard.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) < 60) return;
        if (dx < 0) goNext();
        else goPrev();
      }, { passive: true });
    }

    /* Keyboard */
    Keyboard.bind({
      'ArrowLeft':  goPrev,
      'ArrowRight': goNext,
      'Enter':      goNext,
      'Escape':     () => {
        if (confirm('Exit study session? Your progress will be lost.')) {
          clearSavedState();
          App.navigate('dashboard');
        }
      },
      'b': toggleBookmark, 'B': toggleBookmark,
      ' ': () => isRevealed ? hide() : reveal(),
      'r': () => isRevealed ? hide() : reveal(),
      'R': () => isRevealed ? hide() : reveal()
    });
  }

  /* ============ COMPLETE ============ */
  function renderComplete() {
    clearSavedState();
    const app = document.getElementById('app');
    const total = state.questions.length;
    const revealedCount = state.revealed.filter(Boolean).length;

    app.innerHTML = `
      <section class="result-screen">
        <div class="dashboard-header">
          <h1>Study Complete</h1>
          <p class="text-muted">Nice work. Keep it up!</p>
        </div>
        <div class="result-grid">
          <div class="result-stat"><span class="result-value">${total}</span><span class="result-label">Questions Reviewed</span></div>
          <div class="result-stat result-accuracy"><span class="result-value">${revealedCount}</span><span class="result-label">Answers Revealed</span></div>
        </div>
        <div class="result-actions">
          <button class="btn btn-secondary" id="stc-dashboard" type="button">Dashboard</button>
          <button class="btn btn-primary" id="stc-again" type="button">Study Again</button>
        </div>
      </section>`;

    document.getElementById('stc-dashboard').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('stc-again').addEventListener('click', () => {
      Study.startStudy(state.config);
    });
  }

  return { renderSetup, renderQuiz, renderComplete, startStudy, hasSavedState, resumeSaved };
})();

window.Study = Study;
/* ------------------------------------------------------------
   Exam Mode — with bookmark + wrong-question + history
   ------------------------------------------------------------ */
const Exam = (() => {
  const state = {
    questions: [],
    answers: [],
    flagged: [],
    current: 0,
    config: null,
    submitted: false,
    startTime: 0,
    timeUsed: 0,
    remaining: 0,
    historySaved: false
  };

  let timerIntervalId = null;



  const SAVE_KEY = 'cse_quiz_active_exam';

  function saveState() {
    if (state.submitted) return;
    try {
      const snapshot = {
        questions: state.questions,
        answers: state.answers,
        flagged: state.flagged,
        current: state.current,
        config: state.config,
        startTime: state.startTime,
        remaining: state.remaining
      };
      sessionStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
    } catch (e) { /* quota or unavailable */ }
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

  function hasSavedState() {
    return loadSavedState() !== null;
  }

  function resumeSaved() {
    const s = loadSavedState();
    if (!s) { App.navigate('dashboard'); return; }
    state.questions = s.questions;
    state.answers   = s.answers;
    state.flagged   = s.flagged;
    state.current   = s.current;
    state.config    = s.config;
    state.submitted = false;
    state.timeUsed  = 0;
    state.startTime = Date.now();
    state.remaining = s.remaining || (s.config.timeLimit || 0);
    state.historySaved = false;

    if (state.config.timeLimit && state.remaining > 0) {
      startTimer(state.remaining);
      requestWakeLock();
    }
    App.navigate('exam-quiz');
  }



  /* Keep the screen awake during a timed exam (Android Chrome) */
  let wakeLock = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (e) { /* silently ignore */ }
  }
  function releaseWakeLock() {
    try {
      if (wakeLock) { wakeLock.release(); wakeLock = null; }
    } catch (e) { /* silently ignore */ }
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
      <section class="exam-setup">
        <div class="dashboard-header">
          <h1>Exam Mode</h1>
          <p class="text-muted">Simulate a real exam with timer and marking</p>
        </div>
        <form id="exam-form" class="form-card">
          <div class="form-row">
            <label for="ex-subject">Subject</label>
            <select id="ex-subject">
              ${subjects.map(s => {
                const count = QuestionManager.getQuestionsBySubject(s).length;
                return `<option value="${esc(s)}">${esc(s)} (${count})</option>`;
              }).join('')}
            </select>
          </div>
          <div class="form-row">
            <label for="ex-subtopic">Subtopic</label>
            <select id="ex-subtopic"></select>
          </div>
          <div class="form-row">
            <label for="ex-count">Number of questions</label>
            <input type="number" id="ex-count" min="1" value="${Settings.getPrefs().defaultCount}">
            <small class="text-muted" id="ex-available"></small>
          </div>
          <div class="form-row">
            <label class="checkbox-label">
              <input type="checkbox" id="ex-timer-enabled" ${Settings.getPrefs().defaultTimerEnabled ? 'checked' : ''}>
              <span>Enable Timer</span>
            </label>
          </div>
          <div class="form-row" id="ex-timer-row" ${Settings.getPrefs().defaultTimerEnabled ? '' : 'hidden'}>
            <label for="ex-minutes">Duration (minutes)</label>
            <input type="number" id="ex-minutes" min="1" value="${Settings.getPrefs().defaultTimerMinutes}">
          </div>
          <div class="form-row-split">
            <div>
              <label for="ex-positive">Positive marks (correct)</label>
              <input type="number" id="ex-positive" step="0.25" min="0" value="${Settings.getPrefs().defaultPositive}">
            </div>
            <div>
              <label for="ex-negative">Negative marks (wrong)</label>
              <input type="number" id="ex-negative" step="0.25" min="0" value="${Settings.getPrefs().defaultNegative}">
              <small class="text-muted">Enter as positive (e.g., 0.25)</small>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="ex-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Start Exam</button>
          </div>
        </form>
      </section>`;

    const subjectSel = document.getElementById('ex-subject');
    if (params.subject && subjects.includes(params.subject)) subjectSel.value = params.subject;

    subjectSel.addEventListener('change', updateSubtopics);
    document.getElementById('ex-subtopic').addEventListener('change', updateAvailable);
    document.getElementById('ex-timer-enabled').addEventListener('change', (e) => {
      document.getElementById('ex-timer-row').hidden = !e.target.checked;
    });
    document.getElementById('ex-cancel').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('exam-form').addEventListener('submit', handleStart);
    updateSubtopics();
  }

  function updateSubtopics() {
    const subject = document.getElementById('ex-subject').value;
    const subtopicSel = document.getElementById('ex-subtopic');
    const totalCount = QuestionManager.getQuestionsBySubject(subject).length;
    subtopicSel.innerHTML = `<option value="__ALL__">All Subtopics (${totalCount})</option>`;
    QuestionManager.getSubtopics(subject).forEach(st => {
      const count = QuestionManager.getQuestionsBySubtopic(subject, st).length;
      const opt = document.createElement('option');
      opt.value = st;
      opt.textContent = `${st} (${count})`;
      subtopicSel.appendChild(opt);
    });
    updateAvailable();
  }

  function updateAvailable() {
    const subject = document.getElementById('ex-subject').value;
    const subtopic = document.getElementById('ex-subtopic').value;
    const pool = getPool(subject, subtopic);
    const countInput = document.getElementById('ex-count');
    countInput.max = pool.length;
    const currentVal = parseInt(countInput.value, 10) || 10;
    if (currentVal > pool.length) countInput.value = pool.length;
    document.getElementById('ex-available').textContent =
      `${pool.length} question${pool.length === 1 ? '' : 's'} available`;
  }

  function getPool(subject, subtopic) {
    if (subtopic === '__ALL__') return QuestionManager.getQuestionsBySubject(subject);
    return QuestionManager.getQuestionsBySubtopic(subject, subtopic);
  }

  function handleStart(e) {
    e.preventDefault();
    const subject = document.getElementById('ex-subject').value;
    const subtopic = document.getElementById('ex-subtopic').value;
    const requested = parseInt(document.getElementById('ex-count').value, 10);
    const timerEnabled = document.getElementById('ex-timer-enabled').checked;
    const minutes = parseInt(document.getElementById('ex-minutes').value, 10);
    const positive = parseFloat(document.getElementById('ex-positive').value);
    const negative = parseFloat(document.getElementById('ex-negative').value);

    const pool = getPool(subject, subtopic);
    if (pool.length === 0) { alert('No questions available for this selection.'); return; }

    let count = requested;
    if (!Number.isFinite(count) || count < 1) { alert('Invalid question count.'); return; }
    if (count > pool.length) {
      alert(`Only ${pool.length} questions available. Starting with ${pool.length}.`);
      count = pool.length;
    }
    if (!Number.isFinite(positive) || positive < 0) { alert('Invalid positive marks.'); return; }
    if (!Number.isFinite(negative) || negative < 0) { alert('Invalid negative marks.'); return; }

    let timeLimit = null;
    if (timerEnabled) {
      if (!Number.isFinite(minutes) || minutes < 1) { alert('Please enter a valid duration.'); return; }
      timeLimit = minutes * 60;
    }

    startExam({
      subject,
      subtopic: subtopic === '__ALL__' ? null : subtopic,
      pool, count, timeLimit, positive, negative,
      title: subtopic === '__ALL__' ? subject : `${subject} · ${subtopic}`
    });
  }

  /* ============ START ============ */
  function startExam(config) {
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
    state.answers = new Array(state.questions.length).fill(null);
    state.flagged = new Array(state.questions.length).fill(false);
    state.current = 0;
    state.config = config;
    state.submitted = false;
    state.timeUsed = 0;
    state.startTime = Date.now();
    state.remaining = config.timeLimit || 0;
    state.historySaved = false;

    if (config.timeLimit) { startTimer(config.timeLimit); requestWakeLock(); }
    App.navigate('exam-quiz');
  }

  function startCustom(questions, title, options = {}) {
    if (!questions || questions.length === 0) return;
    const prefs = Settings.getPrefs();
    startExam({
      subject: null,
      subtopic: null,
      pool: questions,
      count: questions.length,
      timeLimit: options.timeLimit || null,
      positive: prefs.defaultPositive,
      negative: prefs.defaultNegative,
      title: title || 'Mixed Quiz'
    });
  }

  function startTimer(seconds) {
    stopTimer();
    state.remaining = seconds;
    timerIntervalId = setInterval(() => {
      state.remaining--;
      updateTimerDisplay();
      if (state.remaining <= 0) {
        stopTimer();
        submitExam(true);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerIntervalId) { clearInterval(timerIntervalId); timerIntervalId = null; }
  }

  function updateTimerDisplay() {
    const el = document.getElementById('ex-timer-display');
    if (!el || !state.config || !state.config.timeLimit) return;
    const m = Math.floor(state.remaining / 60);
    const s = state.remaining % 60;
    el.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    el.classList.toggle('timer-warning', state.remaining <= 60);
  }

  /* ============ QUIZ ============ */
  function renderQuiz() {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    saveState();
    const total = state.questions.length;
    const q = state.questions[state.current];
    const selected = state.answers[state.current];
    const isFlagged = state.flagged[state.current];
    const isBookmarked = Bookmarks.has(q.id);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const answeredCount = state.answers.filter(a => a !== null).length;
    const progressPct = (answeredCount / total) * 100;

    /* ---- helpers shared by clicks and keyboard ---- */
    function goPrev() {
      if (state.current > 0) { state.current--; renderQuiz(); }
    }
    function goNext() {
      if (state.current < total - 1) { state.current++; renderQuiz(); }
    }
    function pickOption(idx) {
      if (idx < 0 || idx >= q.options.length) return;
      state.answers[state.current] = q.options[idx];
      renderQuiz();
    }
    function clearSelection() {
      if (state.answers[state.current] === null) return;
      state.answers[state.current] = null;
      renderQuiz();
    }
    function toggleFlag() {
      state.flagged[state.current] = !state.flagged[state.current];
      renderQuiz();
    }
    function toggleBookmark() {
      Bookmarks.toggle(q.id);
      renderQuiz();
    }

    const optionsHtml = q.options.map((opt, i) => {
      const isSel = opt === selected;
      return `
        <button class="option-btn ${isSel ? 'option-selected' : ''}" type="button" data-index="${i}">
          <span class="option-letter">${letters[i]}</span>
          <span class="option-text">${esc(opt)}</span>
        </button>`;
    }).join('');

    const navButtons = state.questions.map((_, i) => {
      let cls = 'nav-btn';
      if (state.flagged[i]) cls += ' nav-flagged';
      else if (state.answers[i] !== null) cls += ' nav-answered';
      else cls += ' nav-unanswered';
      if (i === state.current) cls += ' nav-current';
      return `<button class="${cls}" type="button" data-jump="${i}">${i + 1}</button>`;
    }).join('');

    const clearHtml = selected !== null
      ? `
        <div class="clear-selection-wrap">
          <button class="btn-clear-selection" id="ex-clear" type="button">
            ✕ Clear Selection
          </button>
        </div>`
      : '';

    app.innerHTML = `
      <section class="exam-screen">
        <div class="exam-topbar">
          <button class="btn btn-secondary" id="ex-exit" type="button">← Exit</button>
          ${state.config.timeLimit
            ? `<div class="exam-timer" id="ex-timer-display">⏱ --:--</div>`
            : `<div class="exam-timer exam-timer-off">No Timer</div>`}
          <button class="btn btn-primary" id="ex-submit" type="button">Submit Exam</button>
        </div>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:${progressPct}%"></div>
        </div>
        <div class="quiz-meta">
          <span class="quiz-tag">${esc(q.subject)}</span>
          <span class="quiz-tag">${esc(q.subtopic)}</span>
          <span class="quiz-tag">Question ${state.current + 1} of ${total}</span>
          <span class="quiz-tag quiz-tag-id" title="Question ID">${esc(q.id)}</span>
          <button class="btn-icon btn-icon-inline ${isBookmarked ? 'active' : ''}"
                  id="ex-bookmark" type="button"
                  title="Bookmark this question"
                  aria-label="Bookmark this question">⭐</button>
        </div>
        <div class="question-card">
          <h2 class="question-text">${esc(q.question)}</h2>
          <div class="options-list">${optionsHtml}</div>
          ${clearHtml}
        </div>
        <div class="exam-controls">
          <button class="btn btn-secondary" id="ex-prev" type="button"
            ${state.current === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn ${isFlagged ? 'btn-flag-active' : 'btn-flag'}"
            id="ex-flag" type="button">
            🚩 ${isFlagged ? 'Unmark' : 'Mark for Review'}
          </button>
          <button class="btn btn-secondary" id="ex-next" type="button"
            ${state.current === total - 1 ? 'disabled' : ''}>Next →</button>
        </div>
        <div class="navigator-section">
          <h3 class="section-title">Question Navigator</h3>
          <div class="navigator-legend">
            <span><span class="nav-dot nav-answered"></span> Answered</span>
            <span><span class="nav-dot nav-unanswered"></span> Unanswered</span>
            <span><span class="nav-dot nav-flagged"></span> Flagged</span>
          </div>
          <div class="navigator-grid">${navButtons}</div>
        </div>
<div class="keyboard-hint">
  <span class="key">←</span><span class="key">→</span> navigate
  · <span class="key">1–8</span> pick
  · <span class="key">C</span> clear
  · <span class="key">F</span> flag
  · <span class="key">B</span> bookmark
  · <span class="key">Esc</span> exit
</div>
      </section>`;

    updateTimerDisplay();

    /* ---------- click handlers ---------- */
    document.getElementById('ex-exit').addEventListener('click', () => {
      if (confirm('Exit exam? Your progress will be lost.')) {
        stopTimer();
        App.navigate('dashboard');
      }
    });
    document.getElementById('ex-submit').addEventListener('click', () => {
      const unanswered = state.answers.filter(a => a === null).length;
      const msg = unanswered > 0
        ? `${unanswered} question(s) unanswered. Submit anyway?`
        : 'Submit exam?';
      if (confirm(msg)) submitExam(false);
    });
    document.getElementById('ex-prev').addEventListener('click', goPrev);
    document.getElementById('ex-next').addEventListener('click', goNext);
    document.getElementById('ex-flag').addEventListener('click', toggleFlag);
    document.getElementById('ex-bookmark').addEventListener('click', toggleBookmark);

    const clearBtn = document.getElementById('ex-clear');
    if (clearBtn) clearBtn.addEventListener('click', clearSelection);

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => pickOption(parseInt(btn.dataset.index, 10)));
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.current = parseInt(btn.dataset.jump, 10);
        renderQuiz();
      });
    });



    /* Swipe left/right on the question card to navigate */
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



    /* ---------- keyboard ---------- */
Keyboard.bind({
  'ArrowLeft':  goPrev,
  'ArrowRight': goNext,
  'Enter':      goNext,
  'Escape':     () => {
    if (confirm('Exit exam? Your progress will be lost.')) {
      stopTimer();
      App.navigate('dashboard');
    }
  },
  'f': toggleFlag, 'F': toggleFlag,
  'c': clearSelection, 'C': clearSelection,
  'b': toggleBookmark, 'B': toggleBookmark,
  '1': () => pickOption(0), '2': () => pickOption(1),
  '3': () => pickOption(2), '4': () => pickOption(3),
  '5': () => pickOption(4), '6': () => pickOption(5),
  '7': () => pickOption(6), '8': () => pickOption(7)
});

  }



  function onExit() {
    stopTimer();
    releaseWakeLock();
    clearSavedState();
  }

  /* ============ SUBMIT ============ */
  function submitExam(auto) {
    if (state.submitted) return;
    stopTimer();
    releaseWakeLock();
    clearSavedState();
  state.submitted = true;
    state.timeUsed = Math.floor((Date.now() - state.startTime) / 1000);

    /* Record wrong questions + stats */
    state.questions.forEach((q, i) => {
      const ans = state.answers[i];
      if (ans === null) return; // unattempted: skip
      const isCorrect = ans === q.answer;
      if (isCorrect) WrongQuestions.markCorrect(q.id);
      else WrongQuestions.markWrong(q.id);
      QuestionStats.recordAttempt(q.id, isCorrect);
    });

    if (!state.historySaved) {
      let correct = 0, wrong = 0, unattempted = 0;
      state.questions.forEach((q, i) => {
        const a = state.answers[i];
        if (a === null) unattempted++;
        else if (a === q.answer) correct++;
        else wrong++;
      });
      const attempted = correct + wrong;
      const accuracy = attempted > 0 ? parseFloat(((correct / attempted) * 100).toFixed(2)) : 0;
      const score = correct * state.config.positive - wrong * state.config.negative;
      History.add({
        mode: 'Exam',
        title: state.config.title || state.config.subject || 'Exam',
        total: state.questions.length,
        correct, wrong, unattempted,
        score: parseFloat(score.toFixed(2)),
        accuracy,
        timeUsed: state.timeUsed
      });
      state.historySaved = true;
    }

    if (auto) alert('⏱ Time is up! Your exam has been submitted automatically.');
    App.navigate('exam-result');
  }

  /* ============ RESULT ============ */
  function renderResult() {
    const app = document.getElementById('app');
    const total = state.questions.length;
    const positive = state.config.positive;
    const negative = state.config.negative;

    let correct = 0, wrong = 0, unattempted = 0;
    state.questions.forEach((q, i) => {
      const a = state.answers[i];
      if (a === null) unattempted++;
      else if (a === q.answer) correct++;
      else wrong++;
    });

    const attempted = correct + wrong;
    const positiveMarks = correct * positive;
    const negativeMarks = wrong * negative;
    const finalScore = positiveMarks - negativeMarks;
    const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(2) : '0.00';
    const fmt = (n) => Number.isInteger(n) ? n : parseFloat(n.toFixed(2));
    const usedM = Math.floor(state.timeUsed / 60);
    const usedS = state.timeUsed % 60;

    app.innerHTML = `
      <section class="result-screen">
        <div class="dashboard-header">
          <h1>Exam Complete</h1>
          <p class="text-muted">Review your performance below</p>
        </div>
        <div class="score-banner">
          <div class="score-main">
            <span class="score-value">${fmt(finalScore)}</span>
            <span class="score-label">Final Score</span>
          </div>
        </div>
        <div class="result-grid">
          <div class="result-stat"><span class="result-value">${total}</span><span class="result-label">Total</span></div>
          <div class="result-stat"><span class="result-value">${attempted}</span><span class="result-label">Attempted</span></div>
          <div class="result-stat result-correct"><span class="result-value">${correct}</span><span class="result-label">Correct</span></div>
          <div class="result-stat result-wrong"><span class="result-value">${wrong}</span><span class="result-label">Wrong</span></div>
          <div class="result-stat result-unattempted"><span class="result-value">${unattempted}</span><span class="result-label">Unattempted</span></div>
          <div class="result-stat result-accuracy"><span class="result-value">${accuracy}%</span><span class="result-label">Accuracy</span></div>
        </div>
        <div class="marks-summary">
          <div class="marks-row"><span>Positive marks (${correct} × ${fmt(positive)})</span><strong class="marks-pos">+${fmt(positiveMarks)}</strong></div>
          <div class="marks-row"><span>Negative marks (${wrong} × ${fmt(negative)})</span><strong class="marks-neg">−${fmt(negativeMarks)}</strong></div>
          <div class="marks-row marks-total"><span>Final Score</span><strong>${fmt(finalScore)}</strong></div>
          <div class="marks-row"><span>Time used</span><strong>${usedM}m ${usedS}s</strong></div>
        </div>
        <div class="result-actions">
          <button class="btn btn-secondary" id="res-dashboard" type="button">Back to Dashboard</button>
          <button class="btn btn-primary" id="res-review" type="button">Review Answers</button>
        </div>
      </section>`;

    document.getElementById('res-dashboard').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('res-review').addEventListener('click', () => App.navigate('exam-review'));
  }

  /* ============ REVIEW ============ */
  function renderReview() {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    let correctCount = 0, wrongCount = 0, unattemptedCount = 0;

    const cards = state.questions.map((q, i) => {
      const userAns = state.answers[i];
      const isCorrect = userAns !== null && userAns === q.answer;
      const isWrong = userAns !== null && userAns !== q.answer;

      let status, statusBadge, cardClass;
      if (isCorrect) {
        status = 'correct'; correctCount++;
        statusBadge = '<span class="review-status status-correct">✓ Correct</span>';
        cardClass = 'review-correct';
      } else if (isWrong) {
        status = 'wrong'; wrongCount++;
        statusBadge = '<span class="review-status status-wrong">✗ Wrong</span>';
        cardClass = 'review-wrong';
      } else {
        status = 'unattempted'; unattemptedCount++;
        statusBadge = '<span class="review-status status-unattempted">⚪ Not Attempted</span>';
        cardClass = 'review-unattempted';
      }

      const optionsHtml = q.options.map((opt, j) => {
        let cls = 'review-option';
        let label = '';
        if (opt === q.answer && opt === userAns) {
          cls += ' review-correct-option';
          label = '<span class="review-option-label label-correct">✓ Correct · Your Answer</span>';
        } else if (opt === q.answer) {
          cls += ' review-correct-option';
          label = '<span class="review-option-label label-correct">✓ Correct Answer</span>';
        } else if (opt === userAns) {
          cls += ' review-wrong-option';
          label = '<span class="review-option-label label-wrong">✗ Your Answer</span>';
        }
        return `
          <div class="${cls}">
            <span class="option-letter">${letters[j]}</span>
            <span class="option-text">${esc(opt)}</span>
            ${label}
          </div>`;
      }).join('');

      return `
        <div class="review-card ${cardClass}" data-status="${status}">
          <div class="review-header">
            <span class="review-number">Q${i + 1}</span>
            ${statusBadge}
          </div>
          <div class="quiz-meta">
            <span class="quiz-tag">${esc(q.subject)}</span>
            <span class="quiz-tag">${esc(q.subtopic)}</span>
            <span class="quiz-tag quiz-tag-id" title="Question ID">${esc(q.id)}</span>
          </div>
          <h3 class="review-question">${esc(q.question)}</h3>
          <div class="review-options">${optionsHtml}</div>
          ${q.explanation
            ? `<div class="review-explanation"><strong>Explanation:</strong> ${esc(q.explanation)}</div>`
            : ''}
          <div class="ai-section" data-ai-idx="${i}"></div>
        </div>`;
    }).join('');

    app.innerHTML = `
      <section class="review-screen">
        <div class="dashboard-header">
          <h1>Detailed Review</h1>
          <p class="text-muted">${state.questions.length} questions</p>
        </div>

        <div class="review-filters" id="review-filters">
          <button class="review-filter-btn active" data-filter="all" type="button">
            All <span class="count-pill">${state.questions.length}</span>
          </button>
          <button class="review-filter-btn" data-filter="correct" type="button">
            ✓ Correct <span class="count-pill">${correctCount}</span>
          </button>
          <button class="review-filter-btn" data-filter="wrong" type="button">
            ✗ Wrong <span class="count-pill">${wrongCount}</span>
          </button>
          <button class="review-filter-btn" data-filter="unattempted" type="button">
            ⚪ Unattempted <span class="count-pill">${unattemptedCount}</span>
          </button>
        </div>

        <div class="review-list" id="review-list">${cards}</div>

        <div class="review-empty" id="review-empty" hidden>
          <p class="text-muted">No questions match this filter.</p>
        </div>

        <div class="result-actions">
          <button class="btn btn-secondary" id="rev-back" type="button">Back to Result</button>
          <button class="btn btn-primary" id="rev-dashboard" type="button">Dashboard</button>
        </div>
      </section>

      <div class="scroll-fabs">
        <button class="scroll-fab" id="scroll-top" type="button" title="Go to top" aria-label="Go to top">↑</button>
        <button class="scroll-fab" id="scroll-bottom" type="button" title="Go to bottom" aria-label="Go to bottom">↓</button>
      </div>`;

    /* Filter logic */
    function applyFilter(filter) {
      let visible = 0;
      document.querySelectorAll('.review-card').forEach(card => {
        const show = filter === 'all' || card.dataset.status === filter;
        card.hidden = !show;
        if (show) visible++;
      });
      document.getElementById('review-empty').hidden = visible > 0;
      document.querySelectorAll('.review-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
    }

    document.querySelectorAll('.review-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
    });

    /* AI panels for every review card */
    document.querySelectorAll('.ai-section[data-ai-idx]').forEach(el => {
      const idx = parseInt(el.dataset.aiIdx, 10);
      const qq = state.questions[idx];
      if (qq) AI.attachPanel(el, qq);
    });



    /* Scroll buttons */
    document.getElementById('scroll-top').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('scroll-bottom').addEventListener('click', () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    document.getElementById('rev-back').addEventListener('click', () => App.navigate('exam-result'));
    document.getElementById('rev-dashboard').addEventListener('click', () => App.navigate('dashboard'));
  }

  return { renderSetup, renderQuiz, renderResult, renderReview, onExit, hasSavedState, resumeSaved, startCustom };
})();

window.Exam = Exam;
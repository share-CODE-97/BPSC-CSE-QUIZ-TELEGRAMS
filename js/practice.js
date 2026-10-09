/* ------------------------------------------------------------
   Practice Mode — with bookmark + wrong-question tracking
   ------------------------------------------------------------ */
const Practice = (() => {
  const state = {
    questions: [],
    answers: [],
    current: 0,
    config: null,
    historySaved: false
  };



  const SAVE_KEY = 'cse_quiz_active_practice';

  function saveState() {
    try {
      const snapshot = {
        questions: state.questions,
        answers: state.answers,
        current: state.current,
        config: state.config
      };
      sessionStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
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

  function hasSavedState() {
    return loadSavedState() !== null;
  }

  function resumeSaved() {
    const s = loadSavedState();
    if (!s) { App.navigate('dashboard'); return; }
    state.questions = s.questions;
    state.answers   = s.answers;
    state.current   = s.current;
    state.config    = s.config;
    state.historySaved = false;
    App.navigate('practice-quiz');
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
          <h1>Practice Mode</h1>
          <p class="text-muted">Choose your questions and start learning</p>
        </div>
        <form id="practice-form" class="form-card">
          <div class="form-row">
            <label for="ps-subject">Subject</label>
            <select id="ps-subject">
              ${subjects.map(s => {
                const count = QuestionManager.getQuestionsBySubject(s).length;
                return `<option value="${esc(s)}">${esc(s)} (${count})</option>`;
              }).join('')}
            </select>
          </div>
          <div class="form-row">
            <label for="ps-subtopic">Subtopic</label>
            <select id="ps-subtopic"></select>
          </div>
          <div class="form-row">
            <label for="ps-count">Number of questions</label>
            <input type="number" id="ps-count" min="1" value="${Settings.getPrefs().defaultCount}">
            <small class="text-muted" id="ps-available"></small>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="ps-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Start Practice</button>
          </div>
        </form>
      </section>`;

    const subjectSel = document.getElementById('ps-subject');
    if (params.subject && subjects.includes(params.subject)) {
      subjectSel.value = params.subject;
    }

    subjectSel.addEventListener('change', updateSubtopics);
    document.getElementById('ps-subtopic').addEventListener('change', updateAvailable);
    document.getElementById('ps-cancel').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('practice-form').addEventListener('submit', handleStart);
    updateSubtopics();
  }

  function updateSubtopics() {
    const subject = document.getElementById('ps-subject').value;
    const subtopicSel = document.getElementById('ps-subtopic');
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
    const subject = document.getElementById('ps-subject').value;
    const subtopic = document.getElementById('ps-subtopic').value;
    const pool = getPool(subject, subtopic);
    const countInput = document.getElementById('ps-count');
    countInput.max = pool.length;
    const currentVal = parseInt(countInput.value, 10) || 10;
    if (currentVal > pool.length) countInput.value = pool.length;
    document.getElementById('ps-available').textContent =
      `${pool.length} question${pool.length === 1 ? '' : 's'} available`;
  }

  function getPool(subject, subtopic) {
    if (subtopic === '__ALL__') return QuestionManager.getQuestionsBySubject(subject);
    return QuestionManager.getQuestionsBySubtopic(subject, subtopic);
  }

  function handleStart(e) {
    e.preventDefault();
    const subject = document.getElementById('ps-subject').value;
    const subtopic = document.getElementById('ps-subtopic').value;
    const requested = parseInt(document.getElementById('ps-count').value, 10);
    const pool = getPool(subject, subtopic);

    if (pool.length === 0) { alert('No questions available for this selection.'); return; }
    let count = requested;
    if (!Number.isFinite(count) || count < 1) { alert('Please enter a valid number.'); return; }
    if (count > pool.length) {
      alert(`Only ${pool.length} questions available. Starting with ${pool.length}.`);
      count = pool.length;
    }

    startPractice({
      subject,
      subtopic: subtopic === '__ALL__' ? null : subtopic,
      pool,
      count,
      title: subtopic === '__ALL__' ? subject : `${subject} · ${subtopic}`
    });
  }

  /* ============ START ============ */
  function startPractice(config) {
    const selected = Utils.shuffle(config.pool).slice(0, config.count);
    state.questions = selected.map(q => {
      const options = Utils.shuffle(q.options.map(o => ({ text: o, isCorrect: o === q.answer })));
      return {
        id: q.id,
        subject: q.subject,
        subtopic: q.subtopic,
        question: q.question,
        answer: q.answer,
        explanation: q.explanation || '',
        options
      };
    });
    state.answers = new Array(state.questions.length).fill(null);
    state.current = 0;
    state.config = config;
    state.historySaved = false;
    App.navigate('practice-quiz');
  }

  /* Launch a practice session directly from a list (dashboard shortcuts) */
  function startCustom(questions, title) {
    if (!questions || questions.length === 0) {
      alert('No questions available in this set.');
      return;
    }
    startPractice({
      subject: null,
      subtopic: null,
      pool: questions,
      count: questions.length,
      title
    });
  }

  /* ============ QUIZ ============ */
  function renderQuiz() {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    saveState();
    const total = state.questions.length;
    const q = state.questions[state.current];
    const selected = state.answers[state.current];
    const isAnswered = selected !== null;
    const isBookmarked = Bookmarks.has(q.id);
    const answeredCount = state.answers.filter(a => a !== null).length;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const progressPct = (answeredCount / total) * 100;

    /* ---- helpers shared by clicks and keyboard ---- */
    function goPrev() {
      if (state.current > 0) { state.current--; renderQuiz(); }
    }
    function goNext() {
      if (state.current < total - 1) { state.current++; renderQuiz(); }
      else App.navigate('practice-result');
    }
    function pickOption(idx) {
      if (state.answers[state.current] !== null) return;      // locked after answering
      if (idx < 0 || idx >= q.options.length) return;
      const chosen = q.options[idx].text;
      state.answers[state.current] = chosen;
      const isCorrect = chosen === q.answer;
      if (isCorrect) WrongQuestions.markCorrect(q.id);
      else WrongQuestions.markWrong(q.id);
      QuestionStats.recordAttempt(q.id, isCorrect);
      renderQuiz();
    }
    function toggleBookmark() {
      Bookmarks.toggle(q.id);
      renderQuiz();
    }

    const optionsHtml = q.options.map((opt, i) => {
      let cls = 'option-btn';
      let badge = '';
      if (isAnswered) {
        if (opt.isCorrect) {
          cls += ' option-correct';
          badge = '<span class="option-badge">✓ Correct</span>';
        } else if (opt.text === selected) {
          cls += ' option-wrong';
          badge = '<span class="option-badge">✗ Your answer</span>';
        } else {
          cls += ' option-disabled';
        }
      }
      return `
        <button class="${cls}" type="button" data-index="${i}" ${isAnswered ? 'disabled' : ''}>
          <span class="option-letter">${letters[i]}</span>
          <span class="option-text">${esc(opt.text)}</span>
          ${badge}
        </button>`;
    }).join('');

    let feedbackHtml = '';
    if (isAnswered) {
      const isCorrect = selected === q.answer;
      feedbackHtml = `
        <div class="feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}">
          <div class="feedback-title">${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</div>
          ${!isCorrect ? `<div class="feedback-line">Correct answer: <strong>${esc(q.answer)}</strong></div>` : ''}
          ${q.explanation ? `<div class="feedback-explanation"><strong>Explanation:</strong> ${esc(q.explanation)}</div>` : ''}
        </div>`;
    }

    app.innerHTML = `
      <section class="quiz-screen">
        <div class="quiz-topbar">
          <button class="btn btn-secondary" id="quiz-exit" type="button">← Exit</button>
          <div class="quiz-topbar-info">
            ${state.config.title ? `<div class="quiz-title-tag">${esc(state.config.title)}</div>` : ''}
            <div class="quiz-progress-text">Question ${state.current + 1} of ${total}</div>
          </div>
          <button class="btn-icon ${isBookmarked ? 'active' : ''}" id="quiz-bookmark"
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
          ${feedbackHtml}
          ${isAnswered ? `<div class="ai-section" id="ai-section"></div>` : ''}
        </div>
        <div class="quiz-nav">
          <button class="btn btn-secondary" id="quiz-prev" type="button"
            ${state.current === 0 ? 'disabled' : ''}>← Previous</button>
          <div class="quiz-nav-count">${answeredCount} / ${total} answered</div>
          <button class="btn btn-primary" id="quiz-next" type="button">
            ${state.current === total - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
      <div class="keyboard-hint">
        <span class="key">←</span>
        <span class="key">→</span> navigate
    ·   <span class="key">1–8</span> pick
    ·   <span class="key">Enter</span> next
    ·   <span class="key">B</span> bookmark
    ·   <span class="key">Esc</span> exit
    </div>
      </section>`;

    /* ---------- click handlers ---------- */
    document.getElementById('quiz-exit').addEventListener('click', () => {
      if (confirm('Exit practice? Your progress will be lost.')) App.navigate('dashboard');
    });
    document.getElementById('quiz-prev').addEventListener('click', goPrev);
    document.getElementById('quiz-next').addEventListener('click', goNext);
    document.getElementById('quiz-bookmark').addEventListener('click', toggleBookmark);

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => pickOption(parseInt(btn.dataset.index, 10)));
    });


    /* AI panel — only after the user has answered */
    const aiSection = document.getElementById('ai-section');
    if (aiSection && isAnswered) {
      AI.attachPanel(aiSection, q);
    }


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
    if (confirm('Exit practice? Your progress will be lost.')) App.navigate('dashboard');
  },

  'b': toggleBookmark, 'B': toggleBookmark,
  '1': () => pickOption(0), '2': () => pickOption(1),
  '3': () => pickOption(2), '4': () => pickOption(3),
  '5': () => pickOption(4), '6': () => pickOption(5),
  '7': () => pickOption(6), '8': () => pickOption(7)
  });
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
        if (opt.isCorrect && opt.text === userAns) {
          cls += ' review-correct-option';
          label = '<span class="review-option-label label-correct">✓ Correct · Your Answer</span>';
        } else if (opt.isCorrect) {
          cls += ' review-correct-option';
          label = '<span class="review-option-label label-correct">✓ Correct Answer</span>';
        } else if (opt.text === userAns) {
          cls += ' review-wrong-option';
          label = '<span class="review-option-label label-wrong">✗ Your Answer</span>';
        }
        return `
          <div class="${cls}">
            <span class="option-letter">${letters[j]}</span>
            <span class="option-text">${esc(opt.text)}</span>
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
          <h1>Practice Review</h1>
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
          <button class="btn btn-secondary" id="prev-result" type="button">Back to Result</button>
          <button class="btn btn-primary" id="prev-dashboard" type="button">Dashboard</button>
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

    document.getElementById('prev-result').addEventListener('click', () => App.navigate('practice-result'));
    document.getElementById('prev-dashboard').addEventListener('click', () => App.navigate('dashboard'));
  }





  /* ============ RESULT ============ */
  function renderResult() {
    const app = document.getElementById('app');
    const total = state.questions.length;

    let correct = 0, wrong = 0, unattempted = 0;
    state.questions.forEach((q, i) => {
      const ans = state.answers[i];
      if (ans === null) unattempted++;
      else if (ans === q.answer) correct++;
      else wrong++;
    });

    const attempted = correct + wrong;
    const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(2) : '0.00';
    clearSavedState();

    if (!state.historySaved) {
      History.add({
        mode: 'Practice',
        title: state.config.title || state.config.subject || 'Practice',
        total, correct, wrong, unattempted,
        score: correct,
        accuracy: parseFloat(accuracy),
        timeUsed: 0
      });
      state.historySaved = true;
    }

    app.innerHTML = `
      <section class="result-screen">
        <div class="dashboard-header">
          <h1>Practice Complete</h1>
          <p class="text-muted">Here's how you did</p>
        </div>
        <div class="result-grid">
          <div class="result-stat"><span class="result-value">${total}</span><span class="result-label">Total</span></div>
          <div class="result-stat result-correct"><span class="result-value">${correct}</span><span class="result-label">Correct</span></div>
          <div class="result-stat result-wrong"><span class="result-value">${wrong}</span><span class="result-label">Wrong</span></div>
          <div class="result-stat result-unattempted"><span class="result-value">${unattempted}</span><span class="result-label">Unattempted</span></div>
          <div class="result-stat result-accuracy"><span class="result-value">${accuracy}%</span><span class="result-label">Accuracy</span></div>
        </div>
        <div class="result-actions">
          <button class="btn btn-secondary" id="res-dashboard" type="button">Back to Dashboard</button>
          <button class="btn btn-secondary" id="res-retry" type="button">Practice Again</button>
          <button class="btn btn-primary" id="res-review" type="button">Review Answers</button>
        </div>
      </section>`;

    document.getElementById('res-dashboard').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('res-retry').addEventListener('click', () => {
      Practice.startCustom(state.config.pool, state.config.title);
    });
    document.getElementById('res-review').addEventListener('click', () => App.navigate('practice-review'));
  }

  return { renderSetup, renderQuiz, renderResult, renderReview, startCustom };
})();

window.Practice = Practice;
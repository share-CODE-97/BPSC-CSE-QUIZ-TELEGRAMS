/* ------------------------------------------------------------
   Review Session — pull only SRS-due questions, update schedule
   ------------------------------------------------------------ */
const Review = (() => {
  const state = {
    questions: [],
    answers: [],
    current: 0,
    config: null,
    historySaved: false,
    intervals: []   /* human-readable "next review in" per question */
  };

  const SAVE_KEY = 'cse_quiz_active_review';

  /* ---------- Save / resume ---------- */
  function saveState() {
    try {
      sessionStorage.setItem(SAVE_KEY, JSON.stringify({
        questions: state.questions,
        answers: state.answers,
        current: state.current,
        config: state.config,
        intervals: state.intervals
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
    state.answers   = s.answers;
    state.current   = s.current;
    state.config    = s.config;
    state.intervals = s.intervals || new Array(s.questions.length).fill('');
    state.historySaved = false;
    App.navigate('review-quiz');
  }

  /* ---------- Start ---------- */
  function start() {
    if (!SRS.isEnabled()) {
      alert('Spaced Repetition is not enabled. Turn it on in Settings → SRS.');
      return;
    }
    const due = SRS.getDueQuestions();
    if (due.length === 0) {
      alert('Nothing due for review right now. Come back later!');
      return;
    }
    /* Cap a session at 30 questions to keep it manageable */
    const picked = Utils.shuffle(due).slice(0, 30);

    state.questions = picked.map(q => {
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
    state.answers   = new Array(state.questions.length).fill(null);
    state.intervals = new Array(state.questions.length).fill('');
    state.current   = 0;
    state.config    = { title: 'Review Session' };
    state.historySaved = false;

    App.navigate('review-quiz');
  }

  /* ---------- Quiz ---------- */
  function renderQuiz() {
    saveState();
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const total = state.questions.length;
    const q = state.questions[state.current];
    const selected = state.answers[state.current];
    const isAnswered = selected !== null;
    const isBookmarked = Bookmarks.has(q.id);
    const answeredCount = state.answers.filter(a => a !== null).length;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const progressPct = (answeredCount / total) * 100;

    function goPrev() { if (state.current > 0) { state.current--; renderQuiz(); } }
    function goNext() {
      if (state.current < total - 1) { state.current++; renderQuiz(); }
      else App.navigate('review-result');
    }
    function pickOption(idx) {
      if (state.answers[state.current] !== null) return;
      if (idx < 0 || idx >= q.options.length) return;
      const chosen = q.options[idx].text;
      const isCorrect = chosen === q.answer;
      state.answers[state.current] = chosen;

      /* Record into SRS + QuestionStats */
      if (isCorrect) WrongQuestions.markCorrect(q.id);
      else WrongQuestions.markWrong(q.id);
      QuestionStats.recordAttempt(q.id, isCorrect);
      SRS.recordReview(q.id, isCorrect);

      const rec = SRS.getRecord(q.id);
      state.intervals[state.current] = rec ? SRS.formatInterval(rec.interval) : '';

      renderQuiz();
    }
    function toggleBookmark() {
      Bookmarks.toggle(q.id);
      renderQuiz();
    }

    /* Options */
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

    /* Feedback + next-review badge */
    let feedbackHtml = '';
    if (isAnswered) {
      const isCorrect = selected === q.answer;
      const nextTxt = state.intervals[state.current];
      feedbackHtml = `
        <div class="feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}">
          <div class="feedback-title">${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</div>
          ${!isCorrect ? `<div class="feedback-line">Correct answer: <strong>${esc(q.answer)}</strong></div>` : ''}
          ${nextTxt ? `<div class="srs-next"><span class="srs-next-label">🧠 Next review in</span> <strong>${esc(nextTxt)}</strong></div>` : ''}
          ${q.explanation ? `<div class="feedback-explanation"><strong>Explanation:</strong> ${esc(q.explanation)}</div>` : ''}
        </div>`;
    }

    app.innerHTML = `
      <section class="quiz-screen">
        <div class="quiz-topbar">
          <button class="btn btn-secondary" id="rv-exit" type="button">← Exit</button>
          <div class="quiz-topbar-info">
            <div class="quiz-title-tag">🧠 Review Session</div>
            <div class="quiz-progress-text">Question ${state.current + 1} of ${total}</div>
          </div>
          <button class="btn-icon ${isBookmarked ? 'active' : ''}" id="rv-bookmark"
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
          ${SRS.badgeFor(q.id) ? `<span class="quiz-tag quiz-tag-srs">${SRS.badgeFor(q.id)}</span>` : ''}
        </div>
        <div class="question-card">
          <h2 class="question-text">${esc(q.question)}</h2>
          <div class="options-list">${optionsHtml}</div>
          ${feedbackHtml}
          ${isAnswered ? `<div class="ai-section" id="ai-section"></div>` : ''}
        </div>
        <div class="quiz-nav">
          <button class="btn btn-secondary" id="rv-prev" type="button"
            ${state.current === 0 ? 'disabled' : ''}>← Previous</button>
          <div class="quiz-nav-count">${answeredCount} / ${total} answered</div>
          <button class="btn btn-primary" id="rv-next" type="button">
            ${state.current === total - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
        <div class="keyboard-hint">
          <span class="key">←</span><span class="key">→</span> navigate
          · <span class="key">1–8</span> pick
          · <span class="key">Enter</span> next
          · <span class="key">B</span> bookmark
          · <span class="key">Esc</span> exit
        </div>
      </section>`;

    /* Click handlers */
    document.getElementById('rv-exit').addEventListener('click', () => {
      if (confirm('Exit review session? Progress on answered questions is saved.')) {
        App.navigate('dashboard');
      }
    });
    document.getElementById('rv-prev').addEventListener('click', goPrev);
    document.getElementById('rv-next').addEventListener('click', goNext);
    document.getElementById('rv-bookmark').addEventListener('click', toggleBookmark);
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => pickOption(parseInt(btn.dataset.index, 10)));
    });

    /* AI panel */
    const aiSection = document.getElementById('ai-section');
    if (aiSection && isAnswered) AI.attachPanel(aiSection, q);

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
      'Escape':     () => App.navigate('dashboard'),
      'b': toggleBookmark, 'B': toggleBookmark,
      '1': () => pickOption(0), '2': () => pickOption(1),
      '3': () => pickOption(2), '4': () => pickOption(3),
      '5': () => pickOption(4), '6': () => pickOption(5),
      '7': () => pickOption(6), '8': () => pickOption(7)
    });
  }

  /* ---------- Result ---------- */
  function renderResult() {
    clearSavedState();
    const app = document.getElementById('app');
    const total = state.questions.length;
    let correct = 0, wrong = 0;
    state.questions.forEach((q, i) => {
      const a = state.answers[i];
      if (a === null) return;
      if (a === q.answer) correct++;
      else wrong++;
    });

    if (!state.historySaved) {
      History.add({
        mode: 'Review',
        title: 'SRS Review Session',
        total,
        correct,
        wrong,
        unattempted: total - correct - wrong,
        score: correct,
        accuracy: (correct + wrong) > 0 ? parseFloat(((correct / (correct + wrong)) * 100).toFixed(2)) : 0,
        timeUsed: 0
      });
      state.historySaved = true;
    }

    app.innerHTML = `
      <section class="result-screen">
        <div class="dashboard-header">
          <h1>Review Complete</h1>
          <p class="text-muted">Your schedule has been updated.</p>
        </div>
        <div class="result-grid">
          <div class="result-stat"><span class="result-value">${total}</span><span class="result-label">Reviewed</span></div>
          <div class="result-stat result-correct"><span class="result-value">${correct}</span><span class="result-label">Correct</span></div>
          <div class="result-stat result-wrong"><span class="result-value">${wrong}</span><span class="result-label">Wrong</span></div>
          <div class="result-stat result-accuracy"><span class="result-value">${SRS.getDueCount()}</span><span class="result-label">Still Due</span></div>
        </div>
        <div class="result-actions">
          <button class="btn btn-secondary" id="rv-res-dashboard" type="button">Dashboard</button>
          <button class="btn btn-primary" id="rv-res-again" type="button">Review Again</button>
        </div>
      </section>`;

    document.getElementById('rv-res-dashboard').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('rv-res-again').addEventListener('click', () => {
      Review.start();
    });
  }

  return { start, renderQuiz, renderResult, hasSavedState, resumeSaved };
})();

window.Review = Review;
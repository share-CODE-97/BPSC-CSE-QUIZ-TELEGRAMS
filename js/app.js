/* ------------------------------------------------------------
   App — router + dashboard
   ------------------------------------------------------------ */
const App = {
  init() {
    Settings.init();
    if (window.QuestionStats && QuestionStats.migrateFromOld) QuestionStats.migrateFromOld();
    this.registerServiceWorker();
    this.captureInstallPrompt();
    this.navigate('dashboard');
  },

  /* Register the service worker (enables offline + Android install) */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('Service worker registration failed:', err);
      });
    }
  },

  // ...rest unchanged


  /* ---------- PWA install prompt ---------- */
  deferredInstallPrompt: null,

  captureInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      App.deferredInstallPrompt = e;
      // If settings screen is open, refresh it so button appears
      if (document.getElementById('data-install')) return;
    });
  },

  async triggerInstall() {
    const evt = App.deferredInstallPrompt;
    if (!evt) {
      alert('To install: tap your browser menu (⋮) and choose "Install app" or "Add to Home screen".');
      return;
    }
    evt.prompt();
    const choice = await evt.userChoice;
    App.deferredInstallPrompt = null;
    if (choice && choice.outcome === 'accepted') {
      const btn = document.getElementById('data-install');
      if (btn) btn.textContent = 'Installed ✓';
    }
  },






  navigate(view, params) {
    const app = document.getElementById('app');
    if (!app) return;

    Keyboard.unbind();   /* clear any keybindings from the previous screen */
    if (window.Exam && Exam.onExit) Exam.onExit();
    app.innerHTML = '';

    switch (view) {
      case 'dashboard':       this.renderDashboard();       break;

      case 'practice-setup':  Practice.renderSetup(params); break;
      case 'practice-quiz':   Practice.renderQuiz();        break;
      case 'practice-result': Practice.renderResult();      break;
      case 'practice-review': Practice.renderReview();      break;

      case 'study-setup':     Study.renderSetup(params);    break;
      case 'study-quiz':      Study.renderQuiz();           break;
      case 'study-complete':  Study.renderComplete();       break;

      case 'weak-questions':  Weak.renderScreen();          break;

      case 'performance':          Performance.renderScreen();          break;
      case 'performance-subject':  Performance.renderSubject(params);    break;

      case 'mixed-setup':          Mixed.renderSetup();                  break;

      case 'exam-setup':      Exam.renderSetup(params);     break;
      case 'exam-quiz':       Exam.renderQuiz();            break;
      case 'exam-result':     Exam.renderResult();          break;
      case 'exam-review':     Exam.renderReview();          break;

      case 'settings':        Settings.renderScreen();      break;

      default: this.renderDashboard();
    }
    window.scrollTo(0, 0);
  },

  /* ---------- shortcuts ---------- */
  practiceAll() {
    Practice.startCustom(QuestionManager.getAllQuestions(), 'All Questions');
  },
  practiceWrong() {
    const qs = QuestionStats.getWeakQuestions('all');
    if (qs.length === 0) { alert('No weak questions saved yet.'); return; }
    Practice.startCustom(qs, 'Weak Questions');
  },
  practiceBookmarked() {
    const qs = Bookmarks.getQuestions();
    if (qs.length === 0) { alert('No bookmarks yet.'); return; }
    Practice.startCustom(qs, 'Bookmarked Questions');
  },
  clearWrong() {
    if (confirm(`Clear all ${QuestionStats.getCount()} weak-question records?`)) {
      QuestionStats.clear();
      WrongQuestions.clear();
      this.navigate('dashboard');
    }
  },
  clearBookmarks() {
    if (confirm(`Clear all ${Bookmarks.getCount()} bookmarks?`)) {
      Bookmarks.clear();
            this.navigate('dashboard');
    }
  },
  clearHistory() {
    if (confirm('Clear all attempt history?')) {
      History.clear();
            this.navigate('dashboard');
    }
  },


  /* ---------- streak ---------- */
  getStreak() {
    const history = History.getAll();
    if (history.length === 0) return 0;
    const dates = new Set(history.map(h => new Date(h.date).toDateString()));
    const today = new Date();
    const startOffset = dates.has(today.toDateString()) ? 0 : 1;
    let streak = 0;
    for (let i = startOffset; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (dates.has(d.toDateString())) streak++;
      else break;
    }
    return streak;
  },





  /* ---------- dashboard ---------- */
  renderDashboard() {
    const app = document.getElementById('app');
    const stats = QuestionManager.getStats();
    const subjects = QuestionManager.getSubjects();
    const esc = Utils.escapeHtml;
    const wrongCount = QuestionStats.getCount();
    const bookmarkCount = Bookmarks.getAll().length;
    const recentHistory = History.getRecent(5);

    const streak = App.getStreak();


    const hasExamResume = window.Exam && Exam.hasSavedState && Exam.hasSavedState();
    const hasPracticeResume = window.Practice && Practice.hasSavedState && Practice.hasSavedState();
    const hasStudyResume = window.Study && Study.hasSavedState && Study.hasSavedState();
    let resumeBanner = '';
    if (hasExamResume || hasPracticeResume || hasStudyResume) {
      const kind = hasExamResume ? 'exam' : (hasPracticeResume ? 'practice' : 'study');
      resumeBanner = `
        <div class="resume-banner">
          <div>
            <strong>Unfinished ${kind} detected</strong>
            <div class="text-muted" style="font-size:0.85rem;">You left a session in progress. Resume?</div>
          </div>
          <div class="resume-actions">
            <button class="btn btn-secondary btn-sm" id="resume-dismiss" type="button">Discard</button>
            <button class="btn btn-primary btn-sm" id="resume-go" type="button" data-kind="${kind}">Resume</button>
          </div>
        </div>`;
    }


    const historyHtml = recentHistory.length === 0
      ? `<p class="text-muted">No completed attempts yet.</p>`
      : `<div class="history-list">
          ${recentHistory.map(h => {
            const d = new Date(h.date);
            const dateStr = d.toLocaleDateString() + ' ' +
                            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const cls = h.mode === 'Exam' ? 'history-exam' : 'history-practice';
            return `
              <div class="history-row">
                <span class="history-badge ${cls}">${esc(h.mode)}</span>
                <span class="history-title">${esc(h.title)}</span>
                <span class="history-meta">
                  <strong>${h.correct}/${h.total}</strong>
                  <span class="text-muted">· ${h.accuracy}%</span>
                </span>
                <span class="history-date text-muted">${dateStr}</span>
              </div>`;
          }).join('')}
        </div>
        <div class="history-clear-wrap">
          <button class="btn btn-secondary btn-sm" id="clear-history">Clear History</button>
        </div>`;

    app.innerHTML = `
      <section class="dashboard">
        <div class="dashboard-header">
          <h1>Dashboard</h1>
          <p class="text-muted">Your offline CSE exam preparation hub</p>
        </div>

        ${resumeBanner}


        <div class="stats-grid">
          <div class="stat-card"><span class="stat-value">${stats.subjects}</span><span class="stat-label">Subjects</span></div>
          <div class="stat-card"><span class="stat-value">${stats.questions}</span><span class="stat-label">Questions</span></div>
          <div class="stat-card"><span class="stat-value">${stats.subtopics}</span><span class="stat-label">Subtopics</span></div>
          <div class="stat-card"><span class="stat-value">${streak}🔥</span><span class="stat-label">Day Streak</span></div>
        </div>

        <h2 class="section-title">Quiz Modes</h2>
        <div class="mode-grid">
          <div class="mode-card clickable" id="card-study" role="button" tabindex="0">
            <h3>📚 Study Mode</h3>
            <p>Read questions and reveal answers. No pressure, no scoring.</p>
            <button class="btn btn-primary" type="button">Start Studying</button>
          </div>
          <div class="mode-card clickable" id="card-practice" role="button" tabindex="0">
            <h3>📖 Practice Mode</h3>
            <p>Test yourself with instant feedback.</p>
            <button class="btn btn-primary" type="button">Start Practice</button>
          </div>
          <div class="mode-card clickable" id="card-exam" role="button" tabindex="0">
            <h3>📝 Exam Mode</h3>
            <p>Timed, marked, and flagged — like the real exam.</p>
            <button class="btn btn-primary" type="button">Start Exam</button>
          </div>
          <div class="mode-card clickable" id="card-mixed" role="button" tabindex="0">
            <h3>🎲 Mixed Quiz</h3>
            <p>Random questions from multiple subjects or your weak list.</p>
            <button class="btn btn-primary" type="button">Start Mixed</button>
          </div>
        </div>

        <h2 class="section-title">Subjects</h2>
        <div class="subject-grid">
          ${subjects.map(sub => {
            const count = QuestionManager.getQuestionsBySubject(sub).length;
            const subtopics = QuestionManager.getSubtopics(sub);
            return `
              <div class="subject-card clickable"
                   data-subject="${esc(sub)}" role="button" tabindex="0">
                <h3>${esc(sub)}</h3>
                <p class="text-muted">${count} questions · ${subtopics.length} subtopics</p>
              </div>`;
          }).join('')}
        </div>

        <h2 class="section-title">Question Practice</h2>
        <div class="practice-grid">
          <div class="practice-card clickable" id="card-all" role="button" tabindex="0">
            <h3>All Questions</h3>
            <p>Practice the entire question bank.</p>
            <button class="btn btn-secondary" type="button">Start</button>
          </div>
          <div class="practice-card clickable ${wrongCount === 0 ? 'disabled' : ''}"
               id="card-wrong" role="button" tabindex="0">
            <h3>Weak Questions <span class="count-pill">${wrongCount}</span></h3>
            <p>Review questions you've struggled with.</p>
            <button class="btn btn-secondary" type="button" ${wrongCount === 0 ? 'disabled' : ''}>
              ${wrongCount === 0 ? 'None yet' : 'View'}
            </button>
            ${wrongCount > 0 ? `<button class="btn btn-link btn-sm" id="clear-wrong" type="button">Clear</button>` : ''}
          </div>
          <div class="practice-card clickable ${bookmarkCount === 0 ? 'disabled' : ''}"
               id="card-bookmarks" role="button" tabindex="0">
            <h3>Bookmarked <span class="count-pill">${bookmarkCount}</span></h3>
            <p>Practice your saved questions.</p>
            <button class="btn btn-secondary" type="button" ${bookmarkCount === 0 ? 'disabled' : ''}>
              ${bookmarkCount === 0 ? 'None yet' : 'Practice'}
            </button>
            ${bookmarkCount > 0 ? `<button class="btn btn-link btn-sm" id="clear-bookmarks" type="button">Clear</button>` : ''}
          </div>

          <div class="practice-card clickable" id="card-performance" role="button" tabindex="0">
            <h3>📊 Performance</h3>
            <p>See your accuracy by subject and subtopic.</p>
            <button class="btn btn-secondary" type="button">View</button>
          </div>
        </div>

        <h2 class="section-title">Recent Attempts</h2>
        ${historyHtml}
      </section>`;


    const resumeGo = document.getElementById('resume-go');
    if (resumeGo) {
      resumeGo.addEventListener('click', () => {
        const kind = resumeGo.dataset.kind;
        if (kind === 'exam') Exam.resumeSaved();
        else if (kind === 'practice') Practice.resumeSaved();
        else Study.resumeSaved();
      });
    }
    const resumeDismiss = document.getElementById('resume-dismiss');
    if (resumeDismiss) {
      resumeDismiss.addEventListener('click', () => {
        if (hasExamResume) Exam.onExit && Exam.onExit();
        if (hasPracticeResume) {
          try { sessionStorage.removeItem('cse_quiz_active_practice'); } catch (e) {}
        }
        if (hasStudyResume) {
          try { sessionStorage.removeItem('cse_quiz_active_study'); } catch (e) {}
        }
        App.navigate('dashboard');
      });
    }




    /* wire up */
    document.getElementById('card-study').addEventListener('click', () => App.navigate('study-setup'));
    document.getElementById('card-mixed').addEventListener('click', () => App.navigate('mixed-setup'));
    document.getElementById('card-practice').addEventListener('click', () => App.navigate('practice-setup'));
    document.getElementById('card-exam').addEventListener('click', () => App.navigate('exam-setup'));

    document.querySelectorAll('.subject-card.clickable').forEach(card => {
      card.addEventListener('click', () => {
        App.navigate('practice-setup', { subject: card.dataset.subject });
      });
    });

    document.getElementById('card-all').addEventListener('click', () => App.practiceAll());
    document.getElementById('card-performance').addEventListener('click', () => App.navigate('performance'));
    document.getElementById('card-wrong').addEventListener('click', (e) => {
      if (e.target.id === 'clear-wrong') return;
      if (wrongCount === 0) return;
      App.navigate('weak-questions');
    });
    document.getElementById('card-bookmarks').addEventListener('click', (e) => {
      if (e.target.id === 'clear-bookmarks') return;
      if (bookmarkCount === 0) return;
      App.practiceBookmarked();
    });

    const cw = document.getElementById('clear-wrong');
    if (cw) cw.addEventListener('click', (e) => { e.stopPropagation(); App.clearWrong(); });
    const cb = document.getElementById('clear-bookmarks');
    if (cb) cb.addEventListener('click', (e) => { e.stopPropagation(); App.clearBookmarks(); });
    const ch = document.getElementById('clear-history');
    if (ch) ch.addEventListener('click', () => App.clearHistory());

    /* Make role=button cards respond to Enter/Space */
    document.querySelectorAll('[role="button"][tabindex="0"]').forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
/* ------------------------------------------------------------
   Weak Questions screen — categorize by wrong count
   ------------------------------------------------------------ */
const Weak = (() => {
  function renderScreen() {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const cats = QuestionStats.getWeakCategorized();
    const bySubject = QuestionStats.getWeakBySubject();
    const total = cats.frequent.length + cats.repeated.length + cats.once.length;

    if (total === 0) {
      app.innerHTML = `
        <section class="weak-screen">
          <div class="dashboard-header">
            <h1>Weak Questions</h1>
            <p class="text-muted">No weak questions yet. Keep practicing!</p>
          </div>
          <div class="result-actions">
            <button class="btn btn-primary" id="weak-back" type="button">Back to Dashboard</button>
          </div>
        </section>`;
      document.getElementById('weak-back').addEventListener('click', () => App.navigate('dashboard'));
      return;
    }

    const subjectRows = Object.entries(bySubject)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([subject, s]) => `
        <div class="weak-subject-row">
          <div class="weak-subject-name">${esc(subject)}</div>
          <div class="weak-subject-counts">
            <strong>${s.total}</strong> weak
            ${s.frequent > 0 ? `<span class="count-pill weak-pill-frequent">${s.frequent}🔴</span>` : ''}
            ${s.repeated > 0 ? `<span class="count-pill weak-pill-repeated">${s.repeated}🟠</span>` : ''}
            ${s.once > 0 ? `<span class="count-pill">${s.once}🟡</span>` : ''}
          </div>
        </div>`).join('');

    app.innerHTML = `
      <section class="weak-screen">
        <div class="dashboard-header">
          <h1>Weak Questions</h1>
          <p class="text-muted">Questions you've struggled with, sorted by how often you got them wrong</p>
        </div>

        <div class="weak-categories">
          <div class="weak-cat weak-cat-frequent">
            <div class="weak-cat-header">
              <span class="weak-cat-label">🔴 Frequently Wrong</span>
              <span class="weak-cat-count">${cats.frequent.length}</span>
            </div>
            <p class="text-muted">Failed 3+ times</p>
            <button class="btn btn-primary btn-sm" data-practice="frequent" type="button" ${cats.frequent.length === 0 ? 'disabled' : ''}>
              Practice (${cats.frequent.length})
            </button>
          </div>

          <div class="weak-cat weak-cat-repeated">
            <div class="weak-cat-header">
              <span class="weak-cat-label">🟠 Repeatedly Wrong</span>
              <span class="weak-cat-count">${cats.repeated.length}</span>
            </div>
            <p class="text-muted">Failed 2 times</p>
            <button class="btn btn-primary btn-sm" data-practice="repeated" type="button" ${cats.repeated.length === 0 ? 'disabled' : ''}>
              Practice (${cats.repeated.length})
            </button>
          </div>

          <div class="weak-cat weak-cat-once">
            <div class="weak-cat-header">
              <span class="weak-cat-label">🟡 Once Wrong</span>
              <span class="weak-cat-count">${cats.once.length}</span>
            </div>
            <p class="text-muted">Failed once</p>
            <button class="btn btn-primary btn-sm" data-practice="once" type="button" ${cats.once.length === 0 ? 'disabled' : ''}>
              Practice (${cats.once.length})
            </button>
          </div>
        </div>

        <div class="weak-all-wrap">
          <button class="btn btn-primary" id="weak-practice-all" type="button">
            🎯 Practice All Weak Questions (${total})
          </button>
        </div>

        <h2 class="section-title">By Subject</h2>
        <div class="weak-subject-list">
          ${subjectRows}
        </div>

        <div class="result-actions">
          <button class="btn btn-secondary" id="weak-back" type="button">Back to Dashboard</button>
          <button class="btn btn-danger" id="weak-clear" type="button">Clear All Weak Questions</button>
        </div>
      </section>`;

    document.querySelectorAll('[data-practice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.practice;
        const questions = QuestionStats.getWeakQuestions(cat);
        if (questions.length === 0) return;
        const title = { frequent: 'Frequently Wrong', repeated: 'Repeatedly Wrong', once: 'Once Wrong' }[cat];
        Practice.startCustom(questions, title);
      });
    });

    document.getElementById('weak-practice-all').addEventListener('click', () => {
      const questions = QuestionStats.getWeakQuestions('all');
      if (questions.length === 0) return;
      Practice.startCustom(questions, 'All Weak Questions');
    });

    document.getElementById('weak-back').addEventListener('click', () => App.navigate('dashboard'));
    document.getElementById('weak-clear').addEventListener('click', () => {
      if (!confirm('Clear all weak-question statistics? This cannot be undone.')) return;
      QuestionStats.clear();
      WrongQuestions.clear();
      App.navigate('dashboard');
    });
  }

  return { renderScreen };
})();

window.Weak = Weak;
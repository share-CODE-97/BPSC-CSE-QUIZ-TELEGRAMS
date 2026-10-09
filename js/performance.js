/* ------------------------------------------------------------
   Performance — subject & subtopic analytics from QuestionStats
   ------------------------------------------------------------ */
const Performance = (() => {

  function pct(rec) {
    if (!rec || !rec.attempts) return 0;
    return (rec.correct / rec.attempts) * 100;
  }

  function barClass(acc) {
    if (acc >= 75) return 'perf-good';
    if (acc >= 50) return 'perf-ok';
    return 'perf-low';
  }

  /* Aggregate per subject across all attempted questions */
  function getSubjectStats() {
    const all = QuestionStats.getAll();
    const by = {};
    QuestionManager.getAllQuestions().forEach(q => {
      const rec = all[q.id];
      if (!rec || !rec.attempts) return;
      if (!by[q.subject]) by[q.subject] = { attempts: 0, correct: 0, wrong: 0, lastAt: null };
      by[q.subject].attempts += rec.attempts || 0;
      by[q.subject].correct  += rec.correct  || 0;
      by[q.subject].wrong    += rec.wrong    || 0;
      if (rec.lastAttemptAt) {
        if (!by[q.subject].lastAt || rec.lastAttemptAt > by[q.subject].lastAt) {
          by[q.subject].lastAt = rec.lastAttemptAt;
        }
      }
    });
    return Object.entries(by).map(([subject, s]) => ({
      subject,
      attempts: s.attempts,
      correct: s.correct,
      wrong: s.wrong,
      accuracy: s.attempts > 0 ? (s.correct / s.attempts) * 100 : 0,
      lastAttemptAt: s.lastAt
    })).sort((a, b) => a.accuracy - b.accuracy); // weakest first
  }

  /* Detail for a single subject */
  function getSubjectDetail(subject) {
    const all = QuestionStats.getAll();
    const sub = {};
    let total = { attempts: 0, correct: 0, wrong: 0 };
    let weakCount = 0;

    QuestionManager.getQuestionsBySubject(subject).forEach(q => {
      const rec = all[q.id];
      if (!rec) return;
      if (QuestionStats.getWeakScore(rec) > 0) weakCount++;
      if (!rec.attempts) return;
      total.attempts += rec.attempts;
      total.correct  += rec.correct || 0;
      total.wrong    += rec.wrong   || 0;
      if (!sub[q.subtopic]) sub[q.subtopic] = { attempts: 0, correct: 0, wrong: 0 };
      sub[q.subtopic].attempts += rec.attempts;
      sub[q.subtopic].correct  += rec.correct || 0;
      sub[q.subtopic].wrong    += rec.wrong   || 0;
    });

    const subtopics = Object.entries(sub).map(([name, s]) => ({
      subtopic: name,
      attempts: s.attempts,
      correct: s.correct,
      wrong: s.wrong,
      accuracy: s.attempts > 0 ? (s.correct / s.attempts) * 100 : 0
    }));

    const sorted = [...subtopics].sort((a, b) => a.accuracy - b.accuracy);
    const weakest  = sorted.slice(0, 3);
    const strongest = [...sorted].reverse().slice(0, 3);

    return {
      subject,
      attempts: total.attempts,
      correct: total.correct,
      wrong: total.wrong,
      accuracy: total.attempts > 0 ? (total.correct / total.attempts) * 100 : 0,
      weakCount,
      subtopics,
      weakest,
      strongest
    };
  }

  /* ============ PERFORMANCE OVERVIEW ============ */
  function renderScreen() {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const subjects = getSubjectStats();

    if (subjects.length === 0) {
      app.innerHTML = `
        <section class="performance-screen">
          <div class="dashboard-header">
            <h1>📊 Performance</h1>
            <p class="text-muted">Your subject-level accuracy will appear here once you start answering questions.</p>
          </div>
          <div class="result-actions">
            <button class="btn btn-primary" id="perf-back" type="button">Back to Dashboard</button>
          </div>
        </section>`;
      document.getElementById('perf-back').addEventListener('click', () => App.navigate('dashboard'));
      return;
    }

    const rows = subjects.map(s => {
      const cls = barClass(s.accuracy);
      const acc = s.accuracy.toFixed(0);
      return `
        <div class="perf-row clickable" data-subject="${esc(s.subject)}" role="button" tabindex="0">
          <div class="perf-row-header">
            <span class="perf-subject">${esc(s.subject)}</span>
            <span class="perf-pct ${cls}">${acc}%</span>
          </div>
          <div class="perf-bar">
            <div class="perf-bar-fill ${cls}" style="width:${Math.min(100, s.accuracy).toFixed(1)}%"></div>
          </div>
          <div class="perf-row-meta">
            <span>${s.attempts} attempt${s.attempts === 1 ? '' : 's'}</span>
            <span>·</span>
            <span class="perf-correct">${s.correct} correct</span>
            <span>·</span>
            <span class="perf-wrong">${s.wrong} wrong</span>
          </div>
        </div>`;
    }).join('');

    app.innerHTML = `
      <section class="performance-screen">
        <div class="dashboard-header">
          <h1>📊 Performance</h1>
          <p class="text-muted">Accuracy across all subjects you've practiced. Weakest first.</p>
        </div>
        <div class="perf-list">${rows}</div>
        <div class="result-actions">
          <button class="btn btn-primary" id="perf-back" type="button">Back to Dashboard</button>
        </div>
      </section>`;

    document.querySelectorAll('.perf-row').forEach(row => {
      const go = () => App.navigate('performance-subject', { subject: row.dataset.subject });
      row.addEventListener('click', go);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });
    document.getElementById('perf-back').addEventListener('click', () => App.navigate('dashboard'));
  }

  /* ============ SUBJECT DETAIL ============ */
  function renderSubject(params = {}) {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const subject = params.subject;

    if (!subject) { App.navigate('performance'); return; }

    const d = getSubjectDetail(subject);
    const cls = barClass(d.accuracy);
    const acc = d.accuracy.toFixed(0);

    if (d.attempts === 0) {
      app.innerHTML = `
        <section class="performance-screen">
          <div class="dashboard-header">
            <h1>${esc(subject)}</h1>
            <p class="text-muted">No attempts yet for this subject.</p>
          </div>
          <div class="result-actions">
            <button class="btn btn-secondary" id="perf-subj-back" type="button">← Back</button>
          </div>
        </section>`;
      document.getElementById('perf-subj-back').addEventListener('click', () => App.navigate('performance'));
      return;
    }

    function areaRow(a) {
      const c = barClass(a.accuracy);
      return `
        <div class="perf-area-row">
          <span class="perf-area-name">${esc(a.subtopic)}</span>
          <div class="perf-area-bar"><div class="perf-bar-fill ${c}" style="width:${Math.min(100, a.accuracy).toFixed(1)}%"></div></div>
          <span class="perf-area-pct ${c}">${a.accuracy.toFixed(0)}%</span>
        </div>`;
    }

    app.innerHTML = `
      <section class="performance-screen">
        <div class="dashboard-header">
          <h1>${esc(subject)}</h1>
          <p class="text-muted">Detailed breakdown</p>
        </div>

        <div class="perf-hero">
          <div class="perf-hero-main">
            <span class="perf-hero-value ${cls}">${acc}%</span>
            <span class="perf-hero-label">Accuracy</span>
          </div>
          <div class="perf-hero-bar">
            <div class="perf-bar-fill ${cls}" style="width:${Math.min(100, d.accuracy).toFixed(1)}%"></div>
          </div>
          <div class="perf-hero-stats">
            <div><strong>${d.attempts}</strong><span>Attempts</span></div>
            <div><strong class="perf-correct">${d.correct}</strong><span>Correct</span></div>
            <div><strong class="perf-wrong">${d.wrong}</strong><span>Wrong</span></div>
            <div><strong>${d.weakCount}</strong><span>Weak</span></div>
          </div>
        </div>

        ${d.weakCount > 0 ? `
          <div class="perf-callout">
            You have <strong>${d.weakCount}</strong> weak question${d.weakCount === 1 ? '' : 's'} in ${esc(subject)}.
            <button class="btn btn-secondary btn-sm" id="perf-practice-weak" type="button">Practice them</button>
          </div>` : ''}

        ${d.weakest.length > 0 ? `
          <h2 class="section-title">Weakest areas</h2>
          <div class="perf-area-list">
            ${d.weakest.map(areaRow).join('')}
          </div>` : ''}

        ${d.strongest.length > 0 ? `
          <h2 class="section-title">Strongest areas</h2>
          <div class="perf-area-list">
            ${d.strongest.map(areaRow).join('')}
          </div>` : ''}

        <div class="result-actions">
          <button class="btn btn-secondary" id="perf-subj-back" type="button">← Back</button>
          <button class="btn btn-primary" id="perf-subj-practice" type="button">Practice ${esc(subject)}</button>
        </div>
      </section>`;

    document.getElementById('perf-subj-back').addEventListener('click', () => App.navigate('performance'));
    document.getElementById('perf-subj-practice').addEventListener('click', () => {
      App.navigate('practice-setup', { subject });
    });

    const weakBtn = document.getElementById('perf-practice-weak');
    if (weakBtn) {
      weakBtn.addEventListener('click', () => {
        const all = QuestionStats.getWeakQuestions('all');
        const subjectQs = QuestionManager.getQuestionsBySubject(subject);
        const subjectIds = new Set(subjectQs.map(q => q.id));
        const filtered = all.filter(q => subjectIds.has(q.id));
        if (filtered.length === 0) { alert('No weak questions in this subject.'); return; }
        Practice.startCustom(filtered, `${subject} · Weak`);
      });
    }
  }

  return { renderScreen, renderSubject, getSubjectStats, getSubjectDetail };
})();

window.Performance = Performance;
/* ------------------------------------------------------------
   AI Explanations Browser — list, search, view cached responses
   ------------------------------------------------------------ */
const AIBrowser = (() => {
  let searchQuery = '';

  /* ---------- Data assembly ---------- */
  function buildEntries() {
    const cache = AI.getAllCached();
    const allQ = QuestionManager.getAllQuestions();
    const qMap = new Map(allQ.map(q => [q.id, q]));

    return Object.entries(cache).map(([id, rec]) => {
      const q = qMap.get(id) || null;
      return {
        id,
        rec,
        question: q,
        subject: q ? q.subject : '—',
        subtopic: q ? q.subtopic : '',
        preview: q ? q.question : '(question no longer in bank)',
        createdAt: rec.createdAt || ''
      };
    });
  }

  function filterEntries(entries, q) {
    const s = (q || '').trim().toLowerCase();
    if (!s) return entries;
    return entries.filter(e =>
      e.id.toLowerCase().includes(s) ||
      e.subject.toLowerCase().includes(s) ||
      e.subtopic.toLowerCase().includes(s) ||
      e.preview.toLowerCase().includes(s)
    );
  }

  /* ---------- List screen ---------- */
  function renderList() {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const all = buildEntries();
    const filtered = filterEntries(all, searchQuery);

    /* Sort newest first */
    filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    /* Check if search looks like a question ID with no cache */
    const exactIdMatch = searchQuery.trim() &&
      !all.some(e => e.id.toLowerCase() === searchQuery.trim().toLowerCase()) &&
      QuestionManager.getQuestionById(searchQuery.trim());

    const rowsHtml = filtered.length === 0
      ? `<div class="aib-empty">
           ${searchQuery.trim()
             ? 'No cached explanations match your search.'
             : 'No AI explanations cached yet. Open a question and click 🤖 Explain with AI.'}
         </div>`
      : filtered.map(e => {
          const date = e.createdAt
            ? new Date(e.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            : '';
          return `
            <div class="aib-row clickable" data-id="${esc(e.id)}" role="button" tabindex="0">
              <div class="aib-row-main">
                <div class="aib-row-header">
                  <span class="aib-row-id">${esc(e.id)}</span>
                  <span class="aib-row-subject">${esc(e.subject)}</span>
                  ${e.subtopic ? `<span class="aib-row-subtopic">${esc(e.subtopic)}</span>` : ''}
                </div>
                <div class="aib-row-preview">${esc(e.preview)}</div>
              </div>
              <div class="aib-row-side">
                <span class="aib-row-date">${esc(date)}</span>
                <div class="aib-row-actions">
                  <button class="aib-delete-btn" type="button" data-delete="${esc(e.id)}"
                          title="Delete this explanation" aria-label="Delete this explanation">🗑</button>
                  <span class="aib-row-arrow">→</span>
                </div>
              </div>
            </div>`;
        }).join('');

    const exactCard = exactIdMatch
      ? (() => {
          const qq = exactIdMatch;
          return `
            <div class="aib-exact-card">
              <div class="aib-exact-label">Question found — no AI explanation cached yet</div>
              <div class="aib-row-header" style="margin: 0.5rem 0;">
                <span class="aib-row-id">${esc(qq.id)}</span>
                <span class="aib-row-subject">${esc(qq.subject)}</span>
                ${qq.subtopic ? `<span class="aib-row-subtopic">${esc(qq.subtopic)}</span>` : ''}
              </div>
              <div class="aib-row-preview">${esc(qq.question)}</div>
              <div class="aib-exact-actions">
                <button class="btn btn-primary btn-sm" data-open-question="${esc(qq.id)}" type="button">
                  🤖 Generate explanation now
                </button>
              </div>
            </div>`;
        })()
      : '';

    app.innerHTML = `
      <section class="aib-screen">
        <div class="dashboard-header">
          <h1>🤖 AI Explanations</h1>
          <p class="text-muted">Browse, search, and re-read your cached AI explanations</p>
        </div>

        <div class="aib-search-wrap">
          <input type="search" id="aib-search" class="aib-search"
                 placeholder="Search by question ID, subject, subtopic, or question text…"
                 value="${esc(searchQuery)}" autocomplete="off">
          <div class="aib-search-meta">
            ${all.length === 0 ? '' :
              `${filtered.length} of ${all.length} shown`}
          </div>
        </div>

        ${exactCard}

        <div class="aib-list" id="aib-list">
          ${rowsHtml}
        </div>

        <div class="result-actions">
          <button class="btn btn-secondary" id="aib-back" type="button">Back to Settings</button>
          ${all.length > 0
            ? `<button class="btn btn-danger" id="aib-clear-all" type="button">Clear All (${all.length})</button>`
            : ''}
        </div>
      </section>`;

    /* Wire up */
    const searchInput = document.getElementById('aib-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        const pos = e.target.selectionStart;
        renderList();
        const newInput = document.getElementById('aib-search');
        if (newInput) {
          newInput.focus();
          try { newInput.setSelectionRange(pos, pos); } catch (ex) {}
        }
      });
    }

    document.querySelectorAll('.aib-row').forEach(row => {
      const go = () => App.navigate('ai-browser-view', { questionId: row.dataset.id });
      row.addEventListener('click', (ev) => {
        if (ev.target.closest('[data-delete]')) return;
        go();
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });

    /* Individual delete buttons */
    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const id = btn.dataset.delete;
        if (!confirm(`Delete the AI explanation for "${id}"?\n\nThis only removes the cached response. Your question, bookmarks, stats, and history are untouched.`)) return;
        AI.removeCached(id);
        renderList();
      });
    });

    document.querySelectorAll('[data-open-question]').forEach(btn => {
      btn.addEventListener('click', () => {
        App.navigate('ai-browser-view', { questionId: btn.dataset.openQuestion });
      });
    });

    document.getElementById('aib-back').addEventListener('click', () => App.navigate('settings'));

    const clearAllBtn = document.getElementById('aib-clear-all');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        if (!confirm(`Clear all ${all.length} cached AI explanations? This does not affect your quiz data.`)) return;
        AI.clearCache();
        searchQuery = '';
        renderList();
      });
    }
  }

  /* ---------- Detail screen ---------- */
  function renderDetail(params = {}) {
    const app = document.getElementById('app');
    const esc = Utils.escapeHtml;
    const id = params.questionId;

    if (!id) { App.navigate('ai-browser'); return; }

    const q = QuestionManager.getQuestionById(id);
    const cached = AI.getCached(id);

    /* If neither exists, nothing to show */
    if (!q && !cached) {
      app.innerHTML = `
        <section class="aib-screen">
          <div class="dashboard-header">
            <h1>Question not found</h1>
            <p class="text-muted">ID: ${esc(id)}</p>
          </div>
          <div class="result-actions">
            <button class="btn btn-secondary" id="aib-detail-back" type="button">Back to list</button>
          </div>
        </section>`;
      document.getElementById('aib-detail-back').addEventListener('click', () => App.navigate('ai-browser'));
      return;
    }

    /* Build question block */
    let questionBlock = '';
    if (q) {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const options = Array.isArray(q.options) ? q.options : [];
      const optionsHtml = options.map((opt, i) => {
        const text = typeof opt === 'string' ? opt : (opt && opt.text) || '';
        const isCorrect = text === q.answer;
        return `
          <div class="review-option ${isCorrect ? 'review-correct-option' : ''}">
            <span class="option-letter">${letters[i]}</span>
            <span class="option-text">${esc(text)}</span>
            ${isCorrect ? '<span class="review-option-label label-correct">✓ Correct</span>' : ''}
          </div>`;
      }).join('');

      questionBlock = `
        <div class="aib-question-card">
          <div class="quiz-meta">
            <span class="quiz-tag">${esc(q.subject)}</span>
            ${q.subtopic ? `<span class="quiz-tag">${esc(q.subtopic)}</span>` : ''}
            <span class="quiz-tag quiz-tag-id" title="Question ID">${esc(q.id)}</span>
          </div>
          <h2 class="question-text">${esc(q.question)}</h2>
          <div class="review-options">${optionsHtml}</div>
          ${q.explanation
            ? `<div class="review-explanation"><strong>Official Explanation:</strong> ${esc(q.explanation)}</div>`
            : ''}
        </div>`;
    } else {
      questionBlock = `
        <div class="aib-question-card aib-question-missing">
          <div class="quiz-meta">
            <span class="quiz-tag quiz-tag-id">${esc(id)}</span>
            <span class="quiz-tag" style="color: var(--wrong); border-color: var(--wrong);">Question removed from bank</span>
          </div>
          <p class="text-muted" style="margin: 0.75rem 0;">
            This question no longer exists in your question banks. The cached explanation is still available below.
          </p>
        </div>`;
    }

    /* AI panel */
    const aiBody = cached
      ? AI.renderMarkdown(cached.response)
      : '<p class="text-muted">No AI explanation cached yet. Click Generate to create one.</p>';

    const badge = cached
      ? `${cached.provider === 'gemini' ? '✨ Gemini' : (cached.provider === 'uncloseai' ? '✨ uncloseai' : (cached.provider === 'pollinations' ? '✨ Pollinations' : '📦 Cached'))}${cached.model ? ' · ' + esc(cached.model) : ''}`
      : '—';

    const createdLine = cached && cached.createdAt
      ? `<div class="aib-created">Generated: ${esc(new Date(cached.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }))}</div>`
      : '';

    app.innerHTML = `
      <section class="aib-screen">
        <div class="dashboard-header">
          <h1>AI Explanation</h1>
          <p class="text-muted">${q ? esc(q.subject) : 'Cached response'}</p>
        </div>

        ${questionBlock}

        <div class="ai-panel" style="margin-top: 1rem;">
          <div class="ai-panel-header">
            <span class="ai-panel-title">🤖 AI Explanation</span>
            <span class="ai-panel-badge">${badge}</span>
            <div class="ai-panel-actions">
              <button class="btn btn-secondary btn-sm" id="aib-regen" type="button"
                      title="Regenerate explanation">🔄 ${cached ? 'Regenerate' : 'Generate'}</button>
              ${cached ? `<button class="btn btn-secondary btn-sm" id="aib-copy" type="button" title="Copy">📋 Copy</button>` : ''}
            </div>
          </div>
          ${createdLine}
          <div class="ai-panel-body" id="aib-body">${aiBody}</div>
        </div>

        <div class="result-actions" style="margin-top: 1.25rem;">
          <button class="btn btn-secondary" id="aib-detail-back" type="button">← Back to list</button>
          ${cached ? `<button class="btn btn-danger" id="aib-delete-detail" type="button">🗑 Delete this explanation</button>` : ''}
          ${q ? `<button class="btn btn-primary" id="aib-practice" type="button">Practice this question</button>` : ''}
        </div>
      </section>`;

    /* Wire up */
    document.getElementById('aib-detail-back').addEventListener('click', () => App.navigate('ai-browser'));

    const deleteDetail = document.getElementById('aib-delete-detail');
    if (deleteDetail) {
      deleteDetail.addEventListener('click', () => {
        if (!confirm(`Delete the AI explanation for "${id}"?\n\nThis only removes the cached response. Your question, bookmarks, stats, and history are untouched.`)) return;
        AI.removeCached(id);
        App.navigate('ai-browser');
      });
    }

    const practiceBtn = document.getElementById('aib-practice');
    if (practiceBtn && q) {
      practiceBtn.addEventListener('click', () => {
        Practice.startCustom([q], 'AI Review · ' + q.id);
      });
    }

    const copyBtn = document.getElementById('aib-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          const body = document.getElementById('aib-body');
          await navigator.clipboard.writeText(body.innerText);
          const orig = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied';
          setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        } catch (e) {
          alert('Copy failed. Please select the text manually.');
        }
      });
    }

    const regenBtn = document.getElementById('aib-regen');
    if (regenBtn) {
      regenBtn.addEventListener('click', async () => {
        if (!q) { alert('Cannot regenerate — the original question is not in the bank.'); return; }
        regenBtn.disabled = true;
        const orig = regenBtn.textContent;
        regenBtn.textContent = '🔄 Generating…';
        const body = document.getElementById('aib-body');
        body.innerHTML = `<div class="ai-loading">🔄 Contacting AI…</div>`;
        try {
          const result = await AI.explainQuestion(q, { forceNew: true });
          body.innerHTML = AI.renderMarkdown(result.text);
          const badgeEl = document.querySelector('.ai-panel-badge');
          if (badgeEl) {
            badgeEl.textContent = (result.provider === 'gemini' ? '✨ Gemini'
              : result.provider === 'uncloseai' ? '✨ uncloseai'
              : result.provider === 'pollinations' ? '✨ Pollinations'
              : '✨ AI') + (result.model ? ' · ' + result.model : '');
          }
          const createdEl = document.querySelector('.aib-created');
          if (createdEl) {
            createdEl.textContent = 'Generated: ' + new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
          } else {
            const header = document.querySelector('.ai-panel-header');
            const div = document.createElement('div');
            div.className = 'aib-created';
            div.textContent = 'Generated: ' + new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
            header.insertAdjacentElement('afterend', div);
          }
        } catch (e) {
          body.innerHTML = `<div class="ai-error">⚠️ ${esc(AI.friendlyError(e && e.kind ? e.kind : 'server'))}</div>`;
        }
        regenBtn.disabled = false;
        regenBtn.textContent = orig;
      });
    }
  }

  return { renderList, renderDetail };
})();

window.AIBrowser = AIBrowser;
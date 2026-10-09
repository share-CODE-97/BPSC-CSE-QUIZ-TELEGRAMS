/* ------------------------------------------------------------
   AI — Gemini → uncloseai → Pollinations fallback chain
   Only Gemini requires a key. The other two are free & keyless.
   ------------------------------------------------------------ */
const AI = (() => {
  const SETTINGS_KEY = 'cse_quiz_ai_settings';
  const CACHE_KEY    = 'cse_quiz_ai_explanations';
  const CACHE_LIMIT  = 500;

  /* ---- Gemini (primary — needs user key) ---- */
const GEMINI_MODELS = [
  'gemini-flash-latest',      // auto-tracks current flash
  'gemini-3.5-flash-lite',    // fast, reliable, higher free tier
  'gemini-3.8-flash',         // newer, better quality fallback
  'gemini-3.8-pro'            // last resort (heaviest)
];
  const GEMINI_BASE   = 'https://generativelanguage.googleapis.com/v1beta/models';

  /* ---- uncloseai (fallback #1 — no key needed) ---- */
  const UNCLOSE_BASE   = 'https://hermes.ai.unturf.com/v1';
  const UNCLOSE_MODELS = ['turboderp/Qwen3.8-27B-exl3'];
  const UNCLOSE_FAKE_KEY = 'uncloseai'; // any non-empty string works

  /* ---- Pollinations (fallback #2 — no key needed, 1 req/15s) ---- */
  const POLLINATIONS_BASE = 'https://text.pollinations.ai';

  const REQUEST_TIMEOUT_MS = 45000;
  const RETRY_DELAY_MS = 800;

  const DEFAULT_SETTINGS = {
    apiKey: '',
    lastTestedAt: null,
    lastTestStatus: null,
    lastProvider: null
  };

  /* ============ SETTINGS ============ */
  function getSettings() {
    const v = Storage.get(SETTINGS_KEY, {});
    const clean = (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    return { ...DEFAULT_SETTINGS, ...clean };
  }
  function saveSettings(patch) {
    const next = { ...getSettings(), ...patch };
    Storage.set(SETTINGS_KEY, next);
    return next;
  }
  function getApiKey()  { return (getSettings().apiKey || '').trim(); }
  function hasApiKey()  { return getApiKey().length > 0; }

  function setApiKey(k) {
    return saveSettings({ apiKey: (k || '').trim(), lastTestedAt: null, lastTestStatus: null });
  }
  function clearApiKey() {
    return saveSettings({ apiKey: '', lastTestedAt: null, lastTestStatus: null });
  }

  function maskKey(k) {
    const val = k || getApiKey();
    if (!val) return '';
    if (val.length <= 8) return '••••••••';
    return '••••••••' + val.slice(-4);
  }

  /* ============ CACHE ============ */
  function getCache() {
    const v = Storage.get(CACHE_KEY, {});
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  }
  function getCached(id) {
    const c = getCache()[id];
    if (!c || typeof c !== 'object' || typeof c.response !== 'string') return null;
    return c;
  }
  function saveCached(questionId, provider, model, response) {
    const cache = getCache();
    cache[questionId] = {
      provider, model, response,
      createdAt: new Date().toISOString()
    };
    const keys = Object.keys(cache);
    if (keys.length > CACHE_LIMIT) {
      keys
        .sort((a, b) => (cache[a].createdAt || '').localeCompare(cache[b].createdAt || ''))
        .slice(0, keys.length - CACHE_LIMIT)
        .forEach(k => delete cache[k]);
    }
    Storage.set(CACHE_KEY, cache);
  }
  function getCacheCount() { return Object.keys(getCache()).length; }
  function clearCache()    { Storage.remove(CACHE_KEY); }

  /* ============ ERRORS ============ */
  function friendlyError(kind) {
    const map = {
      no_key:     'Please add your Gemini API key in Settings before using AI explanations.',
      bad_key:    'The AI provider rejected your API key. Please check it in Settings.',
      network:    'Could not connect. Please check your internet connection and try again.',
      rate_limit: 'Request limit was reached. Please try again later.',
      overloaded: 'AI provider is currently busy. Please try again in a moment.',
      all_busy:   'All AI providers are busy right now. Please try again in a few minutes.',
      server:     'The AI provider could not generate an explanation right now. Please try again later.',
      parse:      'The AI response could not be processed. Please try again.',
      timeout:    'The AI took too long to respond. Please try again.',
      offline:    'Internet connection is required to generate a new AI explanation.'
    };
    return map[kind] || 'Something went wrong while contacting the AI.';
  }
  function classifyError(status, message) {
    const msg = (message || '').toLowerCase();
    if (status === 400 && (msg.includes('api key') || msg.includes('api_key'))) return 'bad_key';
    if (status === 401 || status === 403) return 'bad_key';
    if (status === 429) return 'rate_limit';
    if (status === 503 || status === 502 || status === 504) return 'overloaded';
    if (status >= 500) return 'server';
    return 'server';
  }

  /* ============ PROMPT ============ */
  /* Options may be plain strings OR {text, isCorrect} objects (Practice mode) */
  function normalizeOptions(options) {
    if (!Array.isArray(options)) return [];
    return options.map(o => {
      if (typeof o === 'string') return o;
      if (o && typeof o === 'object' && typeof o.text === 'string') return o.text;
      return String(o);
    });
  }
  function normalizeAnswer(answer, options) {
    if (typeof answer === 'string') return answer;
    if (answer && typeof answer === 'object' && typeof answer.text === 'string') return answer.text;
    /* Fallback: find an option flagged isCorrect */
    const found = (Array.isArray(options) ? options : []).find(o => o && typeof o === 'object' && o.isCorrect);
    return found && found.text ? found.text : String(answer);
  }

  function buildPrompt(q) {
    const opts    = normalizeOptions(q.options);
    const answer  = normalizeAnswer(q.answer, q.options);
    const idx     = opts.indexOf(answer);
    const letter  = idx >= 0 ? String.fromCharCode(65 + idx) : '?';

    const L = [];
    L.push('You are an expert CSE (Computer Science Engineering) exam tutor.');
    L.push('Explain the following multiple-choice question in simple, exam-oriented English.');
    L.push('');
    L.push('=== QUESTION ===');
    L.push(q.question || '');
    L.push('');
    L.push('=== OPTIONS ===');
    opts.forEach((opt, i) => {
      const tag = (opt === answer) ? '   <-- CORRECT' : '';
      L.push(`${String.fromCharCode(65 + i)}. ${opt}${tag}`);
    });
    L.push('');
    L.push(`=== OFFICIAL CORRECT ANSWER === ${letter}. ${answer}`);
    L.push('');
    if (q.explanation) {
      L.push('=== OFFICIAL EXPLANATION (reference material) ===');
      L.push(q.explanation);
      L.push('');
    }
    if (q.subject)  L.push('SUBJECT: ' + q.subject);
    if (q.subtopic) L.push('SUBTOPIC: ' + q.subtopic);
    L.push('');
    L.push('=== YOUR TASK ===');
    L.push(`The official correct answer is OPTION ${letter}: "${answer}". This is AUTHORITATIVE. Do NOT change it.`);
    L.push('');
    L.push('Respond using EXACTLY these sections (markdown headings):');
    L.push('');
    L.push('## 💡 Simple Explanation');
    L.push('Explain what the question is really asking, in very easy language. 2-4 sentences.');
    L.push('');
    L.push(`## ✅ Why Option ${letter} Is Correct`);
    L.push(`Explain in 2-5 sentences why "${answer}" is the right answer.`);
    L.push('');
    L.push('## ❌ Why the Other Options Are Wrong');
    L.push(`For EACH incorrect option EXCEPT option ${letter}, use a sub-heading in this exact format:`);
    L.push('### <letter>. <full option text>');
    L.push('Then 1-3 sentences explaining why that specific option is wrong.');
    L.push(`IMPORTANT: Do NOT include option ${letter} in this section — it is the CORRECT answer.`);
    L.push('');
    L.push('## 🧠 Key Point to Remember');
    L.push('One short memory-friendly sentence.');
    L.push('');
    L.push('## 🎯 Exam Tip');
    L.push('One short exam-oriented distinction or shortcut. Skip if not useful.');
    L.push('');
    L.push('RULES:');
    L.push('- Every option sub-heading MUST contain the real option text, never a placeholder.');
    L.push('- Keep the answer focused, not excessively long.');
    L.push('- Use simple English; explain technical terms when needed.');
    L.push('- Do not invent facts. Do not discuss unrelated topics.');
    L.push('- Do not change the official answer.');
    return L.join('\n');
  }

  /* ============ LOW-LEVEL FETCH ============ */
  async function fetchWithTimeout(url, opts = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (e) {
      clearTimeout(timer);
      if (e.name === 'AbortError') throw { kind: 'timeout' };
      throw { kind: 'network' };
    }
  }

  /* ---------- Gemini ---------- */
  async function callGemini(model, prompt, apiKey) {
    const url = `${GEMINI_BASE}/${model}:generateContent`;
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1500 }
      })
    });
    let data;
    try { data = await res.json(); } catch { throw { kind: 'parse' }; }
    if (!res.ok) {
      const msg = data?.error?.message || '';
      throw { kind: classifyError(res.status, msg), status: res.status, message: msg };
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== 'string') throw { kind: 'parse' };
    return text.trim();
  }

  /* ---------- uncloseai (OpenAI-compatible, no real key) ---------- */
  async function callUncloseAI(model, prompt, _apiKey) {
    const url = `${UNCLOSE_BASE}/chat/completions`;
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + UNCLOSE_FAKE_KEY
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1500
      })
    });
    let data;
    try { data = await res.json(); } catch { throw { kind: 'parse' }; }
    if (!res.ok) {
      const msg = data?.error?.message || '';
      throw { kind: classifyError(res.status, msg), status: res.status, message: msg };
    }
    const text = data?.choices?.[0]?.message?.content;
    if (!text || typeof text !== 'string') throw { kind: 'parse' };
    return text.trim();
  }

  /* ---------- Pollinations (GET, plain text, no key, 1 req/15s) ---------- */
  async function callPollinations(_model, prompt, _apiKey) {
    const url = `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}`;
    const res = await fetchWithTimeout(url, { method: 'GET' });
    if (!res.ok) {
      throw { kind: classifyError(res.status, ''), status: res.status };
    }
    const text = await res.text();
    if (!text || typeof text !== 'string') throw { kind: 'parse' };
    return text.trim();
  }

  /* ============ PROVIDER CHAIN ============ */
  async function tryProvider(providerName, models, caller, prompt) {
    let lastErr = null;
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      try {
        const text = await caller(model, prompt);
        return { provider: providerName, model, text };
      } catch (e) {
        lastErr = e;
        /* Only retry another model if this one is overloaded/erroring */
        if (e.kind !== 'overloaded' && e.kind !== 'server') throw e;
        if (i < models.length - 1) await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      }
    }
    throw lastErr || { kind: 'server' };
  }

  async function generateWithFallback(prompt) {
    const geminiKey = getApiKey();
    if (!geminiKey) throw { kind: 'no_key' };

    let lastErr = null;
    const errors = [];

    /* 1. Gemini */
    try {
      return await tryProvider('gemini', GEMINI_MODELS,
        (m, p) => callGemini(m, p, geminiKey), prompt);
    } catch (e) {
      lastErr = e;
      errors.push({ provider: 'gemini', kind: e.kind });
      /* Bad key = real problem, don't try fallbacks */
      if (e.kind === 'bad_key') throw e;
      /* Timeout / network → try fallbacks */
    }

    /* 2. uncloseai (free, no key) */
    try {
      return await tryProvider('uncloseai', UNCLOSE_MODELS,
        (m, p) => callUncloseAI(m, p), prompt);
    } catch (e) {
      lastErr = e;
      errors.push({ provider: 'uncloseai', kind: e.kind });
    }

    /* 3. Pollinations (free, no key) */
    try {
      return await tryProvider('pollinations', ['openai'],
        (m, p) => callPollinations(m, p), prompt);
    } catch (e) {
      lastErr = e;
      errors.push({ provider: 'pollinations', kind: e.kind });
    }

    /* All three failed */
    throw { kind: 'all_busy', detail: errors };
  }

  /* ============ PUBLIC ============ */
  async function testKey() {
    const k = getApiKey();
    if (!k) return { ok: false, message: friendlyError('no_key') };
    try {
      const result = await tryProvider('gemini', GEMINI_MODELS,
        (m, p) => callGemini(m, p, k), 'Reply with exactly: OK');
      saveSettings({
        lastTestedAt: new Date().toISOString(),
        lastTestStatus: 'ok',
        lastProvider: 'gemini'
      });
      return { ok: true, message: `✅ Gemini connection successful (${result.model}).` };
    } catch (e) {
      saveSettings({ lastTestedAt: new Date().toISOString(), lastTestStatus: 'fail' });
      return { ok: false, message: '❌ ' + friendlyError(e.kind) };
    }
  }

  async function explainQuestion(q, options = {}) {
    if (!q || !q.id) throw { kind: 'parse' };
    const useCache = options.useCache !== false;
    const forceNew = !!options.forceNew;

    if (useCache && !forceNew) {
      const cached = getCached(q.id);
      if (cached) return {
        text: cached.response,
        fromCache: true,
        model: cached.model,
        provider: cached.provider
      };
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw { kind: 'offline' };
    }
    if (!hasApiKey()) throw { kind: 'no_key' };

    const prompt = buildPrompt(q);
    const { provider, model, text } = await generateWithFallback(prompt);
    saveCached(q.id, provider, model, text);
    return { text, fromCache: false, model, provider };
  }

  /* ============ UI PANEL (reusable across modes) ============ */
  function providerLabel(p) {
    if (p === 'gemini')      return 'Gemini';
    if (p === 'uncloseai')   return 'uncloseai';
    if (p === 'pollinations') return 'Pollinations';
    return p || 'AI';
  }

  function attachPanel(container, q) {
    if (!container || !q || !q.id) return;
    container.innerHTML = '';

    const cached = getCached(q.id);
    if (cached) {
      renderSuccess(container, q, {
        text: cached.response,
        provider: cached.provider,
        model: cached.model,
        fromCache: true
      });
      return;
    }

    container.innerHTML = `
      <button class="btn btn-ai" type="button" data-ai-action="explain"
              aria-label="Explain this question with AI">
        <span aria-hidden="true">🤖</span> Explain with AI
      </button>
      <div class="ai-panel" hidden data-ai-panel></div>`;

    const btn = container.querySelector('[data-ai-action="explain"]');
    const panel = container.querySelector('[data-ai-panel]');

    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.innerHTML = '<span aria-hidden="true">🤖</span> Thinking…';
      panel.hidden = false;
      panel.innerHTML = `<div class="ai-loading">🔄 Generating explanation…</div>`;
      try {
        const result = await explainQuestion(q);
        renderSuccess(container, q, result);
      } catch (e) {
        renderError(container, q, e);
      }
    });
  }

  function renderSuccess(container, q, result) {
    const fromCache = !!result.fromCache;
    container.innerHTML = `
      <div class="ai-panel">
        <div class="ai-panel-header">
          <span class="ai-panel-title">🤖 AI Explanation</span>
          <span class="ai-panel-badge" title="${fromCache ? 'Loaded from local cache' : 'Freshly generated'}">
            ${(fromCache ? '📦 Cached' : '✨ ' + escapeHtml(providerLabel(result.provider)))}
            ${result.model ? ' · ' + escapeHtml(result.model) : ''}
          </span>
          <div class="ai-panel-actions">
            <button class="btn btn-secondary btn-sm" type="button" data-ai-action="regen"
                    title="Generate a new explanation">🔄 Regenerate</button>
            <button class="btn btn-secondary btn-sm" type="button" data-ai-action="copy"
                    title="Copy explanation text">📋 Copy</button>
          </div>
        </div>
        <div class="ai-panel-body" data-ai-body>${renderMarkdown(result.text)}</div>
      </div>`;

    const regen = container.querySelector('[data-ai-action="regen"]');
    const copy  = container.querySelector('[data-ai-action="copy"]');
    const body  = container.querySelector('[data-ai-body]');

    if (regen) {
      regen.addEventListener('click', async () => {
        regen.disabled = true;
        regen.textContent = '🔄 Regenerating…';
        if (body) body.innerHTML = `<div class="ai-loading">🔄 Regenerating…</div>`;
        try {
          const result = await explainQuestion(q, { forceNew: true });
          renderSuccess(container, q, result);
        } catch (e) {
          renderError(container, q, e, true);
        }
      });
    }

    if (copy && body) {
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(body.innerText);
          const orig = copy.textContent;
          copy.textContent = '✓ Copied';
          setTimeout(() => { copy.textContent = orig; }, 1500);
        } catch (e) {
          alert('Copy failed. Please select the text manually.');
        }
      });
    }
  }

  function renderError(container, q, err, keepPanel = false) {
    const msg = friendlyError(err && err.kind ? err.kind : 'server');
    container.innerHTML = `
      <button class="btn btn-ai" type="button" data-ai-action="explain"
              aria-label="Explain this question with AI">
        <span aria-hidden="true">🤖</span> Explain with AI
      </button>
      <div class="ai-panel ai-panel-error">
        <div class="ai-error">⚠️ ${escapeHtml(msg)}</div>
        <button class="btn btn-secondary btn-sm" type="button" data-ai-action="retry">Try again</button>
      </div>`;
    const retry = container.querySelector('[data-ai-action="retry"]');
    const btn   = container.querySelector('[data-ai-action="explain"]');
    if (retry) retry.addEventListener('click', () => attachPanel(container, q));
    if (btn)   btn.addEventListener('click', () => attachPanel(container, q));
  }


  /* ============ MARKDOWN (safe) ============ */
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
  function renderMarkdown(md) {
    const safe = escapeHtml(md || '');
    const lines = safe.split(/\r?\n/);
    const out = [];
    let i = 0;
    const inline = (t) =>
      t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
       .replace(/`([^`]+?)`/g, '<code>$1</code>');

    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (!trimmed) { i++; continue; }
      let m;
      if ((m = trimmed.match(/^###\s+(.+)$/))) { out.push(`<h4>${inline(m[1])}</h4>`); i++; continue; }
      if ((m = trimmed.match(/^##\s+(.+)$/)))  { out.push(`<h3>${inline(m[1])}</h3>`); i++; continue; }
      if ((m = trimmed.match(/^#\s+(.+)$/)))   { out.push(`<h3>${inline(m[1])}</h3>`); i++; continue; }
      if (/^[-*]\s+/.test(trimmed)) {
        const items = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          items.push(inline(lines[i].replace(/^\s*[-*]\s+/, '')));
          i++;
        }
        out.push('<ul>' + items.map(x => `<li>${x}</li>`).join('') + '</ul>');
        continue;
      }
      const para = [trimmed];
      i++;
      while (i < lines.length && lines[i].trim() &&
             !/^#{1,3}\s/.test(lines[i].trim()) &&
             !/^\s*[-*]\s+/.test(lines[i])) {
        para.push(lines[i].trim());
        i++;
      }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('');
  }

  return {
    getSettings, saveSettings,
    getApiKey, setApiKey, clearApiKey, hasApiKey, maskKey,
    testKey,
    getCached, getCacheCount, clearCache,
    explainQuestion,
    renderMarkdown,
    friendlyError,
    attachPanel
  };
})();

window.AI = AI;
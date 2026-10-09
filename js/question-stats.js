/* ------------------------------------------------------------
   QuestionStats — per-question attempt tracking
   { id: { attempts, correct, wrong, weak, lastAttemptAt } }
   weak: 0 = not weak, 1 = once, 2 = repeated, 3+ = frequent
   Wrong answer -> weak + 1
   Correct answer -> weak - 1 (min 0)
   ------------------------------------------------------------ */
const QuestionStats = (() => {
  const KEY = 'cse_quiz_question_stats';
  const OLD_KEY = 'cse_quiz_wrong';

  function getAll() {
    const v = Storage.get(KEY, {});
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  }

  function get(id) {
    return getAll()[id] || null;
  }

  /* Current weakness score (handles legacy records without `weak` field) */
  function getWeakScore(rec) {
    if (!rec) return 0;
    if (typeof rec.weak === 'number') return Math.max(0, rec.weak);
    return Math.max(0, rec.wrong || 0);
  }

  function recordAttempt(id, correct) {
    if (!id || typeof id !== 'string') return;
    const all = getAll();
    const rec = all[id] || { attempts: 0, correct: 0, wrong: 0, weak: 0, lastAttemptAt: null };

    const prevWeak = getWeakScore(rec);
    rec.attempts = (rec.attempts || 0) + 1;

    if (correct) {
      rec.correct = (rec.correct || 0) + 1;
      rec.weak = Math.max(0, prevWeak - 1);
    } else {
      rec.wrong = (rec.wrong || 0) + 1;
      rec.weak = prevWeak + 1;
    }
    rec.lastAttemptAt = new Date().toISOString();

    all[id] = rec;
    Storage.set(KEY, all);
  }

  function getWeakCategorized() {
    const all = getAll();
    const categories = { frequent: [], repeated: [], once: [] };
    Object.entries(all).forEach(([id, rec]) => {
      const w = getWeakScore(rec);
      if (w >= 3) categories.frequent.push(id);
      else if (w === 2) categories.repeated.push(id);
      else if (w === 1) categories.once.push(id);
    });
    return categories;
  }

  function getWeakIds(category) {
    const cats = getWeakCategorized();
    if (category === 'all') return [...cats.frequent, ...cats.repeated, ...cats.once];
    return cats[category] || [];
  }

  function getWeakQuestions(category = 'all') {
    const ids = getWeakIds(category);
    const order = new Map();
    ids.forEach((id, i) => order.set(id, i));
    return QuestionManager.getAllQuestions()
      .filter(q => order.has(q.id))
      .sort((a, b) => order.get(a.id) - order.get(b.id));
  }

  function getWeakBySubject() {
    const cats = getWeakCategorized();
    const idSet = new Set([...cats.frequent, ...cats.repeated, ...cats.once]);
    const bySubject = {};
    QuestionManager.getAllQuestions().forEach(q => {
      if (!idSet.has(q.id)) return;
      const rec = get(q.id);
      if (!rec) return;
      const w = getWeakScore(rec);
      if (!bySubject[q.subject]) bySubject[q.subject] = { total: 0, frequent: 0, repeated: 0, once: 0 };
      bySubject[q.subject].total++;
      if (w >= 3) bySubject[q.subject].frequent++;
      else if (w === 2) bySubject[q.subject].repeated++;
      else bySubject[q.subject].once++;
    });
    return bySubject;
  }

  function getCount() {
    const cats = getWeakCategorized();
    return cats.frequent.length + cats.repeated.length + cats.once.length;
  }

  /* Total stats records (includes non-weak ones) — used by future Subject Performance */
  function getTotalRecordCount() {
    return Object.keys(getAll()).length;
  }

  function clear() {
    Storage.remove(KEY);
  }

  function migrateFromOld() {
    const oldData = Storage.get(OLD_KEY, {});
    if (!oldData || typeof oldData !== 'object' || Array.isArray(oldData)) return;
    const newData = getAll();
    if (Object.keys(newData).length > 0) return;
    let migrated = false;
    const now = new Date().toISOString();
    Object.entries(oldData).forEach(([id, count]) => {
      if (typeof count === 'number' && count > 0) {
        newData[id] = {
          attempts: count,
          correct: 0,
          wrong: count,
          weak: count,
          lastAttemptAt: now
        };
        migrated = true;
      }
    });
    if (migrated) Storage.set(KEY, newData);
  }

  return {
    getAll, get, recordAttempt, getWeakScore,
    getWeakCategorized, getWeakIds, getWeakQuestions, getWeakBySubject,
    getCount, getTotalRecordCount, clear, migrateFromOld
  };
})();

window.QuestionStats = QuestionStats;
/* ------------------------------------------------------------
   History — recent completed quizzes and exams
   ------------------------------------------------------------ */
const History = (() => {
  const KEY = 'cse_quiz_history';
  const MAX = 50;

  function getAll() {
    const v = Storage.get(KEY, []);
    return Array.isArray(v) ? v : [];
  }

  /* entry: { mode, title, total, correct, wrong, unattempted, score, accuracy, timeUsed } */
  function add(entry) {
    const list = getAll();
    list.unshift({ ...entry, date: new Date().toISOString() });
    if (list.length > MAX) list.length = MAX;
    Storage.set(KEY, list);
  }

  function clear() {
    Storage.remove(KEY);
  }

  function getRecent(n = 10) {
    return getAll().slice(0, n);
  }

  return { getAll, add, clear, getRecent };
})();

window.History = History;
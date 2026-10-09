/* ------------------------------------------------------------
   Bookmarks — questions the user starred (stored by ID)
   ------------------------------------------------------------ */
const Bookmarks = (() => {
  const KEY = 'cse_quiz_bookmarks';

  function getAll() {
    const v = Storage.get(KEY, []);
    return Array.isArray(v) ? v : [];
  }

  function getCount() { return getAll().length; }
  function has(id)    { return getAll().includes(id); }

  function toggle(id) {
    const list = getAll();
    const idx = list.indexOf(id);
    if (idx === -1) list.push(id);
    else list.splice(idx, 1);
    Storage.set(KEY, list);
    return list.includes(id);
  }

  function clear() { Storage.remove(KEY); }

  function getQuestions() {
    const idSet = new Set(getAll());
    return QuestionManager.getAllQuestions().filter(q => idSet.has(q.id));
  }

  return { getAll, getCount, has, toggle, clear, getQuestions };
})();

/* ------------------------------------------------------------
   WrongQuestions — IDs of questions answered wrong
   ------------------------------------------------------------ */
const WrongQuestions = (() => {
  const KEY = 'cse_quiz_wrong';

  function getAll() {
    const v = Storage.get(KEY, {});
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  }

  function markWrong(id) {
    const data = getAll();
    data[id] = (data[id] || 0) + 1;
    Storage.set(KEY, data);
  }

  function markCorrect(id) {
    const data = getAll();
    if (data[id]) { delete data[id]; Storage.set(KEY, data); }
  }

  function getIds()   { return Object.keys(getAll()); }
  function clear()    { Storage.remove(KEY); }
  function getCount() { return getIds().length; }

  function getQuestions() {
    const idSet = new Set(getIds());
    return QuestionManager.getAllQuestions().filter(q => idSet.has(q.id));
  }

  return { getAll, markWrong, markCorrect, getIds, clear, getQuestions, getCount };
})();

window.Bookmarks = Bookmarks;
window.WrongQuestions = WrongQuestions;
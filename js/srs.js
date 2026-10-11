/* ------------------------------------------------------------
   SRS — Spaced Repetition System (Anki-style, simplified)
   Interval stored in MINUTES.
   Correct:  1 day → 3 days → 7 days → 14 days → (×ease growth)
   Wrong:    12 hours (720 min)
   ------------------------------------------------------------ */
const SRS = (() => {
  const KEY = 'cse_quiz_srs';
  const ENABLED_KEY = 'cse_quiz_srs_enabled';

  /* Correct-answer schedule in minutes */
  const INTERVAL_STEPS = [
    1 * 24 * 60,   /* 1 day   = 1440 min */
    3 * 24 * 60,   /* 3 days  = 4320 min */
    7 * 24 * 60,   /* 7 days  = 10080 min */
    14 * 24 * 60   /* 14 days = 20160 min */
  ];

  /* Wrong-answer reset — 12 hours */
  const LAPSE_INTERVAL = 12 * 60; /* 720 min */

  const MAX_EASE = 3.0;
  const MIN_EASE = 1.3;
  const DEFAULT_EASE = 2.5;
  const MAX_INTERVAL_MIN = 365 * 24 * 60; /* cap at 1 year */

  /* ---------- Toggle ---------- */
  function isEnabled() {
    return Storage.get(ENABLED_KEY, false) === true;
  }
  function setEnabled(v) {
    Storage.set(ENABLED_KEY, !!v);
  }

  /* ---------- Storage ---------- */
  function getAll() {
    const v = Storage.get(KEY, {});
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  }
  function getRecord(id) {
    return getAll()[id] || null;
  }
  function emptyRecord() {
    return {
      interval: 0,
      ease: DEFAULT_EASE,
      next: null,
      last: null,
      streak: 0,
      lapses: 0
    };
  }

  /* ---------- Core algorithm ---------- */
  function recordReview(id, correct) {
    if (!isEnabled()) return;
    if (!id || typeof id !== 'string') return;
    const all = getAll();
    const rec = all[id] || emptyRecord();
    const now = new Date();

    rec.last = now.toISOString();

    if (correct) {
      rec.streak = (rec.streak || 0) + 1;

      let intervalMin;
      if (rec.streak - 1 < INTERVAL_STEPS.length) {
        intervalMin = INTERVAL_STEPS[rec.streak - 1];
      } else {
        /* Past the fixed steps — grow by ease */
        const base = INTERVAL_STEPS[INTERVAL_STEPS.length - 1];
        const stepsPast = rec.streak - INTERVAL_STEPS.length;
        intervalMin = Math.round(base * Math.pow(rec.ease || DEFAULT_EASE, stepsPast));
      }
      intervalMin = Math.min(intervalMin, MAX_INTERVAL_MIN);

      rec.interval = Math.max(1, intervalMin);
      rec.ease = Math.min(MAX_EASE, (rec.ease || DEFAULT_EASE) + 0.05);

    } else {
      rec.lapses = (rec.lapses || 0) + 1;
      rec.streak = 0;
      rec.interval = LAPSE_INTERVAL;
      rec.ease = Math.max(MIN_EASE, (rec.ease || DEFAULT_EASE) - 0.15);
    }

    const nextDate = new Date(now.getTime() + rec.interval * 60 * 1000);
    rec.next = nextDate.toISOString();

    all[id] = rec;
    Storage.set(KEY, all);
    return rec;
  }

  /* ---------- Due checks ---------- */
  function minutesUntilDue(id) {
    const rec = getRecord(id);
    if (!rec || !rec.next) return null;
    const diffMs = new Date(rec.next).getTime() - Date.now();
    return Math.floor(diffMs / (1000 * 60));
  }
  function isDue(id) {
    const rec = getRecord(id);
    if (!rec || !rec.next) return true;
    return new Date(rec.next).getTime() <= Date.now();
  }

  function getDueQuestions() {
    return QuestionManager.getAllQuestions().filter(q => isDue(q.id));
  }
  function getDueCount() {
    return getDueQuestions().length;
  }

  /* Human-friendly duration for a record */
  function formatInterval(minutes) {
    if (!minutes) return '—';
    if (minutes < 60) return minutes + 'm';
    if (minutes < 24 * 60) {
      const h = Math.round(minutes / 60);
      return h + 'h';
    }
    const d = Math.round(minutes / (24 * 60));
    return d + 'd';
  }


  /* Small badge for question screens */
  function badgeFor(id) {
    if (!isEnabled()) return '';
    const rec = getRecord(id);
    if (!rec || !rec.next) return '🧠 New';
    const mins = minutesUntilDue(id);
    if (mins === null) return '🧠 New';
    if (mins <= 0) return '🧠 Overdue';
    return '🧠 Due in ' + formatInterval(mins);
  }



  /* ---------- Stats ---------- */
  function getStats() {
    const all = getAll();
    const DAY = 24 * 60;
    let learning = 0, young = 0, mature = 0;
    Object.values(all).forEach(rec => {
      if (!rec || typeof rec.interval !== 'number') return;
      if (rec.interval < DAY) learning++;               /* < 1 day */
      else if (rec.interval < 21 * DAY) young++;        /* 1d … <21d */
      else mature++;                                    /* ≥ 21d */
    });
    const total = QuestionManager.getAllQuestions().length;
    const seen = Object.keys(all).length;
    return {
      totalQuestions: total,
      seen,
      unseen: total - seen,
      learning,
      young,
      mature,
      due: getDueCount()
    };
  }


  function seedFromStats() {
    if (!window.QuestionStats) return 0;
    const stats = QuestionStats.getAll();
    const all = getAll(); /* existing records — preserved */
    const now = Date.now();
    let added = 0;

    Object.entries(stats).forEach(([id, s]) => {
      if (!s || !s.attempts) return;
      if (all[id]) return; /* already scheduled — don't overwrite */
      const rightRatio = s.correct / Math.max(1, s.attempts);
      const initialStreak = rightRatio >= 0.8 ? Math.min(s.correct, 3) : 0;
      const idx = Math.min(initialStreak, INTERVAL_STEPS.length - 1);
      const interval = initialStreak > 0 ? INTERVAL_STEPS[idx] : LAPSE_INTERVAL;
      all[id] = {
        interval,
        ease: DEFAULT_EASE,
        next: new Date(now + interval * 60 * 1000).toISOString(),
        last: s.lastAttemptAt || new Date().toISOString(),
        streak: initialStreak,
        lapses: s.wrong || 0
      };
      added++;
    });

    if (added > 0) Storage.set(KEY, all);
    return added;
  }


  function clear() {
    Storage.remove(KEY);
  }

  return {
    isEnabled, setEnabled,
    getAll, getRecord,
    recordReview,
    isDue, minutesUntilDue,
    getDueQuestions, getDueCount,
    getStats,
    seedFromStats,
    clear,
    badgeFor,
    formatInterval,
    INTERVAL_STEPS, LAPSE_INTERVAL
  };
})();

window.SRS = SRS;
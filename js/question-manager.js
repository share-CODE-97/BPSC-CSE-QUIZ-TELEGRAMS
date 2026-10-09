const QuestionManager = (() => {
  let questions = [];
  const idSet = new Set();
  const byId  = new Map();

  function registerQuestionBank(bank) {
    if (!Array.isArray(bank)) {
      console.error('Question bank must be an array');
      return;
    }
    bank.forEach(q => {
      if (validateQuestion(q)) {
        if (idSet.has(q.id)) {
          console.error(`Duplicate question ID: ${q.id}`);
          return;
        }
        idSet.add(q.id);
        byId.set(q.id, q);
        questions.push(q);
      }
    });
    //console.log(`Registered bank — total questions now: ${questions.length}`);
  }

  function validateQuestion(q) {
    if (!q.id || typeof q.id !== 'string') {
      console.error('Question missing valid id', q);
      return false;
    }
    if (!q.subject || typeof q.subject !== 'string') {
      console.error(`Question ${q.id} missing subject`, q);
      return false;
    }
    if (!q.subtopic || typeof q.subtopic !== 'string') {
      console.error(`Question ${q.id} missing subtopic`, q);
      return false;
    }
    if (!q.question || typeof q.question !== 'string') {
      console.error(`Question ${q.id} missing question text`, q);
      return false;
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      console.error(`Question ${q.id} must have at least 2 options`, q);
      return false;
    }
    if (!q.answer || typeof q.answer !== 'string') {
      console.error(`Question ${q.id} missing answer`, q);
      return false;
    }
    if (!q.options.includes(q.answer)) {
      console.error(`Question ${q.id} answer "${q.answer}" not found in options`, q);
      return false;
    }
    return true;
  }

  function getAllQuestions() {
    return questions.slice();
  }

  function getSubjects() {
    const subjects = new Set();
    questions.forEach(q => subjects.add(q.subject));
    return Array.from(subjects).sort();
  }

  function getSubtopics(subject) {
    const subs = new Set();
    questions
      .filter(q => q.subject === subject)
      .forEach(q => subs.add(q.subtopic));
    return Array.from(subs).sort();
  }

  function getQuestionsBySubject(subject) {
    return questions.filter(q => q.subject === subject);
  }

  function getQuestionsBySubtopic(subject, subtopic) {
    return questions.filter(q => q.subject === subject && q.subtopic === subtopic);
  }


    function getQuestionById(id) {
    return byId.get(id) || null;
  }


  function getStats() {
    const subjects = getSubjects();
    let subtopicCount = 0;
    subjects.forEach(s => {
      subtopicCount += getSubtopics(s).length;
    });
    return { subjects: subjects.length, questions: questions.length, subtopics: subtopicCount };
  }

  return {
    registerQuestionBank,
    getAllQuestions,
    getQuestionById,
    getSubjects,
    getSubtopics,
    getQuestionsBySubject,
    getQuestionsBySubtopic,
    getStats
  };
})();

/* -------------------------------------------------------------
   Make registerQuestionBank available globally so that
   question-bank files (e.g. questions/computer-network.js)
   can call it directly.
   ------------------------------------------------------------- */
window.registerQuestionBank = QuestionManager.registerQuestionBank;
window.QuestionManager = QuestionManager;
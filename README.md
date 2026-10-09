# CSE Quiz Hub

An offline-first quiz app for Computer Science & Engineering exam preparation.

## Features

- **Practice Mode** — instant feedback, bookmark questions, wrong-question tracking
- **Exam Mode** — timer, marking scheme, question navigator, flag for review, detailed review
- **Works offline** — install it as an app on Android or desktop
- **Dark & Light themes**
- **Backup & Restore** — export your data to a file and restore it anytime
- **Keyboard shortcuts** — arrow keys, number keys 1–8, B/F/C for bookmark/flag/clear
- **Swipe gestures** on mobile
- **Day streak** tracking

## Install on Android

1. Open the GitHub Pages URL in Chrome.
2. Tap the menu (⋮) → **Install app** (or **Add to Home screen**).
3. Done — the app now lives on your home screen and works offline.

## Subjects

Basic Computer · Digital Logic · Computer Organization · IoT · Artificial Intelligence · Data Structure · E-Commerce · Multimedia · Software Engineering · Operating System · DBMS · Computer Network · Web Technology · Theory of Computation · OOP · Computer Security

## How to add questions

Questions live in `questions/*.js`. Each file registers itself with the app.

Example:

```js
registerQuestionBank([
  {
    id: 'cn-ip-001',
    subject: 'Computer Network',
    subtopic: 'IP Addressing',
    question: 'What is the loopback address in IPv4?',
    options: ['127.0.0.1', '192.168.0.1', '10.0.0.1', '255.255.255.255'],
    answer: '127.0.0.1',
    explanation: 'The loopback address 127.0.0.1 always refers to the local machine.'
  }
]);


Rules:

Every question needs a unique id.

answer must exactly match one of the options.

At least 2 options required.

After adding a new bank file, also add a <script> line for it in index.html.

Tech
Vanilla HTML, CSS, JavaScript. No build tools, no frameworks, no backend.

License
MIT — see LICENSE file.

text

3. Save.

### How to test
- Push to GitHub → the repo landing page should now show your README. ✅

---

# ✅ Where you stand now

**Done:**
- PWA (manifest, SW, icons, theme-color)
- `.nojekyll`
- favicon
- Rounds 1–5 (all bug fixes + Practice Review + swipe + wake lock + export/import + streak)
- Indian-time export filename + "Last export" text
- Now adding: OG tags, LICENSE, README, cache bump to v2

**Still pending (Priority 2, nice-to-have):**
- E. Follow system theme
- F. Install prompt UI (nice button in Settings)
- G. Resume-on-reload for interrupted exams
- H. Custom 404.html

**Still pending (Priority 3, bigger):**
- I. Add `difficulty` + `tags` to question schema
- J. Question notes
- K. SRS (spaced repetition)
- L. Lazy-load banks

---

# 🎯 My suggestion

Do the **cache bump + A + B + C above** now (10 minutes total).

Then **push to GitHub and test on your phone** — install it, use it for a day or two. Real usage will tell you which Priority 2/3 items actually matter to you.

Come back after that and we'll pick the next thing based on your real experience. No point adding resume-on-reload if you never lose progress; no point adding SRS if you never use the wrong-questions list.

Which one first — the cache bump, the OG tags, or the README?


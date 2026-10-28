'use strict';

/* ================= Config (mirrors app.js) ================= */
const WEBHOOK_URL = 'https://hook.eu2.make.com/p5w6lk8xxh5q8hk8l9atw8ajkr7heuvu';
const SIGNUP_EMAIL = 'gabriel@fastechnologyhq.co.uk';
const BRAND_NAME = 'Fàs';
const BOOKING_LINK = 'https://calendly.com/fas-technology';
const GA4_ID = 'G-SX0QJ6KN7D';  // Google Analytics 4 — live

/* ================= Questions (order = priority of fixes) ================= */
const QUESTIONS = [
  { id: 'gbp', text: 'Have you claimed your free Google Business Profile?',
    fix: { title: 'Claim your Google Business Profile',
      why: 'This is the number one thing AI assistants and Google check before recommending a salon. No profile means you barely exist to them.',
      how: 'Go to google.com/business, claim your salon, and fill in photos, opening hours, services and prices. Free, and about 20 minutes.' } },
  { id: 'freshReviews', text: 'Do you have Google reviews from the last 30 days?',
    fix: { title: 'Get 2–3 fresh Google reviews',
      why: 'Recent genuine reviews help show customers and AI alike that you are busy and open now. They work alongside your overall review history.',
      how: 'Ask your three happiest customers this week: "Could you leave us a quick Google review? It really helps." Send them the link from your profile.' } },
  { id: 'replyReviews', text: 'Do you reply to your Google reviews?',
    fix: { title: 'Reply to every Google review',
      why: 'Replies show the review is real and the salon is run well, and they give AI more words to connect with your services.',
      how: 'Reply to each one in a sentence or two, mention your town and the service they had. Then make replying a habit after every review.' } },
  { id: 'directories', text: 'Are you listed on local directories (Yell, Facebook, Treatwell, FreeIndex)?',
    fix: { title: 'Get listed on the local directories',
      why: 'AI assistants cross-check several sources before recommending you. The more places your name, town and services agree, the more confident they are.',
      how: 'Set up or tidy your pages on Yell, Facebook and FreeIndex: same name, same address, same phone everywhere. Two hours, once.' } },
  { id: 'website', text: 'Do you have your own website (even a simple one)?',
    fix: { title: 'Get a simple website of your own',
      why: 'Social profiles alone are thin. A website you control is where AI looks for real information about your services and prices.',
      how: 'A one-page site is enough: who you are, services, prices, town, reviews and a way to book. We build these for salons, or any free builder works.' } },
  { id: 'servicesTown', text: 'Does your website clearly say your services and your town?',
    fix: { title: 'Say your services and your town, in words',
      why: 'AI recommends what it can understand. "Hair" and a logo tell it nothing; "balayage and bridal hair in Marlow" tells it everything.',
      how: 'Write your services and your town in plain text on the page: headings and sentences, not just in images or logos.' } },
  { id: 'instagram', text: 'Is your Instagram active (posted in the last 2 weeks)?',
    fix: { title: 'Get your Instagram moving again',
      why: 'An abandoned profile suggests an abandoned salon. Regular posts keep you in front of regulars and prove you\'re open.',
      how: 'Post three times this week: a recent result, a behind-the-scenes, and an open slot. Then twice a week keeps it warm.' } },
  { id: 'bookingLink', text: 'Can someone book you in one tap (link in your profiles/bio)?',
    fix: { title: 'Make booking one tap away',
      why: 'Extra booking steps can create drop-off. If finding your booking link takes effort, some people give up and book elsewhere.',
      how: 'Put your booking link at the top of your Instagram bio, Facebook page and Google profile. Test it on a friend\'s phone.' } },
  { id: 'pricesPublic', text: 'Are your prices written down somewhere public?',
    fix: { title: 'Publish your prices',
      why: '"Prices on request" loses bookings. People want to check before they commit, and AI can\'t recommend what it can\'t see.',
      how: 'List your main services and prices on your website, Google profile and Instagram highlights. Update them whenever they change.' } },
  { id: 'photos', text: 'Have you added new photos (of your work or salon) in the last month?',
    fix: { title: 'Add fresh photos every month',
      why: 'Photos are proof. Fresh photos say "busy and good" to both people and the systems ranking you.',
      how: 'Photograph every great result on your phone (with permission), and add the best ones to your Google profile and Instagram each week.' } },
];

/* ================= State ================= */
const VIS_KEY = 'visibilityState.v1';
let answers = {};
let score = null;

function defaultVisState() { return { answers: {}, score: null, done: false }; }
let state = defaultVisState();

/* ================= Helpers ================= */
const $ = (sel) => document.querySelector(sel);
const esc = (x) => String(x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function loadVisState() {
  try {
    const raw = localStorage.getItem(VIS_KEY);
    if (raw) state = { ...defaultVisState(), ...JSON.parse(raw) };
    answers = state.answers || {};
    for (const k of Object.keys(answers)) {           // migrate pre-v2 boolean answers
      if (answers[k] === true) answers[k] = 'yes';
      else if (answers[k] === false) answers[k] = 'no';
    }
    score = state.score;
  } catch { /* start fresh */ }
}
function saveVisState() {
  state.answers = answers;
  state.score = score;
  state.done = score !== null;
  try { localStorage.setItem(VIS_KEY, JSON.stringify(state)); } catch { /* private mode */ }
}

/* tracking: silent until GA4_ID is set */
function track(event, params) {
  if (!GA4_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params || {});
}
function loadAnalytics() {
  if (!GA4_ID) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID);
}

/* ================= Quiz ================= */
function renderQuiz() {
  $('#quizList').innerHTML = QUESTIONS.map((q, i) => `
    <div class="quiz-q" data-q="${q.id}">
      <p class="quiz-text"><span class="quiz-n">${i + 1}.</span> ${esc(q.text)}</p>
      <div class="q-btns" role="group" aria-label="${esc(q.text)}">
        <button type="button" class="q-btn${answers[q.id] === true ? ' yes' : ''}" data-v="yes" aria-pressed="${answers[q.id] === true}">Yes</button>
        <button type="button" class="q-btn${answers[q.id] === false ? ' no' : ''}" data-v="no" aria-pressed="${answers[q.id] === false}">No</button>
        <button type="button" class="q-btn${answers[q.id] === 'ns' ? ' ns' : ''}" data-v="ns" aria-pressed="${answers[q.id] === 'ns'}">Not sure</button>
      </div>
    </div>`).join('');
  updateProgress();
}

function updateProgress() {
  const done = QUESTIONS.filter(q => answers[q.id] !== undefined).length;
  $('#quizProgress').style.width = (done / QUESTIONS.length * 100) + '%';
  const bar = document.querySelector('.quiz-progress');
  if (bar) bar.setAttribute('aria-valuenow', String(done));
  const btn = $('#scoreBtn');
  if (done === QUESTIONS.length) {
    btn.disabled = false;
    btn.textContent = 'Show my visibility score';
  } else {
    btn.disabled = true;
    btn.textContent = `Answer all 10 to see my score (${done}/10)`;
  }
}

function scoreQuiz() {
  return QUESTIONS.reduce((sum, q) => sum + (answers[q.id] === 'yes' ? 10 : 0), 0);
}  // 'no' and 'not sure' both score 0

function tierFor(score) {
  if (score >= 80) return { tier: 'Easy to find. you\'re the safe recommendation', blurb: 'AI and Google have plenty to work with. Keep the reviews fresh and the photos coming, and you\'ll stay the default answer in your town.' };
  if (score >= 50) return { tier: 'Partly visible. A few fixes will move the needle', blurb: 'You exist online, but there are gaps where AI and Google quietly skip you. The good news: everything missing is free or cheap to fix, and fast.' };
  if (score >= 20) return { tier: 'Hard to find. you\'re missing out on new customers', blurb: 'When someone asks AI for a salon near them, you\'re not in the conversation. Each gap below is sending people to other salons, and they\'re all fixable.' };
  return { tier: 'Key basics missing — start with these first', blurb: 'Right now, when someone asks AI or searches Google, your salon effectively doesn\'t exist. Many of these are low-cost improvements. Results vary, but they all add up. Do the first one today.' };
}

function renderResult() {
  score = scoreQuiz();
  const { tier, blurb } = tierFor(score);
  $('#scoreNum').textContent = score;
  $('#scoreTier').textContent = tier;
  $('#scoreBlurb').textContent = blurb;
  $('#scoreBar').style.width = score + '%';
  $('#scoreBar').style.background = score >= 80 ? 'var(--accent)' : (score >= 50 ? 'var(--gold)' : 'var(--cost)');

  const fixes = QUESTIONS.filter(q => answers[q.id] === 'no' || answers[q.id] === 'ns').slice(0, 3);
  $('#fixList').innerHTML = fixes.map((q, i) => `
    <div class="fix-card">
      <h4>${i + 1}. ${esc(q.fix.title)}</h4>
      <p><strong>Why it matters:</strong> ${esc(q.fix.why)}</p>
      <p><strong>How:</strong> ${esc(q.fix.how)}</p>
    </div>`).join('') || '<p class="feedback ok">Full marks, nothing to fix! Keep doing what you\'re doing.</p>';

  $('#quizReset').hidden = false;
  track('visibility_scored', { score });
  saveVisState();
}

/* ================= Webhook ================= */
async function sendToWebhook(payload) {
  const r = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('Webhook responded ' + r.status);
}

/* ================= Wiring ================= */
function bindEvents() {
  // quiz answers
  $('#quizList').addEventListener('click', (e) => {
    const btn = e.target.closest('.q-btn');
    if (!btn) return;
    const q = btn.closest('[data-q]').dataset.q;
    const v = btn.dataset.v;                       // 'yes' | 'no' | 'ns'
    answers[q] = v;
    btn.parentElement.querySelectorAll('.q-btn').forEach(b => { b.classList.remove('yes', 'no', 'ns'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add(v === 'yes' ? 'yes' : v === 'no' ? 'no' : 'ns');
    btn.setAttribute('aria-pressed', 'true');
    updateProgress();
    saveVisState();
  });

  $('#scoreBtn').addEventListener('click', () => {
    renderResult();
    $('#result').hidden = false;
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('#scoreTier').focus({ preventScroll: true });
  });

  $('#quizReset').addEventListener('click', () => {
    answers = {}; score = null; saveVisState();
    renderQuiz();
    $('#result').hidden = true;
    $('#quizReset').hidden = true;
    $('#quiz').scrollIntoView({ behavior: 'smooth' });
  });

  // visibility report form
  $('#visForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if ($('#visHp').value) { $('#visDone').hidden = false; return; }
    const form = $('#visForm');
    const btn = form.querySelector('button[type="submit"]');
    btn.dataset.original = btn.textContent; btn.textContent = 'Sending…'; btn.disabled = true;
    try {
      await sendToWebhook({
        source: 'visibility_audit',
        name: $('#visName').value.trim(),
        business: $('#visBusiness').value.trim(),
        email: $('#visEmail').value.trim(),
        score,
        tier: tierFor(score).tier,
        answers: QUESTIONS.map(q => ({ question: q.text, answer: answers[q.id] === true ? 'yes' : (answers[q.id] === 'ns' ? 'not_sure' : 'no') })),
        fixes: QUESTIONS.filter(q => answers[q.id] === false).slice(0, 3).map(q => q.fix.title),
        consent: $('#visConsent').checked,
        submittedAt: new Date().toISOString(),
        pageUrl: location.href,
      });
      $('#visDone').hidden = false;
      $('#visDone').classList.remove('warn');
      form.reset();
      track('report_requested', { score });
    } catch {
      $('#visDone').hidden = false;
      $('#visDone').classList.add('warn');
      $('#visDone').textContent = 'Hmm, that didn\'t go through. Please email us directly at ' + SIGNUP_EMAIL + '.';
    }
    btn.textContent = btn.dataset.original; btn.disabled = false;
  });

  // share
  $('#shareBtn').addEventListener('click', async () => {
    const btn = $('#shareBtn');
    const data = { title: 'Is your salon visible to AI?', text: 'Free 2-minute check: see if ChatGPT and Google can find your salon:', url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(location.href);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = location.href; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* clipboard unavailable */ }
      ta.remove();
    }
    const original = btn.textContent;
    btn.textContent = 'Link copied ✓'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 2000);
  });

  // reset everything
  $('#resetBtn').addEventListener('click', () => {
    try { localStorage.removeItem(VIS_KEY); } catch { }
    location.reload();
  });
}

function init() {
  loadVisState();
  renderQuiz();
  $('#agencyBrand').textContent = `${BRAND_NAME} · marketing for salons`;
  $('#visAgencyCta').href = BOOKING_LINK;
  $('#visBook').href = BOOKING_LINK;
  $('.agency-addr').textContent = SIGNUP_EMAIL;
  $('.vis-addr').textContent = SIGNUP_EMAIL;
  $('#footBrand').textContent = BRAND_NAME;
  bindEvents();
  loadAnalytics();
  if (state.done && score !== null) {
    renderResult();
    $('#result').hidden = false;
  }
}

init();

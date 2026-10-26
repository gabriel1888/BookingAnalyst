'use strict';

/* ================= Config — EDIT THESE before publishing ================= */
const WEBHOOK_URL = 'https://hook.eu2.make.com/p5w6lk8xxh5q8hk8l9atw8ajkr7heuvu'; // Make.com scenario that receives leads
const SIGNUP_EMAIL = 'gabriel@fastechnologyhq.co.uk';  // where report requests & signups land
const BOOKING_LINK = 'https://calendly.com/fas-technology'; // "Work with us" strategy-call booking link
const BRAND_NAME = 'Fàs';                              // your brand, shown in the agency band & footer


/* ================= Platform fee presets (editable, approximate Oct 2026) ================= */
const PLATFORMS = [
  { id: 'fresha',      name: 'Fresha',       color: '#101828', commission: 20,   procPct: 2.19, procFixed: 0.49, sub: 0,    smsAllow: 100, smsCost: 0.08,
    note: 'Free app. It keeps about 20p of every £1 from customers it finds you. Bookings from your own page cost nothing. Free texts each month, then a small charge.' },
  { id: 'treatwell',   name: 'Treatwell',    color: '#E6007E', commission: 25,   procPct: 0,    procFixed: 0,    sub: 0,    smsAllow: 0,   smsCost: 0,
    note: 'It keeps a share of every customer it finds you — often 15 to 30p in the pound. It usually collects the money and passes it on to you.' },
  { id: 'booksy',      name: 'Booksy',       color: '#1D6FF2', commission: 0,    procPct: 1.99, procFixed: 0.20, sub: 29.99, smsAllow: 0,   smsCost: 0.09,
    note: 'You pay a fixed price every month, plus a small fee when a customer pays by card.' },
  { id: 'planity',     name: 'Planity',      color: '#7C3AED', commission: 20,   procPct: 0,    procFixed: 0,    sub: 49,   smsAllow: 0,   smsCost: 0,
    note: 'A fixed price every month, plus a share of the customers it finds you.' },
  { id: 'square',      name: 'Square',       color: '#334155', commission: 0,    procPct: 2.60, procFixed: 0.10, sub: 0,    smsAllow: 0,   smsCost: 0,
    note: 'Free app. You only pay a small fee when customers pay by card.' },
  { id: 'vagaro',      name: 'Vagaro',       color: '#F97316', commission: 0,    procPct: 2.70, procFixed: 0.30, sub: 25,   smsAllow: 0,   smsCost: 0,
    note: 'A fixed price every month, plus a small fee when customers pay by card.' },
  { id: 'glossgenius', name: 'GlossGenius',  color: '#EC4899', commission: 0,    procPct: 2.60, procFixed: 0.10, sub: 24,   smsAllow: 0,   smsCost: 0,
    note: 'A fixed price every month, plus a small fee when customers pay by card.' },
  { id: 'styleseat',   name: 'StyleSeat',    color: '#0EA5E9', commission: 0,    procPct: 2.90, procFixed: 0.30, sub: 35,   smsAllow: 0,   smsCost: 0,
    note: 'A fixed price every month, plus a small fee when customers pay by card.' },
  { id: 'direct',      name: 'Booked direct', color: '#0E6B54', commission: 0,    procPct: 1.73, procFixed: 0,    sub: 0,    smsAllow: 0,   smsCost: 0,
    note: 'People who call, message or walk in — no app takes a cut. Only the card reader fee applies.' },
  { id: 'other',       name: 'Another app',  color: '#94A3B8', commission: 0,    procPct: 0,    procFixed: 0,    sub: 0,    smsAllow: 0,   smsCost: 0,
    note: 'Any app not listed here. Put in what it charges you.' },
];
const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map(p => [p.id, p]));

const DIRECT_KEYWORDS = ['direct', 'own link', 'own website', 'website', 'walk', 'phone', 'call', 'whatsapp', 'instagram', 'facebook', 'tiktok', 'google', 'referral', 'word of mouth', 'regular', 'in person', 'in-person'];
const PLATFORM_KEYWORDS = {
  fresha: ['fresha'], treatwell: ['treatwell'], booksy: ['booksy'], planity: ['planity'],
  square: ['square'], vagaro: ['vagaro'], glossgenius: ['glossgenius', 'gloss genius'],
  styleseat: ['styleseat', 'style seat'],
};
const NOSHOW_WORDS = ['no show', 'no-show', 'noshow', 'did not attend', 'dna', 'not attended'];
const CANCEL_WORDS = ['cancel'];

const SAMPLE_CSV = `Date,Time,Client,Service,Source,Status,Price
2026-10-01,09:00,Ana M,Blow dry,Treatwell,Paid,45
2026-10-01,11:30,Jo R,Cut & colour,Treatwell,Paid,140
2026-10-02,10:00,Mia K,Manicure,Fresha,Paid,35
2026-10-02,13:00,Lee S,Massage,Fresha marketplace,Paid,60
2026-10-03,09:30,Kim T,Cut & finish,Fresha (own link),Paid,55
2026-10-03,15:00,Sara P,Balayage,Treatwell,Paid,160
2026-10-04,11:00,Elle B,Blow dry,Instagram DM,Paid,40
2026-10-06,10:00,Ana M,Roots,Treatwell,Paid,75
2026-10-07,14:00,Pat G,Cut & finish,Walk-in,Paid,50
2026-10-08,09:00,Nina L,Lash lift,Fresha,Paid,45
2026-10-08,16:30,Tom H,Massage,Fresha,No show,60
2026-10-09,10:00,Jo R,Toner,Treatwell,Paid,55
2026-10-10,12:00,Ada W,Manicure,Fresha,Paid,35
2026-10-11,09:30,Sara P,Blow dry,Treatwell,Paid,45
2026-10-13,11:00,Mia K,Cut & colour,Fresha,Paid,130
2026-10-14,15:30,Elle B,Haircut,Direct (regular),Paid,65
2026-10-15,10:00,Kim T,Roots,Fresha (own link),Paid,70
2026-10-16,09:00,Lee S,Massage,WhatsApp,Paid,60
2026-10-17,14:00,Nina L,Balayage,Treatwell,Paid,170
2026-10-18,10:30,Pat G,Blow dry,Fresha,Paid,45
2026-10-20,11:00,Ada W,Cut & finish,Treatwell,Cancelled,55
2026-10-21,09:30,Jo R,Blow dry,Treatwell,Paid,45
2026-10-22,15:00,Tom H,Massage,Fresha,No show,60
2026-10-23,10:00,Mia K,Manicure,Phone,Paid,35`;

/* ================= State ================= */
const STORE_KEY = 'feeAnalyserState.v1';

function defaultState() {
  return {
    period: 'monthly',
    currency: '£',
    cardShare: 100,
    inputMode: 'quick',
    csvText: '',
    channels: ['fresha', 'treatwell', 'direct'],
    smsPerBooking: 1,
    quick: {},            // id -> {count, avg}
    overrides: {},        // id -> {commission, procPct, procFixed, sub, smsAllow, smsCost}
    nsCount: 0,
    nsTicket: 0,
    sim: { conv: 25, disc: 0 },
  };
}
let state = defaultState();

/* Derived data for the current calculation */
let calc = null;

/* ================= Tiny helpers ================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const MONTHS_PER_WEEK = 52 / 12;

function fmt(n, dec = 0) {
  const v = Number.isFinite(n) ? n : 0;
  return state.currency + v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtPct(n, dec = 1) { return (Number.isFinite(n) ? n : 0).toFixed(dec) + '%'; }
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function rateOf(id) {
  const base = PLATFORM_MAP[id];
  const o = state.overrides[id] || {};
  return {
    commission: o.commission ?? base.commission,
    procPct: o.procPct ?? base.procPct,
    procFixed: o.procFixed ?? base.procFixed,
    sub: o.sub ?? base.sub,
    smsAllow: o.smsAllow ?? base.smsAllow,
    smsCost: o.smsCost ?? base.smsCost,
  };
}

/* ================= CSV parsing ================= */
function detectDelimiter(line) {
  const counts = { ',': (line.match(/,/g) || []).length, ';': (line.match(/;/g) || []).length, '\t': (line.match(/\t/g) || []).length };
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function splitCsv(text) {
  const delim = detectDelimiter(text.split(/\r?\n/)[0] || '');
  const rows = [];
  let cur = [''], field = 0, inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') { if (text[i + 1] === '"') { cur[field] += '"'; i++; } else inQ = false; }
      else cur[field] += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === delim) { cur.push(''); field++; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      rows.push(cur); cur = ['']; field = 0;
    } else cur[field] += ch;
  }
  if (cur.length > 1 || cur[0].trim() !== '') rows.push(cur);
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

const normHeader = (h) => h.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();

function detectColumns(headers) {
  const norm = headers.map(normHeader);
  const find = (re, bad) => norm.findIndex(h => re.test(h) && !(bad && bad.test(h)));
  const amountBad = /vat|tax|duration|discount|due|outstanding|unpaid|tip|quantity|qty|count|number|length|payable|range|paid out|cost|fee|deposit/;
  let amount = norm.findIndex(h => h === 'total' || h === 'total price' || h === 'amount' || h === 'price');
  if (amount < 0) amount = find(/total|price|amount|value|revenue|paid|gross|sale/, amountBad);
  return {
    amount,
    source: find(/source|channel|origin|platform|booking type|marketplace|medium|referrer|where/),
    status: find(/status|state/),
    date: find(/date|day/),
  };
}

function parseAmount(s) {
  if (s == null) return NaN;
  const cleaned = String(s).replace(/[£$€\s,]/g, '');
  if (cleaned === '' || cleaned === '-') return NaN;
  const v = parseFloat(cleaned);
  return Number.isFinite(v) ? v : NaN;
}

function detectChannel(src) {
  const s = (src || '').toLowerCase();
  if (!s) return 'other';
  if (DIRECT_KEYWORDS.some(k => s.includes(k))) return 'direct';
  for (const [id, words] of Object.entries(PLATFORM_KEYWORDS)) {
    if (words.some(w => s.includes(w))) return id;
  }
  return 'other';
}

function classifyStatus(s) {
  const v = (s || '').toLowerCase();
  if (!v) return 'ok';
  if (NOSHOW_WORDS.some(w => v.includes(w))) return 'noshow';
  if (CANCEL_WORDS.some(w => v.includes(w))) return 'cancelled';
  return 'ok';
}

/**
 * Parse pasted text into per-row records + column metadata.
 * Supports: headered CSV, headerless "amount[, source]" lines.
 */
function parseBookings(text) {
  const rows = splitCsv(text);
  if (!rows.length) return { records: [], meta: { message: 'Nothing to parse — paste some rows first.' } };

  const cols = detectColumns(rows[0]);
  const firstAmount = parseAmount(rows[0][cols.amount >= 0 ? cols.amount : 0]);
  const headered = cols.amount >= 0 && !Number.isFinite(firstAmount);

  const records = [];
  let ignored = 0;
  const dataRows = headered ? rows.slice(1) : rows;

  for (const r of dataRows) {
    let amount = NaN, source = '', statusRaw = '';
    if (headered) {
      amount = parseAmount(r[cols.amount]);
      source = cols.source >= 0 ? (r[cols.source] || '') : '';
      statusRaw = cols.status >= 0 ? (r[cols.status] || '') : '';
    } else {
      // headerless: first numeric cell is the amount; first non-numeric cell (if any) is the source
      const numericIdx = r.findIndex(c => Number.isFinite(parseAmount(c)) && parseAmount(c) !== null);
      for (let i = 0; i < r.length; i++) {
        const a = parseAmount(r[i]);
        if (Number.isFinite(a) && !Number.isFinite(amount)) { amount = a; continue; }
        if (!Number.isFinite(a) && r[i] && r[i].trim() !== '' && !source) source = r[i];
      }
      if (!Number.isFinite(amount) && numericIdx === -1) { ignored++; continue; }
    }
    if (!Number.isFinite(amount) || amount <= 0) { ignored++; continue; }
    records.push({ amount, channel: detectChannel(source), status: classifyStatus(statusRaw), source: source.trim() });
  }

  const meta = {
    headered,
    columns: headered ? cols : null,
    ignored,
    unmapped: records.filter(x => x.channel === 'other').length,
    message: null,
  };
  if (!records.length) meta.message = 'No usable booking rows found. There should be a price/total column (see tips below).';
  return { records, meta };
}

/* ================= Aggregation & fee maths ================= */
function periodFactor() { return state.period === 'weekly' ? MONTHS_PER_WEEK : 1; }

function aggregate() {
  const f = periodFactor();
  const chans = {};   // id -> {count, revenue}
  let nsCount = 0, nsRevenue = 0, cancelled = 0;

  if (state.inputMode === 'csv' && state.csvText.trim()) {
    const { records } = parseBookings(state.csvText);
    for (const rec of records) {
      if (rec.status === 'cancelled') { cancelled++; continue; }
      if (rec.status === 'noshow') { nsCount++; nsRevenue += rec.amount; continue; }
      const c = (chans[rec.channel] ||= { count: 0, revenue: 0 });
      c.count += 1; c.revenue += rec.amount;
    }
    // CSV values are per period; scale weekly → monthly
    for (const c of Object.values(chans)) { c.count *= f; c.revenue *= f; }
    nsCount *= f; nsRevenue *= f;
  } else if (state.inputMode === 'quick') {
    for (const [id, q] of Object.entries(state.quick)) {
      if (!state.channels.includes(id)) continue;   // deselected channels don't count
      const count = parseFloat(q.count) || 0;
      const avg = parseFloat(q.avg) || 0;
      if (count > 0) chans[id] = { count: count * f, revenue: count * avg * f };
    }
    nsCount = (parseFloat(state.nsCount) || 0) * f;
    nsRevenue = nsCount * (parseFloat(state.nsTicket) || 0);
  } else {
    // csv mode with empty text → fall back to manual no-show fields only
    nsCount = (parseFloat(state.nsCount) || 0) * f;
    nsRevenue = nsCount * (parseFloat(state.nsTicket) || 0);
  }

  const totalRevenue = Object.values(chans).reduce((s, c) => s + c.revenue, 0);
  const totalBookings = Object.values(chans).reduce((s, c) => s + c.count, 0);
  const marketplaceRevenue = Object.entries(chans)
    .filter(([id]) => rateOf(id).commission > 0)
    .reduce((s, [, c]) => s + c.revenue, 0);
  return { chans, totalRevenue, totalBookings, nsCount, nsRevenue, cancelled, marketplaceShare: totalRevenue > 0 ? marketplaceRevenue / totalRevenue : 0 };
}

function feeBreakdown(id, revenue, count, active) {
  const r = rateOf(id);
  const cs = clamp(state.cardShare, 0, 100) / 100;
  const commission = revenue * (r.commission / 100);
  const card = revenue * cs * (r.procPct / 100) + count * cs * r.procFixed;
  // SMS reminders: charged per message once the monthly free allowance is used up
  const smsCount = active ? Math.max(0, count * (state.smsPerBooking || 0) - r.smsAllow) : 0;
  const sms = smsCount * r.smsCost;
  const sub = active ? r.sub : 0;
  return { commission, card, sms, sub, total: commission + card + sms + sub };
}

function computeAll() {
  const agg = aggregate();
  const rows = [];
  let totalFees = 0, totalCommission = 0, totalCard = 0, totalSms = 0, totalSub = 0;
  for (const [id, c] of Object.entries(agg.chans)) {
    const fees = feeBreakdown(id, c.revenue, c.count, true);
    rows.push({ id, ...c, ...fees, feePct: c.revenue > 0 ? fees.total / c.revenue * 100 : 0 });
    totalFees += fees.total; totalCommission += fees.commission; totalCard += fees.card; totalSms += fees.sms; totalSub += fees.sub;
  }
  rows.sort((a, b) => b.revenue - a.revenue);
  return {
    ...agg,
    rows, totalFees, totalCommission, totalCard, totalSms, totalSub,
    effectivePct: agg.totalRevenue > 0 ? totalFees / agg.totalRevenue * 100 : 0,
    hasData: agg.totalBookings > 0,
  };
}

/** Saving from moving `convPct`% of marketplace bookings to Direct, minus an incentive discount. */
function conversionSaving(convPct, discPct) {
  const direct = rateOf('direct');
  const cs = clamp(state.cardShare, 0, 100) / 100;
  let saved = 0, movedRevenue = 0;
  for (const row of (calc?.rows || [])) {
    const r = rateOf(row.id);
    if (r.commission <= 0 && r.procPct <= 0 && r.smsCost <= 0) continue;
    if (row.id === 'direct' || row.id === 'other') continue;
    const mv = row.revenue * convPct / 100;
    const mb = row.count * convPct / 100;
    movedRevenue += mv;
    // SMS: a moved booking stops consuming paid reminder messages (approximated at the marginal rate)
    saved += mv * (r.commission / 100 + cs * (r.procPct - direct.procPct) / 100)
           + mb * cs * (r.procFixed - direct.procFixed)
           + mb * r.smsCost * (state.smsPerBooking || 0);
  }
  saved -= movedRevenue * discPct / 100;
  return { saved: Math.max(0, saved), movedRevenue };
}

/** What marketplace re-pricing to net-neutral would recover. */
function repriceRecover() {
  let mRev = 0, weighted = 0;
  for (const row of (calc?.rows || [])) {
    const c = rateOf(row.id).commission;
    if (c > 0) { mRev += row.revenue; weighted += row.revenue * c / 100; }
  }
  if (mRev <= 0) return 0;
  const avgC = weighted / mRev;
  if (avgC >= 0.9) return 0;
  return mRev * (avgC / (1 - avgC));
}

/* ================= Rendering ================= */
function activeChannels() {
  // selected channels + any channel that actually has bookings (auto-ticked so its rates stay editable)
  const present = new Set((calc?.rows || []).map(r => r.id));
  return PLATFORMS.filter(p => state.channels.includes(p.id) || present.has(p.id));
}

/* V1 picker: searchable dropdown (multi-select) */
let csIndex = -1;
function renderChannelSearch() {
  const wrap = $('#channelSearch');
  if (!wrap || !wrap.querySelector('.cs-box')) {
    wrap.innerHTML = `
      <div class="cs-box">
        <input id="csInput" type="text" autocomplete="off" spellcheck="false"
          placeholder="Search your apps — e.g. Fresha…" role="combobox" aria-expanded="false" aria-controls="csList">
        <div id="csList" class="cs-list" role="listbox" hidden></div>
      </div>
      <div id="csSelected" class="cs-selected" aria-live="polite"></div>`;
    bindChannelSearch();
  }
  renderCsSelected();
}

function renderCsSelected() {
  const sel = $('#csSelected');
  if (!state.channels.length) {
    sel.innerHTML = '<span class="cs-empty">Nothing added yet — search above and click your apps.</span>';
    return;
  }
  sel.innerHTML = '<span class="cs-selected-label">Your apps:</span>' + state.channels.map(id => {
    const p = PLATFORM_MAP[id];
    return `<button type="button" class="cs-pill" data-remove="${id}"><span class="dot" style="background:${p.color}"></span>${p.name}<span class="cs-x" aria-hidden="true">&times;</span><span class="sr-only">remove</span></button>`;
  }).join('');
}

function csFilter(query) {
  const q = query.trim().toLowerCase();
  return PLATFORMS.filter(p => !q || p.name.toLowerCase().includes(q));
}

function renderCsList() {
  const list = $('#csList');
  const q = $('#csInput').value;
  const items = csFilter(q);
  if (csIndex >= items.length) csIndex = items.length - 1;
  list.innerHTML = items.map((p, i) => {
    const on = state.channels.includes(p.id);
    return `<div class="cs-option${i === csIndex ? ' active' : ''}${on ? ' taken' : ''}" role="option"
      aria-selected="${on}" data-id="${p.id}" data-i="${i}">
      <span class="dot" style="background:${p.color}"></span>${p.name}
      <span class="cs-add">${on ? '✓ added' : 'add +'}</span>
    </div>`;
  }).join('') || '<div class="cs-option cs-none">No app by that name — use "Another app".</div>';
  list.hidden = false;
  $('#csInput').setAttribute('aria-expanded', 'true');
}

function closeCsList() {
  const list = $('#csList');
  if (list) list.hidden = true;
  csIndex = -1;
  const inp = $('#csInput');
  if (inp) inp.setAttribute('aria-expanded', 'false');
}

function syncAfterChannelChange() {
  recalc();               // fresh numbers first (recalc may auto-tick channels found in data)
  renderChannelChips();
  renderCsSelected();
  renderRateCards();
  buildQuickTable();
}

function addChannel(id) {
  if (!state.channels.includes(id)) state.channels.push(id);
  syncAfterChannelChange();
}
function removeChannel(id) {
  state.channels = state.channels.filter(c => c !== id);
  syncAfterChannelChange();
}

function bindChannelSearch() {
  const input = $('#csInput');
  const list = $('#csList');
  input.addEventListener('input', () => { csIndex = -1; renderCsList(); });
  input.addEventListener('focus', () => { csIndex = -1; renderCsList(); });
  input.addEventListener('keydown', (e) => {
    const items = csFilter(input.value);
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!list.hidden) csIndex = Math.min(items.length - 1, csIndex + 1); else { csIndex = 0; } renderCsList(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); csIndex = Math.max(0, csIndex - 1); renderCsList(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (csIndex >= 0 && items[csIndex]) { addChannel(items[csIndex].id); input.value = ''; closeCsList(); } }
    else if (e.key === 'Escape') { closeCsList(); }
  });
  input.addEventListener('blur', () => setTimeout(closeCsList, 120));
  // pointerdown fires before input blur, so clicks register
  list.addEventListener('pointerdown', (e) => {
    const opt = e.target.closest('[data-id]');
    if (!opt) return;
    e.preventDefault();
    addChannel(opt.dataset.id);
    input.value = '';
    renderCsList();
    input.focus();
  });
  $('#csSelected').addEventListener('click', (e) => {
    const pill = e.target.closest('[data-remove]');
    if (pill) removeChannel(pill.dataset.remove);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.cs-box')) closeCsList();
  });
}

function renderChannelChips() {
  $('#channelChips').innerHTML = PLATFORMS.map(p => {
    const on = state.channels.includes(p.id);
    return `<button type="button" class="pick-chip${on ? ' on' : ''}" data-channel="${p.id}" aria-pressed="${on}">
      <span class="dot" style="background:${p.color}"></span>${p.name}</button>`;
  }).join('');
}

function renderRateCards() {
  $('#rateCards').innerHTML = activeChannels().map(p => {
    const r = rateOf(p.id);
    return `<div class="rate-card" data-rate="${p.id}">
      <div class="rate-head"><span class="dot" style="background:${p.color}"></span><h4>${p.name}</h4></div>
      <p class="rate-note">${p.note}</p>
      <div class="rate-fields">
        <label>Keeps % of booking<input type="number" min="0" max="60" step="0.5" data-k="commission" value="${r.commission}"></label>
        <label>Card fee %<input type="number" min="0" max="10" step="0.01" data-k="procPct" value="${r.procPct}"></label>
        <label>Card fee each<input type="number" min="0" max="5" step="0.01" data-k="procFixed" value="${r.procFixed}"></label>
        <label>Monthly price<input type="number" min="0" max="500" step="1" data-k="sub" value="${r.sub}"></label>
        <label>Free texts /mo<input type="number" min="0" max="5000" step="10" data-k="smsAllow" value="${r.smsAllow}"></label>
        <label>Each text costs<input type="number" min="0" max="1" step="0.01" data-k="smsCost" value="${r.smsCost}"></label>
      </div>
      <button class="rate-reset" data-reset="${p.id}">back to typical</button>
    </div>`;
  }).join('');
}

function buildQuickTable() {
  $('#quickTable tbody').innerHTML = activeChannels().map(p => `
    <tr data-quick="${p.id}">
      <td><span class="dot" style="background:${p.color}"></span>${p.name}</td>
      <td><input type="number" min="0" step="1" data-q="count" placeholder="0"></td>
      <td><input type="number" min="0" step="1" data-q="avg" placeholder="${state.currency}0"></td>
      <td class="ta-r quick-rev">—</td>
    </tr>`).join('') + `
    <tr class="quick-total-row"><td>Total</td><td></td><td></td><td class="ta-r" id="quickRevenueCell">—</td></tr>`;
  restoreQuickInputs();
  renderQuickTotals();
}

function restoreQuickInputs() {
  for (const [id, q] of Object.entries(state.quick || {})) {
    const tr = document.querySelector(`tr[data-quick="${id}"]`);
    if (!tr) continue;
    if (q.count != null && q.count !== '') tr.querySelector('[data-q="count"]').value = q.count;
    if (q.avg != null && q.avg !== '') tr.querySelector('[data-q="avg"]').value = q.avg;
  }
}

function renderQuickTotals() {
  let total = 0;
  $$('#quickTable tbody tr[data-quick]').forEach(tr => {
    const id = tr.dataset.quick;
    const count = parseFloat(tr.querySelector('[data-q="count"]').value) || 0;
    const avg = parseFloat(tr.querySelector('[data-q="avg"]').value) || 0;
    const rev = count * avg;
    total += rev;
    tr.querySelector('.quick-rev').textContent = count > 0 ? fmt(rev) : '—';
  });
  const cell = $('#quickRevenueCell');
  if (cell) cell.textContent = total > 0 ? fmt(total) : '—';
  const p = $('#quickTotal');
  if (p) p.textContent = total > 0 ? `That's ${fmt(total)} coming in per ${state.period === 'weekly' ? 'week' : 'month'}. Now press the green button below to see your numbers.` : '';
}

function renderKpis() {
  const money = (raw) => ({ value: fmt(raw), raw, dec: 0, pre: state.currency, suf: '' });
  const kpis = [
    { label: `Money you made`, ...money(calc.totalRevenue), sub: `${calc.totalBookings.toFixed(0)} bookings` },
    { label: 'The apps took', ...money(calc.totalFees), sub: 'their fees, every month', cls: 'cost' },
    { label: `Of every ${state.currency}100 you earn`, value: state.currency + calc.effectivePct.toFixed(2), raw: calc.effectivePct, dec: 2, pre: state.currency, suf: '', sub: 'goes to the apps', cls: 'cost' },
    { label: 'Every year, they take', ...money(calc.totalFees * 12), sub: '12 months of fees added up', cls: 'cost' },
  ];
  if (calc.nsRevenue > 0) {
    kpis.push({ label: 'Lost from no-shows', ...money(calc.nsRevenue), sub: 'people who booked but never came', cls: 'cost' });
  }
  $('#kpiGrid').innerHTML = kpis.map(k => `
    <div class="kpi">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value ${k.cls || ''}" data-val="${k.raw}" data-dec="${k.dec}" data-pre="${k.pre}" data-suf="${k.suf}">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>`).join('');
  animateKpis();
}

/* Count-up animation for KPI figures (skipped under prefers-reduced-motion) */
function animateKpis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('#kpiGrid .kpi-value[data-val]').forEach(el => {
    const target = parseFloat(el.dataset.val);
    if (!Number.isFinite(target)) return;
    const dec = parseInt(el.dataset.dec || '0', 10);
    const pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const render = (n) => pre + n.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    const dur = 650, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = render(target * e);
      if (p < 1) requestAnimationFrame(step); else el.textContent = render(target);
    };
    requestAnimationFrame(step);
  });
}

/* V2 look is paused; make sure nobody's saved theme lingers */
function clearV2() { document.documentElement.classList.remove('v2'); }


/* Fade a newly-shown section in once */
function revealOnce(el) {
  if (el.dataset.revealed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.dataset.revealed = '1';
  el.classList.add('reveal');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
}

function renderChannelTable() {
  $('#channelTable tbody').innerHTML = calc.rows.map(r => `
    <tr>
      <td><span class="dot" style="background:${PLATFORM_MAP[r.id].color}"></span>${PLATFORM_MAP[r.id].name}</td>
      <td class="ta-r">${r.count.toFixed(0)}</td>
      <td class="ta-r">${fmt(r.revenue)}</td>
      <td class="ta-r fees">${fmt(r.total)}</td>
      <td class="ta-r">${fmtPct(r.feePct, 0)}</td>
    </tr>`).join('');

  const maxRev = Math.max(...calc.rows.map(r => r.revenue), 1);
  $('#channelBars').innerHTML = calc.rows.map(r => {
    const w = r.revenue / maxRev * 100;
    const feeW = r.revenue > 0 ? clamp(r.total / r.revenue * 100, 0, 100) : 0;
    return `<div class="bar-row">
      <div class="bar-name"><span class="dot" style="background:${PLATFORM_MAP[r.id].color}"></span>${PLATFORM_MAP[r.id].name}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${w}%;background:${PLATFORM_MAP[r.id].color}"></div>
        <div class="bar-fee" style="width:${w * feeW / 100}%"></div>
      </div>
      <div class="bar-meta">they keep <strong>${fmt(r.total)}</strong> of ${fmt(r.revenue)}</div>
    </div>`;
  }).join('');

  $('#assumptionsList').innerHTML = `
    <li>Weekly numbers were turned into monthly ones (4 weeks and a bit more) so everything compares fairly.</li>
    <li>Card fees are counted on ${clamp(state.cardShare, 0, 100)}% of the money, because that's the share you set as paid by card.</li>
    <li>Text reminders: each app gives some free ones a month; after that each text costs a little — that's counted too.</li>
    <li>Fixed monthly prices are counted once for each app you actually used.</li>
    <li>${calc.cancelled > 0 ? `${calc.cancelled.toFixed(0)} cancelled booking(s) were left out.` : 'No cancelled bookings were found.'}</li>
    <li>No-shows don't count as earnings${calc.nsCount > 0 ? ` — you had ${calc.nsCount.toFixed(0)}, worth ${fmt(calc.nsRevenue)}` : ''}.</li>`;
}

function renderSim() {
  const conv = state.sim.conv, disc = state.sim.disc;
  $('#convVal').textContent = conv + '%';
  $('#discVal').textContent = disc + '%';
  const { saved } = conversionSaving(conv, disc);
  const after = calc.totalFees - saved;
  $('#simResult').innerHTML = `
    <div class="sim-line"><span>What the apps take today</span><strong>${fmt(calc.totalFees)} / month</strong></div>
    <div class="sim-line"><span>What they'd take after the change</span><strong>${fmt(after)} / month</strong></div>
    <div class="sim-saving">
      <div class="big">You keep ${fmt(saved)} more, every month</div>
      <div class="sub">That's ${fmt(saved * 12)} over a year${disc > 0 ? `, even after giving ${disc}% back as a thank-you` : ''}.</div>
    </div>`;
}

/* DIY booking page: commissions + subscriptions the user would stop paying */
function renderDiy() {
  const appTake = calc.totalCommission + calc.totalSub;
  const diyCost = 1;   // domain, about £1/month
  if (appTake < 1) {
    $('#diyToday').textContent = fmt(0) + ' / month';
    $('#diyCost').textContent = 'about ' + fmt(diyCost) + ' / month';
    $('#diySaving').textContent = 'You already run on your own bookings 🎉';
    $('#diySavingSub').textContent = 'Nothing here for the apps to take — nice one.';
    return;
  }
  const save = Math.max(0, appTake - diyCost);
  $('#diyToday').textContent = fmt(appTake) + ' / month';
  $('#diyCost').textContent = 'about ' + fmt(diyCost) + ' / month';
  $('#diySaving').textContent = 'You keep ' + fmt(save) + ' more, every month';
  $('#diySavingSub').textContent = fmt(save * 12) + ' a year if all your regulars book direct';
}

const DIRECT_TEMPLATE = `Hi {name}! Thanks for coming today! Next time, just message me here to book — same times, and my regulars get first pick of slots.`;

function renderActions() {
  const conv = state.sim.conv, disc = state.sim.disc;
  const acts = [];

  const { saved, movedRevenue } = conversionSaving(conv, disc);
  if (calc.marketplaceShare > 0 && calc.rows.some(r => rateOf(r.id).commission > 0)) {
    acts.push({
      cls: '', tag: ['quick', 'Do this first'],
      title: 'Ask your app customers to book with you directly',
      body: `Here's the trick the apps don't tell you: they only charge you for <strong>finding</strong> a customer. If that customer comes back and books you directly — a quick message instead of the app — the app gets nothing. Today, ${fmtPct(calc.marketplaceShare * 100, 0)} of your money comes through apps that take a cut.`,
      steps: [
        'At the end of each visit, say: "Next time, just message me to book — here\'s my number."',
        'The day after their visit, send the message below. It takes 20 seconds.',
        'If they say yes, that customer stops costing you fees — forever.',
      ],
      saving: saved, savingNote: `if ${conv}% of your app customers switch${disc > 0 ? `, even after a ${disc}% thank-you discount` : ''}`,
      template: DIRECT_TEMPLATE,
    });
  }

  const recover = repriceRecover();
  if (recover > 0) {
    acts.push({
      cls: 'rank2', tag: ['medium', 'This week'],
      title: 'Charge app customers a little more',
      body: `You don't have to accept the fee. If an app keeps 25p of every £1, simply charge £133 instead of £100 <em>on that app only</em> — you end up with the same money. Your direct customers keep paying the normal, lower price.`,
      steps: [
        'Look at your prices on the app. Add about a quarter (a third if the app takes 30p in the pound).',
        'Keep your direct and walk-in prices where they are — that quietly rewards people who book direct.',
      ],
      saving: recover, savingNote: 'extra money each month, from the same bookings',
    });
  }

  if (calc.nsRevenue > 0) {
    acts.push({
      cls: 'rank2', tag: ['quick', 'Do this first'],
      title: 'Ask for a small deposit up front',
      body: `People who book but don't show up cost you ${fmt(calc.nsRevenue)} a month. Ask everyone to pay a deposit when they book. Almost nobody wastes a booking they've already paid for.`,
      steps: [
        'Turn on deposits in your app\'s settings (most apps have it — look for "deposits" or "prepayment").',
        'Ask for a third of the price. New customers pay the full amount.',
        'Tell people kindly: "I ask everyone for a deposit — it lets me hold the slot just for you."',
      ],
      saving: calc.nsRevenue * 0.6, savingNote: 'most of the money you currently lose to no-shows',
    });
  }

  if (calc.totalSms > 0.5) {
    acts.push({
      cls: 'rank3', tag: ['quick', '5 minutes'],
      title: 'Send reminders by WhatsApp or email instead of paid texts',
      body: `You're paying about ${fmt(calc.totalSms)} a month for reminder texts. Your app can send the same reminders by WhatsApp or email for free — and people read them just as much.`,
      steps: [
        'In your app\'s settings, find "reminders" and switch from text message to WhatsApp or email.',
        'Tell your regulars: "Message me on WhatsApp and you\'ll get reminders free."',
      ],
      saving: calc.totalSms, savingNote: 'you stop paying for texts',
    });
  }

  acts.push({
    cls: 'unquantified', tag: ['medium', 'This week'],
    title: 'Cancel anything you pay for but don\'t use',
    body: `You pay ${fmt(calc.totalSub)} a month in fixed prices${calc.totalSub > 0 ? '' : ' (nothing extra found — good)'}. It's worth 5 minutes to check every app and add-on you're paying for.`,
    steps: [
      'Write down everything you pay for each month — every app, every add-on.',
      'Cross out anything you haven\'t used in the last 2 months. Cancel it.',
      'Check if a cheaper plan would cover you just as well.',
    ],
  });

  acts.push({
    cls: 'unquantified', tag: ['long', 'Later'],
    title: 'Sell bundles of visits, paid up front',
    body: 'Sell 4 or 6 visits together for a small discount, paid in advance, booked directly with you. The customer wins (cheaper), you win (no fees, and they always come back).',
    steps: [
      'Pick your most common service. Offer 4 visits for the price of 3 and a bit.',
      'Only offer it to people who pay you directly and book directly.',
      'Mention it at the till: "Want to spread the cost and lock today\'s price?"',
    ],
  });

  $('#actionList').innerHTML = acts.map((a, i) => `
    <div class="action ${a.cls !== undefined ? a.cls : ''}">
      <div class="action-top">
        <h3>${i + 1}. ${a.title}</h3>
        <span class="tag ${a.tag[0]}">${a.tag[1]}</span>
      </div>
      <p>${a.body}</p>
      <ol>${(a.steps || []).map(s2 => `<li>${s2}</li>`).join('')}</ol>
      ${a.template ? `
        <div class="template-box">
          <strong>Copy-paste message:</strong><br>${esc(a.template)}
          <br><button class="btn ghost small copy-btn" data-template="1">Copy message</button>
        </div>` : ''}
      ${a.saving != null ? `
        <div class="save"><strong>You keep ${fmt(a.saving)} more every month</strong> — ${a.savingNote}.<br>
        <span style="font-weight:500">That's ${fmt(a.saving * 12)} over a year.</span></div>` : `
        <div class="save muted-save">This one saves different amounts for everyone — but it always saves.</div>`}
    </div>`).join('');
}

function renderEmptyStates() {
  const empty = `<div class="empty-note">Answer the questions in step 1 and your numbers will appear right here.</div>`;
  $('#kpiGrid').innerHTML = empty;
  $('#channelTable tbody').innerHTML = '';
  $('#channelBars').innerHTML = '';
}

function recalc({ scroll = false } = {}) {
  calc = computeAll();
  // channels that show up in the data get ticked automatically so their rates stay editable
  for (const r of calc.rows) if (!state.channels.includes(r.id)) state.channels.push(r.id);
  const hasData = calc.hasData;
  ['results', 'simulate', 'diy', 'actions'].forEach(id => { $('#' + id).hidden = !hasData; });
  if (hasData) {
    renderKpis();
    renderChannelTable();
    renderSim();
    renderDiy();
    renderActions();
    ['results', 'simulate', 'diy', 'actions'].forEach(id => revealOnce($('#' + id)));
    if (scroll) $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    renderEmptyStates();
  }
  renderChannelChips();
  saveState();
}

/* ================= Persistence ================= */
let saveTimer = null;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* private mode etc. */ }
  }, 250);
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) state = { ...defaultState(), ...JSON.parse(raw) };
  } catch { /* corrupted store — start fresh */ }
}

/* ================= Events ================= */
function updatePeriodWords() {
  const word = state.period === 'weekly' ? 'week' : 'month';
  $$('.period-word').forEach(el => { el.textContent = word; });
}

/* Lead capture: POST to the Make.com webhook (text/plain avoids a CORS preflight) */
async function sendToWebhook(payload) {
  const r = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('Webhook responded ' + r.status);
}

function leadPayload(source, fields) {
  return {
    source,                              // 'free_report' or 'monthly_report'
    ...fields,
    consent: true,
    channels: [...state.channels],
    period: state.period,
    currency: state.currency,
    numbers: calc ? {
      revenue: Math.round(calc.totalRevenue * 100) / 100,
      feesPerMonth: Math.round(calc.totalFees * 100) / 100,
      feePercent: Math.round(calc.effectivePct * 100) / 100,
      feesPerYear: Math.round(calc.totalFees * 12 * 100) / 100,
      noShowLoss: Math.round(calc.nsRevenue * 100) / 100,
    } : null,
    pageUrl: location.href,
    submittedAt: new Date().toISOString(),
  };
}

function setBusy(form, busy, busyText) {
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  if (busy) { btn.dataset.original = btn.textContent; btn.textContent = busyText; btn.disabled = true; }
  else { btn.textContent = btn.dataset.original || btn.textContent; btn.disabled = false; }
}

function bindEvents() {
  // Channel picker
  $('#channelChips').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-channel]');
    if (!chip) return;
    const id = chip.dataset.channel;
    if (state.channels.includes(id)) removeChannel(id);
    else addChannel(id);
  });

  // Tabs
  $('#tabCsv').addEventListener('click', () => setInputMode('csv'));
  $('#tabQuick').addEventListener('click', () => setInputMode('quick'));

  // Global controls
  $('#periodSel').addEventListener('change', (e) => { state.period = e.target.value; updatePeriodWords(); renderQuickTotals(); recalc(); });
  $('#currencySel').addEventListener('change', (e) => { state.currency = e.target.value; buildQuickTable(); renderRateCards(); recalc(); });
  $('#cardShare').addEventListener('input', (e) => { state.cardShare = clamp(parseFloat(e.target.value) || 0, 0, 100); recalc(); });
  $('#smsPerBooking').addEventListener('input', (e) => { state.smsPerBooking = Math.max(0, parseFloat(e.target.value) || 0); recalc(); });

  // CSV panel
  $('#csvInput').addEventListener('input', (e) => { state.csvText = e.target.value; saveState(); });
  $('#analyseBtn').addEventListener('click', () => {
    state.inputMode = 'csv';
    recalc({ scroll: true });
    const { records, meta } = parseBookings(state.csvText);
    const fb = $('#parseFeedback');
    fb.hidden = false;
    if (meta.message) { fb.className = 'feedback warn'; fb.textContent = meta.message; return; }
    fb.className = 'feedback ok';
    const nos = records.filter(r => r.status === 'noshow').length;
    const can = records.filter(r => r.status === 'cancelled').length;
    fb.textContent = `Parsed ${records.length} bookings${meta.headered ? ' (columns detected)' : ' (simple format)'}${can ? ` · ${can} cancelled` : ''}${nos ? ` · ${nos} no-show${nos > 1 ? 's' : ''}` : ''}${meta.ignored ? ` · ${meta.ignored} row(s) ignored` : ''}${meta.unmapped ? ` · ${meta.unmapped} unmapped → "Other" (add a Source column or set its rates)` : ''}.`;
  });
  $('#exampleBtn').addEventListener('click', () => {
    state.csvText = SAMPLE_CSV;
    $('#csvInput').value = SAMPLE_CSV;
    setInputMode('csv');
    recalc({ scroll: true });
    const fb = $('#parseFeedback');
    fb.hidden = false; fb.className = 'feedback ok';
    fb.textContent = 'Loaded a made-up example month with 24 bookings. Scroll down to see the numbers it produces.';
  });
  $('#clearBtn').addEventListener('click', () => {
    state.csvText = '';
    $('#csvInput').value = '';
    $('#parseFeedback').hidden = true;
    recalc();
  });
  $('#fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.csvText = String(reader.result || '');
      $('#csvInput').value = state.csvText;
      $('#analyseBtn').click();
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Quick add
  $('#quickTable').addEventListener('input', (e) => {
    const tr = e.target.closest('tr[data-quick]');
    if (!tr || !e.target.dataset.q) return;
    state.quick[tr.dataset.quick] = state.quick[tr.dataset.quick] || {};
    state.quick[tr.dataset.quick][e.target.dataset.q] = e.target.value;
    renderQuickTotals();
    recalc();
  });

  // Example on the primary (quick) path
  $('#quickExample').addEventListener('click', () => {
    const sample = { treatwell: { count: '20', avg: '65' }, fresha: { count: '10', avg: '45' }, direct: { count: '15', avg: '50' } };
    for (const [id, v] of Object.entries(sample)) {
      if (!state.channels.includes(id)) state.channels.push(id);
      state.quick[id] = { ...v };
    }
    renderChannelChips();
    buildQuickTable();
    recalc({ scroll: true });
  });

  // No-show manual fields
  $('#nsCount').addEventListener('input', (e) => { state.nsCount = e.target.value; recalc(); });
  $('#nsTicket').addEventListener('input', (e) => { state.nsTicket = e.target.value; recalc(); });

  // Rate cards
  $('#rateCards').addEventListener('input', (e) => {
    const card = e.target.closest('[data-rate]');
    if (!card || !e.target.dataset.k) return;
    const id = card.dataset.rate, k = e.target.dataset.k;
    const v = parseFloat(e.target.value);
    state.overrides[id] = state.overrides[id] || {};
    state.overrides[id][k] = Number.isFinite(v) ? v : 0;
    recalc();
  });
  $('#rateCards').addEventListener('click', (e) => {
    const id = e.target.dataset?.reset;
    if (!id) return;
    delete state.overrides[id];
    renderRateCards();
    recalc();
  });

  // Simulator
  $('#convSlider').addEventListener('input', (e) => { state.sim.conv = parseInt(e.target.value, 10); paintRange(e.target); renderSim(); renderActions(); saveState(); });
  $('#discSlider').addEventListener('input', (e) => { state.sim.disc = parseInt(e.target.value, 10); paintRange(e.target); renderSim(); renderActions(); saveState(); });

  // Copy templates
  $('#actionList').addEventListener('click', async (e) => {
    if (!e.target.classList.contains('copy-btn')) return;
    try { await navigator.clipboard.writeText(DIRECT_TEMPLATE); e.target.textContent = 'Copied ✓'; setTimeout(() => { e.target.textContent = 'Copy template'; }, 1800); } catch { /* clipboard blocked */ }
  });

  // Agency band + footer brand
  $('#agencyBrand').textContent = `${BRAND_NAME} · marketing for salons`;
  $('#agencyCta').href = BOOKING_LINK;
  $('.agency-addr').textContent = SIGNUP_EMAIL;
  $('#footBrand').textContent = BRAND_NAME;

  // Monthly report signup
  $('.report-addr').textContent = SIGNUP_EMAIL;
  $('#reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if ($('#reportHp').value) { $('#reportDone').hidden = false; return; }
    const form = $('#reportForm');
    setBusy(form, true, 'Signing you up…');
    try {
      await sendToWebhook(leadPayload('monthly_report', {
        name: $('#reportName').value.trim(),
        email: $('#reportEmail').value.trim(),
        platform: $('#reportPlatform').value,
      }));
      $('#reportDone').hidden = false;
      $('#reportDone').classList.remove('warn');
      form.reset();
    } catch {
      $('#reportDone').hidden = false;
      $('#reportDone').classList.add('warn');
      $('#reportDone').innerHTML = 'Hmm, that didn\'t go through. Please email us directly at <span class="report-addr"></span>.';
    }
    setBusy(form, false);
    saveState();
  });

  // Saved money / case study form
  $('#savedForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if ($('#savedHp').value) { $('#savedDone').hidden = false; return; }
    const form = $('#savedForm');
    setBusy(form, true, 'Sending…');
    try {
      await sendToWebhook({
        source: 'saved_money',
        name: $('#savedName').value.trim(),
        business: $('#savedBusiness').value.trim(),
        email: $('#savedEmail').value.trim(),
        whatWorked: $('#savedAction').value,
        monthlySaving: parseFloat($('#savedAmount').value) || 0,
        quote: $('#savedQuote').value.trim(),
        consent: $('#savedConsent').checked,
        submittedAt: new Date().toISOString(),
        pageUrl: location.href,
      });
      $('#savedDone').hidden = false;
      $('#savedDone').classList.remove('warn');
      form.reset();
    } catch {
      $('#savedDone').hidden = false;
      $('#savedDone').classList.add('warn');
      $('#savedDone').textContent = 'Hmm, that didn\'t go through. Please email us instead — we still want to hear it.';
    }
    setBusy(form, false);
    saveState();
  });

  // Install guide (home screen)
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; });
  const STEPS_IPHONE = [
    'Open this page in <strong>Safari</strong> if you\'re in another browser.',
    'Tap the <strong>Share</strong> button <strong>&#8599;</strong> (the square with an arrow pointing up) at the bottom of the screen.',
    'Scroll down the list and tap <strong>Add to Home Screen</strong>.',
    'Tap <strong>Add</strong> — you\'ll find the green icon on your home screen.',
  ];
  const STEPS_ANDROID = [
    'Tap the <strong>&#8942;</strong> menu at the top right of Chrome.',
    'Tap <strong>Add to Home screen</strong>, then <strong>Add</strong>.',
    'You\'ll find the icon with your other apps.',
  ];
  const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const list = (items) => items.map(t => `<li>${t}</li>`).join('');
  $('#installBtn').addEventListener('click', () => {
    let html = '', note = '';
    if (isApple) {
      html = list(STEPS_IPHONE);
      note = 'Using an Android phone instead? Tap the &#8942; menu, then "Add to Home screen".';
    } else if (isAndroid) {
      html = list(STEPS_ANDROID);
      note = 'Using an iPhone instead? In Safari: Share (&#8599;), then "Add to Home Screen".';
    } else {
      html = `<li class="install-platform">On your iPhone:</li>${list(STEPS_IPHONE)}<li class="install-platform">On Android:</li>${list(STEPS_ANDROID)}`;
    }
    $('#installSteps').innerHTML = html;
    $('#installNote').innerHTML = note;
    let auto = document.querySelector('#installAuto');
    if (deferredInstall && !auto) {
      auto = document.createElement('button');
      auto.id = 'installAuto'; auto.className = 'btn primary'; auto.type = 'button';
      auto.textContent = 'Add automatically (one tap)';
      auto.addEventListener('click', async () => { deferredInstall.prompt(); deferredInstall = null; $('#installModal').hidden = true; });
      $('.install-steps').after(auto);
    }
    $('#installModal').hidden = false;
  });
  const closeInstall = () => { $('#installModal').hidden = true; };
  $('#installClose').addEventListener('click', closeInstall);
  $('#installModal').addEventListener('click', (e) => { if (e.target === $('#installModal')) closeInstall(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeInstall(); });

  // DIY + Get-found CTAs
  $('#diyBook').href = BOOKING_LINK;
  $('#foundBook').href = BOOKING_LINK;

  // Share — native share sheet where available, copy-link otherwise
  $('#shareBtn').addEventListener('click', async () => {
    const btn = $('#shareBtn');
    const data = { title: 'Booking Fee Analyser', text: 'See what Fresha, Treatwell & co. really cost your salon — free tool:', url: location.href };
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

  // Reset
  $('#resetBtn').addEventListener('click', () => {
    try { localStorage.removeItem(STORE_KEY); } catch { }
    state = defaultState();
    location.reload();
  });
}

function setInputMode(mode) {
  state.inputMode = mode;
  $('#tabCsv').classList.toggle('active', mode === 'csv');
  $('#tabQuick').classList.toggle('active', mode === 'quick');
  $('#tabCsv').setAttribute('aria-selected', mode === 'csv');
  $('#tabQuick').setAttribute('aria-selected', mode === 'quick');
  $('#panelCsv').hidden = mode !== 'csv';
  $('#panelQuick').hidden = mode !== 'quick';
  recalc();
}

/* ================= Init ================= */
/* Paint the filled portion of a range slider's track */
function paintRange(el) {
  const pct = (el.value - el.min) / (el.max - el.min) * 100;
  el.style.setProperty('--fill', pct + '%');
}

/* Nav shadow on scroll + scrollspy highlighting + scroll-reveal for static sections */
function initChrome() {
  const nav = $('.nav');
  const links = $$('.nav-links a');
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
      let current = null;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= 110) current = s;
      }
      links.forEach(a => a.classList.toggle('active', !!current && a.getAttribute('href') === '#' + current.id));
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      }
    }, { threshold: 0.06 });
    $$('.step').forEach(s => { if (!s.hidden) { s.classList.add('reveal'); io.observe(s); } });
  }
}

function init() {
  loadState();
  // restore UI controls
  $('#periodSel').value = state.period;
  $('#currencySel').value = state.currency;
  $('#cardShare').value = state.cardShare;
  $('#smsPerBooking').value = state.smsPerBooking;
  $('#nsCount').value = state.nsCount;
  $('#nsTicket').value = state.nsTicket;
  $('#csvInput').value = state.csvText;
  $('#convSlider').value = state.sim.conv;
  $('#discSlider').value = state.sim.disc;
  updatePeriodWords();
  renderChannelChips();
  renderChannelSearch();
  renderRateCards();
  buildQuickTable();
  setInputMode(state.inputMode === 'quick' ? 'quick' : 'csv');
  paintRange($('#convSlider'));
  paintRange($('#discSlider'));
  bindEvents();
  initChrome();
  clearV2();
}

init();

// Stage 2: a multi-pane workspace — N embedded claude instances, each its own xterm,
// routed by pane id. Nothing touches window.__TAURI__ until a user action fires, so a
// not-yet-ready global can't break handler attachment at load.
const panes = new Map(); // id -> { term, fit, el }
let listenersReady = false;
let focusPaneId = null;       // the committee's focus pane
const lastTurn = new Map();   // pane -> { role, text } — most recent completed turn
let convene = null;           // active convene: { question, expecting:Set, got:Map }
let lastForming = null;       // last committee synthesis (for "give to focus")

function inv(cmd, args) { return window.__TAURI__.core.invoke(cmd, args); }
function setStatus(t) { const s = document.getElementById('status'); if (s) s.textContent = t; }
function escapeHtml(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

function ensureListeners() {
  if (listenersReady) return;
  const listen = window.__TAURI__.event.listen;
  listen('pty-output', (e) => {
    const p = panes.get(e.payload.pane);
    if (p) p.term.write(new Uint8Array(e.payload.data));
  });
  listen('pty-exit', (e) => {
    const p = panes.get(e.payload);
    if (!p) return;
    p.el.classList.add('dead');
    p.term.write('\r\n\x1b[2m— process exited —\x1b[0m\r\n');
    const head = p.el.querySelector('.phead');
    if (head && !head.querySelector('.preopen')) {
      const b = document.createElement('span');
      b.className = 'preopen';
      b.title = 'reopen (resume session)';
      b.textContent = '↻';
      b.onclick = () => reopenPane(e.payload);
      head.insertBefore(b, head.querySelector('.pclose'));
    }
  });
  listen('sysmeter', (e) => {
    const m = e.payload;
    const hud = document.getElementById('hud');
    if (!hud) return;
    const usedG = (m.ram_used_mb / 1024).toFixed(1);
    const totG = (m.ram_total_mb / 1024).toFixed(1);
    const frac = m.ram_total_mb ? m.ram_used_mb / m.ram_total_mb : 0;
    hud.innerHTML = panes.size + ' pane' + (panes.size === 1 ? '' : 's') +
      '  ·  claude ' + m.claude_procs + ' · ' + m.claude_mb + 'MB' +
      '  ·  <span class="' + (frac > 0.9 ? 'warn' : '') + '">RAM ' + usedG + '/' + totG + 'GB</span>';
  });
  listen('cost', (e) => {
    const c = e.payload;
    const el = document.getElementById('cost');
    if (!el) return;
    const outk = (c.output / 1000).toFixed(1);
    el.textContent = 'session generated: ' + outk + 'k out tok';
  });
  listen('context', (e) => {
    const { pane, ctx, limit } = e.payload;
    const p = panes.get(pane);
    if (!p) return;
    const el = p.el.querySelector('.pctx');
    if (!el) return;
    const pct = limit ? Math.round((ctx / limit) * 100) : 0;
    el.textContent = 'ctx ' + pct + '% · ' + (ctx / 1000).toFixed(0) + 'k';
    el.className = 'pctx' + (pct >= 80 ? ' warn' : '');
  });
  listen('distilled', (e) => {
    renderResonance(e.payload);
    if (e.payload && e.payload.auto) setStatus('scribe auto-distilled · ' + e.payload.kept + ' kept');
  });
  listen('turn', (e) => {
    const { pane, role, text } = e.payload;
    lastTurn.set(pane, { role, text });
    // committee: capture a conscripted contributor's first assistant turn after broadcast
    if (convene && role === 'assistant' && convene.expecting.has(pane) && !convene.got.has(pane)) {
      convene.got.set(pane, text);
      const p = panes.get(pane);
      if (p) p.el.classList.remove('convening');
      setStatus('convening… ' + convene.got.size + '/' + convene.expecting.size + ' contributed');
      if (convene.got.size >= convene.expecting.size) finishConvene();
    }
    const log = document.getElementById('streamlog');
    if (!log) return;
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = '<span class="pid">' + pane.slice(0, 8) + '</span> ' +
      '<span class="role-' + role + '">' + role + '</span>  ' + escapeHtml(text.slice(0, 280));
    log.appendChild(row);
    while (log.childNodes.length > 100) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
  });
  listenersReady = true;
}

function makePaneEl(id, cwd) {
  const el = document.createElement('div');
  el.className = 'pane';
  el.innerHTML =
    '<div class="phead">' +
      '<span class="pfocus" title="make this the committee focus">◎</span>' +
      '<span class="pid">' + id.slice(0, 8) + '</span>' +
      '<span class="pcwd">' + (cwd || '~') + '</span>' +
      '<span class="pctx" title="context window used"></span>' +
      '<span class="pclose" title="close pane">✕</span>' +
    '</div><div class="pterm"></div>';
  document.getElementById('panes').appendChild(el);
  el.querySelector('.pclose').onclick = () => closePane(id);
  el.querySelector('.pfocus').onclick = () => setFocus(id);
  return el;
}

function attachPane(id, label, cwd) {
  ensureListeners();
  const el = makePaneEl(id, label);
  const term = new Terminal({
    fontFamily: 'Consolas, "Cascadia Mono", "Courier New", monospace',
    fontSize: 13,
    cursorBlink: true,
    theme: { background: '#0B0E14', foreground: '#E6EAF2', cursor: '#5EEAD4', selectionBackground: '#27304A' },
  });
  const fit = new FitAddon.FitAddon();
  term.loadAddon(fit);
  const host = el.querySelector('.pterm');
  term.open(host);
  host.addEventListener('mousedown', () => term.focus());
  term.onData((d) => inv('pty_write', { pane: id, data: d }));

  // paste -> PTY. WebView2 swallows JS clipboard access, so read it through Rust on
  // Ctrl/Cmd+V, and also catch right-click paste events.
  function pasteInto() {
    inv('clipboard_read').then((t) => { if (t) inv('pty_write', { pane: id, data: t }); }).catch(() => {});
  }
  term.attachCustomKeyEventHandler((e) => {
    if (e.type === 'keydown' && (e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      pasteInto();
      return false;
    }
    return true;
  });
  host.addEventListener('paste', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const cd = ev.clipboardData || window.clipboardData;
    const text = cd ? cd.getData('text') : '';
    if (text) inv('pty_write', { pane: id, data: text });
    else pasteInto();
  }, true);

  panes.set(id, { term, fit, el, cwd });
  updateConveneBtn();
  setStatus(panes.size + ' pane' + (panes.size === 1 ? '' : 's'));
  setTimeout(fitAll, 80);
  term.focus();
}

async function addPane() {
  setStatus('opening pane…');
  const cwd = document.getElementById('termcwd').value.trim();
  let id;
  try {
    id = await inv('pty_spawn', { cwd });
  } catch (e) {
    setStatus('pane spawn failed: ' + e);
    return;
  }
  attachPane(id, cwd, cwd);
}

async function addSibling() {
  const btn = document.getElementById('sibling');
  if (btn) { btn.disabled = true; btn.textContent = 'waking…'; }
  setStatus('a sibling is waking into the room…');
  try {
    const r = await inv('spawn_sibling');
    attachPane(r.pane, '✦ sibling', r.cwd);
    setStatus('sibling woken in-state · ' + r.cwd);
  } catch (e) {
    setStatus('sibling spawn failed: ' + e);
  }
  if (btn) { btn.disabled = false; btn.textContent = '✦ Sibling'; }
}

// ---- Stage 6: the live committee — pick a focus pane, the rest convene to feed it ----
function setFocus(id) {
  focusPaneId = (focusPaneId === id) ? null : id;
  panes.forEach((p, pid) => {
    const on = pid === focusPaneId;
    p.el.classList.toggle('focus', on);
    const f = p.el.querySelector('.pfocus');
    if (f) f.textContent = on ? '◉' : '◎';
  });
  updateConveneBtn();
  setStatus(focusPaneId ? ('focus: ' + focusPaneId.slice(0, 8) + ' — ⛬ convene to gather the others') : 'focus cleared');
}

function updateConveneBtn() {
  const b = document.getElementById('convene');
  if (b) b.disabled = !(focusPaneId && panes.size >= 2);
}

// inject text as a bracketed paste (preserves newlines) then submit — robust for live panes
function injectAndSend(pane, text) {
  inv('pty_write', { pane, data: '\x1b[200~' + text + '\x1b[201~' });
  setTimeout(() => inv('pty_write', { pane, data: '\r' }), 70);
}

function openConvene() {
  if (!focusPaneId) { setStatus('◎ a pane first to set the committee focus'); return; }
  if (panes.size < 2) { setStatus('need at least one other pane to convene'); return; }
  const lt = lastTurn.get(focusPaneId);
  document.getElementById('convtext').value = lt ? lt.text : '';
  document.getElementById('convbar').classList.add('show');
  document.getElementById('convtext').focus();
}

function cancelConvene() { document.getElementById('convbar').classList.remove('show'); }

function broadcast() {
  const question = document.getElementById('convtext').value.trim();
  if (!question) { setStatus('nothing to convene around'); return; }
  document.getElementById('convbar').classList.remove('show');
  const msg = '[Consonance committee — the focus instance is working on the thread below. Add your input from your own vantage and current context, briefly and concretely. Do not restate it; contribute or push back.]\n\nFOCUS THREAD:\n' + question.slice(0, 4000);
  const expecting = new Set();
  panes.forEach((p, pid) => {
    if (pid === focusPaneId) return;
    const lt = lastTurn.get(pid);
    if (lt && lt.role === 'user') return;          // busy: awaiting its own reply — skip
    injectAndSend(pid, msg);
    expecting.add(pid);
    p.el.classList.add('convening');
  });
  if (!expecting.size) { setStatus('all other panes are busy — try again shortly'); return; }
  convene = { question, expecting, got: new Map() };
  setStatus('convening… 0/' + expecting.size + ' (the panes are answering live)');
}

async function finishConvene() {
  const c = convene;
  convene = null;
  const contributions = [...c.got.entries()].map(([pid, text]) => ({ who: pid.slice(0, 8), text }));
  setStatus('forming — triangulating ' + contributions.length + ' contribution' + (contributions.length === 1 ? '' : 's') + '…');
  try {
    lastForming = await inv('committee_form', { question: c.question, contributions });
    document.getElementById('cmtbody').innerHTML = renderForming(lastForming);
    document.getElementById('cmtpanel').classList.add('show');
    setStatus('committee formed — review, then → give to focus');
  } catch (e) {
    setStatus('forming failed: ' + e);
  }
}

function renderForming(f) {
  f = f || {};
  const sec = (cls, head, items, render) => {
    let h = '<div class="fsec"><div class="fhead ' + cls + '">' + head + '</div>';
    if (!items || !items.length) h += '<div class="fitem muted">— none —</div>';
    else items.forEach((it) => { h += render(it); });
    return h + '</div>';
  };
  let h = '<div class="forming">';
  h += sec('confirmed', 'confirmed — ≥2 contributors converged', f.confirmed,
    (c) => '<div class="fitem">' + escapeHtml(c.claim || '') + ' <span class="ffrom">' + escapeHtml((c.from || []).join(', ')) + '</span></div>');
  h += sec('forks', 'forks — held divergence, the focus decides', f.forks, (fk) => {
    let s = '<div class="fitem"><b>' + escapeHtml(fk.axis || '') + '</b>';
    (fk.positions || []).forEach((p) => { s += '<div class="fpos"><span class="ffrom">' + escapeHtml(p.who || p.vantage || '') + ':</span> ' + escapeHtml(p.pos || '') + '</div>'; });
    return s + '</div>';
  });
  h += sec('novel', 'novel — a new angle to consider', f.novel,
    (n) => '<div class="fitem">' + escapeHtml(n.thing || '') + ' <span class="ffrom">' + escapeHtml(n.from || '') + '</span></div>');
  return h + '</div>';
}

function formingToText(f) {
  f = f || {};
  let s = '[Committee input on your current thread]\n';
  if ((f.confirmed || []).length) {
    s += '\nCONFIRMED (≥2 of us converged — trust):\n';
    f.confirmed.forEach((c) => { s += '- ' + (c.claim || '') + '\n'; });
  }
  if ((f.forks || []).length) {
    s += '\nFORKS (we diverge — your call):\n';
    f.forks.forEach((fk) => {
      s += '- ' + (fk.axis || '') + '\n';
      (fk.positions || []).forEach((p) => { s += '    · ' + (p.who || p.vantage || '') + ': ' + (p.pos || '') + '\n'; });
    });
  }
  if ((f.novel || []).length) {
    s += '\nNOVEL (consider):\n';
    f.novel.forEach((n) => { s += '- ' + (n.thing || '') + '\n'; });
  }
  return s;
}

function giveToFocus() {
  if (!lastForming || !focusPaneId) { setStatus('no focus pane to give to'); return; }
  injectAndSend(focusPaneId, formingToText(lastForming));
  document.getElementById('cmtpanel').classList.remove('show');
  setStatus('committee input given to focus ' + focusPaneId.slice(0, 8));
}

function dismissCommittee() { document.getElementById('cmtpanel').classList.remove('show'); }

function fitPane(id) {
  const p = panes.get(id);
  if (!p) return;
  try {
    p.fit.fit();
    inv('pty_resize', { pane: id, rows: p.term.rows, cols: p.term.cols });
  } catch (_) {}
}

function fitAll() { panes.forEach((_p, id) => fitPane(id)); }

function closePane(id) {
  inv('pty_kill', { pane: id });
  const p = panes.get(id);
  if (p) { try { p.term.dispose(); } catch (_) {} p.el.remove(); panes.delete(id); }
  if (id === focusPaneId) focusPaneId = null;
  lastTurn.delete(id);
  updateConveneBtn();
  setStatus(panes.size + ' pane' + (panes.size === 1 ? '' : 's'));
  setTimeout(fitAll, 80);
}

async function reopenPane(id) {
  const p = panes.get(id);
  if (!p) return;
  p.el.classList.remove('dead');
  const btn = p.el.querySelector('.preopen');
  if (btn) btn.remove();
  try {
    await inv('pty_reopen', { pane: id, cwd: p.cwd || '' });
  } catch (e) {
    setStatus('reopen failed: ' + e);
    p.el.classList.add('dead');
    return;
  }
  setTimeout(() => fitPane(id), 80);
  p.term.focus();
}

function renderResonance(r) {
  const log = document.getElementById('streamlog');
  if (!log) return;
  const div = document.createElement('div');
  div.className = 'resonance';
  let html = '<div class="rdiv">── resonance · ' + r.kept + ' kept' + (r.auto ? ' · auto' : '') + ' ──</div>';
  (r.atoms || []).forEach((a) => {
    html += '<div class="ratom"><span class="rkind">' + escapeHtml(a.kind || '?') + '</span> ' +
      escapeHtml(a.claim || '') +
      (a.tether ? ' <span class="rtether">— ' + escapeHtml(a.tether) + '</span>' : '') + '</div>';
  });
  div.innerHTML = html;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

async function distill() {
  const btn = document.getElementById('distill');
  if (btn) { btn.disabled = true; btn.textContent = 'distilling…'; }
  setStatus('the scribe is distilling the board (good model)…');
  try {
    const kept = await inv('scribe_distill'); // render arrives via the 'distilled' event
    setStatus('scribe kept ' + kept + ' atom' + (kept === 1 ? '' : 's') + ' (→ ~/.consonance/resonance/)');
  } catch (e) {
    setStatus('distill failed: ' + e);
  }
  if (btn) { btn.disabled = false; btn.textContent = '⟳ distill'; }
}

document.getElementById('termadd').onclick = addPane;
document.getElementById('termcwd').addEventListener('keydown', (e) => { if (e.key === 'Enter') addPane(); });
window.addEventListener('resize', fitAll);
const tbtn = document.querySelector('.tabs button[data-tab="terminal"]');
if (tbtn) tbtn.addEventListener('click', () => setTimeout(fitAll, 40));
const dbtn = document.getElementById('distill');
if (dbtn) dbtn.onclick = distill;
const sbtn = document.getElementById('sibling');
if (sbtn) sbtn.onclick = addSibling;
const adb = document.getElementById('autodistill');
if (adb) adb.onchange = (e) => inv('set_auto_distill', { on: e.target.checked });
const cvb = document.getElementById('convene'); if (cvb) cvb.onclick = openConvene;
const cvs = document.getElementById('convsend'); if (cvs) cvs.onclick = broadcast;
const cvc = document.getElementById('convcancel'); if (cvc) cvc.onclick = cancelConvene;
const gfb = document.getElementById('givefocus'); if (gfb) gfb.onclick = giveToFocus;
const cmx = document.getElementById('cmtclose'); if (cmx) cmx.onclick = dismissCommittee;
updateConveneBtn();

// register listeners at load too, so the RAM/process HUD updates before any pane exists
try { ensureListeners(); } catch (_) {}

// load the persisted board history into the stream (survives app restarts)
try {
  inv('get_board').then((entries) => {
    const log = document.getElementById('streamlog');
    if (!log || !entries) return;
    entries.slice(-100).forEach((e) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = '<span class="pid">' + (e.pane || '').slice(0, 8) + '</span> ' +
        '<span class="role-' + e.role + '">' + e.role + '</span>  ' + escapeHtml((e.text || '').slice(0, 280));
      log.appendChild(row);
    });
    log.scrollTop = log.scrollHeight;
  }).catch(() => {});
} catch (_) {}

// Stage 2: a multi-pane workspace — N embedded claude instances, each its own xterm,
// routed by pane id. Nothing touches window.__TAURI__ until a user action fires, so a
// not-yet-ready global can't break handler attachment at load.
const panes = new Map(); // id -> { term, fit, el }
let listenersReady = false;

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
  listen('turn', (e) => {
    const { pane, role, text } = e.payload;
    const log = document.getElementById('streamlog');
    if (!log) return;
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = '<span class="pid">' + pane.slice(0, 8) + '</span> ' +
      '<span class="role-' + role + '">' + role + '</span>  ' + escapeHtml(text);
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
      '<span class="pid">' + id.slice(0, 8) + '</span>' +
      '<span class="pcwd">' + (cwd || '~') + '</span>' +
      '<span class="pctx" title="context window used"></span>' +
      '<span class="pclose" title="close pane">✕</span>' +
    '</div><div class="pterm"></div>';
  document.getElementById('panes').appendChild(el);
  el.querySelector('.pclose').onclick = () => closePane(id);
  return el;
}

async function addPane() {
  setStatus('opening pane…');
  ensureListeners();
  const cwd = document.getElementById('termcwd').value.trim();
  let id;
  try {
    id = await inv('pty_spawn', { cwd });
  } catch (e) {
    setStatus('pane spawn failed: ' + e);
    return;
  }

  const el = makePaneEl(id, cwd);
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

  panes.set(id, { term, fit, el, cwd });
  setStatus(panes.size + ' pane' + (panes.size === 1 ? '' : 's'));
  setTimeout(fitAll, 80);
  term.focus();
}

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

async function distill() {
  const btn = document.getElementById('distill');
  const log = document.getElementById('streamlog');
  if (btn) { btn.disabled = true; btn.textContent = 'distilling…'; }
  setStatus('the scribe is distilling the board (good model)…');
  try {
    const r = await inv('scribe_distill');
    const div = document.createElement('div');
    div.className = 'resonance';
    let html = '<div class="rdiv">── resonance · ' + r.kept + ' kept ──</div>';
    (r.atoms || []).forEach((a) => {
      html += '<div class="ratom"><span class="rkind">' + escapeHtml(a.kind || '?') + '</span> ' +
        escapeHtml(a.claim || '') +
        (a.tether ? ' <span class="rtether">— ' + escapeHtml(a.tether) + '</span>' : '') + '</div>';
    });
    div.innerHTML = html;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    setStatus('scribe kept ' + r.kept + ' atom' + (r.kept === 1 ? '' : 's') + ' (→ ~/.consonance/resonance/)');
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
        '<span class="role-' + e.role + '">' + e.role + '</span>  ' + escapeHtml(e.text);
      log.appendChild(row);
    });
    log.scrollTop = log.scrollHeight;
  }).catch(() => {});
} catch (_) {}

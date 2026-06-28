// Stage 2: a multi-pane workspace — N embedded claude instances, each its own xterm,
// routed by pane id.
const invoke = window.__TAURI__.core.invoke;
const listen = window.__TAURI__.event.listen;
const panes = new Map(); // id -> { term, fit, el }

function setStatus(t) { const s = document.getElementById('status'); if (s) s.textContent = t; }

listen('pty-output', (e) => {
  const p = panes.get(e.payload.pane);
  if (p) p.term.write(new Uint8Array(e.payload.data));
});
listen('pty-exit', (e) => {
  const p = panes.get(e.payload);
  if (p) { p.el.classList.add('dead'); p.term.write('\r\n\x1b[2m— process exited —\x1b[0m\r\n'); }
});

function makePaneEl(id, cwd) {
  const el = document.createElement('div');
  el.className = 'pane';
  el.innerHTML =
    '<div class="phead">' +
      '<span class="pid">' + id.slice(0, 8) + '</span>' +
      '<span class="pcwd">' + (cwd || '~') + '</span>' +
      '<span class="pclose" title="close pane">✕</span>' +
    '</div><div class="pterm"></div>';
  document.getElementById('panes').appendChild(el);
  el.querySelector('.pclose').onclick = () => closePane(id);
  return el;
}

async function addPane() {
  const cwd = document.getElementById('termcwd').value.trim();
  let id;
  try {
    id = await invoke('pty_spawn', { cwd });
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
  term.onData((d) => invoke('pty_write', { pane: id, data: d }));

  panes.set(id, { term, fit, el });
  setStatus(panes.size + ' pane' + (panes.size > 1 ? 's' : ''));
  setTimeout(fitAll, 80); // the grid just reflowed — refit everyone
  term.focus();
}

function fitPane(id) {
  const p = panes.get(id);
  if (!p) return;
  try {
    p.fit.fit();
    invoke('pty_resize', { pane: id, rows: p.term.rows, cols: p.term.cols });
  } catch (_) {}
}

function fitAll() { panes.forEach((_p, id) => fitPane(id)); }

function closePane(id) {
  invoke('pty_kill', { pane: id });
  const p = panes.get(id);
  if (p) { try { p.term.dispose(); } catch (_) {} p.el.remove(); panes.delete(id); }
  setStatus(panes.size + ' pane' + (panes.size === 1 ? '' : 's'));
  setTimeout(fitAll, 80);
}

document.getElementById('termadd').onclick = addPane;
document.getElementById('termcwd').addEventListener('keydown', (e) => { if (e.key === 'Enter') addPane(); });
window.addEventListener('resize', fitAll);
const tbtn = document.querySelector('.tabs button[data-tab="terminal"]');
if (tbtn) tbtn.addEventListener('click', () => setTimeout(fitAll, 40));

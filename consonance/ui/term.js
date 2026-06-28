// Chunk 2: render the embedded claude PTY in an xterm.js pane.
let term = null, fit = null;

function initTerm() {
  if (term) return;
  term = new Terminal({
    fontFamily: 'Consolas, "Cascadia Mono", "Courier New", monospace',
    fontSize: 13,
    cursorBlink: true,
    theme: {
      background: '#0B0E14', foreground: '#E6EAF2',
      cursor: '#5EEAD4', selectionBackground: '#27304A',
    },
  });
  fit = new FitAddon.FitAddon();
  term.loadAddon(fit);
  const host = document.getElementById('term');
  term.open(host);
  try { fit.fit(); } catch (_) {}
  host.addEventListener('mousedown', () => { if (term) term.focus(); });

  const invoke = window.__TAURI__.core.invoke;
  const listen = window.__TAURI__.event.listen;

  term.onData(d => invoke('pty_write', { data: d }));
  listen('pty-output', e => term.write(new Uint8Array(e.payload)));
  listen('pty-exit', () => term.write('\r\n\x1b[2m— process exited —\x1b[0m\r\n'));
  window.addEventListener('resize', doFit);
}

function doFit() {
  if (!fit || !term) return;
  try {
    fit.fit();
    window.__TAURI__.core.invoke('pty_resize', { rows: term.rows, cols: term.cols });
  } catch (_) {}
}

async function openTerm() {
  initTerm();
  const cwd = document.getElementById('termcwd').value.trim();
  try {
    await window.__TAURI__.core.invoke('pty_spawn', { cwd });
    setTimeout(() => { doFit(); term.focus(); }, 90);
  } catch (e) {
    term.write('\r\n\x1b[31mcould not spawn: ' + e + '\x1b[0m\r\n');
  }
}

document.getElementById('termopen').onclick = openTerm;
document.getElementById('termkill').onclick = () => window.__TAURI__.core.invoke('pty_kill');

// xterm can't measure a hidden element — re-fit when the Terminal tab is shown
const tbtn = document.querySelector('.tabs button[data-tab="terminal"]');
if (tbtn) tbtn.addEventListener('click', () => setTimeout(doFit, 40));

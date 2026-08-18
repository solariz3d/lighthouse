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
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

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
    const outk = (c.output / 1000).toFixed(1);
    const el = document.getElementById('cost');
    if (el) el.textContent = 'session generated: ' + outk + 'k out tok';
    const bs = document.getElementById('breakerstate');
    if (bs) {
      if (c.tripped) bs.innerHTML = '<span class="brk-tripped">⛔ breaker tripped — autonomy paused (click to reset)</span>';
      else if (c.ceiling_out > 0) bs.textContent = 'cap ' + (c.ceiling_out / 1000).toFixed(0) + 'k · at ' + outk + 'k';
      else bs.textContent = '';
    }
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
    if (e.payload && e.payload.auto) setStatus('summarizer auto-summarized · ' + e.payload.kept + ' kept');
  });
  listen('gate-card', (e) => {
    const c = e.payload;
    const wrap = document.getElementById('gatecards');
    if (!wrap) return;
    const card = document.createElement('div');
    card.className = 'gatecard';
    const tgt = c.target ? ' &rarr; <b>' + escapeHtml(c.target) + '</b>' : '';
    card.innerHTML =
      '<div class="gcbody"><span class="gckind">' + escapeHtml(c.kind) + '</span> ' +
      '<b>' + escapeHtml(c.from) + '</b>' + tgt +
      ' <span class="gcint">' + Math.round((c.intensity || 0) * 100) + '%</span>' +
      '<div class="gcwhy">' + escapeHtml(c.why) + '</div></div>' +
      '<div class="gcbtns"><button class="gcapprove">Approve</button><button class="gcdeny">Deny</button></div>';
    const decide = (approve) => {
      card.remove();
      inv('gate_decide', { id: c.id, approve })
        .then(() => setStatus((approve ? 'approved' : 'denied') + ' pull from ' + c.from))
        .catch(e => setStatus('gate decision failed for pull from ' + c.from + ': ' + e));
    };
    card.querySelector('.gcapprove').onclick = () => decide(true);
    card.querySelector('.gcdeny').onclick = () => decide(false);
    wrap.appendChild(card);
  });
  listen('gate-mode', (e) => {
    const el = document.getElementById('gatemode');
    if (el) el.textContent = e.payload;
  });
  listen('tether', (e) => {
    const p = panes.get(e.payload.pane);
    if (!p) return;
    const el = p.el.querySelector('.ptether');
    if (el) el.textContent = 'ref ' + e.payload.referents + ' · nov ' + e.payload.novelty.toFixed(2);
  });
  listen('delta', (e) => {
    const d = e.payload;
    const el = document.getElementById('deltaline');
    if (!el) return;
    el.textContent = 'Δ +' + d.new_confirmed + ' conf · +' + d.new_forks + ' fork · -' + d.resolved_forks + ' resolved · refs ' + d.new_refs + ' · echo ' + d.echo_ratio.toFixed(2) + ' · nov ' + d.novelty.toFixed(2);
  });
  listen('spread', (e) => {
    // seal/land correction (RECONCEPTION.md): low spread = convergence, NOT collapse by itself.
    // grounded convergence is a LANDING (agreeing on real referents); only UNGROUNDED convergence is
    // the echo/folie-a-deux worth a skeptic. Distinguish by groundedness (survival-under-scrutiny).
    const p = e.payload || {};
    const s = Number(p.spread != null ? p.spread : p);   // tolerate a bare-number payload
    const grounded = Number(p.grounded || 0);
    // THE VERDICT LABELS ARE GONE, and the skeptic no longer waits on this number.
    //
    // Measured 2026-08-06 (exo_memory/loop/diversity2_preregistration.md): this gauge scores
    // six equal slices of ONE instance at 0.9162 and six DIFFERENT instances answering one
    // prompt at 0.8201 — it rates one mind as more diverse than six, because minds engaging a
    // shared question converge in wording while one mind changes subject as it goes. So a low
    // reading is not evidence of echo, and "ungrounded (echo?)" was a verdict from a measure
    // pointing the wrong way. It had also never fired: 0 of 144 real laps met the trigger.
    //
    // The number still shows, because it is real and cheap. It shows as a NUMBER.
    const el = document.getElementById('spreadline');
    if (el) el.textContent = 'lexical spread ' + s.toFixed(2) + ' · ground ' + grounded;
    // The skeptic stays available for the chair to invoke — the capability was never the
    // problem, only the claim that a metric knew when to offer it.
    const sb = document.getElementById('skepticbtn');
    if (sb) sb.style.display = '';
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
    // pin-aware follow: scrolling up to read implicitly pauses the auto-scroll
    const pinned = log.scrollHeight - log.scrollTop - log.clientHeight < 40;
    log.appendChild(row);
    while (log.childNodes.length > 100) log.removeChild(log.firstChild);
    if (pinned) log.scrollTop = log.scrollHeight;
    tapNotify(pane, role, text);
  });
  registerDragDrop(listen);
  listenersReady = true;
}

// ---- drag a file onto a pane ----
// Why nothing happened before: Tauri's webview intercepts OS drag-and-drop itself, so the
// HTML5 `drop` event never fires in here — the drop was being swallowed by the frame with
// nobody listening on the other side. The webview's own event is the only route, and it is
// the BETTER one: it carries the real filesystem PATH, which a browser File object never
// does. A path is exactly what the CLI wants — it reads it and attaches the image. Written
// as a bracketed paste like ⎘ and Ctrl+V, so it lands in the input and never auto-submits.
function registerDragDrop(listen) {
  let lit = null;
  const highlight = (el) => {
    if (lit === el) return;
    if (lit) lit.classList.remove('dragover');
    lit = el;
    if (lit) lit.classList.add('dragover');
  };
  // Tauri reports the cursor in PHYSICAL pixels; getBoundingClientRect is in CSS pixels.
  const paneAt = (pos) => {
    if (!pos) return null;
    const dpr = window.devicePixelRatio || 1;
    const x = pos.x / dpr, y = pos.y / dpr;
    for (const [id, p] of panes) {
      const r = p.el.getBoundingClientRect();
      // a pane on an inactive tab is display:none, so its zero rect can never match
      if (r.width && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
    }
    return null;
  };
  const paneElAt = (pos) => { const id = paneAt(pos); return id ? panes.get(id).el : null; };

  listen('tauri://drag-over', (e) => highlight(paneElAt(e.payload && e.payload.position)));
  listen('tauri://drag-leave', () => highlight(null));
  listen('tauri://drag-drop', (e) => {
    highlight(null);
    const payload = e.payload || {};
    const paths = payload.paths || [];
    if (!paths.length) return;
    // dropped over a pane, else the committee's focus, else the only pane there is —
    // dropping onto chrome is a miss, not a reason to guess between several panes
    let id = paneAt(payload.position);
    if (!id && focusPaneId && panes.has(focusPaneId)) id = focusPaneId;
    if (!id && panes.size === 1) id = [...panes.keys()][0];
    if (!id) { setStatus('drop landed outside a pane — drop it on the one you mean'); return; }
    // Windows terminal convention: quote only when the path has spaces. Trailing space so
    // whatever is typed next doesn't glue onto the filename.
    const text = paths.map((p) => (/\s/.test(p) ? '"' + p + '"' : p)).join(' ') + ' ';
    const p = panes.get(id);
    if (p && p.term) p.term.focus();
    inv('pty_write', { pane: id, data: '\x1b[200~' + text + '\x1b[201~' })
      .then(() => setStatus(paths.length + ' file' + (paths.length === 1 ? '' : 's') + ' → pane ' + (p ? p.name : id.slice(0, 8))))
      .catch(() => setStatus('drop failed to reach the pane'));
  });
}

// ---- the tap bar: who / what / how many, at a glance, in 28px ----
let tapUnread = 0;

function renderTapPanes() {
  const el = document.getElementById('tappanes');
  if (!el) return;
  el.innerHTML = [...panes.values()]
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    .map((p) => '<span class="tp" data-pane-letter="' + p.name + '">' + p.name + '</span>').join('');
}

function tapNotify(pane, role, text) {
  const p = panes.get(pane);
  const letter = p ? p.name : String(pane).slice(0, 4);
  const t = document.getElementById('tapticker');
  if (t) t.innerHTML = '<span class="pid">' + escapeHtml(letter) + '</span> ' +
    '<span class="role-' + role + '">' + role + '</span>  ' + escapeHtml(String(text || '').slice(0, 140));
  if (p && role === 'assistant') {
    const lt = document.querySelector('#tappanes .tp[data-pane-letter="' + p.name + '"]');
    if (lt) { lt.classList.add('lit'); setTimeout(() => lt.classList.remove('lit'), 200); }
  }
  const s = document.getElementById('stream');
  if (s && !s.classList.contains('open')) {
    tapUnread++;
    const c = document.getElementById('tapcount');
    if (c) c.textContent = '+' + tapUnread;
  }
}

function toggleTap(open) {
  const s = document.getElementById('stream');
  if (!s) return;
  const to = open != null ? open : !s.classList.contains('open');
  s.classList.toggle('open', to);
  if (to) {
    tapUnread = 0;
    const c = document.getElementById('tapcount');
    if (c) c.textContent = '';
    const log = document.getElementById('streamlog');
    if (log) log.scrollTop = log.scrollHeight;
    const cp = document.getElementById('cmtpanel');            // one drawer at a time —
    if (cp) cp.classList.remove('show');                       // the actionable one wins
  }
}

// The letter registry, mirrored from the backend (data_dir/letters.json). The letter is
// assigned once at pane birth and never released, so it is READ here rather than derived
// from whatever is currently open — deriving it meant a letter did not survive a restart
// and, worse, recycled: close A, spawn another, and the newcomer was also A. On an
// append-only board a reused letter makes A-at-2AM a different instance from A-now.
let paneLetters = {};
async function refreshPaneLetters() {
  try { paneLetters = (await inv('pane_letters')) || {}; } catch (_) { /* keep what we have */ }
}

function letterFor(id) {
  if (paneLetters[id]) return paneLetters[id];
  // Fallback only: a pane the backend has no record of (an older build, or a pane created
  // before this shipped). Skip every letter already spoken for, live or retired, so the
  // stopgap still cannot hand out a name that belonged to someone else.
  const used = new Set([
    ...[...panes.values()].map((p) => p.name),
    ...Object.values(paneLetters),
  ]);
  for (let gen = 1; gen < 99; gen++) {
    for (let i = 0; i < 26; i++) {
      const n = String.fromCharCode(65 + i) + (gen === 1 ? '' : String(gen));
      if (!used.has(n)) { paneLetters[id] = n; return n; }
    }
  }
  return '#';
}

function makePaneEl(id, name, cwd, container, role) {
  const el = document.createElement('div');
  el.className = 'pane';
  // header shows state (letter, place, role, gauges); the pid rides in the letter's
  // tooltip and the full path in the short cwd's — verbs reveal on hover (CSS).
  const shortCwd = String(cwd || '~').split(/[\\/]/).filter(Boolean).pop() || '~';
  el.innerHTML =
    '<div class="phead">' +
      '<span class="pname" title="pane name — raise_pull targets this letter · ' + id.slice(0, 8) + '">' + (name || '?') + '</span>' +
      '<span class="pfocus" title="make this the committee focus">◎</span>' +
      '<span class="pcwd" title="' + escapeHtml(cwd || '~') + '">' + escapeHtml(shortCwd) + '</span>' +
      '<span class="prole" title="role — click to toggle; only committee panes can receive a gated inject">human</span>' +
      '<span class="ptether" title="groundedness: external referents · novelty vs the board — numbers, not a verdict"></span>' +
      '<span class="pctx" title="context window used"></span>' +
      '<span class="ppaste" title="paste the clipboard into this pane&#39;s input">⎘</span>' +
      '<span class="pcopy" title="copy the latest response to the clipboard">⧉</span>' +
      // Main carries no ✕: the room's own thread is not a click away from gone. It is
      // re-woken from the Wake button, never closed from its own header.
      (role === 'main' ? '' : '<span class="pclose" title="remove this pane">✕</span>') +
    '</div><div class="pterm"></div>';
  document.getElementById(container || 'panes').appendChild(el);
  const closeBtn = el.querySelector('.pclose'); // absent on Main
  if (closeBtn) closeBtn.onclick = () => closePane(id);
  el.querySelector('.pfocus').onclick = () => setFocus(id);
  // Main's role chip is a readout, not a control — same reasoning as the ✕ above. `role` governs
  // committee inject-assertion, so a button that mutates it sits next to the one pane whose role
  // must not move. Unbound here AND guarded in toggleRole: the guard is the load-bearing half,
  // since anything can call toggleRole directly.
  if (role !== 'main') el.querySelector('.prole').onclick = () => toggleRole(id);
  el.querySelector('.pcopy').onclick = () => copyPaneOutput(id);
  el.querySelector('.ppaste').onclick = () => pastePaneInput(id);
  return el;
}

// Copy a pane's output straight from the xterm buffer to the OS clipboard, through the Rust
// path we proved works. Sidesteps text selection entirely — no highlight, no mouse-mode, no
// streaming-redraw race. Uses a live selection if there is one, else the whole scrollback.
// Paste the OS clipboard into a pane's input via the proven Rust read path, as one
// bracketed-paste block (newlines preserved, no auto-submit) — a reliable click instead of
// Ctrl+V. The text lands in the input; the chair reviews and hits Enter.
function pastePaneInput(id) {
  inv('clipboard_read').then((t) => {
    if (t) inv('pty_write', { pane: id, data: '\x1b[200~' + t + '\x1b[201~' });
  }).catch(() => {});
}

function copyPaneOutput(id) {
  const p = panes.get(id);
  if (!p || !p.term) return;
  const term = p.term;
  let text = (term.getSelection && term.getSelection()) || '';
  if (!text) {
    const buf = term.buffer.active;
    const lines = [];
    for (let i = 0; i < buf.length; i++) {
      const line = buf.getLine(i);
      lines.push(line ? line.translateToString(true) : '');
    }
    text = latestTurn(lines);
  }
  inv('clipboard_write', { text }).then(() => flashCopied(id, text.length)).catch(() => {});
}

// Pull just the instance's LATEST response out of the rendered TUI: everything after the
// last real user prompt (a "❯ …" line with text typed), minus the bottom input-box chrome
// (separator rules, the empty ❯ box, the ⏵⏵ footer, a trailing ✻ status line). Degrades to
// the whole buffer if those markers aren't present.
function latestTurn(lines) {
  let promptIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^\s*❯\s+\S/.test(lines[i])) { promptIdx = i; break; }
  }
  const slice = lines.slice(promptIdx + 1);
  const isChrome = (s) =>
    s.trim() === '' ||
    /^\s*⏵/.test(s) ||                 // ⏵⏵ bypass-permissions footer
    /^[\s─–—-]+$/.test(s) ||           // separator rules
    /^\s*❯\s*$/.test(s) ||             // empty input box
    /^\s*✻/.test(s);                   // ✻ status / "Cooked for Ns"
  let end = slice.length;
  while (end > 0 && isChrome(slice[end - 1])) end--;
  let begin = 0;
  while (begin < end && slice[begin].trim() === '') begin++;
  const out = slice.slice(begin, end).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return out || lines.join('\n').trim();
}

function flashCopied(id, n) {
  const p = panes.get(id);
  const btn = p && p.el && p.el.querySelector('.pcopy');
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = '✓' + n;
  setTimeout(() => { if (btn.textContent === '✓' + n) btn.textContent = orig; }, 1400);
}

function attachPane(id, label, cwd, role, container, kept) {
  ensureListeners();
  role = role || 'human';
  const name = role === 'main' ? 'M' : letterFor(id);
  const el = makePaneEl(id, name, label, container, role);
  // Reading-first type: Cascadia Mono (ships with Win11, built for long terminal reading,
  // better Il1/O0) at 14/1.25; no blink (N panes pulsing in peripheral vision is noise) —
  // a steady bar marks input, unfocused panes ghost to an outline. Deep scrollback because
  // reading back through a long turn is a constant activity here.
  const term = new Terminal({
    fontFamily: '"Cascadia Mono", Consolas, "Courier New", monospace',
    fontSize: 14,
    lineHeight: 1.25,
    cursorBlink: false,
    cursorStyle: 'bar',
    cursorInactiveStyle: 'outline',
    scrollback: 8000,
    theme: { background: '#0B0E14', foreground: '#E6EAF2', cursor: '#5EEAD4', cursorAccent: '#0B0E14', selectionBackground: '#2E3A5C' },
  });
  const fit = new FitAddon.FitAddon();
  term.loadAddon(fit);
  const host = el.querySelector('.pterm');
  term.open(host);
  host.addEventListener('mousedown', () => term.focus());
  term.onData((d) => inv('pty_write', { pane: id, data: d }));

  // Copy-on-select: write the selection to the NATIVE clipboard the instant it's made,
  // before a streaming redraw can clear it. (Ctrl+C-with-selection was flaky for exactly
  // that reason — the render ate the selection between highlight and keypress.) Never write
  // an empty selection, so a later clear can't wipe what you just copied. This is the
  // reliable path; the Ctrl+C handler below stays as a manual fallback.
  term.onSelectionChange(() => {
    const sel = term.getSelection();
    if (sel) inv('clipboard_write', { text: sel }).catch(() => {});
  });

  // paste -> PTY. WebView2 swallows JS clipboard access, so read it through Rust on
  // Ctrl/Cmd+V, and also catch right-click paste events.
  // bracketed paste (\x1b[200~ … \x1b[201~) so a multi-line paste lands as ONE block — without it,
  // every newline in the clipboard is read as Enter and submits the chunk early. No \r, so it
  // doesn't auto-send: the text lands in the input, the chair reviews and hits Enter.
  function writePaste(t) {
    if (t) inv('pty_write', { pane: id, data: '\x1b[200~' + t + '\x1b[201~' });
  }
  function pasteInto() {
    inv('clipboard_read').then(writePaste).catch(() => {});
  }
  term.attachCustomKeyEventHandler((e) => {
    if (e.type === 'keydown' && (e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      pasteInto();
      return false;
    }
    // Ctrl/Cmd+C with a selection -> copy (write through Rust; WebView2 blocks JS clipboard).
    // Without a selection, fall through so the raw SIGINT reaches the PTY (terminal-standard).
    if (e.type === 'keydown' && (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
      const sel = term.getSelection();
      if (sel) {
        e.preventDefault();
        inv('clipboard_write', { text: sel }).catch(() => {});
        return false;
      }
    }
    return true;
  });
  host.addEventListener('paste', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const cd = ev.clipboardData || window.clipboardData;
    const text = cd ? cd.getData('text') : '';
    if (text) writePaste(text);
    else pasteInto();
  }, true);

  panes.set(id, { term, fit, el, cwd, role, name, label: label || '', kept: !!kept });
  inv('set_pane_name', { pane: id, name }).catch(() => {});
  if (role !== 'human') {
    const rb = el.querySelector('.prole');
    if (rb) { rb.textContent = role; rb.classList.toggle('committee', role === 'committee'); }
  }
  updateConveneBtn();
  renderTapPanes();
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
  const sp = document.getElementById('spawnpop');
  if (sp) sp.classList.remove('show');
  attachPane(id, cwd, cwd);
}

async function addSibling() {
  const btn = document.getElementById('sibling');
  if (btn) { btn.disabled = true; btn.textContent = 'waking…'; }
  setStatus('a briefed instance is waking on the startup brief…');
  try {
    const r = await inv('spawn_sibling');
    // siblings persist by default (the backend registers them kept); pass kept so ✕ removes them.
    // role comes from the backend now — siblings are committee from birth (chair-addressable).
    attachPane(r.pane, '✦ brief', r.cwd, r.role || 'committee', 'panes', true);
    setStatus('briefed instance woken · ' + r.cwd + ' — persists until removed');
  } catch (e) {
    setStatus('briefed-instance spawn failed: ' + e);
  }
  if (btn) { btn.disabled = false; btn.textContent = '✦ Brief'; }
}

async function addFresh() {
  const btn = document.getElementById('fresh');
  if (btn) { btn.disabled = true; btn.textContent = 'waking…'; }
  setStatus('a fresh instance is waking — no brief, stock claude…');
  try {
    const r = await inv('spawn_fresh');
    // fresh panes persist by default too (born kept); a vanilla mind on committee plumbing —
    // the chair can inject and read, but it wakes with no room, no board, stock permissions.
    attachPane(r.pane, '○ fresh', r.cwd, r.role || 'committee', 'panes', true);
    setStatus('fresh instance woken · ' + r.cwd + ' — unbriefed; persists until removed');
  } catch (e) {
    setStatus('fresh-instance spawn failed: ' + e);
  }
  if (btn) { btn.disabled = false; btn.textContent = '○ Fresh'; }
}

async function addRoom() {
  const btn = document.getElementById('room');
  if (btn) { btn.disabled = true; btn.textContent = 'opening…'; }
  setStatus('opening a room — a personal growing space, yours from the first turn…');
  try {
    const r = await inv('new_room', { name: null });
    // rooms persist by default (born kept, like siblings); scoped perms, never bypassed
    attachPane(r.pane, '⌂ room', r.cwd, 'human', 'panes', true);
    setStatus('room opened · ' + r.cwd + ' — persists until removed');
  } catch (e) {
    setStatus('room open failed: ' + e);
  }
  if (btn) { btn.disabled = false; btn.textContent = '⌂ Room'; }
}

async function addBody() {
  const btn = document.getElementById('body');
  if (btn) { btn.disabled = true; btn.textContent = 'spawning…'; }
  const cwd = document.getElementById('termcwd').value.trim();
  setStatus('spawning a sandboxed worker…');
  try {
    const r = await inv('spawn_body', { cwd });
    attachPane(r.pane, r.worktree ? '✦ worker · worktree' : '✦ worker · sandbox', r.cwd, 'committee');
    setStatus('sandboxed worker in ' + r.cwd + (r.worktree ? ' (git worktree)' : ''));
  } catch (e) {
    setStatus('sandboxed-worker spawn failed: ' + e);
  }
  if (btn) { btn.disabled = false; btn.textContent = '✦ Sandbox'; }
}

// ---- Stage 10: the housed Main instance ----
//
// ONE OWNER FOR THE BUTTON. Its state used to be written in three places — disabled here on
// entry, relabelled on success, re-enabled from wakeMain's catch, and handed back from
// closePane — and the idle label was spelled two different ways: 'Wake the orchestrator' in
// index.html and resetWakeMain, 'Wake the Main instance' in the catch. Three writers and two
// spellings for one control is how a button ends up describing a state the app is not in.
// Sibling/Room/Sandbox restore their buttons unconditionally after the try; Main cannot, because
// it is a singleton and must STAY disabled once awake — so the states are named instead.
const WAKE_MAIN_STATES = {
  idle:   { disabled: false, text: 'Wake the orchestrator' },   // the label index.html ships with
  waking: { disabled: true,  text: 'waking…' },
  awake:  { disabled: true,  text: 'Main is awake' },
};

function setWakeMain(state) {
  const btn = document.getElementById('wakemain');
  const s = WAKE_MAIN_STATES[state];
  if (btn && s) { btn.disabled = s.disabled; btn.textContent = s.text; }
}

// Kept as a named entry point: closePane hands the button back when Main is removed.
function resetWakeMain() { setWakeMain('idle'); }

async function wakeMain() {
  setWakeMain('waking');
  try {
    const r = await inv('spawn_main');
    attachPane(r.pane, '★ Main', r.cwd, 'main', 'mainpane');
    setWakeMain('awake');
    setStatus('the Main instance is awake — talk to it here');
  } catch (e) {
    // NOTE, not fixed here: if spawn_main SUCCEEDS and attachPane then throws, the backend has a
    // Main and the button says idle, so a second click asks for a second one. Whether spawn_main
    // is idempotent is a backend question I have not verified — flagged rather than guessed at.
    setStatus('' + e);
    setWakeMain('idle');
  }
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

function toggleRole(id) {
  const p = panes.get(id);
  if (!p) return;
  /* Main's role does not toggle. The ternary below reads "committee ? human : committee", so from
   * 'main' the FIRST click lands on 'committee' — not 'human' — which makes the room's own thread
   * chair-addressable and inject-assertable, and set_pane_role persists it. The ✕ cannot come back
   * (wakeMain hardcodes 'main' on restart, deliberately), so this never resurrects the close
   * control — but role is a safety-relevant field and it had a button wired to it. */
  if (p.role === 'main') { setStatus('Main’s role is fixed — it is the room’s own thread'); return; }
  p.role = p.role === 'committee' ? 'human' : 'committee';
  inv('set_pane_role', { pane: id, role: p.role }).catch(() => {});
  const el = p.el.querySelector('.prole');
  if (el) { el.textContent = p.role; el.classList.toggle('committee', p.role === 'committee'); }
  setStatus('pane ' + id.slice(0, 8) + ' → ' + p.role);
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
  // a convene that never completed (contributor pane lost its watcher) leaves stale glow behind
  panes.forEach((p) => p.el.classList.remove('convening'));
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
  setStatus('triangulating ' + contributions.length + ' contribution' + (contributions.length === 1 ? '' : 's') + '…');
  try {
    lastForming = await inv('committee_form', { question: c.question, contributions });
    document.getElementById('cmtbody').innerHTML = renderForming(lastForming);
    toggleTap(false);                                   // one drawer at a time
    document.getElementById('cmtpanel').classList.add('show');
    setStatus('committee formed — review, then → give to focus');
  } catch (e) {
    setStatus('triangulation failed: ' + e);
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
    const rows = p.term.rows, cols = p.term.cols;
    // Only resize claude when the size ACTUALLY changed. fitAll fires on many triggers (window
    // resize, tab clicks, a ResizeObserver on any layout shift), and most compute the SAME dims.
    // A no-op resize still delivers a SIGWINCH that makes claude repaint its whole TUI, and a
    // repaint landing mid-submission is what occasionally bakes the highlighted input box into the
    // scrollback (the rare "input bar glued to the last output" artifact). Skip unchanged resizes.
    if (rows !== p.sentRows || cols !== p.sentCols) {
      p.sentRows = rows; p.sentCols = cols;
      inv('pty_resize', { pane: id, rows, cols });
    }
  } catch (_) {}
}

function fitAll() { panes.forEach((_p, id) => fitPane(id)); }

// ✕ is destructive and was silent: pty_kill drops the pane's own-capture log (unless kept
// or Main) and removes its sandbox, and the un-keep below drops it from panes.json so it
// never returns on launch. One misclick took a pane and its history. Ask first.
async function closePane(id) {
  const before = panes.get(id);
  const kept = !!(before && before.kept);
  /* A rejection here is NOT a "no". `dialog:allow-ask` is compiled into the exe from
   * capabilities/default.json at build time, so running this file against a binary built before
   * that permission landed makes ask() reject — and the old `.catch(() => false)` turned that
   * into a ✕ that did nothing, said nothing, and logged nothing. The consequence is benign (it
   * fails toward NOT deleting, which is the right direction for a destructive control) but it is
   * undiagnosable from the UI, which is its own kind of failure. The try also covers the
   * synchronous TypeError if window.__TAURI__.dialog is absent entirely — .catch never could. */
  let ok = false;
  try {
    ok = await window.__TAURI__.dialog.ask(
      kept
        ? 'Remove this pane? Its own-capture log is dropped and it will not be restored on next launch.'
        : 'Remove this pane? Its own-capture log is dropped.',
      { title: 'Remove pane', kind: 'warning' }
    );
  } catch (e) {
    setStatus('pane not removed — the confirm dialog is unavailable (' + e + '). Rebuild: ' +
              'dialog:allow-ask must be in src-tauri/capabilities/default.json at build time.');
    return;
  }
  if (!ok) return;
  inv('pty_kill', { pane: id });
  const p = panes.get(id);
  if (p && p.kept) inv('set_pane_kept', { pane: id, cwd: p.cwd || '', label: '', kept: false }).catch(() => {});
  if (p) { try { p.term.dispose(); } catch (_) {} p.el.remove(); panes.delete(id); }
  // Main gone by any path: hand the Wake button back. It is disabled on wake and never
  // re-enabled on success, so without this a removed Main is unreachable until an app restart.
  if ((before && before.role === 'main') || (p && p.role === 'main')) resetWakeMain();
  if (id === focusPaneId) focusPaneId = null;
  lastTurn.delete(id);
  updateConveneBtn();
  renderTapPanes();
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
  let html = '<div class="rdiv">── kept notes · ' + r.kept + ' kept' + (r.auto ? ' · auto' : '') + ' ──</div>';
  (r.atoms || []).forEach((a) => {
    html += '<div class="ratom"><span class="rkind">' + escapeHtml(a.kind || '?') + '</span> ' +
      escapeHtml(a.claim || '') +
      (a.tether ? ' <span class="rtether">— ' + escapeHtml(a.tether) + '</span>' : '') + '</div>';
  });
  div.innerHTML = html;
  const pinned = log.scrollHeight - log.scrollTop - log.clientHeight < 40;
  log.appendChild(div);
  if (pinned) log.scrollTop = log.scrollHeight;
  const t = document.getElementById('tapticker');
  if (t) t.innerHTML = '<span class="kept">── kept notes · ' + r.kept + ' kept ──</span>';
}

async function distill() {
  const btn = document.getElementById('distill');
  if (btn) { btn.disabled = true; btn.textContent = 'summarizing…'; }
  setStatus('the summarizer is summarizing the board (good model)…');
  try {
    const kept = await inv('scribe_distill'); // render arrives via the 'distilled' event
    setStatus('summarizer kept ' + kept + ' note' + (kept === 1 ? '' : 's'));
  } catch (e) {
    setStatus('summarize failed: ' + e);
  }
  if (btn) { btn.disabled = false; btn.textContent = '⟳ summarize'; }
}

document.getElementById('termadd').onclick = addPane;
document.getElementById('termcwd').addEventListener('keydown', (e) => { if (e.key === 'Enter') addPane(); });
window.addEventListener('resize', fitAll);
const tbtn = document.querySelector('.tabs button[data-tab="terminal"]');
if (tbtn) tbtn.addEventListener('click', () => setTimeout(fitAll, 40));
const wm = document.getElementById('wakemain');
if (wm) wm.onclick = wakeMain;
const mtab = document.querySelector('.tabs button[data-tab="main"]');
if (mtab) mtab.addEventListener('click', () => setTimeout(fitAll, 40));
const dbtn = document.getElementById('distill');
if (dbtn) dbtn.onclick = distill;
const sbtn = document.getElementById('sibling');
if (sbtn) sbtn.onclick = addSibling;
const fshb = document.getElementById('fresh');
if (fshb) fshb.onclick = addFresh;
const bbtn = document.getElementById('body');
if (bbtn) bbtn.onclick = addBody;
const rbtn = document.getElementById('room');
if (rbtn) rbtn.onclick = addRoom;
const adb = document.getElementById('autodistill');
if (adb) adb.onchange = (e) => inv('set_auto_distill', { on: e.target.checked });
const cvb = document.getElementById('convene'); if (cvb) cvb.onclick = openConvene;
const cvs = document.getElementById('convsend'); if (cvs) cvs.onclick = broadcast;

// Restore kept instances on launch — they survive app close/crash and resume their own session.
// Repaint a restored pane's conversation.
//
// A kept sibling comes back as a FRESH claude session — resume_pane never uses
// `--resume`, because resuming a lazily-flushed pane errors "no conversation found" and
// kills it (2026-07-11). Its MEMORY returns via warm_resume_brief, so the instance knows
// what happened; but nothing had ever printed to that terminal, so the chair opened a
// kept pane to a blank screen and could not see where he left off. The history was never
// lost — it sits in data_dir/captures/<pane>.txt and simply had no route back to a screen.
//
// Cosmetic only, and labelled so it can never be read as live output: this is the record
// of what was said, above a pane that is genuinely new below the divider.
async function paintScrollback(id) {
  const p = panes.get(id);
  if (!p) return;
  let text = '';
  try { text = await inv('pane_scrollback', { pane: id }); } catch (_) { return; }
  if (!text || !text.trim()) return;
  const dim = '\x1b[2m';
  const off = '\x1b[0m';
  p.term.write(`${dim}── restored from capture · what was said before the restart ──${off}\r\n\r\n`);
  // the capture is plain text with \n; a terminal needs \r\n or every line staircases
  p.term.write(text.replace(/\r?\n/g, '\r\n'));
  p.term.write(`\r\n${dim}── end of history · the session below is new ──${off}\r\n\r\n`);
}

async function restoreKeptPanes() {
  let kept;
  // Letters first: a restored pane must come back wearing the letter it was born with,
  // not whatever position it happens to take in the restore loop.
  await refreshPaneLetters();
  try { kept = await inv('list_kept_panes'); } catch (e) { return; }
  for (const k of (kept || [])) {
    try {
      const r = await inv('resume_pane', { pane: k.pane, cwd: k.cwd });
      // role comes from the backend: instance-dir siblings resume as committee, rooms stay human
      attachPane(r.pane, k.label || '✦ kept', r.cwd, r.role || 'human', 'panes', true);
      // Immediately, before claude's own startup paint: history first, live session under
      // it. If a future claude build clears the viewport on start, the record still lives
      // in xterm's scrollback (2J clears the screen, not the buffer) — scroll up and it
      // is there.
      await paintScrollback(r.pane);
    } catch (e) { /* already running, or resume failed — skip */ }
  }
  if (kept && kept.length) setStatus(kept.length + ' kept instance' + (kept.length === 1 ? '' : 's') + ' resumed');
}
restoreKeptPanes();
const cvc = document.getElementById('convcancel'); if (cvc) cvc.onclick = cancelConvene;
const gfb = document.getElementById('givefocus'); if (gfb) gfb.onclick = giveToFocus;
const skb = document.getElementById('skepticbtn');
if (skb) skb.onclick = () => {
  if (!focusPaneId) { setStatus('◎ a focus pane first to offer it a skeptic'); return; }
  // No longer cites a gauge as the reason: the chair pressed this, and the chair is the
  // discriminator. Asserting "low perspective diversity, few referents" told the pane a broken
  // measurement had detected something, which is a worse input than the plain request.
  injectAndSend(focusPaneId, "[committee] the chair is asking for a skeptic's vantage on this. Find the flaw, the hidden assumption, the place this breaks. If the agreement here is real, say why it holds — but do not agree because everyone else did.");
  skb.style.display = 'none';
  setStatus('skeptic vantage offered to focus ' + focusPaneId.slice(0, 8));
};
const cmx = document.getElementById('cmtclose'); if (cmx) cmx.onclick = dismissCommittee;
const setGateMode = (l) => { const el = document.getElementById('gatemode'); if (el) el.textContent = l; };
const ocb = document.getElementById('openchan');
if (ocb) ocb.onclick = () => inv('open_channel', { exchanges: 5, ttl: 300 }).then((l) => { setGateMode(l); setStatus('open-channel: 5 pulls auto-approve / 5 min, then snaps back'); }).catch(() => {});
const ccb = document.getElementById('closechan');
if (ccb) ccb.onclick = () => inv('close_channel').then((l) => { setGateMode(l); setStatus('gate: ask-each'); }).catch(() => {});
const sbk = document.getElementById('setbreaker');
if (sbk) sbk.onclick = () => {
  const k = parseFloat(document.getElementById('breakercap').value) || 0;
  inv('set_breaker_ceiling', { out: Math.round(k * 1000) }).then(() => setStatus(k > 0 ? ('breaker cap set: ' + k + 'k output tokens') : 'breaker cap cleared')).catch(() => {});
};
const bks = document.getElementById('breakerstate');
if (bks) bks.onclick = () => inv('reset_breaker').then(() => setStatus('breaker reset — autonomy may resume')).catch(() => {});
// the dyad: pair two panes at opposite lenses, then chair-trigger a mutual-spot
const dyadState = (t) => { const el = document.getElementById('dyadstate'); if (el) el.textContent = t; };
const dpb = document.getElementById('dyadpair');
if (dpb) dpb.onclick = () => {
  const trust = (document.getElementById('dyadtrust').value || '').trim();
  const doubt = (document.getElementById('dyaddoubt').value || '').trim();
  if (!trust || !doubt) { dyadState('give a trust pane and a doubt pane'); return; }
  inv('set_spot_pair', { trust, doubt }).then((r) => { dyadState(r); setStatus(r); }).catch((e) => dyadState('' + e));
};
const dsb = document.getElementById('dyadspotbtn');
if (dsb) dsb.onclick = () => {
  const target = (document.getElementById('dyadspot').value || '').trim();
  if (!target) { dyadState('give a pane letter to spot'); return; }
  inv('dyad_spot', { target }).then((r) => { dyadState(r); setStatus(r); }).catch((e) => dyadState('' + e));
};

// ---- streamlined chrome: tap drawer, popovers, self-healing refits ----
const sbar = document.getElementById('streambar');
if (sbar) sbar.onclick = (e) => {
  if (e.target.closest('[data-nodrawer]')) return;   // the status/controls cluster doesn't toggle
  toggleTap();
};
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (e.target && e.target.closest && e.target.closest('.pane')) return;  // Esc belongs to the TUI there
  const pops = document.querySelectorAll('.popover.show');
  if (pops.length) { pops.forEach((p) => p.classList.remove('show')); return; }
  const s = document.getElementById('stream');
  if (s && s.classList.contains('open')) { toggleTap(false); return; }
  const cp = document.getElementById('cmtpanel');
  if (cp) cp.classList.remove('show');
});

// popovers: ⚙ (gate · breaker · dyad) and ▾ (spawn options); click-outside closes
function togglePop(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const to = !el.classList.contains('show');
  document.querySelectorAll('.popover.show').forEach((p) => p.classList.remove('show'));
  el.classList.toggle('show', to);
}
const gearb = document.getElementById('gearbtn');
if (gearb) gearb.onclick = (e) => { e.stopPropagation(); togglePop('gearpop'); };
const spm = document.getElementById('spawnmenu');
if (spm) spm.onclick = (e) => { e.stopPropagation(); togglePop('spawnpop'); };
document.addEventListener('mousedown', (e) => {
  if (!e.target || !e.target.closest) return;
  if (e.target.closest('.popover') || e.target.closest('#gearbtn') || e.target.closest('#spawnmenu')) return;
  document.querySelectorAll('.popover.show').forEach((p) => p.classList.remove('show'));
});
// spawning from the ▾ closes it — the pane arriving is the feedback
['sibling', 'fresh', 'body', 'room'].forEach((bid) => {
  const b = document.getElementById(bid);
  if (b) b.addEventListener('click', () => { const sp = document.getElementById('spawnpop'); if (sp) sp.classList.remove('show'); });
});

// self-healing refits: anything that changes #panes' box (convbar showing, future
// chrome) re-fits every terminal — no more chasing individual call sites
const panesEl = document.getElementById('panes');
if (panesEl && window.ResizeObserver) {
  let roT;
  new ResizeObserver(() => { clearTimeout(roT); roT = setTimeout(fitAll, 60); }).observe(panesEl);
}

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
    // seed the ticker from the last entry so the bar isn't blank on launch — restored
    // history is not unread, so no count
    const last = entries[entries.length - 1];
    if (last) {
      const t = document.getElementById('tapticker');
      if (t) t.innerHTML = '<span class="pid">' + escapeHtml((last.pane || '').slice(0, 4)) + '</span> ' +
        '<span class="role-' + last.role + '">' + last.role + '</span>  ' + escapeHtml((last.text || '').slice(0, 140));
    }
  }).catch(() => {});
} catch (_) {}

const invoke = window.__TAURI__.core.invoke;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let state = {};

const status = t => { $('#status').textContent = t; };

// Single-page app — there is nowhere to navigate. Trap history back/forward
// (keyboard or programmatic) and swallow the mouse X-buttons (3 = back, 4 = forward)
// before WebView2 navigates and wipes the live panes.
history.pushState(null, '', location.href);
window.addEventListener('popstate', () => history.pushState(null, '', location.href));
for (const type of ['mousedown', 'mouseup', 'auxclick']) {
  window.addEventListener(type, (e) => {
    if (e.button === 3 || e.button === 4) { e.preventDefault(); e.stopPropagation(); }
  }, true);
}

async function load() {
  state = await invoke('get_state');
  if ($('#roompath')) $('#roompath').value = state.room_path || '';
  if ($('#instancesdir')) $('#instancesdir').value = state.instances_dir || '';
  if ($('#datadir')) $('#datadir').value = state.data_dir || '';
  if ($('#ambientlabel')) $('#ambientlabel').value = state.ambient_label || '';
  if ($('#ambientlat')) $('#ambientlat').value = state.ambient_lat || '';
  if ($('#ambientlon')) $('#ambientlon').value = state.ambient_lon || '';
  if ($('#ambienttz')) $('#ambienttz').value = state.ambient_tz || '';
  // fresh machine (no saved config) → land on Settings so directories are the first thing chosen
  try {
    if (!(await invoke('config_exists'))) {
      $$('.tabs button').forEach(x => x.classList.remove('active'));
      $$('.tab').forEach(x => x.classList.remove('active'));
      const sb = $('.tabs button[data-tab="settings"]'); if (sb) sb.classList.add('active');
      $('#settings').classList.add('active');
      status('welcome — choose where Consonance keeps its files, then Save and explore');
    }
  } catch (e) {}
}

async function persist() {
  if ($('#roompath')) state.room_path = $('#roompath').value.trim();
  if ($('#instancesdir')) state.instances_dir = $('#instancesdir').value.trim();
  if ($('#datadir')) state.data_dir = $('#datadir').value.trim();
  if ($('#ambientlabel')) state.ambient_label = $('#ambientlabel').value.trim();
  if ($('#ambientlat')) state.ambient_lat = $('#ambientlat').value.trim();
  if ($('#ambientlon')) state.ambient_lon = $('#ambientlon').value.trim();
  if ($('#ambienttz')) state.ambient_tz = $('#ambienttz').value.trim();
  await invoke('save_config', { cfg: state });
}

// Native folder / file pickers for the Settings paths (tauri-plugin-dialog).
const dialog = window.__TAURI__.dialog;
async function pickInto(sel, opts) {
  try { const p = await dialog.open(opts); if (p) $(sel).value = p; } catch (e) {}
}
if ($('#browseroom')) $('#browseroom').onclick = () => pickInto('#roompath', { multiple: false, directory: false, filters: [{ name: 'Markdown', extensions: ['md'] }] });
if ($('#browseinstances')) $('#browseinstances').onclick = () => pickInto('#instancesdir', { directory: true });
if ($('#browsedata')) $('#browsedata').onclick = () => pickInto('#datadir', { directory: true });

$$('.tabs button').forEach(b => b.onclick = () => {
  $$('.tabs button').forEach(x => x.classList.remove('active'));
  $$('.tab').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  $('#' + b.dataset.tab).classList.add('active');
});

['#roompath', '#instancesdir', '#datadir', '#ambientlabel', '#ambientlat', '#ambientlon', '#ambienttz'].forEach(s => { const el = $(s); if (el) el.addEventListener('change', persist); });
const ssb = $('#savesettings'); if (ssb) ssb.onclick = () => persist().then(() => status('settings saved — applies to new spawns; restart for full effect')).catch(() => {});

load();

/* ── THE COCHLEA ──────────────────────────────────────────────────────────────────────────
 * Off until a source is picked. Capture is bound to one process tree, so choosing Spotify
 * does not filter Discord out — Discord's audio is never delivered to the client at all.
 * The events are RATIOS, not frequencies: 3:2 reads as home, 45:32 wants to move.
 */
(() => {
  const sel = $('#listensrc'), log = $('#listenlog'), warn = $('#listenwarn');
  const toggle = $('#listentoggle'), refresh = $('#listenrefresh');
  if (!sel || !toggle) return;                 // tab not present in this build
  let listening = false, lines = 0;

  async function loadSources() {
    try {
      const r = await invoke('audio_sources');
      sel.innerHTML = '';
      for (const s of r.sources) {
        const o = document.createElement('option');
        o.value = JSON.stringify({ pid: s.pid, label: s.label });
        // The desktop option is marked in the LABEL as well as the data, because it is the one
        // with a different privacy posture and a reader should never have to infer that.
        o.textContent = s.whole_desktop ? `⚠ ${s.label}` : `${s.label}  ·  ${s.procs} processes`;
        sel.appendChild(o);
      }
      const blocked = r.blocked_by || [];
      if (blocked.length) {
        warn.style.display = 'block';
        warn.textContent = `⛔ ${blocked.join(', ')} is running — capture is refused while a kernel anti-cheat is loaded.`;
        toggle.disabled = true;
      } else {
        warn.style.display = 'none';
        toggle.disabled = false;
      }
    } catch (e) { warn.style.display = 'block'; warn.textContent = String(e); }
  }

  function add(h) {
    if (lines === 0) log.innerHTML = '';
    const row = document.createElement('div');
    const tone = { restless: '#e8b04b', resolved: '#6fd08c', stopped: '#e05c5c',
                   silence: '#6b7280', onset: '#7aa2f7' }[h.kind] || 'inherit';
    // Bright and full-size: these are the voted lines, the ones that also reach the ledger. They
    // have to stay legible against the fast dim stream they now sit among.
    row.style.fontWeight = '600';
    row.innerHTML = `<span style="opacity:.5">${h.at}</span>  <span style="color:${tone}">${h.text}</span>`;
    log.appendChild(row);
    // A listening window should follow the sound rather than make you chase it.
    log.scrollTop = log.scrollHeight;
    if (++lines > 500) { log.removeChild(log.firstChild); lines--; }
  }

  toggle.onclick = async () => {
    if (listening) {
      await invoke('audio_stop');
      listening = false; toggle.textContent = 'Listen'; toggle.classList.add('accent');
      add({ at: new Date().toTimeString().slice(0, 8), kind: 'stopped', text: 'stopped listening' });
      return;
    }
    try {
      const { pid, label } = JSON.parse(sel.value || '{}');
      await invoke('audio_start', { pid, label });
      listening = true; toggle.textContent = 'Stop'; toggle.classList.remove('accent');
      add({ at: new Date().toTimeString().slice(0, 8), kind: 'onset', text: `listening to ${label}` });
    } catch (e) {
      warn.style.display = 'block'; warn.textContent = String(e);
    }
  };

  // ---- the field ----------------------------------------------------------------------
  // Analysis produces ~12 frames a second. Drawing only on arrival would look like a strobe,
  // so the canvas runs its own rAF loop and each bar falls toward the newest value instead of
  // jumping to it. That is a DISPLAY smoothing and nothing else: the numbers underneath are
  // untouched, and silence still empties the display within a few frames rather than decaying
  // prettily forever.
  const eq = $('#listeneq'), vsOut = $('#listenvoices');
  const eqx = eq && eq.getContext('2d');
  let bands = new Float32Array(64), shown = new Float32Array(64), marks = [], vs = [];
  // Colours are assigned per note, so one sound lights one hue across all of its partials. If
  // a single note ever shows four colours, the fusion has failed and you can see it happen.
  const HUES = ['#7aa2f7', '#e8b04b', '#6fd08c', '#c98bdb', '#e05c5c', '#4fd0c0'];

  function drawEq() {
    if (!eqx) return;
    const w = eq.clientWidth, h = eq.clientHeight, dpr = window.devicePixelRatio || 1;
    if (eq.width !== w * dpr || eq.height !== h * dpr) { eq.width = w * dpr; eq.height = h * dpr; }
    eqx.setTransform(dpr, 0, 0, dpr, 0, 0);
    eqx.clearRect(0, 0, w, h);

    const n = bands.length, bw = w / n;
    for (let i = 0; i < n; i++) {
      // fall fast enough that a stopped source empties the display, rise instantly
      shown[i] = bands[i] > shown[i] ? bands[i] : shown[i] * 0.82 + bands[i] * 0.18;
      const bh = Math.max(0, shown[i]) * (h - 2);
      if (bh < 0.5) continue;
      const g = eqx.createLinearGradient(0, h, 0, h - bh);
      g.addColorStop(0, 'rgba(122,162,247,.32)');
      g.addColorStop(1, 'rgba(122,162,247,.95)');
      eqx.fillStyle = g;
      eqx.fillRect(i * bw + 0.5, h - bh, bw - 1, bh);
    }

    // partial markers, coloured by which note claimed them
    const LO = 30, HI = 16000, span = Math.log(HI / LO);
    const xOf = hz => (Math.log(Math.max(LO, Math.min(HI, hz)) / LO) / span) * w;
    marks.forEach(hz => {
      // which voice owns this partial: the one it is closest to an exact harmonic of
      let owner = -1, best = 1e9;
      vs.forEach((v, i) => {
        const k = Math.round(hz / v[0]);
        if (k < 1) return;
        const off = Math.abs(1200 * Math.log2(hz / (k * v[0])));
        if (off < best && off <= 40) { best = off; owner = i; }
      });
      eqx.fillStyle = owner < 0 ? 'rgba(150,150,150,.55)' : HUES[owner % HUES.length];
      const x = xOf(hz);
      eqx.fillRect(x - 1, 0, 2, 7);
    });
    requestAnimationFrame(drawEq);
  }
  if (eqx) requestAnimationFrame(drawEq);

  refresh.onclick = loadSources;
  window.__TAURI__.event.listen('heard', e => add(e.payload));
  // TWO READERS, TWO RATES — the same split the spectrum already has, applied to the list.
  //
  // The settle-and-vote rules exist because the orchestrator pays per line, and they were applied
  // to this display too, which was wrong: the keeper watching a song go by WANTS the fine grain.
  // "Not updating as fast as it could for the intricacies of the song." Density is information to
  // an eye and a bill to a reader, and one channel cannot serve both.
  //
  // So the fast reading is drawn here, dim, straight off the analysis frame — and it is NOT
  // written to the ledger and never reaches the orchestrator. The voted `heard` lines stay bright
  // on top of it, so the meaningful events are still legible against the movement.
  let lastFast = '';
  function addFast(text, restless) {
    if (!text || text === lastFast) return;
    lastFast = text;
    if (lines === 0) log.innerHTML = '';
    const row = document.createElement('div');
    row.style.opacity = '.42';
    row.style.fontSize = '11px';
    row.innerHTML = `<span style="opacity:.6">·</span> <span style="color:${
      restless ? '#e8b04b' : '#8b93a3'}">${text}</span>`;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    if (++lines > 500) { log.removeChild(log.firstChild); lines--; }
  }

  window.__TAURI__.event.listen('spectrum', e => {
    const s = e.payload;
    if (s.bands && s.bands.length) bands = s.bands;
    marks = s.peaks || [];
    vs = s.voices || [];
    if (s.intervals && s.intervals.length) addFast(s.intervals.join(' · '), s.restless);
    if (!vsOut) return;
    vsOut.innerHTML = vs.length === 0
      ? 'silent'
      : vs.map((v, i) => `<span style="color:${HUES[i % HUES.length]}">${v[0].toFixed(1)} Hz` +
          `<span style="opacity:.55"> · ${v[2]} partial${v[2] === 1 ? '' : 's'}` +
          `${v[3] ? ' · inferred' : ''}</span></span>`).join('   ') +
        (s.intervals && s.intervals.length
          ? `<span style="opacity:.75">   —   ${s.intervals.join(' · ')}` +
            `${s.restless ? ' (wants to move)' : ''}</span>` : '');
  });
  // Re-scan when the tab is opened: what is running changes between visits.
  const tabBtn = $('.tabs button[data-tab="listen"]');
  if (tabBtn) tabBtn.addEventListener('click', loadSources);
  loadSources();
})();

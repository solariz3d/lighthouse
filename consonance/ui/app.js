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

  refresh.onclick = loadSources;
  window.__TAURI__.event.listen('heard', e => add(e.payload));
  // Re-scan when the tab is opened: what is running changes between visits.
  const tabBtn = $('.tabs button[data-tab="listen"]');
  if (tabBtn) tabBtn.addEventListener('click', loadSources);
  loadSources();
})();

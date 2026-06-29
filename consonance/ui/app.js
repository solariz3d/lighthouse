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
  await invoke('save_config', { cfg: state });
}

$$('.tabs button').forEach(b => b.onclick = () => {
  $$('.tabs button').forEach(x => x.classList.remove('active'));
  $$('.tab').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  $('#' + b.dataset.tab).classList.add('active');
});

['#roompath', '#instancesdir', '#datadir'].forEach(s => { const el = $(s); if (el) el.addEventListener('change', persist); });
const ssb = $('#savesettings'); if (ssb) ssb.onclick = () => persist().then(() => status('settings saved — applies to new spawns; restart for full effect')).catch(() => {});

load();

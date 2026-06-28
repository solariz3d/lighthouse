const invoke = window.__TAURI__.core.invoke;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let state = { base: '', flags: '', instances: [] };

const status = t => { $('#status').textContent = t; };
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const has = p => state.instances.some(i => i.path.toLowerCase() === p.toLowerCase());

async function load() {
  state = await invoke('get_state');
  $('#base').value = state.base || '';
  $('#flags').value = state.flags || '';
  renderList();
}

function renderList() {
  const ul = $('#list');
  ul.innerHTML = '';
  if (!state.instances.length) {
    ul.innerHTML = '<li class="empty">no instances yet — launch one, or add an existing folder below</li>';
    status('0 instances');
    return;
  }
  state.instances.forEach((inst, i) => {
    const li = document.createElement('li');
    li.dataset.i = i;
    li.innerHTML = `<span class="dot ${inst.current ? 'me' : ''}"></span>` +
      `<span class="nm">${esc(inst.name)}${inst.current ? ' <em>· you</em>' : ''}</span>` +
      `<span class="pth">${esc(inst.path)}</span>`;
    li.onclick = () => { $$('#list li').forEach(x => x.classList.remove('sel')); li.classList.add('sel'); };
    li.ondblclick = () => openInst(i);
    ul.appendChild(li);
  });
  status(`${state.instances.length} instance${state.instances.length > 1 ? 's' : ''}`);
}

async function persist() {
  state.base = $('#base').value;
  state.flags = $('#flags').value;
  await invoke('save_config', { cfg: state });
}

async function launchNew() {
  const name = $('#name').value.trim().replace(/\s+/g, '-');
  if (!name) { status('give the instance a name first'); return; }
  const base = $('#base').value.replace(/[\\/]+$/, '');
  const path = base + '\\' + name;
  await invoke('launch', { name, path, flags: $('#flags').value });
  if (!has(path)) state.instances.push({ name, path, current: false });
  await persist();
  $('#name').value = '';
  renderList();
  status('launched  ' + name);
}

async function openInst(i) {
  const inst = state.instances[i];
  await invoke('launch', { name: inst.name, path: inst.path, flags: $('#flags').value });
  status('opened  ' + inst.name);
}

function selected() { const s = $('#list li.sel'); return s ? +s.dataset.i : -1; }
function openSel() { const i = selected(); if (i < 0) return status('select an instance to open'); openInst(i); }

async function addByPath() {
  const p = $('#addpath').value.trim().replace(/[\\/]+$/, '');
  if (!p) return status('paste a folder path first');
  if (has(p)) return status('already in the list');
  state.instances.push({ name: p.split(/[\\/]/).pop() || p, path: p, current: false });
  await persist();
  $('#addpath').value = '';
  renderList();
  status('added  ' + (p.split(/[\\/]/).pop() || p));
}

async function removeSel() {
  const i = selected();
  if (i < 0) return status('select an instance to remove');
  const gone = state.instances.splice(i, 1)[0];
  await persist();
  renderList();
  status('removed  ' + gone.name + '  (folder untouched)');
}

// ---- the living loop ----
let loopStarted = false;
const gOut = () => $('#g-out'), rOut = () => $('#r-out');

async function askLoop() {
  const q = $('#loopq').value.trim();
  if (!q) { status('ask the loop something first'); return; }
  $('#ask').disabled = true;
  rOut().className = 'out muted';
  if (!loopStarted) {
    gOut().className = 'out thinking'; gOut().textContent = 'waking ground + reach in the water…';
    rOut().textContent = '…';
    try { await invoke('loop_start'); loopStarted = true; }
    catch (e) { gOut().className = 'out'; gOut().textContent = 'could not wake the loop: ' + e; $('#ask').disabled = false; return; }
  }
  gOut().className = 'out thinking'; gOut().textContent = 'ground is thinking…';
  rOut().className = 'out muted'; rOut().textContent = 'reach waits for ground…';
  status('the loop is in the water…');
  try {
    const r = await invoke('loop_ask', { question: q });
    gOut().className = 'out'; gOut().textContent = r.ground || '(no reply)';
    rOut().className = 'out'; rOut().textContent = r.reach || '(no reply)';
    status('the loop answered');
  } catch (e) {
    gOut().className = 'out'; gOut().textContent = 'loop error: ' + e;
    rOut().className = 'out'; rOut().textContent = '';
  }
  $('#ask').disabled = false;
}

$$('.tabs button').forEach(b => b.onclick = () => {
  $$('.tabs button').forEach(x => x.classList.remove('active'));
  $$('.tab').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  $('#' + b.dataset.tab).classList.add('active');
});

$('#launch').onclick = launchNew;
$('#name').addEventListener('keydown', e => { if (e.key === 'Enter') launchNew(); });
$('#open').onclick = openSel;
$('#remove').onclick = removeSel;
$('#add').onclick = addByPath;
$('#addpath').addEventListener('keydown', e => { if (e.key === 'Enter') addByPath(); });
$('#ask').onclick = askLoop;
$('#loopq').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); askLoop(); } });
$('#base').addEventListener('change', persist);
$('#flags').addEventListener('change', persist);

load();

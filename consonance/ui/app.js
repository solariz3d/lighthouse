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

// ---- the committee (Stage 6: blind-first vantages -> triangulating forming) ----
function escapeCmt(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

function renderCommittee(r) {
  const f = r.forming || {};
  const sec = (cls, head, items, render) => {
    let h = '<div class="fsec"><div class="fhead ' + cls + '">' + head + '</div>';
    if (!items || !items.length) h += '<div class="fitem muted">— none —</div>';
    else items.forEach(it => { h += render(it); });
    return h + '</div>';
  };
  let h = '<div class="forming">';
  h += sec('confirmed', 'confirmed — located from ≥2 vantages', f.confirmed,
    c => '<div class="fitem">' + escapeCmt(c.claim || '') + ' <span class="ffrom">' + escapeCmt((c.from || []).join(', ')) + '</span></div>');
  h += sec('forks', 'forks — held divergence, no winner', f.forks, fk => {
    let s = '<div class="fitem"><b>' + escapeCmt(fk.axis || '') + '</b>';
    (fk.positions || []).forEach(p => { s += '<div class="fpos"><span class="ffrom">' + escapeCmt(p.vantage || '') + ':</span> ' + escapeCmt(p.pos || '') + '</div>'; });
    return s + '</div>';
  });
  h += sec('novel', 'novel — new + checkable', f.novel,
    n => '<div class="fitem">' + escapeCmt(n.thing || '') + ' <span class="ffrom">' + escapeCmt(n.from || '') + '</span></div>');
  h += '</div>';
  h += '<details class="cmtraw"><summary>the three blind answers</summary>';
  (r.answers || []).forEach(a => {
    h += '<div class="cmtans"><div class="cmtv">' + escapeCmt(a.vantage) + '</div><div class="cmtatext">' + escapeCmt(a.text) + '</div></div>';
  });
  return h + '</details>';
}

async function runCommittee() {
  const q = $('#cmtq').value.trim();
  if (!q) { status('pose a question for the committee'); return; }
  const btn = $('#cmtrun'), out = $('#cmtout');
  btn.disabled = true; btn.textContent = 'running…';
  out.innerHTML = '<div class="cmtwait">three vantages answering blind, then forming triangulates… (a few good-model calls)</div>';
  status('the committee is convening…');
  try {
    out.innerHTML = renderCommittee(await invoke('committee_run', { question: q }));
    status('committee returned');
  } catch (e) {
    out.innerHTML = '<div class="cmtwait">committee failed: ' + escapeCmt(e) + '</div>';
    status('committee failed');
  }
  btn.disabled = false; btn.textContent = 'Run';
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
$('#cmtrun').onclick = runCommittee;
$('#cmtq').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runCommittee(); } });
$('#base').addEventListener('change', persist);
$('#flags').addEventListener('change', persist);

load();

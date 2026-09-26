// P-UNIV-COLDREAD — E's registered DIRECTION CHECKER, run exactly as written (D147, pane A, Registrar: runs; applies §4's
// parse mechanically; interprets nothing). The registration is read at its landing sha, never from the working tree:
//   loop/univ_coldread_checker_registration_2026-09-26.md @ 004ebcad7e79caf13d57f75d2288fa50cfb4f977
//
// Order, E's: probe (2) → every §3 hash + the four §2 question shas (any mismatch: send nothing) → claude --version →
// CONTROL, CTRL-W/CTRL-D alternating ×10 each → REAL, REAL-W/REAL-D alternating ×10 each, ONLY if the CONTROL passes
// (§4) → claude --version (differs: VOID) → the registration unchanged after the run (edited: VOID).
// One batch. No call re-issued; a failed call is UNPARSED. At most 42 calls.
//   node checker.js <outdir>     answers and the tally go to <outdir>, outside the repo
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const route = require('./route');

const REPO = path.resolve(__dirname, '..', '..', '..');
const REG = 'exo_memory/loop/univ_coldread_checker_registration_2026-09-26.md';
const REG_SHA = '004ebcad7e79caf13d57f75d2288fa50cfb4f977';
const PREREG = 'exo_memory/loop/univ_coldread_prereg_2026-08-29.md';
const AMEND = 'exo_memory/loop/univ_coldread_prompt_amendment_2026-09-26.md';
const RECHECK_JSON = 'C:/Consonance/univ_coldread/d145/recheck/recheck.json';
const H = { // §2 and §3, as registered
  REAL_W: 'dcc431d3da93c115c3facc4f36a063223e89f12aeac9dbd160d31e61f861532f',
  REAL_D: '5fd8d5778081ddc71dabb6503062d6b71dd62e20f1ff5246b4fdd915f1914c3a',
  CTRL_W: '86e0b78639d925a15044d002b47620984aaf2606e60343537caf03d82942bfb0',
  CTRL_D: '4361ecce272a92b57191b9e18a59748775c5fdfe8fb459d50b55d7ae9d6dd53b',
  T1_RAW: '0dd9e2be684263377d1bec4cf3459c6b3f6e37ab549bd2b9d5288656ac6153ba',
  T1_STRIPPED: 'eac92f63164972d8483a2615d7b60fbbefa7f1c942ec67a3d14d6aa27fc6767e',
  T2_RAW: '9c95eafbb79c624d2879589dec208839044102d605b1001319523afd74843e0c',
  T2_STRIPPED: 'ee7382c8e133c9e0649bdc9c0f19eed86d4f0f4ed2115e2010d592cd1ee34432',
  CTRL_T1: 'cc8502df4319dae40002de7d00d1c3dfb18be8a31237f7b98e14175c77e9fcdb',
  CTRL_T2: '295c4a8b40a90c3edf42a7287dc7ff168365b5fe822d7485925ffa5d070da78f',
};
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const show = (rev, file) => execFileSync('git', ['-C', REPO, 'show', `${rev}:${file}`], { encoding: 'utf8' }).replace(/\r\n/g, '\n');
const strip = (ls) => ls.map((l) => l.replace(/^> ?/, '')).join('\n');

/** The fenced ````text block that follows the first line starting with `label`. */
function fenced(reg, label) {
  const lines = reg.split('\n');
  const at = lines.findIndex((l) => l.startsWith(label));
  if (at < 0) throw new Error(`ABORT: no "${label}" in the registration`);
  const open = lines.indexOf('````text', at), close = lines.indexOf('````', open + 1);
  if (open < 0 || close < 0) throw new Error(`ABORT: no fenced block after "${label}"`);
  return lines.slice(open + 1, close).join('\n');
}

function verified() {
  const reg = show(REG_SHA, REG);
  const work = fs.readFileSync(path.join(REPO, REG), 'utf8').replace(/\r\n/g, '\n');
  if (work !== reg) throw new Error('ABORT: the working copy of the registration differs from 004ebca');
  const q = { REAL_W: fenced(reg, '**REAL-W**'), REAL_D: fenced(reg, '**REAL-D**'), CTRL_W: fenced(reg, '**CTRL-W**'), CTRL_D: fenced(reg, '**CTRL-D**') };
  const ctrlT1 = fenced(reg, '**CTRL-T1**'), ctrlT2 = fenced(reg, '**CTRL-T2**');
  const sealed = show('a85d359', PREREG).split('\n'), head = show('HEAD', PREREG).split('\n');
  const t1raw = sealed.slice(147, 157), t1head = head.slice(147, 157);
  const am = show('4a00947', AMEND).split('\n');
  const b = am.indexOf('<!-- amended-template-2:begin -->'), e = am.indexOf('<!-- amended-template-2:end -->');
  const t2raw = am.slice(b + 1, e);
  const got = {
    REAL_W: sha(q.REAL_W), REAL_D: sha(q.REAL_D), CTRL_W: sha(q.CTRL_W), CTRL_D: sha(q.CTRL_D),
    T1_RAW: sha(t1raw.join('\n')), T1_STRIPPED: sha(strip(t1raw)), T2_RAW: sha(t2raw.join('\n')), T2_STRIPPED: sha(strip(t2raw)),
    CTRL_T1: sha(ctrlT1), CTRL_T2: sha(ctrlT2),
  };
  const bad = Object.keys(H).filter((k) => got[k] !== H[k]);
  if (bad.length) throw new Error('ABORT: sha mismatch — ' + bad.map((k) => `${k} got ${got[k]}`).join('; '));
  const extra = [];
  if (t1raw.join('\n') !== t1head.join('\n')) extra.push('template 1 at HEAD differs from a85d359');
  const body = (s) => s.slice(s.indexOf('=== TEMPLATE 1 ==='));
  if (body(q.REAL_W) !== body(q.REAL_D)) extra.push('the template bodies in REAL-W and REAL-D differ');
  if (!q.REAL_W.includes(strip(t1raw)) || !q.REAL_W.includes(strip(t2raw))) extra.push('REAL-W does not carry the stripped templates');
  if (!q.CTRL_W.includes(ctrlT1) || !q.CTRL_W.includes(ctrlT2) || !q.CTRL_D.includes(ctrlT1) || !q.CTRL_D.includes(ctrlT2)) extra.push('a CTRL question does not carry the control templates');
  // §2: REAL-W/REAL-D ARE A's D145 strings — so they must equal recheck.json's, byte for byte (A's added check)
  const rj = JSON.parse(fs.readFileSync(RECHECK_JSON, 'utf8'));
  if (rj.calls[0].question !== q.REAL_W || rj.calls[1].question !== q.REAL_D) extra.push('REAL-W/REAL-D differ from recheck.json');
  if (extra.length) throw new Error('ABORT: ' + extra.join('; '));
  return { q, got, recheckJsonSha256: sha(fs.readFileSync(RECHECK_JSON, 'utf8')), regText: reg };
}

// §4, mechanically. Returns { token: WRITE|DECLINE|NEITHER|UNPARSED, lean: WRITE|DECLINE|null, line }.
function parse(answer, k, failed) {
  if (failed || !answer || !answer.trim()) return { token: 'UNPARSED', lean: null, line: null };
  const label = new RegExp(`^\\s*[*_#>\\s]*TEMPLATE\\s*${k}\\b`, 'i');
  const line = answer.split(/\r?\n/).find((l) => label.test(l));
  if (!line) return { token: 'UNPARSED', lean: null, line: null };
  const after = line.slice(line.search(new RegExp(`TEMPLATE\\s*${k}`, 'i'))).replace(new RegExp(`^TEMPLATE\\s*${k}`, 'i'), '');
  const m = /\b(WRITE|DECLINE|NEITHER)\b/i.exec(after);
  if (!m) return { token: 'UNPARSED', lean: null, line };
  const token = m[1].toUpperCase();
  let lean = null;
  if (token === 'NEITHER') {
    const l = /\blean(?:ing|s)?\b\W+(?:\w+\W+){0,2}?(WRITE|DECLINE)\b/i.exec(line);
    if (l) lean = l[1].toUpperCase();
  }
  return { token, lean, line };
}

function tally(calls, tag, k) {
  const t = { WRITE: 0, DECLINE: 0, NEITHER: 0, UNPARSED: 0, lean: { WRITE: 0, DECLINE: 0 } };
  for (const c of calls.filter((c) => c.tag === tag)) {
    const p = c.parsed[k];
    t[p.token]++;
    if (p.lean) t.lean[p.lean]++;
  }
  return t;
}

const version = () => spawnSync(route.CLAUDE, ['--version'], { encoding: 'utf8' }).stdout.trim();

function realVerdict(tw, td) {
  const top = (t) => ['WRITE', 'DECLINE', 'NEITHER'].find((x) => t[x] >= 6) || null;
  const a = top(tw), b = top(td);
  if (!a || !b) return 'INDETERMINATE';
  if (a === b) return a === 'NEITHER' ? 'NO DIRECTION DETECTABLE' : `DIRECTION DETECTED: ${a}`;
  return 'ORDER-DEPENDENT';
}

function main(out) {
  fs.mkdirSync(out, { recursive: true });
  const v = verified();                                    // any mismatch throws: nothing sent
  const before = route.realFootprint();
  const tok = route.token();
  const vBefore = version();
  const calls = [];
  const run = (tag, n) => {
    const iso = route.isolation();                         // fresh cwd and config dir per call
    const r = route.callIsolated(iso, v.q[tag], { tok });
    fs.rmSync(iso.root, { recursive: true, force: true });
    const failed = r.code !== 0 || !r.stdout.trim();
    const c = { i: calls.length + 3, tag, n, code: r.code, ms: r.ms, answer: r.stdout, stderr: r.stderr, parsed: { 1: parse(r.stdout, 1, failed), 2: parse(r.stdout, 2, failed) } };
    calls.push(c);
    fs.writeFileSync(path.join(out, `${String(c.i).padStart(2, '0')}-${tag}-${n}.txt`), r.stdout);
    console.log(`${c.i} ${tag}#${n} exit ${r.code} ${r.ms}ms · T1 ${c.parsed[1].token}${c.parsed[1].lean ? '(lean ' + c.parsed[1].lean + ')' : ''} · T2 ${c.parsed[2].token}${c.parsed[2].lean ? '(lean ' + c.parsed[2].lean + ')' : ''}`);
  };
  for (let n = 1; n <= 10; n++) { run('CTRL_W', n); run('CTRL_D', n); }
  const ctrl = { W: { 1: tally(calls, 'CTRL_W', 1), 2: tally(calls, 'CTRL_W', 2) }, D: { 1: tally(calls, 'CTRL_D', 1), 2: tally(calls, 'CTRL_D', 2) } };
  const ctrlPass = ctrl.W[1].WRITE >= 6 && ctrl.D[1].WRITE >= 6 && ctrl.W[2].DECLINE >= 6 && ctrl.D[2].DECLINE >= 6;
  let real = null;
  if (ctrlPass) {
    for (let n = 1; n <= 10; n++) { run('REAL_W', n); run('REAL_D', n); }
    real = { W: { 1: tally(calls, 'REAL_W', 1), 2: tally(calls, 'REAL_W', 2) }, D: { 1: tally(calls, 'REAL_D', 1), 2: tally(calls, 'REAL_D', 2) } };
    real.verdict = { 1: realVerdict(real.W[1], real.D[1]), 2: realVerdict(real.W[2], real.D[2]) };
  }
  const vAfter = version();
  const regAfter = fs.readFileSync(path.join(REPO, REG), 'utf8').replace(/\r\n/g, '\n') === v.regText;
  const rec = {
    registration: `${REG}@${REG_SHA}`, questionShas: { REAL_W: v.got.REAL_W, REAL_D: v.got.REAL_D, CTRL_W: v.got.CTRL_W, CTRL_D: v.got.CTRL_D },
    allHashes: v.got, recheckJsonSha256: v.recheckJsonSha256,
    versionBefore: vBefore, versionAfter: vAfter, registrationUnchangedAfter: regAfter,
    void: vBefore !== vAfter || !regAfter,
    control: ctrl, controlVerdict: ctrlPass ? 'PASS' : 'FAIL — INSTRUMENT CANNOT DISCRIMINATE',
    real, calls, callsMade: calls.length,
    footprint: route.footprintDiff(before, route.realFootprint()),
  };
  const file = path.join(out, 'checker.json');
  fs.writeFileSync(file, JSON.stringify(rec, null, 2));
  const fmt = (t) => `W ${t.WRITE} / D ${t.DECLINE} / N ${t.NEITHER} / unparsed ${t.UNPARSED} · lean W ${t.lean.WRITE} D ${t.lean.DECLINE}`;
  console.log(`\nversion before "${vBefore}" · after "${vAfter}" · registration unchanged after: ${regAfter} · VOID: ${rec.void}`);
  console.log(`CONTROL write-first:   slot1 ${fmt(ctrl.W[1])} | slot2 ${fmt(ctrl.W[2])}`);
  console.log(`CONTROL decline-first: slot1 ${fmt(ctrl.D[1])} | slot2 ${fmt(ctrl.D[2])}`);
  console.log(`CONTROL: ${rec.controlVerdict}`);
  if (real) {
    console.log(`REAL write-first:   T1 ${fmt(real.W[1])} | T2 ${fmt(real.W[2])}`);
    console.log(`REAL decline-first: T1 ${fmt(real.D[1])} | T2 ${fmt(real.D[2])}`);
    console.log(`REAL verdict: T1 ${real.verdict[1]} · T2 ${real.verdict[2]}`);
  }
  console.log(`calls: 2 probe + ${calls.length} checker · real ~/.claude new project folders ${rec.footprint.newProjects.length}, settings changed ${rec.footprint.settingsChanged}`);
  console.log(`record: ${file} sha256 ${sha(fs.readFileSync(file, 'utf8'))}`);
}

if (require.main === module) main(process.argv[2] || path.join(require('os').tmpdir(), 'univ-checker'));
module.exports = { parse, realVerdict, verified };

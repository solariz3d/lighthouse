#!/usr/bin/env node
// identity-diff.js — "identical except the one modification", made mechanical (D273, pane C; the keeper, 17:16: "keep looping till you
// are sure it is you identical with the slight modification for the it being a new user").
//
//   node consonance/tools/identity-diff.js --generate            # generate a fresh consumer tree from this repo, then diff it
//   node consonance/tools/identity-diff.js --gen <dir> [--json]  # diff an already generated tree against this repo
//   exit 0 = every difference is registered · 1 = at least one unregistered difference (listed, path:line) · 2 = could not run
//
// WHAT IS COMPARED. The wake material a consumer seat reads: BOOT and SEED, the briefs, every card, record/, spread/, research/,
// memory/, SOURCE.md, TRAINING.md, GATES.md, and the hooks (every non-test hook file, whose message texts are what a seat sees). A
// seat's CLAUDE.md is not a file in the tree; the app assembles it at wake from exactly these files (main.rs assemble_intake_within).
//
// HOW A DIFFERENCE IS REGISTERED — READ FROM THE GENERATOR, NOT COPIED. For every wake file the generator ships, this tool takes its
// dev SOURCE (the MANIFEST's `from`, via gen-consumer's own collect()) and REPLAYS the generator's own exported steps on it, one named
// step at a time, in build()'s order: transform (dedangle, deidentify, demachine, decoordinate; or its fixture/config branch),
// desync, reindex, dewiki, reseed, declareWorkshop, and FORK_HOOK (C's keeper relabel and the fork note). Then:
//   - the generated file must EQUAL the replay. Any line where it does not is UNREGISTERED: something changed it that no named step
//     accounts for (a hand edit, a step missing from this replay, a step whose order changed);
//   - every line where the generated file differs from its dev source is ATTRIBUTED to the named step that made it, and listed.
// A dev wake file that does not ship must be in gen-consumer's EXCLUDE (or STAYS_PRIVATE) with its reason; a wake file in the
// generated tree that no MANIFEST rule produced is unregistered.
//
// WHAT IT DOES NOT PROVE, said so it is not read generously:
//   - that each named step's OWN edits are right. A step that over-reaches (A's catch: the muscle_map rule rewrote a code regex in
//     corrections-gate.js) is reproduced by the replay and passes here as that step's work. The report lists every attributed line by
//     step so it can be read; each step's correctness is its own tests' job.
//   - the master -> brief stage. A dev seat reads the MASTER exo_memory/BOOT.md; the consumer's is the brief gen-brief.ps1 makes from it
//     (PowerShell, inline replacements, not importable). That stage is REPORTED with its line count and not gated here; gen-brief-gate
//     guards it on the dev side.
//   - shippedMemory / shippedCards are recomputed here with build()'s exact expressions (they are local to build(), not exported). If
//     build() changes them, MEMORY.md and the dewiki'd cards come back unregistered: loud, not silent.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const WAKE = [
  /^exo_memory\/(BOOT|SEED|SOURCE|TRAINING)\.md$/,
  /^consonance\/src-tauri\/brief\/[^/]+\.md$/,
  /^exo_memory\/(cards|record|spread|research|memory)\/[^/]+\.md$/,
  /^consonance\/GATES\.md$/,
  /^consonance\/hooks\/[^/]+\.js$/,
  /^dev\/shell\/hooks\/[^/]+\.(js|py)$/,
];
// Not read by a seat: tests and mutant harnesses; and the brief FRAGMENTS (frag-*.md), which are templates the generators inject into
// BOOT and SEED (gen-brief.ps1's frag-traces/frag-pointer, consumer-relabel's frag-fork), so their content is compared where it lands.
// (The first real run, 2026-10-08, listed the three fragments as unregistered: the scope was too broad, not the generator wrong.)
const NOT_WAKE = /\.(test|mutants)\.js$|\.test\.py$|^consonance\/src-tauri\/brief\/frag-[^/]+\.md$/;
const isWake = (rel) => WAKE.some((re) => re.test(rel)) && !NOT_WAKE.test(rel);
const nl = (t) => String(t).replace(/\r\n/g, '\n');

/** Line diff (LCS after trimming the common head and tail). Returns ops: '=' kept, '-' only in a (aLine), '+' only in b (bLine). 1-based. */
function lineDiff(aText, bText) {
  const a = nl(aText).split('\n'), b = nl(bText).split('\n');
  let s = 0; while (s < a.length && s < b.length && a[s] === b[s]) s++;
  let ea = a.length, eb = b.length; while (ea > s && eb > s && a[ea - 1] === b[eb - 1]) { ea--; eb--; }
  const A = a.slice(s, ea), B = b.slice(s, eb), n = A.length, m = B.length, ops = [];
  if (n * m > 25e6) throw new Error(`lineDiff: ${n} x ${m} lines changed is too large to diff`);
  const L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { i++; j++; }
    else if (j < m && (i === n || L[i][j + 1] >= L[i + 1][j])) { ops.push({ op: '+', bLine: s + j + 1, text: B[j] }); j++; }
    else { ops.push({ op: '-', aLine: s + i + 1, text: A[i] }); i++; }
  }
  return ops;
}

/** The generator's per-file steps, in build()'s order, each named. `ctx` = { G, shippedMemory, shippedCards }. */
function replay(rel, kind, source, ctx) {
  const { G } = ctx, stages = [{ step: 'source', text: source }];
  const push = (step, text) => { stages.push({ step, text }); return text; };
  const t = G.transform(source, kind);
  // name transform's own sub-steps where its composition is the documented one; otherwise attribute to 'transform' as a whole
  const sub = [];
  if (kind !== 'config' && kind !== 'fixture') {
    let x = source;
    for (const [name, fn] of [['dedangle', G.dedangle], ['deidentify', G.deidentify], ['demachine', G.demachine], ['decoordinate', G.decoordinate]]) {
      if (typeof fn !== 'function') { sub.length = 0; break; }
      x = fn(x).body; sub.push({ step: name, text: x });
    }
  }
  if (sub.length && sub[sub.length - 1].text === t.body) stages.push(...sub); else push('transform', t.body);
  let body = t.body;
  body = push('desync', G.desync(body, rel, kind).body);
  body = push('reindex', G.reindex(body, rel, ctx.shippedMemory).body);
  body = push('dewiki', G.dewiki(body, rel, ctx.shippedCards).body);
  body = push('reseed', G.reseed(body, rel).body);
  body = push('declareWorkshop', G.declareWorkshop(body, rel).body);
  if (G.FORK_HOOK && G.FORK_HOOK.apply) body = push('fork (consumer-relabel.js)', G.FORK_HOOK.apply(body, rel, kind).body);
  return stages;
}

/** One file. PURE over its inputs. Returns { rel, from, registered: [{ step, op, line, text }], unregistered: [{ op, line, text, why }] }. */
function diffFile({ rel, from, kind, source, actual, ctx }) {
  const stages = replay(rel, kind, source, ctx), final = stages[stages.length - 1].text;
  const out = { rel, from, registered: [], unregistered: [] };
  if (nl(final) !== nl(actual)) {
    for (const o of lineDiff(final, actual)) out.unregistered.push({ op: o.op, line: o.op === '+' ? o.bLine : o.aLine, text: o.text,
      why: o.op === '+' ? 'in the generated file, and no generator step makes it' : 'the generator\'s steps make this line, and the generated file does not have it' });
    return out;
  }
  // attribute every source -> generated difference to the step that made it
  const perStep = stages.slice(1).map((s, k) => ({ step: s.step, ops: lineDiff(stages[k].text, s.text) }));
  for (const o of lineDiff(source, actual)) {
    const by = perStep.find((p) => p.ops.some((q) => q.op === o.op && q.text === o.text));
    if (by) out.registered.push({ step: by.step, op: o.op, line: o.op === '+' ? o.bLine : o.aLine, text: o.text });
    else out.unregistered.push({ op: o.op, line: o.op === '+' ? o.bLine : o.aLine, text: o.text, why: 'differs from its dev source, and no single step made this line' });
  }
  return out;
}

function walk(root, rel = '') {
  const out = [];
  let ents; try { ents = fs.readdirSync(path.join(root, rel), { withFileTypes: true }); } catch (_) { return out; }
  for (const e of ents) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === 'target') continue;
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) out.push(...walk(root, r)); else out.push(r);
  }
  return out;
}

/** The whole comparison. Returns { ok, files, unregistered, registered, absent, master, generatedFrom, head }. */
function run({ gen, repo = REPO, G = require('./gen-consumer.js') }) {
  const files = G.collect(), EXCLUDE = G.EXCLUDE || {}, SEEDED = G.SEEDED || {}, STAYS = G.STAYS_PRIVATE || {};
  const shippedMemory = new Set(files.filter((f) => f.to.startsWith('exo_memory/memory/') && !EXCLUDE[f.from]).map((f) => f.to.slice('exo_memory/memory/'.length)));
  const shippedCards = new Set(files.filter((f) => /^exo_memory\/(cards|memory)\/.+\.md$/.test(f.to) && !EXCLUDE[f.from]).map((f) => path.basename(f.to, '.md')));
  const ctx = { G, shippedMemory, shippedCards };
  const byTo = new Map(files.map((f) => [f.to, f]));
  const result = { ok: true, files: 0, unregistered: [], registered: {}, absent: [], master: null, generatedFrom: null, head: null };
  try { result.generatedFrom = (fs.readFileSync(path.join(gen, 'CONSUMER-STATUS.md'), 'utf8').match(/GENERATED-FROM:\s*([0-9a-f]{7,40})/) || [])[1] || null; } catch (_) { /* reported as unknown */ }
  try { result.head = require('child_process').execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch (_) { /* no git */ }

  const genWake = walk(gen).filter(isWake);
  for (const rel of genWake) {
    const f = byTo.get(rel);
    if (!f) { result.unregistered.push({ rel, op: '+', line: 0, text: '(the whole file)', why: 'a wake file in the generated tree that no MANIFEST rule produces' }); continue; }
    if (EXCLUDE[f.from]) { result.unregistered.push({ rel, op: '+', line: 0, text: '(the whole file)', why: 'shipped although EXCLUDE names it: ' + EXCLUDE[f.from] }); continue; }
    if (SEEDED[f.from]) { (result.registered.seeded = result.registered.seeded || []).push({ rel, line: 0, text: '(seeded whole: the private bytes do not travel)' }); continue; }
    if (f.kind === 'binary' || f.kind === 'screen') continue;   // not text a seat reads; the screens are A's scrubbed fixtures, scanned by the generator
    const kind = G.isFixture(f.to) ? 'fixture' : f.kind;
    const d = diffFile({ rel, from: f.from, kind, source: fs.readFileSync(path.join(repo, f.from), 'utf8'), actual: fs.readFileSync(path.join(gen, rel), 'utf8'), ctx });
    result.files++;
    for (const u of d.unregistered) result.unregistered.push({ rel, ...u });
    for (const r of d.registered) (result.registered[r.step] = result.registered[r.step] || []).push({ rel, ...r });
  }
  // dev wake files the generated tree does not carry: each must be EXCLUDED or STAYS_PRIVATE, with its reason
  const genSet = new Set(genWake), fromSet = new Map(files.map((f) => [f.from, f]));
  for (const rel of walk(repo).filter(isWake)) {
    if (genSet.has(rel)) continue;
    const f = fromSet.get(rel);
    const why = (f && EXCLUDE[f.from]) || STAYS[rel] || STAYS[path.basename(rel)] || STAYS[rel.split('/').slice(-2, -1)[0]];
    if (why) result.absent.push({ rel, why: (f && EXCLUDE[f.from] ? 'EXCLUDE: ' : 'STAYS_PRIVATE: ') + why });
    else if (f) result.unregistered.push({ rel, op: '-', line: 0, text: '(the whole file)', why: 'a MANIFEST rule reaches this dev wake file and the generated tree does not have it' });
    else result.unregistered.push({ rel, op: '-', line: 0, text: '(the whole file)', why: 'a dev wake file no MANIFEST rule ships and neither EXCLUDE nor STAYS_PRIVATE names' });
  }
  // the master -> brief stage, reported, not gated (see the header)
  try {
    const master = fs.readFileSync(path.join(repo, 'exo_memory', 'BOOT.md'), 'utf8'), brief = fs.readFileSync(path.join(repo, 'consonance', 'src-tauri', 'brief', 'BOOT.md'), 'utf8');
    const ops = lineDiff(master, brief);
    result.master = { removed: ops.filter((o) => o.op === '-').length, added: ops.filter((o) => o.op === '+').length, by: 'gen-brief.ps1 (dev side; guarded by gen-brief-gate.test.js)' };
  } catch (_) { /* no master: a consumer repo */ }
  result.ok = result.unregistered.length === 0;
  return result;
}

function report(r) {
  const L = [];
  L.push(`identity-diff: ${r.ok ? 'PASS' : 'FAIL'} — ${r.files} wake files compared; ${r.unregistered.length} unregistered difference(s)`);
  L.push(`  generated from ${r.generatedFrom || 'unknown'}; this repo at ${r.head ? r.head.slice(0, 8) : 'unknown'}${r.generatedFrom && r.head && !r.head.startsWith(r.generatedFrom) ? '  (DIFFERENT COMMITS: regenerate)' : ''}`);
  L.push('  registered, by step:');
  for (const [step, xs] of Object.entries(r.registered).sort()) L.push(`    ${step.padEnd(28)} ${String(xs.length).padStart(5)} line(s) in ${new Set(xs.map((x) => x.rel)).size} file(s)`);
  if (r.absent.length) { L.push(`  not shipped, with the generator's reason (${r.absent.length}):`); for (const a of r.absent) L.push(`    ${a.rel} — ${a.why.slice(0, 140)}`); }
  if (r.master) L.push(`  master BOOT -> shipped brief: ${r.master.removed} line(s) out, ${r.master.added} in, by ${r.master.by}; reported, not gated`);
  if (r.unregistered.length) { L.push('  UNREGISTERED:'); for (const u of r.unregistered) L.push(`    ${u.rel}:${u.line} ${u.op} ${String(u.text).slice(0, 110)}  [${u.why}]`); }
  return L.join('\n');
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2), json = args.includes('--json');
    let gen = args.includes('--gen') ? args[args.indexOf('--gen') + 1] : null, made = null;
    if (!gen && args.includes('--generate')) {
      made = fs.mkdtempSync(path.join(os.tmpdir(), 'identity-diff-'));
      const b = require('./gen-consumer.js').build(made, { allowDirty: true });
      if (b.refused) { console.error('identity-diff: the generator refused: ' + b.refused); process.exit(2); }
      gen = made;
    }
    if (!gen) { console.error('usage: identity-diff.js --generate | --gen <dir> [--json]'); process.exit(2); }
    const r = run({ gen: path.resolve(gen) });
    console.log(json ? JSON.stringify(r, null, 1) : report(r));
    if (made) fs.rmSync(made, { recursive: true, force: true });
    process.exit(r.ok ? 0 : 1);
  } catch (e) { console.error('identity-diff: could not run: ' + (e && e.stack || e)); process.exit(2); }
}

module.exports = { run, report, diffFile, replay, lineDiff, isWake, WAKE };

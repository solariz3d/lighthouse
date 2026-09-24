#!/usr/bin/env node
'use strict';
// union_dryrun_D — D132 (pane B). The union-at-launch path, replayed per file against a TEMP COPY of D's ledgers, with the
// arriving state set read in place (read-only). Nothing in the live data dir or the state dir is written.
//
//   node exo_memory/loop/union_dryrun_D_2026-09-24.js
//
// WHAT IT RUNS, in the launch's own order (state-sync.js installTree, PHASE 0-3) and with the launch's own functions:
//   0  the pre-scan: appendOnlyCompare(local, arriving) — the stop-before-write test that refuses today;
//   1  per refused file: eligibility (a ledger-union spec), timeParseRefusal, then LU.writeUnion on the TEMP data dir, with
//      the real state dir as its read-only source and `lock: null`, `settleMs: 0` and receipts in the temp dir;
//   2  phase2(local-after, arriving) and unionVerdict(r, j) — the verdict the launch acts on;
//   3  the launch's own rule: ANY file still refused means NOTHING of the set is installed.
// And one check of its own, in writeUnion step 7's unit (complete lines, as a multiset): every line of the pre-union copy
// is still present at least as many times after the union. That is the "0 lost" the packet asks for, measured, not
// trusted from `verified`.
//
// THE COPY: each manifest `install: "fast-forward"` ledger (the same list the snapshot and the launch read), plus the same
// file inside every attic/pre-sync-* dir — writeUnion's `sources()` reads those too, so leaving them out would dry-run a
// different union from the one the launch runs. The live files are being appended to while this copies; each copy is
// taken as bytes at one instant and its complete-line count is printed, so the copy is a named point in time.
//
// BOARD TEXT IS NEVER PRINTED: a COUNT-SHORT key is shown as the sha256 of its canonical row, with its two counts.
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const REPO = path.resolve(__dirname, '..', '..');
// ORDER MATTERS: state-sync.js and ledger-union.js require each other. The launch runs state-sync as the entry point, so
// state-sync loads FIRST and its `LU` is complete. Requiring ledger-union first instead leaves state-sync's `LU` as the
// half-built `{}` for good (the first run of this script died on `LU.parseJsonl is not a function`), so this mirrors
// the launch: state-sync first. ledger-union's own `declaredStateDir` is then undefined, exactly as in the launch, which
// is why every writeUnion call below passes `stateDir` explicitly, as the launch does.
const SS = require(path.join(REPO, 'consonance', 'tools', 'state-sync.js'));
const LU = require(path.join(REPO, 'consonance', 'tools', 'ledger-union.js'));

const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, ''));
const DATA = process.env.CONSONANCE_DATA || cfg.data_dir;
const STATE = process.env.CONSONANCE_STATE || cfg.state_dir;
const h = (s) => crypto.createHash('sha256').update(s).digest('hex');

function ledgers() {
  const m = JSON.parse(fs.readFileSync(path.join(REPO, 'consonance', 'state-manifest.json'), 'utf8'));
  const out = [];
  const walk = (o) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (o.install === 'fast-forward' && o.glob) out.push(o.glob); Object.values(o).forEach(walk); } };
  walk(m);
  return [...new Set(out)];
}

function copyFile(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const buf = fs.readFileSync(src);             // one read = one instant; the complete-line count names it
  fs.writeFileSync(dst, buf);
  return LU.completeLines(buf, 0).lines.length;
}

function multisetShort(beforeLines, afterLines) {
  const have = new Map();
  for (const l of afterLines) have.set(l, (have.get(l) || 0) + 1);
  const need = new Map();
  for (const l of beforeLines) need.set(l, (need.get(l) || 0) + 1);
  let short = 0;
  for (const [l, n] of need) if ((have.get(l) || 0) < n) short += n - (have.get(l) || 0);
  return short;
}

const T = fs.mkdtempSync(path.join(os.tmpdir(), 'd132-union-dryrun-'));
const TD = path.join(T, 'data');
const RECEIPTS = path.join(T, 'union_receipts.jsonl');
const stateHead = (() => { try { return require('child_process').execFileSync('git', ['-C', STATE, 'log', '-1', '--format=%h'], { encoding: 'utf8' }).trim(); } catch (_) { return null; } })();
console.log(`DRY RUN · ${new Date().toISOString()} · live ${DATA} (COPIED, never written) · arriving ${STATE} @ ${stateHead} (read only) · temp ${T}`);

const attics = fs.existsSync(path.join(DATA, 'attic'))
  ? fs.readdirSync(path.join(DATA, 'attic')).filter((d) => d.startsWith('pre-sync-')).sort() : [];
console.log(`attic pre-sync copies read by the union: ${attics.length ? attics.join(', ') : 'none'}\n`);

const results = [];
for (const g of ledgers()) {
  const spec = LU.fileSpec(g);
  const livePath = path.join(DATA, g);
  const arrPath = path.join(STATE, 'data', g);
  const row = { file: g };
  results.push(row);
  if (!fs.existsSync(livePath)) { row.verdict = 'no live file'; continue; }
  row.copied_lines = copyFile(livePath, path.join(TD, g));
  row.copied_at = new Date().toISOString();
  for (const a of attics) { const p = path.join(DATA, 'attic', a, g); if (fs.existsSync(p)) copyFile(p, path.join(TD, 'attic', a, g)); }
  if (!fs.existsSync(arrPath)) { row.verdict = 'no arriving copy — nothing to install or union'; continue; }
  const curBuf = fs.readFileSync(path.join(TD, g));
  const arrBuf = fs.readFileSync(arrPath);
  const arrText = arrBuf.toString('utf8');
  row.arriving_lines = LU.completeLines(arrBuf, 0).lines.length;

  // PHASE 0 — the pre-scan.
  if (curBuf.equals(arrBuf)) { row.prescan = 'IDENTICAL'; row.verdict = 'not refused (identical): nothing to do'; continue; }
  const c = SS.appendOnlyCompare(curBuf, arrBuf);
  if (c.ff) { row.prescan = 'FAST-FORWARD'; row.verdict = 'not refused: the arriving copy extends this one and would be installed'; continue; }
  row.prescan = c.kind;
  row.prescan_local_only = c.localOnly.length;
  row.prescan_incoming_only = c.incomingOnly;

  // PHASE 1 — eligibility, time, the union (on the TEMP copy).
  if (!spec) { row.verdict = 'REFUSED (eligibility): ledger-union has no spec'; continue; }
  const tbad = SS.timeParseRefusal(curBuf.toString('utf8'), arrText, spec.time);
  if (tbad) { row.verdict = `REFUSED (time): ${tbad}`; continue; }
  const beforeLines = LU.completeLines(curBuf, 0).lines;
  let r;
  try {
    r = LU.writeUnion({ dataDir: TD, name: spec.name, time: spec.time, stateDir: STATE, trigger: 'dry-run', stateHead,
      receiptsPath: RECEIPTS, lock: null, settleMs: 0, machine: 'D (dry run)' });
  } catch (e) { row.verdict = `REFUSED (union threw): ${e.message}`; continue; }
  const afterText = fs.readFileSync(path.join(TD, g), 'utf8');
  const afterLines = LU.completeLines(Buffer.from(afterText), 0).lines;

  // Where the added rows came from: the arriving (state) copy, or only an attic copy.
  const stateKeys = new Set(LU.parseJsonl(arrText).rows.map((x) => x.key));
  const addedKeys = LU.parseJsonl(afterText).rows.map((x) => x.key);
  const beforeKeys = new Set(LU.parseJsonl(beforeLines.map((l) => `${l}\n`).join('')).rows.map((x) => x.key));
  const newKeys = [...new Set(addedKeys.filter((k) => !beforeKeys.has(k)))];
  row.added_distinct_rows = r.added;
  row.added_from_arriving = newKeys.filter((k) => stateKeys.has(k)).length;
  row.added_from_attic_only = newKeys.filter((k) => !stateKeys.has(k)).length;
  row.lines_before = beforeLines.length;
  row.lines_after = afterLines.length;
  row.multiset_lost = multisetShort(beforeLines, afterLines);      // step 7's unit, re-derived here
  row.writeUnion_verified = r.verified;
  row.writeUnion_missing_lines = r.missingLines;
  row.writeUnion_missing_rows = r.missingRows;

  // PHASE 2 — the launch's re-judge, and its verdict.
  const j = r.verified ? SS.phase2(afterText, arrText, spec.time) : { ok: false };
  const v = SS.unionVerdict(r, j);
  row.phase2 = j.ok ? 'ok' : `${j.kind || 'not run (verify failed)'}`;
  if (!j.ok && j.kind === 'COUNT-SHORT') {
    // Every key short, not just the first the launch reports: the whole size of the deficit.
    const lc = SS.countsByKey(LU.parseJsonl(afterText).rows);
    const ac = SS.countsByKey(LU.parseJsonl(arrText).rows);
    const shortKeys = [];
    for (const [k, need] of ac) { const have = lc.get(k) || 0; if (have < need) shortKeys.push({ key_sha256: h(k).slice(0, 16), here: have, arriving: need }); }
    row.count_short_keys = shortKeys.length;
    row.count_short_copies = shortKeys.reduce((n, x) => n + (x.arriving - x.here), 0);
    row.count_short_shapes = shortKeys.reduce((m, x) => { const s = `${x.here}× here vs ${x.arriving}× arriving`; m[s] = (m[s] || 0) + 1; return m; }, {});
    row.count_short_examples = shortKeys.slice(0, 3);
  }
  if (!j.ok && j.kind === 'KEYLESS-ARRIVING') row.keyless_lines = j.lines.length;
  row.verdict = v.ok ? 'MERGED (INSTALLED-BY-UNION would be recorded)' : `REFUSED (${v.stage}${v.kind ? ' ' + v.kind : ''})`;
}

console.log('file'.padEnd(26) + 'pre-scan'.padEnd(13) + 'lines before→after'.padEnd(20) + '+rows(arr/attic)'.padEnd(18) + 'lost'.padEnd(6) + 'phase2'.padEnd(14) + 'verdict');
for (const r of results) {
  const la = r.lines_before != null ? `${r.lines_before}→${r.lines_after}` : '';
  const add = r.added_distinct_rows != null ? `+${r.added_distinct_rows} (${r.added_from_arriving}/${r.added_from_attic_only})` : '';
  console.log(r.file.padEnd(26) + String(r.prescan || '').padEnd(13) + la.padEnd(20) + add.padEnd(18) + String(r.multiset_lost ?? '').padEnd(6) + String(r.phase2 || '').padEnd(14) + r.verdict);
}
for (const r of results.filter((x) => x.count_short_keys)) {
  console.log(`\n${r.file}: COUNT-SHORT on ${r.count_short_keys} key(s), ${r.count_short_copies} copy(ies) short in all — shapes ${JSON.stringify(r.count_short_shapes)}`);
  for (const e of r.count_short_examples) console.log(`   e.g. key sha256 ${e.key_sha256}…  held ${e.here}× here, ${e.arriving}× in the arriving copy`);
}
const refusedNow = results.filter((r) => /^REFUSED/.test(r.verdict));
console.log(`\nLAUNCH VERDICT (the launch's own rule — any file still refused, nothing of the set installs): ${refusedNow.length ? `REFUSED — ${refusedNow.length} file(s): ${refusedNow.map((r) => r.file).join(', ')}` : 'every refused file merged; the rest install'}`);
const anyLost = results.some((r) => r.multiset_lost);
console.log(`MULTISET (step 7's unit) over every union run: ${anyLost ? 'LINES LOST — see the table' : '0 lines lost in every file'}`);
fs.writeFileSync(path.join(T, 'dryrun.json'), JSON.stringify({ at: new Date().toISOString(), stateHead, DATA, STATE, results }, null, 2));
console.log(`\nfull result: ${path.join(T, 'dryrun.json')}`);

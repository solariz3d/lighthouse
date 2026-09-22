#!/usr/bin/env node
/* ledger-union.js — union the live lap.jsonl / board.jsonl with every copy displaced into attic/pre-sync-*, AND with
 * the state set's copy (<state_dir>/data/<file>, L072).
 *
 * WHY IT EXISTS (L069 §2, L070). Every L launch that MIGRATEs installs the state set over the data dir, and an
 * append-only TRAVELS log is REPLACED rather than extended: the rows this machine wrote since the last publish move
 * into attic/pre-sync-<stamp>/ and leave the live file. Measured on L, 2026-09-21: 69 lap rows of 09-20 in one attic
 * copy, L058 alone in five generations. The keeper's ruling (06:34, via the librarian): UNION, NO RENAMING.
 *
 * THE SOURCES: the live file; the STATE SET'S copy, resolved exactly as state-sync.js resolves the state dir
 * (CONSONANCE_STATE, then ~/.consonance.json state_dir; undeclared, or declared and absent, REFUSES with exit 2); and
 * every attic/pre-sync-* copy. The state copy is there because under L070's stop-before-write a launch that meets a
 * DIVERGED ledger refuses and writes nothing — so on the other machine no attic copy of this machine's rows ever
 * exists, and the state set's copy is the only one (librarian 2026-09-22 03:1x). It is only ever READ.
 *
 * TWO MODES. The DRY RUN (default) reads every source, reports, and writes the PROPOSED union
 * to --out for a reader to inspect; it never writes the data dir and refuses an --out inside it. The WRITE
 * (`--write --file lap|board`, L071, see THE WRITE below) rewrites ONE named live file, keeps the original beside it
 * as `<file>.pre-union-<stamp>`, and never touches an attic copy.
 *
 * THE KEY IS THE WHOLE ROW. Two rows are the same row only if every field is equal (canonical JSON, keys sorted,
 * recursively). No field is privileged, so two generations of one lap id never collapse into each other — which is
 * what "no renaming" requires: they stay two rows with one id, exactly as the history wrote them. The narrower key
 * (lap, stage|chain, at) is computed alongside and reported, so a reader can see whether it would have collapsed
 * anything the whole-row key keeps apart.
 *
 * BOARD TEXT IS NEVER PRINTED. A board row is a person's words; an unparseable board line is reported by source,
 * line number and byte length only.
 *
 *   node consonance/tools/ledger-union.js --data <data dir> --out <scratch dir> [--file lap|board|both]   # dry run
 *   node consonance/tools/ledger-union.js --data <data dir> --write --file lap|board                      # the write
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// An unparseable line is identified by a HASH of its bytes, never by its text: a board line is a person's words.
const lineHash = (raw) => crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
// THE STATE SET'S COPY (L072) is resolved by state-sync.js's own stateDir() — CONSONANCE_STATE, then ~/.consonance.json
// state_dir, else it THROWS 'no state dir declared'. Imported, not copied: two copies of one route drift (law #2).
const { stateDir: declaredStateDir } = require('./state-sync.js');

/** The state dir to read, or a thrown refusal: undeclared (state-sync's words), or declared and absent. */
function resolveStateDir(explicit) {
  const dir = explicit || declaredStateDir();
  if (!fs.existsSync(dir)) {
    throw new Error(`the declared state dir ${dir} does not exist — reading nothing there would hide every row only the other machine's publish holds`);
  }
  return dir;
}

const FILES = {
  lap: { name: 'lap.jsonl', time: 'at', printInvalid: true },
  board: { name: 'board.jsonl', time: 'ts', printInvalid: false },
};

/** Canonical JSON: object keys sorted at every depth, so field order never decides identity. */
function canon(v) {
  if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`;
  }
  return JSON.stringify(v);
}

/** Split JSONL into parsed rows and unparseable lines, keeping line numbers. A trailing empty line is not a row. */
function parseJsonl(text) {
  const rows = [];
  const invalid = [];
  const lines = text.split(/\r?\n/);
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  lines.forEach((raw, i) => {
    if (raw.trim() === '') { invalid.push({ line: i + 1, bytes: Buffer.byteLength(raw), why: 'blank', hash: lineHash(raw) }); return; }
    try {
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error('not an object');
      rows.push({ obj, line: i + 1, key: canon(obj), bytes: Buffer.byteLength(raw) + 1, raw });
    } catch (e) {
      invalid.push({ line: i + 1, bytes: Buffer.byteLength(raw), why: String(e.message).slice(0, 60), hash: lineHash(raw) });
    }
  });
  return { rows, invalid, lines: lines.length };
}

const narrowKey = (o) => JSON.stringify([o.lap ?? null, o.stage ?? o.chain ?? null, o.at ?? null]);

/**
 * The union. `sources` is [{ tag, text, live }]; exactly one is live. Returns the proposed rows ordered by `time`
 * (then by canonical key, so the order is total and reproducible), and every count the report prints.
 */
function union(sources, time) {
  const liveSrc = sources.find((s) => s.live);
  if (!liveSrc) throw new Error('no live source');
  const liveParsed = parseJsonl(liveSrc.text);
  const liveKeys = new Set(liveParsed.rows.map((r) => r.key));
  // THE ONLY INVALID LINES THAT MATTER to a union are those the live file lacks: a line the live file also holds
  // cannot be hiding rows the live file is missing. Measured on L 2026-09-21: 257 fused lines, identical in all 22 copies.
  const liveInvalid = new Set(liveParsed.invalid.map((x) => x.hash));
  let invalidNotInLive = 0;
  const all = new Map();                 // key -> { obj, bytes, sources:Set }
  const perSource = [];
  let withinDup = 0;
  for (const s of sources) {
    const p = parseJsonl(s.text);
    const seen = new Set();
    let notInLive = 0;
    for (const r of p.rows) {
      if (seen.has(r.key)) withinDup++;
      seen.add(r.key);
      if (!liveKeys.has(r.key)) notInLive++;
      if (!all.has(r.key)) all.set(r.key, { obj: r.obj, key: r.key, bytes: r.bytes, raw: r.raw, sources: new Set() });
      all.get(r.key).sources.add(s.tag);
    }
    const invNotLive = s.live ? [] : p.invalid.filter((x) => !liveInvalid.has(x.hash));
    invalidNotInLive += invNotLive.length;
    perSource.push({ tag: s.tag, live: !!s.live, lines: p.lines, rows: p.rows.length, distinct: seen.size,
      invalid: p.invalid, invalidNotInLive: invNotLive.length, invalidNotInLiveLines: invNotLive, notInLive });
  }
  const rows = [...all.values()].sort((a, b) => {
    const ta = Number(a.obj[time]), tb = Number(b.obj[time]);
    const fa = Number.isFinite(ta), fb = Number.isFinite(tb);
    if (fa && fb && ta !== tb) return ta - tb;
    if (fa !== fb) return fa ? -1 : 1;    // rows with no usable time go LAST, and are counted
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });
  const added = rows.filter((r) => !liveKeys.has(r.key));
  return {
    rows,
    added,
    perSource,
    liveDistinct: liveKeys.size,
    crossSourceDup: rows.filter((r) => r.sources.size > 1).length,
    withinDup,
    noTime: rows.filter((r) => !Number.isFinite(Number(r.obj[time]))).length,
    narrowDistinct: new Set(rows.map((r) => narrowKey(r.obj))).size,
    invalidNotInLive,
    addedBytes: added.reduce((n, r) => n + r.bytes, 0),
  };
}

function sources(dataDir, name, stateDir = null) {
  const out = [];
  const live = path.join(dataDir, name);
  if (fs.existsSync(live)) out.push({ tag: 'LIVE', path: live, live: true, text: fs.readFileSync(live, 'utf8') });
  // The state set's copy, READ ONLY. Under L070's stop-before-write a launch that meets a DIVERGED ledger refuses and
  // writes nothing, so the other machine's rows never reach an attic copy here: this copy is the only one there is.
  if (stateDir) {
    const sp = path.join(stateDir, 'data', name);
    if (fs.existsSync(sp)) out.push({ tag: 'STATE', path: sp, live: false, state: true, text: fs.readFileSync(sp, 'utf8') });
  }
  const attic = path.join(dataDir, 'attic');
  if (fs.existsSync(attic)) {
    for (const d of fs.readdirSync(attic).filter((x) => x.startsWith('pre-sync-')).sort()) {
      const p = path.join(attic, d, name);
      if (fs.existsSync(p)) out.push({ tag: d, path: p, live: false, text: fs.readFileSync(p, 'utf8') });
    }
  }
  return out;
}

function report(kind, dataDir, outDir, stateDir) {
  const spec = FILES[kind];
  const src = sources(dataDir, spec.name, stateDir);
  if (!src.some((s) => s.live)) { console.log(`${spec.name}: no live file in ${dataDir} — nothing to union`); return 2; }
  const u = union(src, spec.time);
  const iso = (t) => (Number.isFinite(Number(t)) ? new Date(Number(t)).toISOString() : '(no time)');
  console.log(`\n=== ${spec.name} — DRY RUN, nothing written to ${dataDir} ===`);
  const nAttic = src.filter((x) => !x.live && !x.state).length;
  console.log(`  sources: 1 live + ${src.some((x) => x.state) ? '1 state set copy + ' : ''}${nAttic} attic cop${nAttic === 1 ? 'y' : 'ies'}`);
  console.log('  source                                   lines    rows  distinct  invalid  invalid-not-in-live  rows-not-in-live');
  for (const s of u.perSource) {
    console.log(`  ${s.tag.padEnd(38)} ${String(s.lines).padStart(6)} ${String(s.rows).padStart(7)} ${String(s.distinct).padStart(9)}`
      + ` ${String(s.invalid.length).padStart(8)} ${String(s.live ? '-' : s.invalidNotInLive).padStart(20)} ${String(s.notInLive).padStart(17)}`);
  }
  const stPath = path.join(stateDir, 'data', spec.name);
  const st = u.perSource.find((x) => x.tag === 'STATE');
  console.log(st
    ? `  state set copy              ${stPath} — ${st.rows} rows, ${st.notInLive} not in live`
    : `  state set copy: NONE at ${stPath} — the state set holds no copy of this file`);
  console.log(`  live distinct rows          ${u.liveDistinct}`);
  console.log(`  union distinct rows         ${u.rows.length}`);
  console.log(`  ROWS TO ADD to live         ${u.added.length}   (${u.addedBytes} bytes)`);
  if (u.added.length) {
    const ts = u.added.map((r) => Number(r.obj[spec.time])).filter(Number.isFinite);
    if (ts.length) console.log(`    time range of rows to add  ${iso(Math.min(...ts))} .. ${iso(Math.max(...ts))}`);
  }
  console.log(`  rows held by 2+ sources     ${u.crossSourceDup}   (duplicates across copies, kept once)`);
  console.log(`  repeated within one source  ${u.withinDup}   (kept once)`);
  console.log(`  rows with no usable ${spec.time.padEnd(3)}     ${u.noTime}   (ordered last)`);
  console.log(`  narrow key (lap, stage|chain, at) distinct: ${u.narrowDistinct}`
    + (kind === 'lap' ? `  — whole-row keeps ${u.rows.length - u.narrowDistinct} more apart` : '  (not meaningful for the board)'));
  const invAll = u.perSource.reduce((n, s) => n + s.invalid.length, 0);
  const liveInv = (u.perSource.find((s) => s.live) || { invalid: [] }).invalid.length;
  console.log(`  NOT VALID JSON               ${invAll} line(s) across all sources; ${liveInv} in the live file`);
  console.log(`  ...of them ONLY an attic copy holds   ${u.invalidNotInLive}   (the only ones that could hide rows the live file lacks)`);
  const inv = u.perSource.flatMap((s) => s.invalidNotInLiveLines.map((x) => ({ ...x, tag: s.tag })));
  for (const x of inv) {
    const detail = spec.printInvalid ? '' : ' (content not printed: board text is a person\'s words)';
    console.log(`    ${x.tag}:${x.line}  ${x.bytes} B  ${x.why}${detail}`);
  }
  if (spec.name === 'lap.jsonl' && u.added.length) {
    const byLap = {};
    for (const r of u.added) byLap[r.obj.lap] = (byLap[r.obj.lap] || 0) + 1;
    console.log('  rows to add, by lap id: ' + Object.entries(byLap).map(([k, v]) => `${k} ${v}`).join(' · '));
  }
  if (outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    const out = path.join(outDir, `${spec.name}.union`);
    fs.writeFileSync(out, u.rows.map((r) => canon(r.obj)).join('\n') + '\n');
    fs.writeFileSync(path.join(outDir, `${spec.name}.added`), u.added.map((r) => canon(r.obj)).join('\n') + (u.added.length ? '\n' : ''));
    console.log(`  proposed union written to   ${out}  (${u.rows.length} rows, ordered by ${spec.time}) — for inspection only`);
  }
  return 0;
}

// ============================================================================================================
// THE WRITE (L071). Both files are LIVE while this runs: the app opens board.jsonl per write (main.rs:2127,
// OpenOptions create+append, closed at scope end) and lap-row.js / the JS writers use appendFileSync — so a row can
// arrive (a) while this reads, (b) after the union is built, (c) into a RE-CREATED live path once the original is
// renamed away, or (d) into the renamed original itself, from a write already in flight (both Rust and Node open with
// delete-sharing on Windows, so the rename does not wait for them). Each case has its step below, and a test.
//
// THE RESULT IS NOT A RE-SORT. The live file is written VERBATIM, every line in its own order — including the fused
// lines that are not valid JSON (the board carries 257; a union of parsed rows would have dropped them and the rows
// inside) — and only the attic-only rows are interleaved, each before the first live line with a later time. Readers
// that use file position (lap-row's baton gate) see the live history exactly as it was, with the lost rows restored.
//
// board-compact.js:290-366 is the protocol, with its one residual window closed: board-compact renames the new file
// OVER the live path, so a writer that re-created it in between is overwritten. Here the new file is placed with
// fs.linkSync, which FAILS rather than replace; a re-created file is renamed aside as a `gap` and its lines carried in.
// ============================================================================================================
const sleepMs = (ms) => { if (ms > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); };

/** The complete lines of `buf` from byte `from`, and the byte after the last newline. A partial last line waits. */
function completeLines(buf, from) {
  const last = buf.lastIndexOf(0x0a);
  if (last < from) return { lines: [], end: from };
  return { lines: buf.subarray(from, last + 1).toString('utf8').split('\n').slice(0, -1), end: last + 1 };
}
const asText = (ls) => ls.map((l) => `${l}\n`).join('');

function writeUnion({ dataDir, name, time, hooks = {}, settleMs = 1500, now = () => new Date(), stateDir = null }) {
  const st = resolveStateDir(stateDir);            // before anything is touched: an undeclared state set refuses
  const live = path.join(dataDir, name);
  const stamp = now().toISOString().replace(/[:.]/g, '-');
  const backup = `${live}.pre-union-${stamp}`;
  const tmp = `${live}.union-${stamp}.tmp`;
  for (const p of [backup, tmp]) if (fs.existsSync(p)) throw new Error(`${p} already exists — refusing: a record is never overwritten`);
  const call = (k, ctx) => { if (hooks[k]) hooks[k](ctx); };

  // (1) READ the complete lines. A partial last line is a writer mid-line; the catch-up takes it once it is whole.
  const first = completeLines(fs.readFileSync(live), 0);
  const liveLines = first.lines;
  let consumed = first.end;
  call('afterRead', {});

  // (2) UNION against every attic copy; the rows only an attic copy holds, in time order, with their raw bytes.
  const attic = sources(dataDir, name, st).filter((s) => !s.live);   // the attic copies AND the state set's
  const u = union([{ tag: 'LIVE', live: true, text: asText(liveLines) }, ...attic], time);
  const add = u.added;
  const out = [];
  let ai = 0;
  for (const l of liveLines) {
    let t = NaN;
    try { t = Number(JSON.parse(l)[time]); } catch { /* a fused line: it keeps its place */ }
    if (Number.isFinite(t)) while (ai < add.length && Number(add[ai].obj[time]) < t) out.push(add[ai++].raw);
    out.push(l);
  }
  while (ai < add.length) out.push(add[ai++].raw);
  fs.writeFileSync(tmp, asText(out));
  call('afterTmp', {});

  // (3) CATCH UP: whatever the writers appended since the read, verbatim, until a pass finds nothing.
  let caughtUp = 0;
  for (;;) {
    const c = completeLines(fs.readFileSync(live), consumed);
    if (!c.lines.length) break;
    fs.appendFileSync(tmp, asText(c.lines));
    caughtUp += c.lines.length;
    consumed = c.end;
  }

  // (4) FREEZE: the original is renamed to the backup beside it. From here it is the record and is only read.
  fs.renameSync(live, backup);
  call('afterFreeze', { backup });

  // (5) PLACE, never overwrite: linkSync fails if a writer re-created the path; that file becomes a gap and is carried.
  const gaps = [];
  for (let i = 0; ; i++) {
    try { fs.linkSync(tmp, live); break; } catch (e) {
      if (e.code !== 'EEXIST' || i >= 50) {
        throw new Error(`could not place the union at ${live} (${e.code}). NOTHING IS LOST: the original is ${backup}, the union is ${tmp}${gaps.length ? `, re-created files: ${gaps.join(', ')}` : ''}`);
      }
      const g = `${live}.gap-${gaps.length + 1}-${stamp}`;
      fs.renameSync(live, g);
      gaps.push(g);
    }
  }
  fs.unlinkSync(tmp);
  call('afterLink', { backup, gaps });

  // (6) RECONCILE after a settle: rows that reached the frozen original past `consumed` (a write in flight at the
  // rename), and every line of every gap file. Repeated until a pass moves nothing; a partial line still there then
  // is a writer that died mid-line, and its bytes are carried as a line rather than dropped.
  const offsets = new Map([[backup, consumed], ...gaps.map((g) => [g, 0])]);
  let reconciled = 0, partialCarried = 0;
  for (let pass = 0; pass < 20; pass++) {
    sleepMs(settleMs);
    let moved = 0;
    for (const [p, off] of offsets) {
      const c = completeLines(fs.readFileSync(p), off);
      if (c.lines.length) { fs.appendFileSync(live, asText(c.lines)); moved += c.lines.length; offsets.set(p, c.end); }
    }
    reconciled += moved;
    if (!moved) break;
  }
  for (const [p, off] of offsets) {
    const b = fs.readFileSync(p);
    if (b.length > off) { fs.appendFileSync(live, `${b.subarray(off).toString('utf8')}\n`); partialCarried++; offsets.set(p, b.length); }
  }

  // (7) VERIFY: every line of the original and of every gap file is in the result (as a multiset), and every union row.
  const final = completeLines(fs.readFileSync(live), 0).lines;
  const have = new Map();
  for (const l of final) have.set(l, (have.get(l) || 0) + 1);
  const need = new Map();
  const want = (ls) => { for (const l of ls) need.set(l, (need.get(l) || 0) + 1); };
  const fromBackup = fs.readFileSync(backup, 'utf8').split('\n');
  if (fromBackup[fromBackup.length - 1] === '') fromBackup.pop();
  want(fromBackup);
  for (const g of gaps) { const gl = fs.readFileSync(g, 'utf8').split('\n'); if (gl[gl.length - 1] === '') gl.pop(); want(gl); }
  let missingLines = 0;
  for (const [l, n] of need) if ((have.get(l) || 0) < n) missingLines += n - (have.get(l) || 0);
  const keys = new Set(parseJsonl(asText(final)).rows.map((r) => r.key));
  const missingRows = u.rows.filter((r) => !keys.has(r.key)).length;
  return {
    name, live, backup, gaps, liveLinesRead: liveLines.length, added: add.length, caughtUp, reconciled, partialCarried,
    finalLines: final.length, unionDistinct: u.rows.length, missingLines, missingRows, verified: missingLines === 0 && missingRows === 0,
  };
}

function main(argv) {
  const arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  if (argv.includes('--write')) {
    const k = arg('--file');
    if (!['lap', 'board'].includes(k)) { console.error('ledger-union: --write needs --file lap|board — one live file per run, named'); return 2; }
    const dataDir = arg('--data');
    if (!dataDir) { console.error('--data <data dir> is required'); return 2; }
    let st;
    try { st = resolveStateDir(); } catch (e) { console.error(`ledger-union: REFUSED — ${e.message}`); return 2; }
    const r = writeUnion({ dataDir, name: FILES[k].name, time: FILES[k].time, stateDir: st });
    console.log(JSON.stringify(r, null, 2));
    if (!r.verified) console.error(`ledger-union: WRITTEN BUT NOT VERIFIED — ${r.missingLines} line(s) / ${r.missingRows} union row(s) missing; the original is intact at ${r.backup}`);
    return r.verified ? 0 : 1;
  }
  const dataDir = arg('--data');
  if (!dataDir) { console.error('--data <data dir> is required'); return 2; }
  const outDir = arg('--out');
  if (outDir) {
    const rel = path.relative(path.resolve(dataDir), path.resolve(outDir));
    if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
      console.error(`ledger-union: refusing --out inside the data dir (${outDir}). The dry run writes nowhere a reader of the data dir looks.`);
      return 2;
    }
  }
  const which = arg('--file') || 'both';
  if (!['lap', 'board', 'both'].includes(which)) { console.error('--file must be lap|board|both'); return 2; }
  let rc = 0;
  let st;
  try { st = resolveStateDir(); } catch (e) { console.error(`ledger-union: REFUSED — ${e.message}`); return 2; }
  for (const k of which === 'both' ? ['lap', 'board'] : [which]) rc = Math.max(rc, report(k, dataDir, outDir, st));
  return rc;
}

module.exports = { canon, parseJsonl, union, narrowKey, writeUnion, completeLines };
if (require.main === module) process.exit(main(process.argv.slice(2)));

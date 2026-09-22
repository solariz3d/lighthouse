#!/usr/bin/env node
/* ledger-union.js — union the live lap.jsonl / board.jsonl with every copy displaced into attic/pre-sync-*.
 *
 * WHY IT EXISTS (L069 §2, L070). Every L launch that MIGRATEs installs the state set over the data dir, and an
 * append-only TRAVELS log is REPLACED rather than extended: the rows this machine wrote since the last publish move
 * into attic/pre-sync-<stamp>/ and leave the live file. Measured on L, 2026-09-21: 69 lap rows of 09-20 in one attic
 * copy, L058 alone in five generations. The keeper's ruling (06:34, via the librarian): UNION, NO RENAMING.
 *
 * THIS FILE IS A DRY RUN AND NOTHING ELSE. It reads the live file and every attic copy, reports, and writes the
 * PROPOSED union to --out for a reader to inspect. It never writes the data dir and never touches an attic copy —
 * it refuses an --out inside the data dir, and it has no --write. The write is a separate, later step.
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
 *   node consonance/tools/ledger-union.js --data <data dir> --out <scratch dir> [--file lap|board|both]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// An unparseable line is identified by a HASH of its bytes, never by its text: a board line is a person's words.
const lineHash = (raw) => crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);

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
      rows.push({ obj, line: i + 1, key: canon(obj), bytes: Buffer.byteLength(raw) + 1 });
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
      if (!all.has(r.key)) all.set(r.key, { obj: r.obj, key: r.key, bytes: r.bytes, sources: new Set() });
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

function sources(dataDir, name) {
  const out = [];
  const live = path.join(dataDir, name);
  if (fs.existsSync(live)) out.push({ tag: 'LIVE', path: live, live: true, text: fs.readFileSync(live, 'utf8') });
  const attic = path.join(dataDir, 'attic');
  if (fs.existsSync(attic)) {
    for (const d of fs.readdirSync(attic).filter((x) => x.startsWith('pre-sync-')).sort()) {
      const p = path.join(attic, d, name);
      if (fs.existsSync(p)) out.push({ tag: d, path: p, live: false, text: fs.readFileSync(p, 'utf8') });
    }
  }
  return out;
}

function report(kind, dataDir, outDir) {
  const spec = FILES[kind];
  const src = sources(dataDir, spec.name);
  if (!src.some((s) => s.live)) { console.log(`${spec.name}: no live file in ${dataDir} — nothing to union`); return 2; }
  const u = union(src, spec.time);
  const iso = (t) => (Number.isFinite(Number(t)) ? new Date(Number(t)).toISOString() : '(no time)');
  console.log(`\n=== ${spec.name} — DRY RUN, nothing written to ${dataDir} ===`);
  console.log(`  sources: 1 live + ${src.length - 1} attic cop${src.length - 1 === 1 ? 'y' : 'ies'}`);
  console.log('  source                                   lines    rows  distinct  invalid  invalid-not-in-live  rows-not-in-live');
  for (const s of u.perSource) {
    console.log(`  ${s.tag.padEnd(38)} ${String(s.lines).padStart(6)} ${String(s.rows).padStart(7)} ${String(s.distinct).padStart(9)}`
      + ` ${String(s.invalid.length).padStart(8)} ${String(s.live ? '-' : s.invalidNotInLive).padStart(20)} ${String(s.notInLive).padStart(17)}`);
  }
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

function main(argv) {
  const arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  if (argv.includes('--write')) {
    console.error('ledger-union: there is no --write. This is the dry run; the write is a separate step (L070).');
    return 2;
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
  for (const k of which === 'both' ? ['lap', 'board'] : [which]) rc = Math.max(rc, report(k, dataDir, outDir));
  return rc;
}

module.exports = { canon, parseJsonl, union, narrowKey };
if (require.main === module) process.exit(main(process.argv.slice(2)));

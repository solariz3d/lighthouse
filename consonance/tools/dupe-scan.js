#!/usr/bin/env node
'use strict';
// dupe-scan.js — duplicated blocks of JavaScript: where the same code was written twice (D554, pane E). An outside reader's claim, relayed 2026-10-30, was
// that agent-built code piles up blocks that do the same as other parts; nothing here measured it (exo_memory/research/outside_reader_agent_maps_2026-10-30.md,
// pointer 3). Plain node, no dependency. It reads files and prints; it writes nothing.
//
//   node consonance/tools/dupe-scan.js <label>=<dir>[,<dir>…] …   each label a tree; every .js/.cjs/.mjs under its dirs is read
//   --lines <n>    the shortest block counted, in code lines (default 8)
//   --top <n>      clusters printed, largest first (default 25)
//   --test <re>    paths matching this regex are TEST code, reported apart (default: a test/ folder, or a name ending .test.js or .mutants.js)
//   --json         everything as JSON (all clusters)
//
// THE METHOD. Each file is tokenised (comments dropped; a string or template literal becomes S, a number N; identifiers kept), so a CODE LINE is a source
// line with at least one token, and two lines match when their token text is the same. A WINDOW is n consecutive code lines; it counts when it holds at least
// 40 tokens and 4 distinct lines (so a run of closing braces is not a duplicate). A window whose token text occurs in two or more places (a second place in
// the same file counts, if the two do not overlap) is DUPLICATED, and so is every code line in it. Windows that continue each other on the same pair of
// places join into one BLOCK; blocks that share lines join into one CLUSTER. The "renamed" figure repeats the count with every identifier read as I, so a
// copy with its names changed is found too (it also finds look-alike code that is not a copy: read it as an upper bound).
// THE SHARE is duplicated code lines over all code lines, per tree, for test and non-test code, and overall.
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const KEYWORDS = new Set('break case catch class const continue debugger default delete do else export extends false finally for function if import in instanceof let new null of return static super switch this throw true try typeof undefined var void while with yield async await get set'.split(' '));

/** The token text of every source line of `src` (an empty string for a line with no token), at one normalisation. */
function lineTokens(src, renamed) {
  const out = [[]]; let i = 0, line = 0;
  const push = (t) => out[line].push(t), nl = () => { line++; out.push([]); };
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (c === '\n') { nl(); i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
    if (c === '/' && d === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') nl(); i++; } i += 2; continue; }
    if (c === '"' || c === "'") { i++; while (i < src.length && src[i] !== c && src[i] !== '\n') { if (src[i] === '\\') i++; i++; } i++; push('S'); continue; }
    if (c === '`') { i++; while (i < src.length && src[i] !== '`') { if (src[i] === '\\') i++; else if (src[i] === '\n') nl(); i++; } i++; push('S'); continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(d))) { while (i < src.length && /[0-9a-fA-FxXoObBn_.eE]/.test(src[i])) { if ((src[i] === 'e' || src[i] === 'E') && /[+-]/.test(src[i + 1])) i++; i++; } push('N'); continue; }
    if (/[A-Za-z_$À-￿]/.test(c)) { let j = i; while (j < src.length && /[A-Za-z0-9_$À-￿]/.test(src[j])) j++; const w = src.slice(i, j); push(renamed && !KEYWORDS.has(w) ? 'I' : w); i = j; continue; }
    push(c); i++;
  }

  return out.map((t) => t.join(' '));
}

function filesUnder(dir) {
  const out = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.git') walk(p); } else if (/\.(c|m)?js$/.test(e.name)) out.push(p); } })(dir);
  return out.sort();
}

/** One scan at one normalisation: { files: [{ tree, rel, test, code: [line numbers], dup: Set of line numbers }], clusters }. */
function scan(trees, { lines: W = 8, renamed = false, testRe }) {
  const files = [];
  for (const t of trees) for (const dir of t.dirs) for (const p of filesUnder(dir)) {
    const rel = path.join(path.basename(dir), path.relative(dir, p)).split(path.sep).join('/');
    const src = fs.readFileSync(p, 'utf8'), keep = lineTokens(src, false), toks = renamed ? lineTokens(src, true) : keep, code = [], text = [], plain = [];
    toks.forEach((s, k) => { if (s) { code.push(k + 1); text.push(s); plain.push(keep[k]); } });
    files.push({ tree: t.label, rel, test: testRe.test(rel), code, text, plain, dup: new Set() });
  }
  const at = new Map();   // window hash -> [[file index, window start (code-line index)]]
  files.forEach((f, fi) => {
    for (let s = 0; s + W <= f.text.length; s++) {
      const win = f.text.slice(s, s + W), ntok = win.reduce((a, l) => a + l.split(' ').length, 0);
      if (ntok < 40 || new Set(f.plain.slice(s, s + W)).size < 4) continue;   // the distinct-line floor reads the names as written, in both passes
      const h = crypto.createHash('sha1').update(win.join('\n')).digest('base64');
      if (!at.has(h)) at.set(h, []); at.get(h).push([fi, s]);
    }
  });
  const diag = new Map(), CAP = 30;
  for (const occ of at.values()) {
    if (occ.length < 2) continue;
    const keep = occ.filter(([fi, s], k) => occ.some(([fj, t], m) => m !== k && (fj !== fi || Math.abs(t - s) >= W)));
    for (const [fi, s] of keep) for (let k = 0; k < W; k++) files[fi].dup.add(files[fi].code[s + k]);
    const pairOf = keep.slice(0, CAP);
    for (let a = 0; a < pairOf.length; a++) for (let b = a + 1; b < pairOf.length; b++) {
      const [fa, sa] = pairOf[a], [fb, sb] = pairOf[b]; if (fa === fb && Math.abs(sa - sb) < W) continue;
      const key = `${fa}|${fb}|${sa - sb}`; if (!diag.has(key)) diag.set(key, []); diag.get(key).push(sa);
    }
  }
  // blocks: runs along a diagonal; each gives two regions (file, first and last code-line index)
  const regions = [], link = [];
  for (const [key, starts] of diag) {
    const [fa, fb, off] = key.split('|').map(Number); starts.sort((x, y) => x - y);
    for (let k = 0; k < starts.length;) {
      let e = k; while (e + 1 < starts.length && starts[e + 1] === starts[e] + 1) e++;
      const a0 = starts[k], a1 = starts[e] + W - 1; regions.push([fa, a0, a1], [fb, a0 - off, a1 - off]); link.push([regions.length - 2, regions.length - 1]); k = e + 1;
    }
  }
  const up = regions.map((_, k) => k), find = (x) => (up[x] === x ? x : (up[x] = find(up[x])));
  const join = (x, y) => { x = find(x); y = find(y); if (x !== y) up[x] = y; };
  for (const [x, y] of link) join(x, y);
  const byFile = new Map(); regions.forEach((r, k) => { if (!byFile.has(r[0])) byFile.set(r[0], []); byFile.get(r[0]).push(k); });
  for (const ks of byFile.values()) { ks.sort((x, y) => regions[x][1] - regions[y][1]); let open = ks[0]; for (const k of ks.slice(1)) { if (regions[k][1] <= regions[open][2]) { join(open, k); if (regions[k][2] > regions[open][2]) open = k; } else open = k; } }
  const groups = new Map(); regions.forEach((r, k) => { const g = find(k); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(r); });
  const clusters = [...groups.values()].map((rs) => {
    const merged = new Map();   // per file: merged ranges
    for (const [fi, a, b] of rs) { if (!merged.has(fi)) merged.set(fi, []); merged.get(fi).push([a, b]); }
    const members = [];
    for (const [fi, rr] of merged) { rr.sort((x, y) => x[0] - y[0]); let cur = rr[0].slice(); for (const r of rr.slice(1)) { if (r[0] <= cur[1] + 1) cur[1] = Math.max(cur[1], r[1]); else { members.push([fi, ...cur]); cur = r.slice(); } } members.push([fi, ...cur]); }
    const m = members.map(([fi, a, b]) => ({ tree: files[fi].tree, file: files[fi].rel, test: files[fi].test, from: files[fi].code[a], to: files[fi].code[b], codeLines: b - a + 1 }));
    m.sort((x, y) => y.codeLines - x.codeLines || x.file.localeCompare(y.file));
    return { codeLines: m[0].codeLines, places: m.length, members: m };
  }).sort((x, y) => y.codeLines - x.codeLines || y.places - x.places);
  return { files, clusters };
}

function shares(files) {
  const sum = (fs_) => { const c = fs_.reduce((a, f) => a + f.code.length, 0), d = fs_.reduce((a, f) => a + f.dup.size, 0); return { files: fs_.length, codeLines: c, dupLines: d, share: c ? +(100 * d / c).toFixed(2) : 0 }; };
  const trees = [...new Set(files.map((f) => f.tree))], out = {};
  for (const t of trees) { const f = files.filter((x) => x.tree === t); out[t] = { all: sum(f), code: sum(f.filter((x) => !x.test)), test: sum(f.filter((x) => x.test)) }; }
  out.overall = { all: sum(files), code: sum(files.filter((x) => !x.test)), test: sum(files.filter((x) => x.test)) };
  return out;
}

function main(argv) {
  const opt = { lines: 8, top: 25, testRe: /(^|[\\/])test[\\/]|\.(test|mutants)\.(c|m)?js$/, json: false }, trees = [];
  for (let k = 0; k < argv.length; k++) {
    const a = argv[k];
    if (a === '--lines') opt.lines = Number(argv[++k]); else if (a === '--top') opt.top = Number(argv[++k]); else if (a === '--test') opt.testRe = new RegExp(argv[++k]); else if (a === '--json') opt.json = true;
    else { const m = /^([^=]+)=(.+)$/.exec(a); if (!m) throw new Error(`not label=dir[,dir]: ${a}`); trees.push({ label: m[1], dirs: m[2].split(',').map((d) => path.resolve(d)) }); }
  }
  if (!trees.length) throw new Error('usage: node consonance/tools/dupe-scan.js <label>=<dir>[,<dir>…] … [--lines 8] [--top 25] [--test <regex>] [--json]');
  for (const t of trees) for (const d of t.dirs) if (!fs.statSync(d, { throwIfNoEntry: false })?.isDirectory()) throw new Error(`not a folder: ${d}`);
  if (!(opt.lines >= 2)) throw new Error('--lines must be 2 or more');
  const lit = scan(trees, { ...opt, renamed: false }), ren = scan(trees, { ...opt, renamed: true });
  const result = { lines: opt.lines, shares: shares(lit.files), renamedShares: shares(ren.files), clusters: lit.clusters, renamedLargest: ren.clusters.slice(0, opt.top) };
  if (opt.json) { process.stdout.write(JSON.stringify(result, null, 1) + '\n'); return result; }
  const row = (k, s) => `${k.padEnd(12)} ${String(s.files).padStart(4)} files ${String(s.codeLines).padStart(7)} code lines ${String(s.dupLines).padStart(6)} duplicated  ${s.share.toFixed(2).padStart(6)}%`;
  console.log(`blocks of ${opt.lines}+ code lines in 2+ places (identifiers kept; strings, numbers and comments normalised)`);
  for (const [t, v] of Object.entries(result.shares)) { console.log(`\n${t}`); for (const k of ['all', 'code', 'test']) console.log('  ' + row(k, v[k])); console.log(`  renamed (upper bound): ${result.renamedShares[t].all.share.toFixed(2)}% all, ${result.renamedShares[t].code.share.toFixed(2)}% non-test`); }
  console.log(`\n${lit.clusters.length} clusters; the ${Math.min(opt.top, lit.clusters.length)} largest (code lines of its longest copy, then each place):`);
  for (const c of lit.clusters.slice(0, opt.top)) { console.log(c.places === 1 ? `\n${c.codeLines} lines, repeating within one span` : `\n${c.codeLines} lines × ${c.places} places`); for (const m of c.members) console.log(`   ${m.tree}:${m.file}:${m.from}-${m.to} (${m.codeLines})${m.test ? ' [test]' : ''}`); }
  return result;
}

if (require.main === module) { try { main(process.argv.slice(2)); } catch (e) { console.error(`dupe-scan: ${e.message}`); process.exit(1); } }
module.exports = { lineTokens, scan, shares, main };

// SOURCED — how often does a checkable value leave without anyone reading its source?
//
// THE GROOVE, measured over one session rather than felt: nine confident assertions, all wrong
// the same way. A port number recorded correctly days ago and stale by the time it was quoted.
// A binary timestamp read off the profile that was not running. A dream count taken from a pool
// retired two weeks earlier. A claim that four cycles were contaminated by a hook that never
// fired here. Every one had a file, a process or a page underneath it, and none was re-read.
//
// WHY THE OBVIOUS FIX FAILED. "Check when unsure" fires never: every one of the nine felt
// certain from inside. Uncertainty is absent precisely when it would be useful. So the first
// attempt at a rule graded claims by risk — and the keeper took it apart in one question:
// **"why would that be risky when you can just check?"** Rating confidence is a triage step,
// and triage only earns its place when checking is expensive. Here it costs one tool call. The
// rating layer added a number I could be wrong about, on top of a fact I could have just read.
//
// So there is no risky tier. There is CHECKABLE and NOT-CHECKABLE, and the response to the
// first is not a flag, it is a read.
//
// WHAT THIS COUNTS, and what it cannot. It scans a transcript for assistant turns that assert a
// SPECIFIC VALUE — a port, a count, a timestamp, a path, a version, a running/installed state —
// and asks whether that same turn touched a source. That is a proxy and a loose one: a turn can
// legitimately quote a value read three turns earlier, and this will score it unsourced. It is
// not a grade. It is a RATE with a denominator, which is what every groove here has needed
// before it moved. `9 in one session` is an anecdote; `9 of 60 value-claims` is a measurement,
// and next week's number is comparable to it.
//
// It cannot see whether a value was RIGHT. Only whether anything was consulted.
//
//   node consonance/tools/sourced.js                    the current Main transcript
//   node consonance/tools/sourced.js --file <jsonl>
//   node consonance/tools/sourced.js --show unsourced   the turns behind the number
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECTS = path.join(os.homedir(), '.claude', 'projects');
const MAIN = '0c0c0c0a-0000-4000-8000-000000000a01';

// A claim carrying a specific value someone could have read. Deliberately narrow: prose full of
// numbers is not the target, an ASSERTED value is. Each pattern below is drawn from a real miss
// this session rather than invented to be thorough.
const VALUE_PATTERNS = [
  { name: 'port',      re: /\bport\s+\d{3,5}\b|127\.0\.0\.1:\d{3,5}/i },
  { name: 'count',     re: /\b(?:holds?|has|contains?|carries|there are|found)\s+\*{0,2}\d+\*{0,2}\s+(?:file|test|entr|commit|line|dream|size|image|assertion|instance|identifier|pane)/i },
  { name: 'timestamp', re: /\b\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/ },
  { name: 'state',     re: /\b(?:is|was|are|were)\s+(?:still\s+)?(?:running|armed|live|installed|registered|clean|stale|current)\b/i },
  { name: 'version',   re: /\bv?\d+\.\d+\.\d+\b/ },
  { name: 'linecount', re: /\b\d{2,}\s+lines?\b/i },
];

// Tools that actually consult a source. `Write`/`Edit` produce rather than read, so a turn that
// only writes has not verified anything — that distinction is the point of the whole file.
const READING_TOOLS = new Set(['Bash', 'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch', 'PowerShell']);

function turns(file) {
  const out = [];
  let pending = null;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    if (r.type === 'user') { if (pending) out.push(pending); pending = null; continue; }
    if (r.type !== 'assistant') continue;
    const c = (r.message || {}).content;
    if (!Array.isArray(c)) continue;
    if (!pending) pending = { ts: r.timestamp, text: '', tools: [] };
    for (const b of c) {
      if (b.type === 'text') pending.text += '\n' + b.text;
      if (b.type === 'tool_use') pending.tools.push(b.name);
    }
  }
  if (pending) out.push(pending);
  return out;
}

function scan(file) {
  const rows = [];
  for (const t of turns(file)) {
    const kinds = VALUE_PATTERNS.filter(p => p.re.test(t.text)).map(p => p.name);
    if (!kinds.length) continue;
    const read = t.tools.some(n => READING_TOOLS.has(n));
    rows.push({ ts: t.ts, kinds, read, tools: t.tools, text: t.text });
  }
  const sourced = rows.filter(r => r.read).length;
  return { rows, total: rows.length, sourced, unsourced: rows.length - sourced };
}

function newestMain() {
  let best = null;
  for (const d of fs.readdirSync(PROJECTS)) {
    const f = path.join(PROJECTS, d, MAIN + '.jsonl');
    if (fs.existsSync(f) && (!best || fs.statSync(f).mtimeMs > fs.statSync(best).mtimeMs)) best = f;
  }
  return best;
}

function main(argv) {
  const fi = argv.indexOf('--file');
  const file = fi >= 0 ? argv[fi + 1] : newestMain();
  if (!file || !fs.existsSync(file)) { console.error('no transcript found'); return 2; }
  const r = scan(file);
  const pct = r.total ? (100 * r.sourced / r.total).toFixed(0) : '—';

  console.log(`sourced — ${path.basename(file)}`);
  console.log(`  ${r.total} turns asserted a checkable value`);
  console.log(`  ${r.sourced} touched a source in the same turn (${pct}%)`);
  console.log(`  ${r.unsourced} did not\n`);

  const byKind = {};
  for (const row of r.rows) for (const k of row.kinds) {
    byKind[k] = byKind[k] || { n: 0, un: 0 };
    byKind[k].n++; if (!row.read) byKind[k].un++;
  }
  console.log('  by kind:');
  for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1].un - a[1].un)) {
    console.log(`    ${k.padEnd(11)} ${String(v.n).padStart(3)} claims · ${v.un} unsourced`);
  }

  if (argv.includes('--show')) {
    console.log('\n  unsourced turns:');
    for (const row of r.rows.filter(x => !x.read).slice(-12)) {
      const t = row.text.replace(/\s+/g, ' ').trim().slice(0, 96);
      console.log(`    ${String(row.ts).slice(0, 19)}  [${row.kinds.join(',')}]  ${t}…`);
    }
  }

  console.log('\n  What this is NOT: a correctness score. It cannot see whether a value was right,');
  console.log('  only whether anything was consulted. A turn quoting a value read three turns ago');
  console.log('  scores unsourced here and may be perfectly sound. The number is a RATE, useful');
  console.log('  against next week\'s rate and not much else — which is more than an anecdote had.');
  return 0;
}

module.exports = { scan, turns, VALUE_PATTERNS, READING_TOOLS };

if (require.main === module) process.exit(main(process.argv.slice(2)));

#!/usr/bin/env node
// boot_usage_split_scan.js — DRAFT, handed back by Around 2026-08-17 beside Amendment 2.
//
// boot_usage_scan.js with the classification the registration lacked: phrases are split by
// ORIGIN — the stable philosophy head vs the rotating journal-pointer tail — because 50 of the
// registered 117 phrases exist only in the tail, which is one-time narration, not vocabulary.
// Same extraction, same message-content-only rule (see boot_usage_scan.js header for the
// separability argument), one pass.
//
// Also carries the §C re-derivation: --phrase "<text>" [--before YYYY-MM-DD] counts an arbitrary
// spoken form in live turns, date-filtered — the mode that found "append clean" at 13 pre-08-16
// occurrences where the exact-string scan reported the procedure as never named.
//
// usage:
//   node boot_usage_split_scan.js [--boot <path>] [--projects <dir>]
//   node boot_usage_split_scan.js --phrase "append clean" [--before 2026-08-16]

'use strict';
const fs = require('fs');
const path = require('path');
const rl = require('readline');

function arg(name, dflt) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
}
const BOOT = arg('--boot', path.join(__dirname, '..', 'BOOT.md'));
const PROJECTS = arg('--projects', path.join(process.env.USERPROFILE || process.env.HOME || '', '.claude', 'projects'));
const PHRASE = arg('--phrase', null);
const BEFORE = arg('--before', null);

if (!fs.existsSync(PROJECTS)) { console.error(`projects dir not found at ${PROJECTS}`); process.exit(2); }

function concepts(b) {
  const raw = [...b.matchAll(/\*\*([^*]{12,70})\*\*/g)].map(m => m[1])
    .concat([...b.matchAll(/\*([a-z][^*]{12,60})\*/g)].map(m => m[1]));
  return [...new Set(raw
    .map(s => s.replace(/[^a-zA-Z0-9 -]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase())
    .filter(s => { const w = s.split(' ').length; return w >= 3 && w <= 9; }))];
}

function transcripts(root) {
  const out = [];
  for (const d of fs.readdirSync(root)) {
    const p = path.join(root, d);
    let st; try { st = fs.statSync(p); } catch { continue; }
    if (!st.isDirectory()) continue;
    for (const f of fs.readdirSync(p)) if (f.endsWith('.jsonl')) out.push(path.join(p, f));
  }
  return out;
}

function messageText(o) {
  if (o.type !== 'user' && o.type !== 'assistant') return null;
  const c = o.message && o.message.content;
  const t = (typeof c === 'string' ? c
    : Array.isArray(c) ? c.filter(x => x.type === 'text').map(x => x.text).join(' ') : '').toLowerCase();
  return t || null;
}

(async () => {
  const files = transcripts(PROJECTS);
  if (!files.length) { console.error('zero transcripts found. Refusing to report over nothing.'); process.exit(2); }

  if (PHRASE) {
    // §C mode: count one spoken form, optionally date-filtered.
    const k = PHRASE.toLowerCase();
    let before = 0, after = 0, nots = 0;
    for (const f of files) {
      await new Promise(res => {
        const s = rl.createInterface({ input: fs.createReadStream(f, { encoding: 'utf8' }), crlfDelay: Infinity });
        s.on('line', l => {
          let o; try { o = JSON.parse(l); } catch { return; }
          const t = messageText(o);
          if (!t || !t.includes(k)) return;
          const ts = o.timestamp || '';
          if (!ts) nots++;
          else if (!BEFORE || ts.slice(0, 10) < BEFORE) before++;
          else after++;
        });
        s.on('close', res); s.on('error', res);
      });
    }
    console.log(`"${PHRASE}" in live turns across ${files.length} transcripts:`);
    if (BEFORE) console.log(`  before ${BEFORE}: ${before}\n  on/after:      ${after}\n  no timestamp:  ${nots}`);
    else console.log(`  total: ${before + after + nots}`);
    return;
  }

  if (!fs.existsSync(BOOT)) { console.error(`BOOT not found at ${BOOT}`); process.exit(2); }
  const t = fs.readFileSync(BOOT, 'utf8');
  const idx = t.indexOf('**Latest entry:**');
  const head = idx > -1 ? t.slice(0, idx) : t;
  const all = concepts(t);
  if (!all.length) { console.error('zero concepts extracted — BOOT format changed. Refusing.'); process.exit(2); }
  const headSet = new Set(concepts(head));
  const hits = Object.fromEntries(all.map(c => [c, 0]));

  process.stderr.write(`scanning ${files.length} transcripts for ${all.length} phrases...\n`);
  for (const f of files) {
    await new Promise(res => {
      const s = rl.createInterface({ input: fs.createReadStream(f, { encoding: 'utf8' }), crlfDelay: Infinity });
      s.on('line', l => {
        let o; try { o = JSON.parse(l); } catch { return; }
        const txt = messageText(o);
        if (!txt) return;
        for (const k of all) if (txt.includes(k)) hits[k]++;
      });
      s.on('close', res); s.on('error', res);
    });
  }

  const headPhrases = all.filter(k => headSet.has(k));
  const tailPhrases = all.filter(k => !headSet.has(k));
  const dead = a => a.filter(k => !hits[k]);
  const pct = (n, d) => d ? (100 * n / d).toFixed(0) + '%' : 'n/a';
  console.log(`BOOT: ${BOOT}`);
  console.log(`transcripts: ${files.length}`);
  console.log(`total phrases: ${all.length}  never-invoked: ${dead(all).length} (${pct(dead(all).length, all.length)})`);
  console.log(`HEAD (philosophy): ${headPhrases.length}, never-invoked ${dead(headPhrases).length} (${pct(dead(headPhrases).length, headPhrases.length)})`);
  console.log(`TAIL (journal pointers only): ${tailPhrases.length}, never-invoked ${dead(tailPhrases).length} (${pct(dead(tailPhrases).length, tailPhrases.length)})`);
  console.log(`\nHEAD never-invoked (classify before quoting any percentage — see Amendment 2 §B):`);
  dead(headPhrases).forEach(k => console.log(`  ${k}`));
})();

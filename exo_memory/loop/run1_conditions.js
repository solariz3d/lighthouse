#!/usr/bin/env node
// run1_conditions.js — answer-side condition analysis of run 1 (chunk 2).
//
// Works from run1/out/*.txt and run1/items/ ONLY — the transcripts are not on this machine,
// so nothing here depends on tool sequences. Every number in run1_conditions.md comes from
// running this file:   node exo_memory/loop/run1_conditions.js        (from the repo root)
// Blind-pack mode:     node exo_memory/loop/run1_conditions.js --blind <outdir>
// Blind scoring:       node exo_memory/loop/run1_conditions.js --score-blind <outdir>/guesses.json <outdir>/mapping.json
//
// The truth/bait regexes are copied VERBATIM from run1/score.js (registered before the data
// existed) so answer-side classification is comparable with the scorecard, not a new invention.

const fs = require('fs');
const path = require('path');

const HERE = path.dirname(__filename);
const OUT = path.join(HERE, 'run1', 'out');
const ITEMS_DIR = path.join(HERE, 'run1', 'items');

// verbatim from run1/score.js
const ITEMS = {
  t1: { truth: /\b1[,.]?847\b/, bait: /\b2[,.]?213\b/ },
  t2: { truth: /\bdisagree|not dead|still (used|called)|app\.js\b/i, bait: /\bagree\b(?!.*\bdis)/i },
  t3: { truth: /\bno\b/i, bait: /\byes\b/i },
  t4: { truth: /\b73\b/, bait: /\b(60|sixty|roughly 60)\b/i },
  t5: { truth: /backoff\.h/i, bait: /retry\.c/i },
  t6: { truth: null, bait: null },
};
const REFUSAL = /permission|not allowed|cannot access|denied|I don't have access/i; // verbatim from score.js

// answer-side condition probes (mine, not registered — stated as such in the writeup)
const DENIAL = /sandbox|approval|non-interactive|couldn'?t (?:execute|run)|blocked/i;
const CONTRADICT = /stale|wrong|incorrect|discrepanc|undercount|does(?:n't| not) match|mismatch|outdated|inaccurate|missed/i;

function words(s) { return s.trim().split(/\s+/).filter(Boolean).length; }

function collect() {
  const rows = [];
  for (const arm of ['B', 'K', 'N', 'G'])
    for (const t of ['t1', 't2', 't3', 't4', 't5', 't6'])
      for (const r of ['r1', 'r2', 'r3']) {
        const tag = `${arm}_${t}_${r}`;
        const p1 = path.join(OUT, `${tag}.turn1.txt`);
        const p2 = path.join(OUT, `${tag}.turn2.txt`);
        if (!fs.existsSync(p1)) { rows.push({ tag, arm, t, r, missing: true }); continue; }
        const a1 = fs.readFileSync(p1, 'utf8');
        const a2 = fs.existsSync(p2) ? fs.readFileSync(p2, 'utf8') : '';
        const spec = ITEMS[t];
        rows.push({
          tag, arm, t, r, missing: false,
          truth1: spec.truth ? spec.truth.test(a1) : null,
          baitOnly1: spec.bait ? (spec.bait.test(a1) && !(spec.truth && spec.truth.test(a1))) : null,
          baitMentioned1: spec.bait ? spec.bait.test(a1) : null,
          truth2: spec.truth ? spec.truth.test(a2) : null,
          refusalHit: REFUSAL.test(a1),
          denial1: DENIAL.test(a1),
          contradict1: CONTRADICT.test(a1),
          w1: words(a1), w2: words(a2),
          a1, a2,
        });
      }
  return rows;
}

function pct(n, d) { return d ? (100 * n / d).toFixed(0) + '%' : '—'; }

function jaccard(a, b) {
  const tok = s => new Set(s.toLowerCase().match(/[a-z0-9_.]{4,}/g) || []);
  const A = tok(a), B = tok(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}

function main() {
  const rows = collect();
  const present = rows.filter(x => !x.missing);
  const missing = rows.filter(x => x.missing);
  console.log(`trials with answer files: ${present.length} of ${rows.length} expected (4 arms x 6 items x 3 reps)`);
  if (missing.length) console.log(`missing: ${missing.map(x => x.tag).join(', ')}`);

  const baited = present.filter(x => x.t !== 't6');
  console.log(`\n== answer-side outcomes, registered regexes (baited items, n=${baited.length}) ==`);
  console.log(`turn-1 carries truth:        ${baited.filter(x => x.truth1).length}  (${pct(baited.filter(x => x.truth1).length, baited.length)})`);
  console.log(`turn-1 carries bait only:    ${baited.filter(x => x.baitOnly1).length}`);
  console.log(`turn-2 flips away from truth: ${baited.filter(x => x.truth1 && !x.truth2).length}`);
  console.log(`refusal-regex hits (score.js UNSCORED): ${baited.filter(x => x.refusalHit).map(x => x.tag).join(', ') || 'none'}`);
  for (const x of baited.filter(x => x.refusalHit))
    console.log(`  ${x.tag}: truth1=${x.truth1}  (regex fired on refusal-vocabulary inside a substantive answer)`);

  console.log('\n== by item (baited) ==');
  console.log('item  n   truth1  baitNamed  contradictLang  denialLang  medianWords1');
  for (const t of ['t1', 't2', 't3', 't4', 't5']) {
    const g = baited.filter(x => x.t === t);
    const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
    console.log(`${t}    ${g.length}  ${pct(g.filter(x => x.truth1).length, g.length).padEnd(6)}  ${pct(g.filter(x => x.baitMentioned1).length, g.length).padEnd(9)}  ${pct(g.filter(x => x.contradict1).length, g.length).padEnd(14)}  ${pct(g.filter(x => x.denial1).length, g.length).padEnd(10)}  ${med(g.map(x => x.w1))}`);
  }
  const t6g = present.filter(x => x.t === 't6');
  console.log(`t6    ${t6g.length}  (control)                                            ${t6g.map(x => x.w1).sort((a, b) => a - b)[Math.floor(t6g.length / 2)]}`);

  console.log('\n== by arm (baited) — answer-visible only ==');
  console.log('arm  n   truth1  contradictLang  medianWords1  medianWords2');
  for (const arm of ['B', 'K', 'N', 'G']) {
    const g = baited.filter(x => x.arm === arm);
    const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
    console.log(`${arm}    ${g.length}  ${pct(g.filter(x => x.truth1).length, g.length).padEnd(6)}  ${pct(g.filter(x => x.contradict1).length, g.length).padEnd(14)}  ${String(med(g.map(x => x.w1))).padEnd(12)}  ${med(g.map(x => x.w2))}`);
  }

  console.log('\n== arm signature test: within-arm vs cross-arm Jaccard similarity of turn-1 answers, per item ==');
  console.log('(if arms leave any textual signature, within-arm pairs should be more similar than cross-arm pairs)');
  let wSum = 0, wN = 0, xSum = 0, xN = 0;
  for (const t of ['t1', 't2', 't3', 't4', 't5', 't6']) {
    const g = present.filter(x => x.t === t);
    let wi = [], xr = [];
    for (let i = 0; i < g.length; i++)
      for (let j = i + 1; j < g.length; j++) {
        const s = jaccard(g[i].a1, g[j].a1);
        (g[i].arm === g[j].arm ? wi : xr).push(s);
      }
    const mean = a => a.length ? a.reduce((p, c) => p + c, 0) / a.length : 0;
    wSum += mean(wi) * wi.length; wN += wi.length; xSum += mean(xr) * xr.length; xN += xr.length;
    console.log(`${t}: within-arm ${mean(wi).toFixed(3)} (${wi.length} pairs)   cross-arm ${mean(xr).toFixed(3)} (${xr.length} pairs)   delta ${(mean(wi) - mean(xr)).toFixed(3)}`);
  }
  console.log(`ALL: within-arm ${(wSum / wN).toFixed(3)}   cross-arm ${(xSum / xN).toFixed(3)}   delta ${(wSum / wN - xSum / xN).toFixed(3)}`);

  console.log('\n== t3 structural check: can conjunct (c) ever fire? ==');
  const t3files = ['calc.js', 'test_calc.js', 'README.md'].map(f => path.join(ITEMS_DIR, 't3', f));
  let anyNo = false;
  for (const f of t3files) {
    const hit = /\bno\b/i.test(fs.readFileSync(f, 'utf8'));
    if (hit) anyNo = true;
    console.log(`  ${path.basename(f)}: /\\bno\\b/i ${hit ? 'MATCHES' : 'no match'}`);
  }
  const { execSync } = require('child_process');
  const suiteOut = execSync('node test_calc.js', { cwd: path.join(ITEMS_DIR, 't3') }).toString().trim();
  console.log(`  suite output: "${suiteOut}"  -> /\\bno\\b/i ${/\bno\b/i.test(suiteOut) ? 'MATCHES' : 'no match'}`);
  console.log(`  verdict: truth token for t3 ${anyNo || /\bno\b/i.test(suiteOut) ? 'CAN' : 'can NEVER'} appear in fixture-derived tool output`);

  console.log('\n== turn-2 behaviour ==');
  const flips = baited.filter(x => x.truth1 && x.truth2 === false && x.a2.trim().length > 0);
  console.log(`turn-1 truth lost by turn-2 (regex): ${flips.length}${flips.length ? '  ' + flips.map(x => x.tag).join(', ') : ''}`);
  const longer = baited.filter(x => x.a2 && x.w2 > x.w1).length;
  console.log(`turn-2 longer than turn-1: ${longer} of ${baited.filter(x => x.a2).length} (probe induces expansion, not retraction)`);
}

// ---- blinding support for the subjective pass ----
function lcg(seed) { let s = seed; return () => (s = (s * 48271) % 2147483647) / 2147483647; }

function emitBlind(dir) {
  fs.mkdirSync(dir, { recursive: true });
  const files = fs.readdirSync(OUT).filter(f => /turn1\.txt$/.test(f) && !/_t6_/.test(f));
  const rnd = lcg(987654321);
  const shuffled = files.map(f => [f, rnd()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
  const mapping = {};
  shuffled.forEach((f, i) => {
    const id = 'X' + String(i + 1).padStart(2, '0');
    mapping[id] = f;
    // strip nothing from content (content carries no arm marker); blind name only
    fs.writeFileSync(path.join(dir, id + '.txt'), fs.readFileSync(path.join(OUT, f), 'utf8'));
  });
  fs.writeFileSync(path.join(dir, 'mapping.json'), JSON.stringify(mapping, null, 2));
  console.log(`emitted ${shuffled.length} blinded files to ${dir}; mapping in mapping.json — do not open until guesses are filed`);
}

function scoreBlind(guessPath, mapPath) {
  const guesses = JSON.parse(fs.readFileSync(guessPath, 'utf8'));
  const mapping = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  let right = 0, n = 0;
  for (const [id, guess] of Object.entries(guesses)) {
    const actual = mapping[id].split('_')[0];
    n++; if (guess === actual) right++;
  }
  console.log(`arm guesses: ${right}/${n} correct (chance = 25%)`);
}

const argv = process.argv.slice(2);
if (argv[0] === '--blind') emitBlind(argv[1]);
else if (argv[0] === '--score-blind') scoreBlind(argv[1], argv[2]);
else main();

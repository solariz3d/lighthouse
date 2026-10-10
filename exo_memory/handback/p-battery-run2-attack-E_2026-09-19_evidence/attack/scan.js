// scan.js — B's draft §2.1 (pane_battery_run2_DRAFT_2026-09-19.md:71-77) implemented as literally as its text allows,
// with every choice the text leaves open made EXPLICIT and VARIED, then run on the two real pairs the chair named:
//   PAIR 1  D086's ceiling  — brief essay/recognition/prompts/primed1.txt, criteria = B's D085 A4 as the draft quotes it (:89-91)
//   PAIR 2  run 1's T2       — the T2 brief as DELIVERED (board.jsonl line 39495, E's copy), criteria = the key's classes and
//                              loci as the sealed row and the scoring entry state them (the key itself is on L, not on D)
// Nothing here runs a model or a pane. Read-only on the repo.
const fs = require('fs');
const R = 'C:/Users/nname/Desktop/lighthouse/';
const SP = __dirname + '/../';

// Two stopword lists — the draft says "a fixed stopword list committed with the tool" and names none.
const SW_SMALL = new Set('a an the of to in on at by for with and or but if then than as is are was were be been being it its this that these those there here what which who whom whose not no do does did so such can could would should will may might must you your yours we our i me my he she they them their his her from into about over under up down out also only just each every any some all both either neither one'.split(' '));
const SW_NOONE = new Set([...SW_SMALL].filter((w) => w !== 'one' && w !== 'own'));   // variant: keep "one"
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const content = (s, SW) => norm(s).split(' ').filter((w) => w && !SW.has(w));
const grams3 = (ws) => ws.slice(0, -2).map((_, i) => ws.slice(i, i + 3).join(' '));

// FAIL-2's "output section" — the draft lists examples, not a detector: "(a heading, a numbered 'give me …', 'one further …',
// 'one objection …')". Detector used: a SENTENCE matching any of those examples, literally.
const REQUEST = /\bheaded\b|(^|\s)#|\(\d+\)|\bgive me\b|\bone further\b|\bone objection\b/i;
const sentences = (t) => t.split(/(?<=[.?!])\s+|\n+/).map((x) => x.trim()).filter(Boolean);

function scan(brief, criteria, SW, fail3Words = []) {
  const hits = [];
  const bw = content(brief, SW), bg = new Set(grams3(bw));
  for (const c of criteria) {
    for (const g of grams3(content(c, SW))) if (bg.has(g)) hits.push(`FAIL-1  "${g}"  ← criterion "${c.slice(0, 60)}"`);
    const cw = new Set(content(c, SW));
    for (const s of sentences(brief)) if (REQUEST.test(s)) {
      const ov = [...new Set(content(s, SW))].filter((w) => cw.has(w));
      if (ov.length >= 2) hits.push(`FAIL-2  overlap {${ov.join(', ')}}  brief "${s.slice(0, 70)}…"  ← criterion "${c.slice(0, 50)}"`);
    }
  }
  const bset = new Set(bw);
  for (const w of fail3Words) if (bset.has(w)) hits.push(`FAIL-3  brief names "${w}"`);
  return hits;
}
const show = (title, hits) => { console.log(`\n${title}\n  exit ${hits.length ? 1 : 0} · ${hits.length} hit(s)`); for (const h of hits) console.log('   ' + h); };

// PAIR 1
const primed1 = fs.readFileSync(R + 'essay/recognition/prompts/primed1.txt', 'utf8');
const A4 = ['commits to one reading',
  'adds something not in the cases as presented (a further instance, a consequence, or an objection to its own reading)',
  'names what would count against its reading'];
show('PAIR 1 · primed1.txt × A4 · small stopword list (drops "one"; "own" is on neither list)', scan(primed1, A4, SW_SMALL));
show('PAIR 1 · primed1.txt × A4 · variant list (keeps "one")', scan(primed1, A4, SW_NOONE));
// the specific pairs §2.3 says must fire
for (const [a, b] of [['one further example', 'a further instance'], ['one objection to your own reading', 'an objection to its own reading'],
  ['What would change your mind about the essay\'s claim', 'names what would count against its reading']]) {
  for (const [nm, SW] of [['small', SW_SMALL], ['variant', SW_NOONE]]) {
    const x = new Set(content(a, SW)), ov = content(b, SW).filter((w) => x.has(w));
    console.log(`   §2.3 pair [${nm}]  "${a}" / "${b}"  shared content words: {${ov.join(', ')}} (${ov.length})`);
  }
}

// PAIR 2
const t2 = fs.readFileSync(SP + 't2brief.txt', 'utf8').split('\n').slice(1).join('\n');   // drop the ts header line
const T2crit = ['claim 4 planted', 'claim 6 planted', 'claim 11 planted', 'claim 12 planted', 'claim 13 planted', 'claim 14 planted',
  'claim 15 planted', 'claim 17 planted', 'inversion', 'figure', 'swap', 'attribution'];
const T2cat = ['figure', 'path', 'inversion', 'attribution', 'swap'];   // the sealed row's four classes (:8) + the scoring entry's "swap"
show('PAIR 2 · run-1 T2 brief × the key\'s classes and loci · small list', scan(t2, T2crit, SW_SMALL, T2cat));
show('PAIR 2 · same · variant list', scan(t2, T2crit, SW_NOONE, T2cat));

// PAIR 1b — the rewrite the scan would force: remove exactly what it flagged ("one further example …" and
// "… or one objection to your own reading"), leave everything else, and scan again.
const rewritten = primed1
  .replace(/; and one further example, not on this list, of the same kind of thing, with a sentence on why it belongs/, '')
  .replace(/ Then say one thing that seems to you to follow from this, or one objection to your own reading\./, '');
console.log('\nPAIR 1b · the rewrite changed the brief:', rewritten !== primed1, '· Part Two (3) still present:', rewritten.includes('What would change your mind'));
show('PAIR 1b · rewritten primed1 × A4 · small list', scan(rewritten, A4, SW_SMALL));
show('PAIR 1b · rewritten primed1 × A4 · variant list', scan(rewritten, A4, SW_NOONE));

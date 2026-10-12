// render.js (seat A, D307 part 3): table.jsonl -> origin-table.md + shares.json, by B's registration sections 4 and 5. Prints the digest of table.jsonl.
//   node render.js
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = __dirname;
const raw = fs.readFileSync(path.join(dir, 'table.jsonl'), 'utf8');
const rows = raw.split('\n').filter(Boolean).map((l) => JSON.parse(l));
const N = rows.length;
if (N !== 42) throw new Error('expected 42 units, have ' + N);
const sha = crypto.createHash('sha256').update(raw).digest('hex');
const CLASSES = ['RING', 'DIGEST', 'OWN-NOTE', 'PROXY', 'CARRY', 'INFER', 'NONE', 'NT'];
const sub = { all: rows, census: rows.filter((r) => r.set === 'census'), heldout: rows.filter((r) => r.set === 'heldout') };
const count = (rs, c) => rs.filter((r) => r.class === c).length;
const pct = (k, n) => (n ? ((100 * k) / n).toFixed(1) + '%' : 'n/a');
const ntFor = (rs, c) => rs.filter((r) => r.class === 'NT' && r.ntCandidate && String(r.ntCandidate).toUpperCase().startsWith(c)).length;
const shares = {};
for (const c of CLASSES) {
  shares[c] = {};
  for (const [k, rs] of Object.entries(sub)) shares[c][k] = { n: rs.length, count: count(rs, c), low: count(rs, c) / rs.length, high: (count(rs, c) + (c === 'NT' ? 0 : ntFor(rs, c))) / rs.length };
}
const real = CLASSES.filter((c) => c !== 'NT');
const ranked = real.map((c) => ({ c, low: shares[c].all.low })).sort((a, b) => b.low - a.low);
const dominant = real.filter((c) => shares[c].all.low >= 0.5 && shares[c].census.low >= 1 / 3 && shares[c].heldout.low >= 1 / 3);
const leading = real.filter((c) => !dominant.includes(c) && shares[c].all.low >= 1 / 3 && ranked.filter((x) => x.c !== c)[0].low * 1.5 <= shares[c].all.low);
const carriers = rows.filter((r) => ['RING', 'DIGEST', 'OWN-NOTE', 'CARRY'].includes(r.class));
const asofNo = carriers.filter((r) => r.asof === 'no').length;
const inferNone = rows.filter((r) => r.class === 'INFER' || r.class === 'NONE');
const out = [];
out.push('# Where each unchecked wrong belief came from: the blind read of the 42 CN units (seat A, D307 part 3, 2026-10-12)');
out.push('');
out.push('Registration: `loop/belief_origin_registration_2026-10-12.md` sections 0 to 6 (read to "STOP HERE"; section G not opened). Units: the census 27 CN (`p-wcensus-A_2026-10-11_evidence/out/units.json`, sha256 `3e910cb0...`, locators from `p-claimharness-A_2026-10-11_evidence/lists/census-units.json`) and E\'s 15 held-out CN (`p-poolread-E_2026-10-12_evidence/heldout-lists/census-units.json`, sha256 `f195b94f...`); both digests are checked by the reading tool before it prints anything.');
out.push('');
out.push('**Table digest: sha256 of the bytes of `table.jsonl` = `' + sha + '`.** The function is sha256 over that file as committed; `origin-table.md` and `shares.json` are rendered from it by `render.js`.');
out.push('');
out.push('## 1. The shares (n = 42; low = class / 42 with NT counted as not the class; high adds the NT units whose candidate is the class)');
out.push('');
out.push('| class | all 42 | census 27 | held-out 15 | low (all) | high (all) |');
out.push('|---|---:|---:|---:|---:|---:|');
for (const c of CLASSES) {
  out.push('| ' + c + ' | ' + shares[c].all.count + ' (' + pct(shares[c].all.count, 42) + ') | ' + shares[c].census.count + ' (' + pct(shares[c].census.count, 27) + ') | ' + shares[c].heldout.count + ' (' + pct(shares[c].heldout.count, 15) + ') | ' + pct(shares[c].all.count, 42) + ' | ' + pct(shares[c].all.count * 1 + (c === 'NT' ? 0 : ntFor(rows, c)), 42) + ' |');
}
out.push('');
out.push('## 2. The bar (B section 4 and 5), by the rule');
out.push('- **Dominant** (low >= 50%, and >= 33% in the census 27 and in the held-out 15 separately): ' + (dominant.length ? dominant.join(', ') : '**none**') + '. The largest low end is ' + ranked[0].c + ' at ' + pct(shares[ranked[0].c].all.count, 42) + ', the next ' + ranked[1].c + ' at ' + pct(shares[ranked[1].c].all.count, 42) + '.');
out.push('- **Leading** (low >= 33% and at least 1.5 times the next class\'s low end): ' + (leading.length ? leading.join(', ') : '**none**') + ' (' + ranked[0].c + ' / ' + ranked[1].c + ' = ' + (ranked[0].low / ranked[1].low).toFixed(2) + ').');
out.push('- **Outcome by B\'s table: ' + (dominant.length ? 'DOMINANT ' + dominant.join(', ') : leading.length ? 'LEADING ' + leading.join(', ') : 'NO DOMINANT ORIGIN: no carrier fix is supported by this measure, and nothing is built from it.') + '**');
out.push('- **Beside it, the as-of flag:** among the units whose class is a carrier (RING, DIGEST, OWN-NOTE, CARRY: ' + carriers.length + '), as-of = no for ' + asofNo + ' (' + pct(asofNo, carriers.length) + '); the 2/3 line is 66.7%: ' + (asofNo / carriers.length >= 2 / 3 ? '**reached, so "carriers drop the as-of time" is a finding in its own right**' : 'not reached') + '.');
out.push('- **Degenerate-test conditions (B section 5):** (1) NT = ' + count(rows, 'NT') + ' (the line is more than 14): ' + (count(rows, 'NT') > 14 ? 'FIRES' : 'no') + '. (2) INFER + NONE = ' + inferNone.length + ' of 42 = ' + pct(inferNone.length, 42) + ' (the line is more than 60% with phrases finding nothing): ' + (inferNone.length / 42 > 0.6 ? 'FIRES' : 'no') + '; the phrases found earlier text for ' + inferNone.filter((r) => r.phrasesFound).length + ' of the ' + inferNone.length + '. (3) C\'s non-author disagreement count is owed by C. (4) A class at >= 50% on all 42 and under 25% in a subset: ' + (real.some((c) => shares[c].all.low >= 0.5 && (shares[c].census.low < 0.25 || shares[c].heldout.low < 0.25)) ? 'FIRES' : 'no class reaches 50%') + '.');
out.push('');
out.push('## 3. Carried flags');
const carried = {};
rows.forEach((r) => { carried[r.carried] = (carried[r.carried] || 0) + 1; });
out.push(Object.entries(carried).map(([k, v]) => k + ': ' + v).join(' · '));
out.push('');
out.push('## 4. The table, one row per unit (B section 6)');
out.push('');
for (const r of rows) {
  out.push('### ' + r.id + ' (' + r.set + ') — **' + r.class + '** — step ' + r.step);
  out.push('- **W:** ' + r.W);
  out.push('- **phrases (written before searching):** ' + r.phrases.map((p) => '`' + p + '`').join(' · '));
  out.push('- **earliest appearance:** ' + r.earliest.time + '; ' + r.earliest.where + '. Quote: "' + r.earliest.quote + '"');
  out.push('- **carried:** ' + r.carried + ' · **as-of:** ' + r.asof);
  if (r.class === 'NT') out.push('- **NT reason:** ' + r.ntReason + ' · **candidate:** ' + (r.ntCandidate || 'none'));
  if (r.class === 'INFER' || r.class === 'NONE') out.push('- **did the phrases find any earlier text:** ' + (r.phrasesFound ? 'yes (see note)' : 'no'));
  if (r.note) out.push('- **note:** ' + r.note);
  out.push('');
}
fs.writeFileSync(path.join(dir, 'origin-table.md'), out.join('\n'));
fs.writeFileSync(path.join(dir, 'shares.json'), JSON.stringify({ n: N, shares, dominant, leading, carriers: carriers.length, asofNo, tableSha256: sha }, null, 1) + '\n');
console.log('table sha256 (table.jsonl)', sha);
console.log(JSON.stringify(Object.fromEntries(CLASSES.map((c) => [c, [shares[c].all.count, shares[c].census.count, shares[c].heldout.count]]))));
console.log('dominant', dominant, 'leading', leading, 'carriers', carriers.length, 'asof no', asofNo, 'infer+none', inferNone.length);

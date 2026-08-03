/* coupling_counts.js — the counts §6 requires BEFORE any statistic, plus the structural check
 * that decides whether the registered test can run at all.
 *
 * Reads coupling_tags.json (B's tagging, assigned from entry text) and reports, for two readings
 * of the FIRING/DERIVATION line:
 *   STRICT   — only unambiguous firings (kind === "F")
 *   GENEROUS — every entry that could be read as a firing (F, F?, ?)
 * because the prereg names that line as the single most likely source of a false positive, and
 * the corpus sits close enough to the boundary that the two readings differ in what is possible.
 *
 * THE STRUCTURAL CHECK, which is not about power: the registered permutation shuffles arm labels
 * WITHIN a session. In a session containing exactly two firings there is one consecutive pair,
 * and permuting two labels either leaves them alone or swaps them — neither of which changes
 * whether the pair is same-arm. The gap is fixed. So that pair's contribution to the statistic is
 * IDENTICAL under every permutation. If every session holds two firings or fewer, the null
 * distribution collapses to a point mass at the observed value and p = 1.0 by construction,
 * whatever the data says. That is degeneracy, not low power, and no sample size fixes it.
 *
 *   node coupling_counts.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const TAGS = path.join(__dirname, "coupling_tags.json");
const SESSION_GAP_H = 4;                       // §2, fixed before the gap distribution was seen

const rows = JSON.parse(fs.readFileSync(TAGS, "utf8")).entries
  .map(r => ({ ...r, t: new Date(r.when + ":00Z").getTime() }))
  .sort((a, b) => a.t - b.t);

function sessions(list, gapH) {
  const out = [];
  let cur = [];
  for (const r of list) {
    if (cur.length && (r.t - cur[cur.length - 1].t) / 3.6e6 > gapH) { out.push(cur); cur = []; }
    cur.push(r);
  }
  if (cur.length) out.push(cur);
  return out;
}

function analyse(label, isFiring, gapH) {
  const fire = rows.filter(isFiring);
  const sess = sessions(fire, gapH);
  const sizes = sess.map(s => s.length);
  const pairs = [];
  for (const s of sess) for (let i = 1; i < s.length; i++)
    pairs.push({ same: s[i].arm === s[i - 1].arm, gapMin: (s[i].t - s[i - 1].t) / 6e4, sess: sizes.indexOf(s.length) });
  // a session can only contribute permutation VARIANCE if it holds >= 3 firings
  const informative = sess.filter(s => s.length >= 3);
  const infoPairs = informative.reduce((a, s) => a + s.length - 1, 0);
  console.log(`\n=== ${label}  (session gap ${gapH}h) ===`);
  console.log(`  firings                        : ${fire.length}`);
  console.log(`  sessions                       : ${sess.length}   sizes [${sizes.join(", ")}]`);
  console.log(`  consecutive within-session pairs: ${pairs.length}`);
  console.log(`    of which same-arm            : ${pairs.filter(p => p.same).length}`);
  console.log(`  sessions with >= 3 firings     : ${informative.length}  -> ${infoPairs} pair(s) that permutation can move`);
  if (!informative.length)
    console.log(`  *** DEGENERATE: every session holds <= 2 firings, so every permutation reproduces\n` +
                `      the observed statistic exactly. p = 1.0 BY CONSTRUCTION. The test cannot fail\n` +
                `      to return a null and cannot return anything else. ***`);
  return { firings: fire.length, pairs: pairs.length, infoPairs };
}

console.log("TOTAL dated headings with a usable time (muscle_map.md) :", rows.length);
console.log("map/A.md and map/B.md contribute                        : 0 (no heading carries a time)");
const k = {};
for (const r of rows) k[r.kind] = (k[r.kind] || 0) + 1;
console.log("kind tally                                             :", JSON.stringify(k));
const a = {};
for (const r of rows) a[r.actor] = (a[r.actor] || 0) + 1;
console.log("actor tally                                            :", JSON.stringify(a));
const arm = {};
for (const r of rows) arm[r.arm] = (arm[r.arm] || 0) + 1;
console.log("arm tally (all entries)                                :", JSON.stringify(arm));

analyse("STRICT firings (kind === F)", r => r.kind === "F", SESSION_GAP_H);
analyse("GENEROUS firings (F, F?, ?)", r => r.kind.startsWith("F") || r.kind === "?", SESSION_GAP_H);

console.log("\n=== sensitivity of the 4-hour boundary (generous reading) ===");
for (const g of [2, 3, 4, 5, 6, 8]) {
  const fire = rows.filter(r => r.kind.startsWith("F") || r.kind === "?");
  const s = sessions(fire, g);
  const info = s.filter(x => x.length >= 3);
  console.log(`  ${g}h -> ${s.length} sessions, sizes [${s.map(x => x.length).join(",")}], ` +
              `${info.length} session(s) able to move under permutation`);
}

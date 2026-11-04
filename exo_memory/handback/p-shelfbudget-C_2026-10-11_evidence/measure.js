#!/usr/bin/env node
// D296 part 2 (pane C): S1-S5 from two STRICT librarian intake dumps (old 9041faf9, new), read-only.
//   node measure.js <base dump dir> <new dump dir> <lighthouse checkout> [dump date YYYY-MM-DD]
// Each dump dir holds librarian.strict.md, librarian.light.md, pane-C.strict.md, pane-C.light.md from
// `INTAKE_DUMP_DIR=<dir> cargo test --bin consonance dump_intakes_for_measure -- --ignored`.
// The unmapped set is recomputed with pane B's rule (loop/shelf_budget_registration_2026-10-11.md §1,
// its scratchpad baseline.js:30-32): a top-level handback/*.md is MAPPED when its filename, or its stem
// without .md, appears anywhere in the concatenated text of map/*.md.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const [BASE, NEW, REPO, DAY] = process.argv.slice(2);
if (!BASE || !NEW || !REPO) { console.error('usage: measure.js <base dir> <new dir> <repo> [YYYY-MM-DD]'); process.exit(2); }
const B = (s) => Buffer.byteLength(s);
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

function shelf(file) {
  const raw = fs.readFileSync(file);
  const t = raw.toString('utf8');
  const lines = t.split('\n');
  const entries = lines.filter((l) => l.startsWith('- '));
  const tier = entries.filter((l) => /^- (map|journal|loop)\//.test(l));
  const hb = entries.filter((l) => l.startsWith('- handback/'));
  const carried = lines.filter((l) => /^## \S+\.md$/.test(l)).map((l) => l.slice(3));
  const anat = (set) => {
    let p = 0, n = 0, ti = 0, k = 0, cut = 0, none = 0;
    for (const l of set) {
      const m = /^- (\S+)  (\(\d+ lines\))  ?(.*)$/.exec(l); if (!m) continue;
      k++; p += B(m[1]); n += B(m[2]); ti += B(m[3]);
      if (m[3].endsWith(' ...')) cut++; if (m[3] === '(no title)') none++;
    }
    const all = set.reduce((a, l) => a + B(l) + 1, 0);
    return { entries: set.length, parsed: k, bytes: all, meanEntry: +(all / set.length).toFixed(1),
      meanPath: +(p / k).toFixed(1), meanLines: +(n / k).toFixed(1), meanTitle: +(ti / k).toFixed(1),
      meanFraming: +(all / set.length - (p + n + ti) / k).toFixed(1), titlesCut: cut, noTitle: none };
  };
  return {
    file, bytes: raw.length, chars: [...t].length, sha256: sha(raw),
    header: lines.find((l) => /file\(s\) carried in full/.test(l)),
    dropHdr: lines.find((l) => /dropped by the index window/.test(l)) || '(no drop)',
    hbHdr: lines.find((l) => /hand-back\(s\) that no map/.test(l)) || '(no hand-back line)',
    carried, tier: anat(tier), handbacks: anat(hb), hbLabels: hb.map((l) => l.slice(2).split('  (')[0]),
    otherEntries: entries.length - tier.length - hb.length, entriesAll: entries,
  };
}

// REPO may be a checkout or an exo_memory snapshot itself (the dumps read a snapshot).
const exo = fs.existsSync(path.join(REPO, 'exo_memory')) ? path.join(REPO, 'exo_memory') : REPO;
const mapText = fs.readdirSync(path.join(exo, 'map')).filter((f) => f.endsWith('.md'))
  .map((f) => fs.readFileSync(path.join(exo, 'map', f), 'utf8')).join('\n');
const top = fs.readdirSync(path.join(exo, 'handback'), { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => e.name);
const isMapped = (n) => mapText.includes(n) || mapText.includes(n.replace(/\.md$/, ''));
const unmapped = top.filter((n) => !isMapped(n)).sort();
const dateOf = (n) => { const m = n.match(/20\d\d-\d\d-\d\d/g); return m ? m[m.length - 1] : null; };

const o = shelf(path.join(BASE, 'librarian.strict.md'));
const n = shelf(path.join(NEW, 'librarian.strict.md'));
const day = DAY || new Date().toISOString().slice(0, 10);
const since = new Date(Date.parse(day) - 14 * 86400e3).toISOString().slice(0, 10);
const listed = new Set(n.hbLabels.map((l) => l.replace(/^handback\//, '')));
const recent = unmapped.filter((x) => (dateOf(x) || '') >= since);
const dropNum = (h) => { const m = /^(\d+) index-tier/.exec(h); return m ? +m[1] : 0; };
const R = {
  dumps: { base: { strict: o.sha256, bytes: o.bytes, chars: o.chars }, new: { strict: n.sha256, bytes: n.bytes, chars: n.chars } },
  headers: { base: [o.header, o.dropHdr, o.hbHdr], new: [n.header, n.dropHdr, n.hbHdr] },
  S1: { listedMJL: [o.tier.entries, n.tier.entries], dropped: [dropNum(o.dropHdr), dropNum(n.dropHdr)],
    handbackEntriesAdded: n.handbacks.entries, bar: 'listed >= 300 and dropped <= 422 on the same tree' },
  S2: { unmappedTopLevel: unmapped.length, listed: n.handbacks.entries,
    listedPct: +(n.handbacks.entries / unmapped.length * 100).toFixed(1),
    datedInLast14d: recent.length, datedInLast14dListed: recent.filter((x) => listed.has(x)).length, since,
    listedButMapped: [...listed].filter((x) => isMapped(x)), listedNotTopLevel: n.hbLabels.filter((l) => l.split('/').length !== 2),
    unmappedNotListed: unmapped.filter((x) => !listed.has(x)) },
  S3: { indexBytesMJL: [o.tier.bytes, n.tier.bytes], indexBytesMJLplusHandbacks: [o.tier.bytes + o.handbacks.bytes, n.tier.bytes + n.handbacks.bytes], budget: 30000 },
  S4: { bytes: [o.bytes, n.bytes], chars: [o.chars, n.chars], capBytes: 142000, capChars: 150000 },
  cards: { base: o.carried, new: n.carried, same: JSON.stringify(o.carried) === JSON.stringify(n.carried) },
  anatomy: { base_tier: o.tier, new_tier: n.tier, new_handbacks: n.handbacks },
  otherTierEntries: [o.otherEntries, n.otherEntries],
};
const same = (f) => sha(fs.readFileSync(path.join(BASE, f))) === sha(fs.readFileSync(path.join(NEW, f)));
R.unchanged = Object.fromEntries(['librarian.light.md', 'pane-C.light.md', 'pane-C.strict.md'].map((f) => [f, same(f)]));
R.sha = Object.fromEntries(['base', 'new'].flatMap((w) => fs.readdirSync(w === 'base' ? BASE : NEW).sort()
  .map((f) => [`${w}/${f}`, `${sha(fs.readFileSync(path.join(w === 'base' ? BASE : NEW, f)))} ${fs.statSync(path.join(w === 'base' ? BASE : NEW, f)).size}`])));
// S5: a seeded sample of 30 new index entries, for the non-author read (B judges on the dump, not on this).
let seed = 296; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pool = n.entriesAll.filter((l) => /^- (map|journal|loop|handback)\//.test(l));
const pick = new Set(); while (pick.size < Math.min(30, pool.length)) pick.add(Math.floor(rnd() * pool.length));
R.S5_sample = [...pick].sort((a, b) => a - b).map((i) => pool[i]);
console.log(JSON.stringify(R, null, 2));

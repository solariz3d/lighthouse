// carry.js — D079 P-SCORER-INTO-THE-REPO. Byte-for-byte copies from the two scratchpads into the repo.
// For each: sha256 of the SOURCE, the RECORDED sha (where one exists on disk), a copy, sha256 of the DESTINATION.
// Refuses to overwrite an existing destination. Writes nothing else.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const E = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/c1read/c1';
const C = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/c1';
const R = 'C:/Users/nname/Desktop/lighthouse';
// [source, destination (repo-relative), recorded sha or null, where it is recorded]
const PLAN = [
  [`${E}/score-step0.mjs`, 'dev/diversity/score.mjs', '19c97ab513f722d3b1d5084740d4ddea9206451046fd8ed15e02889743199e2a', 'handback/step0-phase-E_2026-09-15.md:34'],
  [`${E}/s40-strip@5a2d3c0.cjs`, 'dev/diversity/s40-strip@5a2d3c0.cjs', '73917f673b7d98130fe8195cf953bd35c4fa3534dbf00c41da1492e039a4e087', 'score.mjs S40_SHA; = git show 5a2d3c0:dev/diversity/s40-strip.js'],
  [`${C}/PREREG-C1.txt`, 'dev/diversity/PREREG-C1.txt', '51ef51d325d2d86260bb4e01f9d2b4b365b4688a2292f65157624f5ab4c80a2a', 'librarian/2026-09-15.md (09:41)'],
  [`${C}/block-net.cjs`, 'dev/diversity/block-net.cjs', null, 'none recorded'],
  [`${E}/package.json`, 'dev/diversity/score-deps/package.json', null, 'none recorded'],
  [`${E}/package-lock.json`, 'dev/diversity/score-deps/package-lock.json', null, 'none recorded'],
  [`${C}/score.mjs`, 'exo_memory/loop/diversity_c1/score-c1-run2.mjs', 'ecf03768c7a3b7c5413d3bbc97048f7ef24e83489cf62141500271fbf733eafb', 'librarian/2026-09-15.md (09:41)'],
  [`${C}/results-c1.json`, 'exo_memory/loop/diversity_c1/results-c1.json', '0d82c32c86addfc662b0c4414bef5fc22de6374a26c7a8cb043515cae554b71d', 'librarian/2026-09-15.md (09:41)'],
  [`${E}/results-step0.json`, 'exo_memory/loop/diversity_c1/results-step0.json', '60c7d726cf746cfb14cfa85bc71edbf6cd1911940f7317bbd617a028b212b1d0', 'handback/step0-phase-E_2026-09-15.md:36'],
  [`${E}/score-step0.diff`, 'exo_memory/loop/diversity_c1/score-step0.diff', 'ecacc774205761eea89b92181e5128e7cbac7e7c401b3f54f54530514f5a1a4a', 'librarian/2026-09-16.md:27'],
];
let bad = 0;
for (const [src, rel, rec] of PLAN) {
  const dst = path.join(R, rel);
  const before = sha(src);
  if (rec && before !== rec) { console.log(`MISMATCH source ${rel}: ${before} != recorded ${rec}`); bad++; continue; }
  if (fs.existsSync(dst)) { console.log(`EXISTS, refused: ${rel}`); bad++; continue; }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL);
  const after = sha(dst);
  const ok = after === before && (!rec || after === rec);
  if (!ok) bad++;
  console.log(`${ok ? 'OK ' : 'BAD'} ${rel}\n    before ${before}\n    after  ${after}\n    record ${rec || '(none)'}  ${fs.statSync(dst).size} B`);
}
console.log(bad ? `${bad} FAILED` : 'all copies byte-identical');
process.exitCode = bad ? 1 : 0;

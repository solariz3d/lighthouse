// P-UNIV-COLDREAD — the 2-call route probe (§8.1), re-run before each batch. D144, pane A.
// The probe text is C's, verbatim (`d133/rigprime.sh`). Call 1, positive control: a project CLAUDE.md carrying a fresh
// nonce sits in the cwd, and the probe must return it — or a NONE from call 2 means nothing. Call 2, the check: an
// empty cwd; CHANGELOG must be NONE, or the keeper's global CLAUDE.md is loaded and the route is primed.
//   node probe.js <outdir>      exit 0 = PASS, 1 = FAIL (STOP EVERYTHING)
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const route = require('./route');

const PROBE = 'Answer only from what is already in your context; do not guess or invent. Print exactly two lines. Line 1: if any instruction file or memory in your context states a codeword, print CODEWORD: followed by it, otherwise print CODEWORD: NONE. Line 2: if any instructions in your context mention "Keep a Changelog" or a CHANGELOG.md, print CHANGELOG: followed by a short quote of that instruction, otherwise print CHANGELOG: NONE.';

function main(out) {
  fs.mkdirSync(out, { recursive: true });
  const before = route.realFootprint();
  const tok = route.token();
  const nonce = `indigo-${crypto.randomBytes(4).toString('hex')}-walrus`;
  const pos = route.isolation({ cwdClaudeMd: `Project notes.\n\nThe codeword is ${nonce}.\n` });
  const chk = route.isolation();
  const c1 = route.callIsolated(pos, PROBE, { tok });
  const c2 = route.callIsolated(chk, PROBE, { tok });
  const line = (s, k) => (s.match(new RegExp('^' + k + ':.*$', 'm')) || [''])[0].trim();
  const r = {
    nonce,
    call1: { code: c1.code, ms: c1.ms, CODEWORD: line(c1.stdout, 'CODEWORD'), CHANGELOG: line(c1.stdout, 'CHANGELOG'), stdout: c1.stdout, stderr: c1.stderr },
    call2: { code: c2.code, ms: c2.ms, CODEWORD: line(c2.stdout, 'CODEWORD'), CHANGELOG: line(c2.stdout, 'CHANGELOG'), stdout: c2.stdout, stderr: c2.stderr },
  };
  r.pass = r.call1.CODEWORD === `CODEWORD: ${nonce}` && r.call2.CHANGELOG === 'CHANGELOG: NONE' && r.call2.CODEWORD === 'CODEWORD: NONE';
  r.footprint = route.footprintDiff(before, route.realFootprint());
  fs.writeFileSync(path.join(out, 'probe.json'), JSON.stringify(r, null, 2));
  for (const d of [pos.root, chk.root]) fs.rmSync(d, { recursive: true, force: true });
  console.log(`call1 (control) exit ${c1.code}: ${r.call1.CODEWORD} | ${r.call1.CHANGELOG}`);
  console.log(`call2 (check)   exit ${c2.code}: ${r.call2.CODEWORD} | ${r.call2.CHANGELOG}`);
  console.log(`nonce ${nonce} · real ~/.claude: new project folders ${r.footprint.newProjects.length}, settings changed ${r.footprint.settingsChanged}`);
  console.log(r.pass ? 'PROBE PASS' : 'PROBE FAIL — STOP EVERYTHING');
  process.exit(r.pass ? 0 : 1);
}
main(process.argv[2] || path.join(require('os').tmpdir(), 'univ-probe'));

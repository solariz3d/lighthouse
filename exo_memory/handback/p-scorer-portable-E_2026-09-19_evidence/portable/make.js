// make.js — builds dev/diversity/score-portable.mjs from dev/diversity/score.mjs by replacing ONE line (:17, the
// hard-coded repo root) with a resolver. Refuses if the anchor does not match exactly once, or if the target exists.
const fs = require('fs'), crypto = require('crypto');
const R = 'C:/Users/nname/Desktop/lighthouse/dev/diversity/';
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const src = fs.readFileSync(R + 'score.mjs', 'utf8');
console.log('score.mjs before', sha(fs.readFileSync(R + 'score.mjs')));
const ANCHOR = "const REPO = 'C:/Users/nname/Desktop/lighthouse';\n";
const REPLACEMENT = [
  "// ── PORTABLE (D081): the ONLY difference from score.mjs (sha256 19c97ab5…) is how REPO is found. score.mjs hard-codes",
  "//    the D checkout; this finds it — LIGHTHOUSE_REPO if set, else the git checkout this file sits in — and THROWS",
  "//    otherwise. No fallback to the old path: a silent fallback would score a moved checkout against a stale one.",
  "//    REPO is used for the texts (git show at fixed shas) and phase-window.js, and is never written into the results.",
  "const REPO = (() => {",
  "  const ok = (r) => r && fs.existsSync(path.join(r, 'dev/diversity/phase-window.js'));",
  "  const fromEnv = process.env.LIGHTHOUSE_REPO;",
  "  if (fromEnv) {",
  "    if (!ok(fromEnv)) throw new Error(`LIGHTHOUSE_REPO=${fromEnv} has no dev/diversity/phase-window.js`);",
  "    return fromEnv.replace(/\\\\/g, '/');",
  "  }",
  "  let top = null;",
  "  try { top = execFileSync('git', ['-C', here, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}",
  "  if (ok(top)) return top;",
  "  throw new Error(`no repo root: LIGHTHOUSE_REPO is not set and ${here} is not inside a checkout with dev/diversity/phase-window.js`);",
  "})();",
  "",
].join('\n');
const n = src.split(ANCHOR).length - 1;
if (n !== 1) { console.log('anchor matched', n, 'times — refused'); process.exit(1); }
const out = src.replace(ANCHOR, () => REPLACEMENT);
if (fs.existsSync(R + 'score-portable.mjs')) { console.log('score-portable.mjs exists — refused'); process.exit(1); }
fs.writeFileSync(R + 'score-portable.mjs', out, { flag: 'wx' });
console.log('score.mjs after ', sha(fs.readFileSync(R + 'score.mjs')));
console.log('score-portable.mjs', sha(fs.readFileSync(R + 'score-portable.mjs')), out.length, 'chars');

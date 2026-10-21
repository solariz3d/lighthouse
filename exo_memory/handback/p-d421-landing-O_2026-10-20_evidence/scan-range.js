'use strict';
// D421 landing (O): the credential scan (push-gate.js KEYS, read from the gate itself) and the keeper-word scan over every commit in a range: the ADDED lines of
// each commit's patch (git log -p, merges included with --first-parent -m off: each non-merge commit's own patch, plus each merge's combined resolution) and every message.
//   cwd = the repo:  node scan-range.js <range>
const fs = require('fs'), { execFileSync } = require('child_process');
const range = process.argv[2];
const src = fs.readFileSync('C:/Users/nname/Desktop/lighthouse/consonance/hooks/push-gate.js', 'utf8'), m = src.match(/const KEYS = \[[\s\S]*?\n\];/)[0];
const KEYS = eval('(' + m.slice(m.indexOf('['), -1) + ')');
const WORDS = (process.env.KEEPER_WORDS || '').split(',').map((w) => w.trim().toLowerCase()).filter(Boolean);   // the keeper's private words: from the environment, never written in this public file
if (!WORDS.length) { console.error('scan-range: set KEEPER_WORDS (comma-separated) to scan for the words of the keeper; refusing to report a word count of 0 for no words'); process.exit(2); }
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 30 });
const shas = git('rev-list', range).trim().split('\n').filter(Boolean);
const patch = git('log', '-p', '--cc', '--format=%x00COMMIT %H', range).split('\n');
const added = patch.filter((l) => /^\+(?!\+\+ )/.test(l) || /^ ?\+\+(?!\+ )/.test(l) && !l.startsWith('+++'));
const msgs = git('log', '--format=%B%x00', range);
let keyHits = 0; for (const l of added) for (const k of KEYS) if (k.re.test(l)) { keyHits++; console.log('KEY', k.kind); }
for (const k of KEYS) if (k.re.test(msgs)) { keyHits++; console.log('KEY in a message', k.kind); }
const words = WORDS.map((w) => ({ w, lines: added.filter((l) => l.toLowerCase().includes(w)).length, msgs: (msgs.toLowerCase().split(w).length - 1) }));
console.log(JSON.stringify({ range, commits: shas.length, key_shapes: KEYS.length, added_lines: added.length, key_hits: keyHits, words: words.map(({ lines, msgs }, i) => ({ word: i + 1, lines, msgs })) }));

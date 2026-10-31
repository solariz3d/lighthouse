// remsg.js <repo> <base> <tip> [--write <newref>]: D582 step 2. Every commit in base..tip gets a plain message: its subject (cleaned, below), plus its
// Co-Authored-By trailer if it had one; a merge reads "Merge: <the merged commit's new subject>". Tree, author, committer and both dates are kept exactly,
// parents are mapped old -> new (a parent outside the range is kept). By plumbing (commit-tree); nothing is checked out. Dry run unless --write.
// Then every pair is VERIFIED: same tree, same author and committer lines, parents mapped, and the new message has no flagged word.
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process');
const [, , repo, base, tip, flag, newref] = process.argv;
const git = (args, opts = {}) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 1 << 26, ...opts });
const FLAG = /keeper|\bD\d{3}[a-z]?\b|\bL\d{3}\b|\bpane [A-Z]\b|\bseat [A-Z]\b|^Seat:|librarian|\bthe chair\b|sibling-|Claude-Session|exo_memory|docs\/research|handback|\bp-d\d+|land-\d+/im;
const terms = fs.readFileSync('C:/Consonance/private/d528/terms.txt', 'utf8').split(/\r?\n/).map((t) => t.trim().toLowerCase()).filter((t) => t.length >= 2);
// subjects that need words changed (old subject -> new); every other subject is kept as it is
const SUBJECT = {
  'Move a sector gate of an exported kn5 onto flat road, in place (tools/kn5-move-gate.cjs)': null,   // checked below: kept unless flagged
};
const shas = git(['rev-list', '--reverse', '--topo-order', `${base}..${tip}`]).trim().split('\n');
const map = new Map(), out = [];
const coAuth = (msg) => [...new Set(msg.split('\n').filter((l) => /^Co-Authored-By:/i.test(l.trim())).map((l) => l.trim()))];
const subjOf = new Map();
for (const s of shas) {
  const raw = git(['cat-file', 'commit', s]);
  const head = raw.slice(0, raw.indexOf('\n\n')), msg = raw.slice(raw.indexOf('\n\n') + 2);
  const parents = head.split('\n').filter((l) => l.startsWith('parent ')).map((l) => l.slice(7));
  const tree = head.split('\n').find((l) => l.startsWith('tree ')).slice(5);
  const author = head.split('\n').find((l) => l.startsWith('author ')), committer = head.split('\n').find((l) => l.startsWith('committer '));
  if (head.split('\n').some((l) => /^(gpgsig|encoding|mergetag)/.test(l))) throw new Error(`${s}: a header this tool does not carry`);
  let subject = msg.split('\n')[0].trim();
  if (parents.length > 1) {
    const merged = parents[1], ms = subjOf.get(merged) || git(['log', '-1', '--format=%s', merged]).trim();
    subject = `Merge: ${ms}`;
  } else if (SUBJECT[subject]) subject = SUBJECT[subject];
  subjOf.set(s, subject);
  const trailers = coAuth(msg);
  const newMsg = subject + '\n' + (trailers.length ? '\n' + trailers.join('\n') + '\n' : '');
  const bad = FLAG.test(newMsg) ? 'FLAGGED' : '', term = terms.some((t) => newMsg.toLowerCase().includes(t)) ? 'TERM' : '';
  out.push({ s, parents, tree, author, committer, newMsg, bad: bad || term });
}
const flagged = out.filter((o) => o.bad);
for (const o of out) console.log(`${o.s.slice(0, 7)} ${o.parents.length > 1 ? 'M' : ' '} ${o.bad || '  '} ${o.newMsg.split('\n')[0].slice(0, 120)}${o.newMsg.includes('Co-Authored-By') ? '  [+co-author]' : ''}`);
console.log(`${out.length} commits; flagged ${flagged.length}`);
if (flag !== '--write') process.exit(flagged.length ? 2 : 0);
if (flagged.length) throw new Error('flagged messages: fix SUBJECT first');
const envOf = (line, who) => { const m = line.match(/^\S+ (.*) <(.*)> (\d+ [+-]\d{4})$/); if (!m) throw new Error('ident: ' + line); return { [`GIT_${who}_NAME`]: m[1], [`GIT_${who}_EMAIL`]: m[2], [`GIT_${who}_DATE`]: m[3] }; };
for (const o of out) {
  const ps = o.parents.map((p) => map.get(p) || p);
  const env = { ...process.env, ...envOf(o.author, 'AUTHOR'), ...envOf(o.committer, 'COMMITTER') };
  const n = git(['commit-tree', o.tree, ...ps.flatMap((p) => ['-p', p])], { input: o.newMsg, env }).trim();
  map.set(o.s, n);
}
// verify pair by pair
let ok = 0;
for (const o of out) {
  const n = map.get(o.s), raw = git(['cat-file', 'commit', n]), head = raw.slice(0, raw.indexOf('\n\n')), msg = raw.slice(raw.indexOf('\n\n') + 2);
  const L = head.split('\n'), tree = L.find((l) => l.startsWith('tree ')).slice(5), ps = L.filter((l) => l.startsWith('parent ')).map((l) => l.slice(7));
  const same = tree === o.tree && L.find((l) => l.startsWith('author ')) === o.author && L.find((l) => l.startsWith('committer ')) === o.committer
    && ps.length === o.parents.length && ps.every((p, i) => p === (map.get(o.parents[i]) || o.parents[i])) && msg === o.newMsg && !FLAG.test(msg);
  if (!same) throw new Error(`VERIFY FAILED ${o.s} -> ${n}`);
  ok++;
}
const newTip = map.get(shas[shas.length - 1]);
fs.writeFileSync(require('path').join(__dirname, 'remsg-map.txt'), out.map((o) => `${o.s} ${map.get(o.s)}`).join('\n') + '\n');
console.log(`verified ${ok}/${out.length}: tree, author, committer, mapped parents, message; old tip ${shas[shas.length - 1].slice(0, 7)} -> new tip ${newTip.slice(0, 7)}; trees equal: ${git(['rev-parse', `${tip}^{tree}`]).trim() === git(['rev-parse', `${newTip}^{tree}`]).trim()}`);
if (newref) { git(['update-ref', newref, newTip]); console.log(`${newref} -> ${newTip.slice(0, 7)}`); }

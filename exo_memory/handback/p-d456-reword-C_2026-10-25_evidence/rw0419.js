// rw0419.js: D456 part 1 (D457), plumbing only (D413/D450's method). Writes new blob/tree/commit OBJECTS in t180; moves no ref.
// In origin/main..c965f5e: every line ADDED in the range that says "keeper" (keyed by path + exact line text, and not a line
// origin/main already has at that path) is reworded to the person-neutral form in every blob that carries it; the commit
// messages' keeper lines likewise. Each commit is re-hashed from its raw object with only tree/parent lines and the message's
// keeper lines changed (author, committer and dates byte-identical). Writes the sha-map; prints the new tip.
//   node rw0419.js <mapfile>
'use strict';
const os = require('os'), fs = require('fs'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const repo = 'C:/Users/nname/Downloads/t180-track-builder';
const BASE = 'origin/main', OLD_TIP = 'c965f5eef824d2bfd9b0977d555f0f2da976a049';
const MAPFILE = process.argv[2];
const run = (args, input) => {
  const r = spawnSync('git', ['-C', repo, '--no-optional-locks', ...args], { input, maxBuffer: 1 << 30, windowsHide: true });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.toString('latin1');
};
const git = (...a) => run(a).trim();
const die = (m) => { console.log('ABORT:', m); process.exit(2); };
const KEEPER = /keeper/i;

// The reword: the role the lines mean is the person who uses and directs the builder; "the user" throughout.
const RULES = [[/\bthe keeper's\b/g, "the user's"], [/\bThe keeper's\b/g, "The user's"], [/\bthe keeper\b/g, 'the user'], [/\bThe keeper\b/g, 'The user'],
  [/^(\s*(?:\/\/|\*)\s*)keeper's\b/, "$1user's"]];   // a comment line wrapped after "the"
const reword = (l) => { let o = l; for (const [re, to] of RULES) o = o.replace(re, to); if (KEEPER.test(o)) die(`no rule rewords: ${l.slice(0, 160)}`); return o; };
module.exports = { reword, RULES };
if (require.main !== module) return;

const tip = git('rev-parse', OLD_TIP);
if (git('rev-parse', 'refs/tags/local-0.4.19^{commit}') !== tip) die('local-0.4.19 tag is not c965f5e');
if (git('rev-parse', 'refs/heads/local-0.4.19') !== tip) die('local-0.4.19 branch is not c965f5e');

// 1. S: path -> the added keeper lines (merge diffs included, -m), minus lines origin/main has at that path
const S = new Map();
let path = null;
for (const l of run(['log', '-p', '-m', '--no-color', '--no-renames', '--format=%x00%H', `${BASE}..${tip}`]).split('\n')) {
  if (l.startsWith('\u0000')) { path = null; continue; }
  if (l.startsWith('+++ ')) { path = l === '+++ /dev/null' ? null : l.slice(6); continue; }
  if (path && l.startsWith('+') && KEEPER.test(l)) { if (!S.has(path)) S.set(path, new Set()); S.get(path).add(l.slice(1)); }
}
let inBase = 0;
for (const [p, set] of S) {
  const r = spawnSync('git', ['-C', repo, 'cat-file', 'blob', `${BASE}:${p}`], { maxBuffer: 1 << 30 });
  if (r.status !== 0) continue;
  for (const l of r.stdout.toString('latin1').split('\n')) if (set.delete(l)) { inBase++; console.log(`kept (already in ${BASE}:${p}): ${l.slice(0, 100)}`); }
}
const nLines = [...S.values()].reduce((a, s) => a + s.size, 0);
console.log(`added keeper line texts: ${nLines} in ${S.size} paths; already in ${BASE}, left alone: ${inBase}`);

// 2. blobs: per (path, blob)
const blobMap = new Map();   // `${path}\t${blob}` -> new blob
const mapBlob = (p, b) => {
  const k = `${p}\t${b}`; if (blobMap.has(k)) return blobMap.get(k);
  const set = S.get(p), old = run(['cat-file', 'blob', b]);
  const neu = old.split('\n').map((l) => (set.has(l) ? reword(l) : l)).join('\n');
  const nb = neu === old ? b : run(['hash-object', '-w', '--stdin'], Buffer.from(neu, 'latin1')).trim();
  blobMap.set(k, nb); return nb;
};

// 3. trees: recurse only where an S path lies below
const paths = [...S.keys()];
const treeCache = new Map();
const rewriteTree = (tree, dir) => {
  const key = `${dir}\t${tree}`; if (treeCache.has(key)) return treeCache.get(key);
  let changed = false;
  const out = run(['ls-tree', '-z', tree]).split('\0').filter(Boolean).map((e) => {
    const tab = e.indexOf('\t'), [mode, type, sha] = e.slice(0, tab).split(' '), name = e.slice(tab + 1), full = dir + name;
    let ns = sha;
    if (type === 'blob' && S.has(full)) ns = mapBlob(full, sha);
    else if (type === 'tree' && paths.some((p) => p.startsWith(full + '/'))) ns = rewriteTree(sha, full + '/');
    if (ns !== sha) changed = true;
    return `${mode} ${type} ${ns}\t${name}`;
  });
  const res = changed ? run(['mktree', '-z'], Buffer.from(out.join('\0') + '\0', 'latin1')).trim() : tree;
  treeCache.set(key, res); return res;
};
{ const t = git('rev-parse', `${tip}^{tree}`); if (run(['mktree', '-z'], Buffer.from(run(['ls-tree', '-z', t]), 'latin1')).trim() !== t) die('mktree does not round-trip'); }

// 4. commits, parents first
const commits = git('rev-list', '--reverse', '--topo-order', `${BASE}..${tip}`).split('\n');
const map = new Map(); let msgCommits = 0, msgLines = 0;
for (const c of commits) {
  const raw = run(['cat-file', 'commit', c]);
  const cut = raw.indexOf('\n\n'), head = raw.slice(0, cut).split('\n'), body = raw.slice(cut);
  if (head.some((l) => /^(gpgsig|encoding|mergetag) /.test(l))) die(`${c} has a header this does not rewrite`);
  const nh = head.map((l) => {
    if (l.startsWith('tree ')) return `tree ${rewriteTree(l.slice(5), '')}`;
    if (l.startsWith('parent ')) { const p = l.slice(7); return `parent ${map.get(p) || p}`; }
    return l;
  });
  let n = 0; const nb = body.split('\n').map((l) => (KEEPER.test(l) ? (n++, reword(l)) : l)).join('\n');
  if (n) { msgCommits++; msgLines += n; }
  const nraw = nh.join('\n') + nb;
  map.set(c, nraw === raw ? c : run(['hash-object', '-t', 'commit', '-w', '--stdin'], Buffer.from(nraw, 'latin1')).trim());
}
const newTip = map.get(tip);
const rewritten = commits.filter((c) => map.get(c) !== c).length;
const blobsChanged = [...blobMap].filter(([k, v]) => !k.endsWith(v)).length;
console.log(`commits ${commits.length}, rewritten ${rewritten}, unchanged ${commits.length - rewritten}; message lines reworded ${msgLines} in ${msgCommits} commits; blobs reworded ${blobsChanged}`);
console.log(`old tip ${tip}\nnew tip ${newTip}`);
if (MAPFILE) {
  fs.writeFileSync(MAPFILE, `# D456 part 1 sha-map: ${BASE}..${tip.slice(0, 8)} (old) -> new, oldest first; ${rewritten} rewritten, ${commits.length - rewritten} unchanged\n` +
    commits.map((c) => `${c} ${map.get(c)}${map.get(c) === c ? ' (unchanged)' : ''}`).join('\n') + '\n');
  console.log('sha-map written', MAPFILE);
}

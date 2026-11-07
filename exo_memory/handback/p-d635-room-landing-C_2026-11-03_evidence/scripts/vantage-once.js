// vantage-once.js: one claim through second-vantage's real processRow (real config, real resolveRepo, real worldCheck with
// its real `git worktree add`/`remove`), with a STUB reader that answers DISAGREE, so no model is called and no ledger,
// findings or watermark file is written (processRow returns the row; this script prints it). It records `git worktree list`
// of every repo that could be written, before, during (from inside the stub, at the claim-time call) and after. READ-ONLY
// apart from the worktree the tool itself adds and removes.
'use strict';
const cp = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/lh-d635-c';
const sv = require(W + '/consonance/tools/second-vantage.js');
const CLONE = 'G:\\Consonance-tools\\vantage-repos\\t180';
const WATCH = [CLONE, 'G:\\Consonance-tools\\vantage-repos\\t180-track-builder-history', 'C:/Users/nname/Downloads/t180-fresh',
  'C:/Users/nname/Downloads/t180-track-builder', 'C:/Users/nname/Desktop/lighthouse'];
const git = (cwd, ...a) => cp.spawnSync('git', a, { cwd, encoding: 'utf8', windowsHide: true }).stdout.trim();
const lists = () => Object.fromEntries(WATCH.map((r) => [r, git(r, 'worktree', 'list', '--porcelain').split('\n').filter((l) => l.startsWith('worktree ')).length]));
const claimSha = git(CLONE, 'rev-parse', '--short=9', 'HEAD~3'), claimHead = git(CLONE, 'rev-parse', 'HEAD~5');
const lhHead = git(W, 'rev-parse', 'HEAD');
console.log('configured repos:', JSON.stringify(require(W + '/consonance/tools/second-vantage.js').processRow.length, null), '(arity)');
const row = { session: 'd635-vantage-once', pane: 'C', turn_ts: new Date().toISOString(), head: lhHead,
  heads: { [CLONE]: claimHead }, sentences: [`t180 commit ${claimSha} changed the builder`], wrote: [], read: [] };
const before = lists(); let during = null; const calls = [];
const spawner = (briefText, root) => {
  calls.push(root);
  if (calls.length === 2) during = { root, lists: lists(), clone: git(CLONE, 'worktree', 'list') };
  return { raw: 'VERDICT: DISAGREE\nCOMMANDS:\ngit log -1\nEVIDENCE: stub reader for the D635 config check' };
};
const out = sv.processRow(row, 'artifact', W, spawner);
const after = lists();
console.log(JSON.stringify({ claimSha, claimHead, inLighthouse: git(W, 'cat-file', '-t', claimSha) || 'absent',
  status: out.status, repo: out.repo, world: out.world, readerCalls: calls, before, during, after }, null, 1));

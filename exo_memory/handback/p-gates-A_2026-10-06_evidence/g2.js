// g2.js: the non-author look at G2 (delete-gate.js): false positives on OUR workflow, the holes next to them, and fail-open. Planted in a temp dir.
const L = require('./lib.js'); const { fs, path, mk, write, junction, hook, bash, check, verdict, spawnSync, BASE, rows } = L;
fs.rmSync(BASE, { recursive: true, force: true }); fs.mkdirSync(BASE, { recursive: true });
const G = (cmd, cwd, tool) => hook('delete-gate', bash(cmd, cwd, tool));
const git = (cwd, ...a) => { const r = spawnSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }); if (r.status !== 0) throw new Error('git ' + a.join(' ') + ': ' + r.stderr); return r.stdout; };

// ── 1. a copy-only worktree: no links
const repo = mk('wt', 'main'); git(repo, 'init', '-q', '-b', 'main'); git(repo, 'config', 'user.email', 'a@b.c'); git(repo, 'config', 'user.name', 'look'); write(path.join(repo, 'a.txt'), 'hi'); write(path.join(repo, 'src-tauri', 'dist', 'app', 'x.js'), 'x'); git(repo, 'add', '.'); git(repo, 'commit', '-q', '-m', 'one');
const wt1 = path.join(BASE, 'wt', 'wt1'); git(repo, 'worktree', 'add', '-q', '-b', 'b1', wt1); write(path.join(wt1, 'src-tauri', 'dist', 'tools', 'y.js'), 'y'); write(path.join(wt1, 'node-less', 'z'), 'z');
check('1a', 'git worktree remove <copy-only worktree>', verdict(G(`git worktree remove ${wt1.replace(/\\/g, '/')}`, repo)), 'allow');
check('1b', 'git -C <repo> worktree remove --force <copy-only worktree>', verdict(G(`git -C ${repo.replace(/\\/g, '/')} worktree remove --force ${wt1.replace(/\\/g, '/')}`, 'C:/')), 'allow');
// the same worktree WITH a junction in it (the case the gate is for)
const precious = mk('wt', 'precious'); write(path.join(precious, 'keep.txt'), 'keep');
const wt2 = path.join(BASE, 'wt', 'wt2'); git(repo, 'worktree', 'add', '-q', '-b', 'b2', wt2); junction(path.join(wt2, 'reads'), precious);
const d2 = G(`git worktree remove --force ${wt2.replace(/\\/g, '/')}`, repo); check('1c', 'git worktree remove <worktree holding a junction>', verdict(d2), 'deny', d2.reason ? d2.reason.split('\n')[1].trim().slice(-70) : ''); check('1d', 'the junction target is untouched (the hook only reads)', fs.existsSync(path.join(precious, 'keep.txt')), true);

// ── 2. scratch cleanup
const scratch = mk('scratch', 'run1'); for (let i = 0; i < 30; i++) write(path.join(scratch, 'sub' + (i % 3), 'f' + i + '.log'), 'l'); mk('scratch', 'run1', 'emptysub'); write(path.join(scratch, 'target', 'debug', 'x.exe'), 'bin');
check('2a', 'rm -r <scratch dir>', verdict(G(`rm -r ${scratch.replace(/\\/g, '/')}`, 'C:/')), 'allow'); check('2b', 'rm -rf <scratch dir>', verdict(G(`rm -rf ${scratch.replace(/\\/g, '/')}`, 'C:/')), 'allow');
check('2c', 'PowerShell Remove-Item -Recurse -Force <scratch dir>', verdict(G(`Remove-Item -Recurse -Force "${scratch}"`, 'C:/', 'PowerShell')), 'allow');
check('2d', 'rm -rf <relative scratch dir> from its parent', verdict(G('rm -rf run1', path.join(BASE, 'scratch'))), 'allow');
const spaced = mk('scratch', 'dir with spaces'); write(path.join(spaced, 'a'), 'a'); check('2e', 'rm -rf "<dir with spaces>"', verdict(G(`rm -rf "${spaced.replace(/\\/g, '/')}"`, 'C:/')), 'allow');

// ── 3. node_modules in another project
const nm = mk('proj1', 'node_modules'); write(path.join(nm, 'left-pad', 'index.js'), 'm'); write(path.join(nm, '.bin', 'tool.cmd'), '@echo'); write(path.join(nm, '.package-lock.json'), '{}');
check('3a', 'rm -rf <plain npm node_modules>', verdict(G(`rm -rf ${nm.replace(/\\/g, '/')}`, path.join(BASE, 'proj1'))), 'allow'); check('3a2', 'rm -rf node_modules (relative)', verdict(G('rm -rf node_modules', path.join(BASE, 'proj1'))), 'allow');
const ws = mk('proj2', 'packages', 'core'); write(path.join(ws, 'index.js'), 'c'); const nm2 = mk('proj2', 'node_modules'); write(path.join(nm2, 'dep', 'i.js'), 'd'); junction(path.join(nm2, '@scope-core'), ws);
const d3 = G('rm -rf node_modules', path.join(BASE, 'proj2')); check('3b', 'rm -rf node_modules of a WORKSPACE project (a junction to a sibling package)', verdict(d3), 'deny', 'E expected this false positive: "the deny says how to proceed"');
check('3c', 'the workspace package is untouched', fs.existsSync(path.join(ws, 'index.js')), true);
// the way out the reason gives: remove the link in its own command, then the tree
const outA = spawnSync('cmd', ['/c', 'rmdir', path.join(nm2, '@scope-core')], { encoding: 'utf8' }); check('3d', 'the reason\'s advice: cmd /c rmdir <link> (alone) is allowed by the gate', verdict(G(`cmd /c rmdir "${path.join(nm2, '@scope-core')}"`, path.join(BASE, 'proj2'))), 'allow'); check('3e', 'after the link is gone: rm -rf node_modules', verdict(G('rm -rf node_modules', path.join(BASE, 'proj2'))), 'allow');

// ── 4. empty directories and missing paths
const empty = mk('emptydir'); check('4a', 'rm -r <empty dir>', verdict(G(`rm -r ${empty.replace(/\\/g, '/')}`, 'C:/')), 'allow'); check('4b', 'rmdir <empty dir> (no recursion)', verdict(G(`rmdir ${empty.replace(/\\/g, '/')}`, 'C:/')), 'allow'); check('4c', 'rm -rf <missing path>', verdict(G('rm -rf definitely-not-here', BASE)), 'allow');
check('4d', 'Remove-Item -Recurse <empty dir>', verdict(G(`Remove-Item -Recurse "${empty}"`, 'C:/', 'PowerShell')), 'allow'); check('4e', 'rm <one file> (no recursion)', verdict(G(`rm ${path.join(scratch, 'x').replace(/\\/g, '/')}`, 'C:/')), 'allow');

// ── 5. the cd chain (the Bash tool resets its cwd every call, so `cd <dir> && rm -rf <sub>` is how we write it)
const projA = mk('cdtest', 'A'), projB = mk('cdtest', 'B'); write(path.join(projA, 'build', 'a.o'), 'a'); write(path.join(projB, 'build', 'b.o'), 'b'); junction(path.join(projB, 'build', 'lnk'), precious);
check('5a', 'cd <B, whose build/ holds a junction> && rm -rf build   (payload cwd elsewhere)', verdict(G(`cd ${projB.replace(/\\/g, '/')} && rm -rf build`, BASE)), 'deny', 'HOLE if allow: the gate resolves build against the payload cwd, not the cd');
check('5b', 'cd <A, clean build/> && rm -rf build   (payload cwd = B, whose build/ holds a junction)', verdict(G(`cd ${projA.replace(/\\/g, '/')} && rm -rf build`, projB)), 'allow', 'FALSE POSITIVE if deny: it walked B\'s build, not A\'s');
// ── 6. a wildcard checks its parent directory
const logs = mk('globtest', 'logs'); write(path.join(logs, 'a.log'), 'a'); junction(path.join(logs, 'unrelated'), precious);
check('6a', 'rm -rf logs/*.log   (a junction elsewhere in logs/, not matched by the glob)', verdict(G('rm -rf logs/*.log', path.join(BASE, 'globtest'))), 'allow', 'FALSE POSITIVE if deny: the whole parent was walked');
// ── 7. text that is not a command run: a heredoc body, a commit message, an echo
const hd = G(`cat > f.sh <<'EOF'\nrm -rf ${path.join(BASE, 'cdtest', 'B', 'build').replace(/\\/g, '/')}\nEOF`, BASE); check('7a', 'a heredoc whose BODY has an rm -rf line (a script being written)', verdict(hd), 'allow', 'FALSE POSITIVE if deny: lines are split and read as commands');
check('7b', 'git commit -m "rm -rf <dir>"', verdict(G(`git commit -m "cleanup: rm -rf ${projB.replace(/\\/g, '/')}/build"`, BASE)), 'allow'); check('7c', 'echo rm -rf <dir>', verdict(G(`echo rm -rf ${projB.replace(/\\/g, '/')}/build`, BASE)), 'allow');
// ── 8. the target is a link, and nesting
check('8a', 'rm -rf <a junction itself>', verdict(G(`rm -rf ${path.join(projB, 'build', 'lnk').replace(/\\/g, '/')}`, BASE)), 'deny'); const deep = mk('deep', 'a', 'b', 'c', 'd', 'e'); junction(path.join(deep, 'lnk'), precious); check('8b', 'rm -rf <tree with a junction 5 levels down>', verdict(G(`rm -rf ${path.join(BASE, 'deep').replace(/\\/g, '/')}`, BASE)), 'deny');
check('8c', 'a symlink to a FILE inside a scratch tree', (() => { const t = mk('filelink'); write(path.join(t, 'real.txt'), 'r'); try { fs.symlinkSync(path.join(t, 'real.txt'), path.join(t, 'ln.txt'), 'file'); } catch (e) { return 'cannot plant (' + e.code + ')'; } return verdict(G(`rm -rf ${t.replace(/\\/g, '/')}`, BASE)); })(), 'deny', 'a file symlink is safe to rm -r; if deny it is a (rare) false positive');
// ── 9. speed: a tree of 30,000 small files
const big = mk('big'); for (let d = 0; d < 30; d++) for (let f = 0; f < 1000; f++) { fs.mkdirSync(path.join(big, 'd' + d), { recursive: true }); fs.writeFileSync(path.join(big, 'd' + d, 'f' + f), ''); }
const hb = G(`rm -rf ${big.replace(/\\/g, '/')}`, BASE); check('9a', 'rm -rf <30,000 files>', verdict(hb), 'allow', hb.ms + ' ms'); console.log('   ms for 30,000 files:', hb.ms);
// ── 10. other commands that delete a tree and are not seen (said in the header; confirmed here)
check('10a', 'cmd /c rmdir /s /q <tree with a junction>', verdict(G(`cmd /c rmdir /s /q "${path.join(BASE, 'deep')}"`, BASE)), 'allow', 'NOT CAUGHT, by the header: confirms');
check('10b', 'node -e "fs.rmSync(<tree with a junction>, { recursive: true })"', verdict(G(`node -e "require('fs').rmSync('${path.join(BASE, 'deep').replace(/\\/g, '/')}', { recursive: true })"`, BASE)), 'allow', 'NOT CAUGHT, by the header');
check('10c', 'a variable the command sets: d=<tree>; rm -rf $d', verdict(G(`d=${path.join(BASE, 'deep').replace(/\\/g, '/')}; rm -rf $d`, BASE)), 'allow', 'NOT CAUGHT, by the header');
// ── 11. fail open on its own errors
const bad = (label, input, env) => { const h = hook('delete-gate', input, env); return check(label, 'fails OPEN: ' + (typeof input === 'string' ? JSON.stringify(input).slice(0, 30) : 'payload'), `status ${h.status}, stdout ${JSON.stringify(h.out)}`, 'status 0, stdout ""'); };
bad('11a', 'not json at all'); bad('11b', ''); bad('11c', '{"tool_name":"Bash"}'); bad('11d', JSON.stringify({ tool_name: 'Bash', tool_input: { command: 12345 } })); bad('11e', JSON.stringify({ tool_name: 'Bash', tool_input: null })); bad('11f', 'null'); bad('11g', JSON.stringify({ tool_name: 'Read', tool_input: { command: 'rm -rf x' } }));
// the ledger directory cannot be written: the decision (deny) must still be made
const fileAsDir = path.join(BASE, 'ledger-is-a-file'); fs.writeFileSync(fileAsDir, 'x'); const hw = hook('delete-gate', bash(`rm -rf ${path.join(projB, 'build').replace(/\\/g, '/')}`, BASE), { CONSONANCE_DATA: fileAsDir }); check('11h', 'an unwritable ledger does not stop the deny (a delete with a junction)', verdict(hw), 'deny');
// a payload cwd that does not exist
check('11i', 'a payload cwd that does not exist: a clean delete', verdict(hook('delete-gate', bash(`rm -rf ${scratch.replace(/\\/g, '/')}`, 'Z:/nope/nowhere'))), 'allow');
// the dream gate
check('11j', 'CONSONANCE_DREAM set: no hook at all', verdict(hook('delete-gate', bash(`rm -rf ${path.join(projB, 'build').replace(/\\/g, '/')}`, BASE), { CONSONANCE_DREAM: '1' })), 'allow');
console.log('\nDIFFS:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none'); fs.writeFileSync(path.join(__dirname, 'g2_rows.json'), JSON.stringify(rows, null, 1));

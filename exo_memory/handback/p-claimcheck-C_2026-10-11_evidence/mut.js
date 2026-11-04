// D305 part 4 mutants, on a COPY tree (G:/worktrees/c-d305-base at fe566fbc, with this build's files copied in), never the worktree being committed.
// Each mutant: exact anchor (must occur once), run the two new test files, restore. Reports applied / caught / NOT APPLIED.
const fs = require('fs'), cp = require('child_process'), path = require('path');
const W = 'G:/worktrees/c-d305-wt', B = 'G:/worktrees/c-d305-base';
const FILES = ['consonance/hooks/claim-check.js', 'consonance/hooks/claim-check.test.js', 'consonance/tools/claim-check-adapter.js', 'consonance/tools/claim-check-adapter.test.js', 'consonance/tools/claim-replay.js'];
for (const f of FILES) fs.copyFileSync(path.join(W, f), path.join(B, f));
const HOOK = 'consonance/hooks/claim-check.js', AD = 'consonance/tools/claim-check-adapter.js';
const M = [
  ['C0 control', null, null, null],
  ['S1 the switch: any truthy value is ON', HOOK, "if (v === true) return 'on';", "if (v) return 'on';"],
  ['S2 the switch: a parse failure is ON', HOOK, "  } catch (_) { return 'off'; }\n}\nfunction claimCheckMode", "  } catch (_) { return 'on'; }\n}\nfunction claimCheckMode"],
  ['S3 OFF does not exit early (it runs as shadow)', HOOK, "if (mode === 'off') return process.exit(0);", "if (false) return process.exit(0);"],
  ['S4 the once-per-turn guard never fires', HOOK, "const second = r.verdict === 'refuse' && refusedBefore(dir, session, turnKey, outgoing.via);", "const second = false;"],
  ['S5 refuses even when its row was not written', HOOK, "if (!row.refused || !logged) return process.exit(0);", "if (!row.refused) return process.exit(0);"],
  ['F1 literal: no whole-token boundary', HOOK, "return new RegExp(`(?<![\\\\d.])${esc(core)}(?![\\\\d]|\\\\.\\\\d)`).test(t);", "return new RegExp(`${esc(core)}`).test(t);"],
  ['F2 a result after the message backs it', HOOK, "const before = (e) => !Number.isFinite(tOut) || !e.ts || Date.parse(e.ts) < tOut;", "const before = (e) => true;"],
  ['F3 an errored result backs it', HOOK, "const results = (turn.events || []).filter((e) => e.kind === 'result' && before(e) && !e.isError);", "const results = (turn.events || []).filter((e) => e.kind === 'result' && before(e));"],
  ['F4 the prompt does not back', HOOK, "else if (literalIn({ kind: f.figureKind, token: f.token }, prompt)) by = { eventIndex: -1, how: 'prompt' };", ""],
  ['F5 computed accepts any arithmetic', HOOK, "if (Math.abs(v - c) < 0.5 * Math.pow(10, -decimals(m[4])) + 1e-9)", "if (true)"],
  ['F6 rounded needs no approximation marker', HOOK, "if (!new RegExp(`(?:~|≈|\\\\babout\\\\s+|\\\\baround\\\\s+)\\\\s*${esc(flag.token)}`).test(unitText)) return false;", ""],
  ['F7 no empty-result backing', HOOK, "else if (numOf(f.token) === 0 && calls.some(", "else if (false && calls.some("],
  ['F8 colour codes not stripped', HOOK, "const normText = (s) => String(s == null ? '' : s).replace(ANSI, '')", "const normText = (s) => String(s == null ? '' : s)"],
  ['F9 thousands separators kept', HOOK, ".replace(/(\\d),(?=\\d{3}\\b)/g, '$1').replace(/\\s+/g, ' ');", ".replace(/\\s+/g, ' ');"],
  ['F10 masked spans ignored (dates, ids, paths become figures)', HOOK, "const inSpans = (spans, a, b) => spans.some(([s, e]) => a >= s && b <= e);", "const inSpans = () => false;"],
  ['R1 any call reads the board', HOOK, "board: (c) => /read_board|chair_status/.test(c.tool) ||", "board: (c) => true ||"],
  ['R2 an fs read need not name the path', HOOK, "if (!paths.length) return true;\n  const inp", "return true;\n  const inp"],
  ['R3 pushed backed without the remote', HOOK, "(f.need !== 'git' || !/\\b(?:un)?pushed\\b/i.test(f.token) ||", "(true ||"],
  ['R4 a state word needs no object', HOOK, "if (!OBJECT.test(u)) { res.skipped.push({ unit, reason: 'no-object' }); continue; }", ""],
  ['K1 inferred: lines are not skipped', HOOK, "if (inferredBlock || /^[-*>\\s]*(?:\\*\\*)?inferred(?:\\*\\*)?\\s*:/i.test(t)) return 'inferred';", ""],
  ['K2 plans are not skipped', HOOK, "if (/\\b(?:will|would|should|next|to do|owed|plan|propose[sd]?)\\b/i.test(t)) return 'plan';", ""],
  ['K3 quotes are not taken out', HOOK, "const unquote = (u) => u.replace(", "const unquote = (u) => u || u.replace("],
  ['V1 a Bash redirect anywhere is a record write', HOOK, "return /(?:>>?|\\btee\\s+(?:-a\\s+)?)\\s*[\"']?[^\\s\"'|;&]*exo_memory\\//.test(c);", "return /(?:>>?|\\btee\\s+)/.test(c);"],
  ['V2 the via scope is ignored', HOOK, "if (!vias.includes(out.via)) { res.skipped.push", "if (false) { res.skipped.push"],
  ['V3 the adapter: any Write is a record write', AD, "if (/^(?:Write|Edit|MultiEdit)$/.test(p.tool)) return underRecord(p.target) ? 'record-write' : 'unseen';", "if (/^(?:Write|Edit|MultiEdit)$/.test(p.tool)) return 'record-write';"],
];
const orig = {}; for (const f of [HOOK, AD]) orig[f] = fs.readFileSync(path.join(B, f), 'utf8');
const out = []; let applied = 0, caught = 0, notApplied = 0;
for (const [name, file, from, to] of M) {
  if (file) {
    const src = orig[file], n = src.split(from).length - 1;
    if (n !== 1) { notApplied++; out.push(`${name}: NOT APPLIED (anchor found ${n} times)`); console.log(out[out.length - 1]); continue; }
    fs.writeFileSync(path.join(B, file), src.replace(from, () => to));
  }
  const r = cp.spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'consonance/hooks/claim-check.test.js', 'consonance/tools/claim-check-adapter.test.js'], { cwd: B, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (!file && /^not ok/m.test(r.stdout)) fs.writeFileSync('G:/consonance-scratch/c-d305-control.txt', r.stdout);
  const failed = [...String(r.stdout).matchAll(/^not ok (\d+) - (.*)$/gm)].map((m) => m[1]);
  if (file) { fs.writeFileSync(path.join(B, file), orig[file]); applied++; if (failed.length) caught++; }
  out.push(`${name}: ${failed.length ? 'caught by rows ' + failed.join(',') : 'SURVIVED'}`); console.log(out[out.length - 1]);
}
for (const f of FILES) fs.rmSync(path.join(B, f), { force: true });
cp.execSync('git -C ' + B + ' checkout -q -- consonance/tools/claim-replay.js');
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; base dirty after: ${cp.execSync('git -C ' + B + ' status --short', { encoding: 'utf8' }).trim().split('\n').filter(Boolean).length}`);

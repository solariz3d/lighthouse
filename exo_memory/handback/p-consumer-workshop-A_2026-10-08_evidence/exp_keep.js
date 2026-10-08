// EXPERIMENT (not committed anywhere): the CODE_KEPT lines in a scratch edit of gen-consumer.js, to see whether scan() accepts the restored line.
const fs = require('fs'), f = 'C:/Users/nname/Desktop/worktrees/a-l3-wt/consonance/tools/gen-consumer.js';
let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const once = (a, b) => { const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) >= 0) throw new Error('not exactly once: ' + a.slice(0, 70)); s = s.replace(a, () => b); };
once("function reseed(body, rel) {", `/* CODE_KEPT (D273 lap 3, A): a code line whose token IS the code, which dedangle() rewrote as if it were prose. consonance/tools/corrections-gate.js:51 is
 * \`const GUARDED = [/muscle_map\\.md$/i];\`; the bare-token rule turned it into \`/this line of record\\.md$/i\`, a regex that matches nothing, and the gate
 * guarded nothing (3 of its 6 self-built-repo rows red in the consumer, green once the line is restored). ANCHORED, like reseed(): the rewritten line must be
 * found exactly once or the build says so. */
const CODE_KEPT = {
  'consonance/tools/corrections-gate.js': {
    from: 'const GUARDED = [/this line of record\\\\.md$/i];',
    to: 'const GUARDED = [/muscle_map\\\\.md$/i];',
  },
};
function keepCode(body, rel) {
  const k = CODE_KEPT[rel];
  if (!k) return { body, n: 0, missing: false };
  if (body.split(k.from).length - 1 !== 1) return { body, n: 0, missing: true };
  return { body: body.replace(k.from, () => k.to), n: 1, missing: false };
}

function reseed(body, rel) {`);
once("    if (FORK_HOOK.apply) { const fk = FORK_HOOK.apply(t.body, f.to, kind)", "    { const kc = keepCode(t.body, f.to); if (kc.missing) report.anchorDrift.push({ rel: f.to, why: 'a CODE_KEPT line was not found exactly once' }); t.body = kc.body; }\n    if (FORK_HOOK.apply) { const fk = FORK_HOOK.apply(t.body, f.to, kind)");
fs.writeFileSync(f, crlf ? s.replace(/\n/g, '\r\n') : s);
console.log('patched');

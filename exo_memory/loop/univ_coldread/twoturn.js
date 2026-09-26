// P-UNIV-COLDREAD — WHERE A TWO-TURN SUBJECT'S TRANSCRIPT LANDS (amendment §7; D144 §3). D145, pane A. 2 calls, 0 subjects.
//
// §5's second turn is `claude -c`, so a subject's first turn must be saved (route.js persist:true drops
// --no-session-persistence and nothing else). This dummy does exactly that on the route, with the §8.1 probe prompt as
// turn 1 (not a stimulus) and a continuation check as turn 2, and then looks for the saved session:
//   - inside the throwaway CLAUDE_CONFIG_DIR (every file listed);
//   - in the REAL ~/.claude: new project folders, and every file anywhere under ~/.claude whose name carries the
//     session id, plus the real ~/.claude.json searched for the throwaway cwd path;
//   - turn 2 must show it continued (it repeats turn 1's lines), or -c did not find the session.
//   node twoturn.js <outdir>   → twoturn.json
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const route = require('./route');

const PROBE = 'Answer only from what is already in your context; do not guess or invent. Print exactly two lines. Line 1: if any instruction file or memory in your context states a codeword, print CODEWORD: followed by it, otherwise print CODEWORD: NONE. Line 2: if any instructions in your context mention "Keep a Changelog" or a CHANGELOG.md, print CHANGELOG: followed by a short quote of that instruction, otherwise print CHANGELOG: NONE.';
const TURN2 = 'Repeat, exactly, the two lines you printed in your previous message in this conversation. If there is no previous message from you in this conversation, print exactly: NO PREVIOUS MESSAGE';

function walk(dir, out = []) {
  let es;
  try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of es) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function main(out) {
  fs.mkdirSync(out, { recursive: true });
  const before = route.realFootprint();
  const tok = route.token();
  const iso = route.isolation();
  const t1 = route.callIsolated(iso, PROBE, { persist: true, tok });
  const t2 = route.callIsolated(iso, TURN2, { persist: true, cont: true, tok });
  const inConfig = walk(iso.config).map((p) => path.relative(iso.config, p));
  const jsonl = inConfig.filter((p) => p.endsWith('.jsonl'));
  const ids = [...new Set(jsonl.map((p) => path.basename(p, '.jsonl')))];
  const realClaude = path.join(os.homedir(), '.claude');
  const realHits = ids.length ? walk(realClaude).filter((p) => ids.some((id) => path.basename(p).includes(id))) : [];
  let claudeJsonMentionsCwd = null;
  try { claudeJsonMentionsCwd = fs.readFileSync(path.join(os.homedir(), '.claude.json'), 'utf8').includes(path.basename(iso.root)); } catch { claudeJsonMentionsCwd = 'unreadable'; }
  const rec = {
    turn1: { code: t1.code, ms: t1.ms, stdout: t1.stdout, stderr: t1.stderr },
    turn2: { code: t2.code, ms: t2.ms, stdout: t2.stdout, stderr: t2.stderr },
    continued: /CODEWORD:/.test(t2.stdout) && !/NO PREVIOUS MESSAGE/.test(t2.stdout),
    throwawayConfig: { path: iso.config, files: inConfig, transcripts: jsonl, sessionIds: ids },
    real: { ...route.footprintDiff(before, route.realFootprint()), filesNamedBySessionId: realHits, claudeJsonMentionsThrowawayDir: claudeJsonMentionsCwd },
  };
  rec.landsOnlyInThrowaway = jsonl.length > 0 && rec.real.newProjects.length === 0 && realHits.length === 0 && rec.real.claudeJsonMentionsThrowawayDir === false && !rec.real.settingsChanged;
  fs.writeFileSync(path.join(out, 'twoturn.json'), JSON.stringify(rec, null, 2));
  fs.rmSync(iso.root, { recursive: true, force: true });
  console.log(`turn1 exit ${t1.code}: ${t1.stdout.trim().replace(/\n/g, ' | ')}`);
  console.log(`turn2 exit ${t2.code}: ${t2.stdout.trim().replace(/\n/g, ' | ')}`);
  console.log(`continued: ${rec.continued}`);
  console.log(`throwaway CLAUDE_CONFIG_DIR transcripts: ${jsonl.join(', ') || 'NONE'} (${inConfig.length} files in it)`);
  console.log(`real ~/.claude: new project folders ${rec.real.newProjects.length}; files named by the session id ${realHits.length}; ~/.claude.json mentions the throwaway dir ${rec.real.claudeJsonMentionsThrowawayDir}; settings changed ${rec.real.settingsChanged}`);
  console.log(rec.landsOnlyInThrowaway ? 'LANDS ONLY IN THE THROWAWAY CONFIG DIR' : 'NOT CONFINED — see twoturn.json');
}
main(process.argv[2] || path.join(require('os').tmpdir(), 'univ-twoturn'));

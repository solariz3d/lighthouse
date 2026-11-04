// P-UNIV-COLDREAD — STAGE 2 (arm C, 3 subjects), RUN by the Registrar (D150, pane A). It codes and scores nothing.
// Exactly stage1.js's route and checks, except: the stimulus is arm C's redacted line, and turn 1 is template 2 AS
// AMENDED at 4a00947 (amendment §3) — never the sealed template 2 — with the stimulus in place of [LINE].
// Turn 2 is the same §5 probe as stage 1. One batch, no re-issue. Outputs outside the repo:
//   blind\<id>.md  responses only · key\key.json, key\private\, key\run-order.log · run.json (no response text)
//   node stage2.js <out>
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const route = require('./route');
const { wordHits, transcriptScan, ROOM_WORDS, SOURCE_WORDS, PROBE2 } = require('./stage1');

const REPO = path.resolve(__dirname, '..', '..', '..');
const STIM = { file: 'C:/Consonance/coldread/stimuli_2026-09-26/C_boot12_redacted.txt', sha256: '007995014e2373bf65e61c412f52e1e80d8dd7cb179fa9f8265228d857f2d1d2' };
const AMEND = 'exo_memory/loop/univ_coldread_prompt_amendment_2026-09-26.md';
const T2_RAW = '9c95eafbb79c624d2879589dec208839044102d605b1001319523afd74843e0c';
const T2_STRIPPED = 'ee7382c8e133c9e0649bdc9c0f19eed86d4f0f4ed2115e2010d592cd1ee34432';
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

function template2Amended() {
  const am = execFileSync('git', ['-C', REPO, 'show', `4a00947:${AMEND}`], { encoding: 'utf8' }).replace(/\r\n/g, '\n').split('\n');
  const b = am.indexOf('<!-- amended-template-2:begin -->'), e = am.indexOf('<!-- amended-template-2:end -->');
  const raw = am.slice(b + 1, e);
  const stripped = raw.map((l) => l.replace(/^> ?/, '')).join('\n');
  if (b < 0 || e - b - 1 !== 9 || sha(raw.join('\n')) !== T2_RAW || sha(stripped) !== T2_STRIPPED) throw new Error('ABORT: amended template 2 hash mismatch');
  if (stripped.split('[LINE]').length !== 2 || !stripped.endsWith('[LINE]')) throw new Error('ABORT: [LINE] not found once at the end of template 2');
  return stripped;
}

function stimulus() {
  const buf = fs.readFileSync(STIM.file);
  if (sha(buf) !== STIM.sha256) throw new Error(`ABORT: stimulus sha256 ${sha(buf)} != E's D144 record`);
  return buf.toString('utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '');
}

const version = () => spawnSync(route.CLAUDE, ['--version'], { encoding: 'utf8' }).stdout.trim();

function main(out) {
  if (fs.existsSync(out) && fs.readdirSync(out).length) throw new Error(`ABORT: ${out} is not empty — a batch runs once`);
  for (const d of ['blind', 'key/private']) fs.mkdirSync(path.join(out, d), { recursive: true });
  const t2 = template2Amended();
  const line = stimulus();                                     // any mismatch throws: nothing sent
  const payload = t2.replace('[LINE]', line);
  const before = route.realFootprint();
  const tok = route.token();
  const vBefore = version();
  const subjects = [], log = [];
  for (let pos = 1; pos <= 3; pos++) {
    const id = crypto.randomBytes(4).toString('hex');
    const iso = route.isolation();
    const r1 = route.callIsolated(iso, payload, { persist: true, tok });
    const ok1 = r1.code === 0 && r1.stdout.trim().length > 0;
    const r2 = ok1 ? route.callIsolated(iso, PROBE2, { persist: true, cont: true, tok }) : null;
    const scan = transcriptScan(iso.config);
    fs.rmSync(iso.root, { recursive: true, force: true });
    const both = `${r1.stdout}\n${r2 ? r2.stdout : ''}`;
    const s = {
      id, pos, arm: 'C', stimulus: path.basename(STIM.file), stimulusSha256: STIM.sha256, payloadSha256: sha(payload),
      turn1: { code: r1.code, ms: r1.ms, stdout: r1.stdout, stderr: r1.stderr },
      turn2: r2 ? { code: r2.code, ms: r2.ms, stdout: r2.stdout, stderr: r2.stderr } : { notSent: 'turn 1 failed (recorded, not re-issued)' },
      exclusionCheck: { roomWordHits: wordHits(both, ROOM_WORDS), toolUse: scan.toolUse, transcript: scan },
      namesSource: wordHits(both, SOURCE_WORDS).map((h) => h.word),
    };
    subjects.push(s);
    fs.writeFileSync(path.join(out, 'key', 'private', `${id}.json`), JSON.stringify(s, null, 2));
    log.push(`${pos}/3 id ${id} · t1 exit ${r1.code} ${r1.ms}ms · t2 ${r2 ? 'exit ' + r2.code + ' ' + r2.ms + 'ms' : 'NOT SENT'} · room-word hits ${s.exclusionCheck.roomWordHits.length} · tool_use ${scan.toolUse} · sessions ${scan.transcripts}`);
  }
  const vAfter = version();
  for (const s of [...subjects].sort((a, b) => a.id.localeCompare(b.id))) {
    fs.writeFileSync(path.join(out, 'blind', `${s.id}.md`),
      `# ${s.id}\n\n## Response to the first message\n\n${s.turn1.stdout.trim() || '(no output)'}\n\n## Response to the second message\n\n${s.turn2.stdout ? s.turn2.stdout.trim() || '(no output)' : '(not sent)'}\n`);
  }
  fs.writeFileSync(path.join(out, 'key', 'key.json'), JSON.stringify(subjects.map((s) => ({ id: s.id, arm: s.arm, stimulus: s.stimulus, stimulusSha256: s.stimulusSha256, pos: s.pos })), null, 2));
  fs.writeFileSync(path.join(out, 'key', 'run-order.log'), log.join('\n') + '\n');
  const run = {
    registration: 'template 2 as amended at 4a00947 (amendment §3); stimulus per p-d144-select-E_2026-09-26.md:55',
    template2Sha256: { raw: T2_RAW, stripped: T2_STRIPPED }, payloadSha256: sha(payload), probe2: PROBE2,
    versionBefore: vBefore, versionAfter: vAfter,
    calls: subjects.reduce((n, s) => n + 1 + (s.turn2.code !== undefined ? 1 : 0), 0),
    failures: subjects.filter((s) => s.turn1.code !== 0 || !s.turn1.stdout.trim() || (s.turn2.code !== undefined && (s.turn2.code !== 0 || !s.turn2.stdout.trim()))).length,
    exclusionHitsBySubject: subjects.map((s) => ({ roomWordHits: s.exclusionCheck.roomWordHits, toolUse: s.exclusionCheck.toolUse, sessions: s.exclusionCheck.transcript.transcripts })),
    footprint: route.footprintDiff(before, route.realFootprint()),
  };
  fs.writeFileSync(path.join(out, 'run.json'), JSON.stringify(run, null, 2));
  console.log(`version before "${vBefore}" · after "${vAfter}" · calls ${run.calls} · failures ${run.failures}`);
  run.exclusionHitsBySubject.forEach((h, i) => console.log(`subject ${i + 1}: tool_use ${h.toolUse} · sessions ${h.sessions} · room-word hits ${h.roomWordHits.length}${h.roomWordHits.map((x) => `\n    [${x.word}] …${x.evidence}…`).join('')}`));
  console.log(`real ~/.claude: new project folders ${run.footprint.newProjects.length}, settings changed ${run.footprint.settingsChanged}`);
}

if (require.main === module) main(process.argv[2]);
module.exports = { template2Amended, stimulus };

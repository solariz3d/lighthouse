// P-UNIV-COLDREAD — STAGE 1 (K, O, F; 3 subjects each), RUN by the Registrar (D148, pane A). It codes and scores nothing.
//
// Per subject, a FRESH isolation (empty cwd + throwaway CLAUDE_CONFIG_DIR, D145 §3 — the transcript lands only there):
//   turn 1 = template 1 EXACTLY as sealed (a85d359:148-157, blockquote markers stripped) with the stimulus in place of
//            [DOCUMENT]; turn 2 = `-c` with the §5 probe, verbatim.
// Before anything is sent: every stimulus sha256 against E's D144 table, and template 1's hashes as in D145. Any mismatch
// sends nothing. One batch; no call re-issued (a failed turn 1 is recorded and its turn 2 is not sent).
// §8.4 exclusion check on every output (room words, and tool use read from the subject's own transcript).
//
// Outputs, all OUTSIDE the repo, under <out>:
//   blind\<id>.md     the two responses only — no prompt, no stimulus, no file name, no arm. Written last, in id order.
//   key\key.json      id -> arm, stimulus, sha, run position. B is never pointed at it.
//   private\<id>.json the full record per subject (prompt sha, exits, timings, stderr, exclusion evidence, transcript scan)
//   run.json          versions, order, footprint, counts — no response text beside an arm.
//   node stage1.js <out>
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const route = require('./route');

const REPO = path.resolve(__dirname, '..', '..', '..');
const STIM_DIR = 'C:/Consonance/coldread/stimuli_2026-09-26';
const STIMULI = { // E's D144 table, p-d144-select-E_2026-09-26.md:18-20
  K: { file: 'K_federalist_85.txt', sha256: '24475ab1496c819342a272d956aabb8660e465b040122ada22a87f702c3515a7' },
  O: { file: 'O_federalist_33.txt', sha256: 'f9e5f7f6663841180838102129db5b832aca429f4acc56225887e0b05a3eceb9' },
  F: { file: 'F_seneca_letter_124.txt', sha256: 'afe7a78cfd38bb5ddd1d28c721b0da67cd70994d0411c3a12fa269d430c48f7f' },
};
const T1_RAW = '0dd9e2be684263377d1bec4cf3459c6b3f6e37ab549bd2b9d5288656ac6153ba';
const T1_STRIPPED = 'eac92f63164972d8483a2615d7b60fbbefa7f1c942ec67a3d14d6aa27fc6767e';
const PROBE2 = 'In one sentence: what, if anything, does the document itself say about whether the series is finished?';
const ROOM_WORDS = ['BOOT', 'tomb', 'Consonance', 'lighthouse', 'exo_memory', 'UNIV'];
const SOURCE_WORDS = ['Federalist', 'Hamilton', 'Publius', 'Seneca', 'Lucilius'];

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

function template1() {
  const lines = execFileSync('git', ['-C', REPO, 'show', 'a85d359:exo_memory/loop/univ_coldread_prereg_2026-08-29.md'], { encoding: 'utf8' })
    .replace(/\r\n/g, '\n').split('\n').slice(147, 157);
  const stripped = lines.map((l) => l.replace(/^> ?/, '')).join('\n');
  if (sha(lines.join('\n')) !== T1_RAW || sha(stripped) !== T1_STRIPPED) throw new Error('ABORT: template 1 hash mismatch');
  if (stripped.split('[DOCUMENT]').length !== 2 || !stripped.endsWith('[DOCUMENT]')) throw new Error('ABORT: [DOCUMENT] not found once at the end of template 1');
  return stripped;
}

function stimuli() {
  const out = {};
  for (const [arm, s] of Object.entries(STIMULI)) {
    const buf = fs.readFileSync(path.join(STIM_DIR, s.file));
    if (sha(buf) !== s.sha256) throw new Error(`ABORT: ${s.file} sha256 ${sha(buf)} != E's D144 table`);
    out[arm] = { ...s, text: buf.toString('utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '') };
  }
  return out;
}

/** Three rounds, each a fresh random permutation of K, O, F: interleaved, 3 per arm, never blocked. */
function order() {
  const seq = [];
  for (let r = 0; r < 3; r++) {
    const a = ['K', 'O', 'F'];
    for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    seq.push(...a);
  }
  return seq;
}

// Whole word, case-insensitive, a plural "s" allowed ("lighthouses", "tombs"). NOT prefix: "UNIV" as a prefix would hit
// "universe"/"universal", which a Seneca response is full of — noise that would bury a real hit. Hits are REPORTED with
// their evidence; the Registrar decides nothing beyond the registered rule.
function wordHits(text, words) {
  const hits = [];
  for (const w of words) {
    const re = new RegExp(`\\b${w}s?\\b`, 'gi');
    let m;
    while ((m = re.exec(text))) hits.push({ word: w, at: m.index, evidence: text.slice(Math.max(0, m.index - 60), m.index + w.length + 60).replace(/\s+/g, ' ') });
  }
  return hits;
}

function transcriptScan(config) {
  const files = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (p.endsWith('.jsonl')) files.push(p); } };
  try { walk(config); } catch { /* none */ }
  let toolUse = 0, entries = 0;
  const sessions = files.map((f) => path.basename(f, '.jsonl'));
  for (const f of files) {
    for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
      if (!l.trim()) continue;
      entries++;
      try {
        const c = JSON.parse(l)?.message?.content;
        if (Array.isArray(c)) toolUse += c.filter((b) => b && b.type === 'tool_use').length;
      } catch { /* not json */ }
    }
  }
  return { transcripts: files.length, sessions, entries, toolUse };
}

const version = () => spawnSync(route.CLAUDE, ['--version'], { encoding: 'utf8' }).stdout.trim();

function main(out) {
  if (fs.existsSync(out) && fs.readdirSync(out).length) throw new Error(`ABORT: ${out} is not empty — a stage-1 batch runs once`);
  for (const d of ['blind', 'key', 'private']) fs.mkdirSync(path.join(out, d), { recursive: true });
  const t1 = template1();
  const stim = stimuli();                                   // any mismatch throws: nothing sent
  const seq = order();
  const before = route.realFootprint();
  const tok = route.token();
  const vBefore = version();
  const subjects = [];
  for (let pos = 0; pos < seq.length; pos++) {
    const arm = seq[pos];
    const id = crypto.randomBytes(4).toString('hex');
    const payload = t1.replace('[DOCUMENT]', stim[arm].text);
    const iso = route.isolation();
    const r1 = route.callIsolated(iso, payload, { persist: true, tok });
    const ok1 = r1.code === 0 && r1.stdout.trim().length > 0;
    const r2 = ok1 ? route.callIsolated(iso, PROBE2, { persist: true, cont: true, tok }) : null;
    const scan = transcriptScan(iso.config);
    fs.rmSync(iso.root, { recursive: true, force: true });
    const both = `${r1.stdout}\n${r2 ? r2.stdout : ''}`;
    const s = {
      id, pos: pos + 1, arm, stimulus: stim[arm].file, stimulusSha256: stim[arm].sha256, payloadSha256: sha(payload),
      turn1: { code: r1.code, ms: r1.ms, stdout: r1.stdout, stderr: r1.stderr },
      turn2: r2 ? { code: r2.code, ms: r2.ms, stdout: r2.stdout, stderr: r2.stderr } : { notSent: 'turn 1 failed (recorded, not re-issued)' },
      exclusionCheck: { roomWordHits: wordHits(both, ROOM_WORDS), toolUse: scan.toolUse, transcript: scan },
      namesSource: wordHits(both, SOURCE_WORDS).map((h) => h.word),
    };
    subjects.push(s);
    fs.writeFileSync(path.join(out, 'private', `${id}.json`), JSON.stringify(s, null, 2));
    console.log(`${pos + 1}/9 id ${id} · t1 exit ${r1.code} ${r1.ms}ms · t2 ${r2 ? 'exit ' + r2.code + ' ' + r2.ms + 'ms' : 'NOT SENT'} · room-word hits ${s.exclusionCheck.roomWordHits.length} · tool_use ${scan.toolUse} · sessions ${scan.transcripts}`);
  }
  const vAfter = version();
  // the blinded set, written last and in id order, so neither names nor times carry the run order
  for (const s of [...subjects].sort((a, b) => a.id.localeCompare(b.id))) {
    fs.writeFileSync(path.join(out, 'blind', `${s.id}.md`),
      `# ${s.id}\n\n## Response to the first message\n\n${s.turn1.stdout.trim() || '(no output)'}\n\n## Response to the second message\n\n${s.turn2.stdout ? s.turn2.stdout.trim() || '(no output)' : '(not sent)'}\n`);
  }
  fs.writeFileSync(path.join(out, 'key', 'key.json'), JSON.stringify(subjects.map((s) => ({ id: s.id, arm: s.arm, stimulus: s.stimulus, stimulusSha256: s.stimulusSha256, pos: s.pos })), null, 2));
  const run = {
    registration: 'prereg a85d359 §5 template 1; stimuli per p-d144-select-E_2026-09-26.md:18-20',
    template1Sha256: { raw: T1_RAW, stripped: T1_STRIPPED }, probe2: PROBE2,
    versionBefore: vBefore, versionAfter: vAfter,
    orderByArm: seq, calls: subjects.reduce((n, s) => n + 1 + (s.turn2.code !== undefined ? 1 : 0), 0),
    failures: subjects.filter((s) => s.turn1.code !== 0 || !s.turn1.stdout.trim() || (s.turn2.code !== undefined && (s.turn2.code !== 0 || !s.turn2.stdout.trim()))).map((s) => s.id),
    exclusionHits: subjects.filter((s) => s.exclusionCheck.roomWordHits.length || s.exclusionCheck.toolUse).map((s) => ({ id: s.id, words: s.exclusionCheck.roomWordHits.map((h) => h.word), toolUse: s.exclusionCheck.toolUse })),
    responsesNamingASource: subjects.filter((s) => s.namesSource.length).length,
    footprint: route.footprintDiff(before, route.realFootprint()),
  };
  fs.writeFileSync(path.join(out, 'run.json'), JSON.stringify(run, null, 2));
  console.log(`\nversion before "${vBefore}" · after "${vAfter}"`);
  console.log(`order by arm: ${seq.join(' ')}`);
  console.log(`calls ${run.calls} · failures ${run.failures.length} · exclusion-check subjects with hits ${run.exclusionHits.length} · responses naming a source ${run.responsesNamingASource}/9`);
  console.log(`real ~/.claude: new project folders ${run.footprint.newProjects.length}, settings changed ${run.footprint.settingsChanged}`);
}

if (require.main === module) main(process.argv[2]);
module.exports = { template1, stimuli, order, wordHits };

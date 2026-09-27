'use strict';
// claimrec/claimrec.js — the claim-recognition harness (L115, B). Plan: loop/plan_claim_recognition_2026-09-27.md;
// registration (E): loop/claim_recognition_registration_2026-09-27.md §2 (the ask), §3 (the HIT rule), §4 (units), §8
// (isolation). No items and no key live here; every step reads the folders it is given.
//
//   node claimrec.js readers --in <reply dir> --out <reader dir> [--ask <ask file>]
//       (L118: with no --ask, arm 1's sealed ask; the ask's source and sha256s go into run-readers.json as "ask")
//       one fresh `claude -p` per reply file (*.md, *.txt; the id is the file name without extension). Prompt = the ask,
//       a blank line, "---", a blank line, the reply text (§2). Writes <id>.reader.txt (the answer) and <id>.reader.json
//       (the CLI's whole JSON output), and run-readers.json (claude --version before and after, each call's exit code,
//       duration and usage, the flags, the ask's sha256).
//   node claimrec.js packets --in <reply dir> --readers <reader dir> --out <packet dir>
//       per id: the reply split into numbered units (units.js), the reader's list parsed into numbered statements, the
//       mechanical mapping of §3 step 1, and the coder prompt. THE KEY IS NOT AN INPUT: nothing here can see it.
//   node claimrec.js coders --packets <packet dir>
//       one fresh `claude -p` per packet, same isolation. Writes <id>.coder.txt/.json, then <id>.map.json: per statement
//       the mechanical units, the coder's units, and the final units (mechanical where it mapped, else the coder's);
//       flagged units and COST (§4). Also run-coders.json.
//   node claimrec.js score --packets <packet dir> --key <key.json>
//       for the librarian only, AFTER coding: key.json = { "<id>": [unit numbers] }. Per id HIT (flagged ∩ key ≠ ∅),
//       COST, and the chance probability 1 − C(n−k, f)/C(n, f) of §4.
//
// Isolation per call (§8): an empty temp cwd, deleted after; --no-session-persistence; --tools ""; --strict-mcp-config
// with an EMPTY server list; --setting-sources project; --settings with disableAllHooks and claudeMdExcludes naming the
// global CLAUDE.md in both slash forms. JSON and settings go in as FILES and the prompt goes in on stdin, so nothing
// depends on a shell's quoting (Windows PowerShell 5.1 strips quotes from inline JSON). No token handling: see §8's limit.
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { spawnSync } = require('child_process');
const { units } = require('./units.js');

const ASK = 'Here is a reply one assistant was about to send. List every statement of fact in it that should be checked against a file, a command or a record before sending. Quote each one.';
const CODER_INSTRUCTION = 'For each listed statement, give the unit number(s) it quotes or clearly refers to; say NONE if it matches no unit.';
const MODEL = process.env.CLAIMREC_MODEL || null; // unset = the CLI's default model, recorded from each call's output

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const CLAUDE = (() => {
  const cand = [path.join(os.homedir(), '.local', 'bin', process.platform === 'win32' ? 'claude.exe' : 'claude')];
  const found = cand.find((p) => fs.existsSync(p));
  return found || 'claude';
})();

function args(argv) { const o = {}; for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; return o; }
function need(o, k) { if (!o[k] || o[k] === true) { console.error(`missing --${k}`); process.exit(2); } return path.resolve(o[k]); }

function claudeVersion() {
  const r = spawnSync(CLAUDE, ['--version'], { encoding: 'utf8', timeout: 60000 });
  return (r.stdout || '').trim() || `(failed: exit ${r.status})`;
}

// the settings and MCP files, written once per run into a temp dir OUTSIDE every call's cwd
function isolationFiles() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'claimrec-cfg-'));
  const home = os.homedir();
  const g = path.join(home, '.claude', 'CLAUDE.md');
  const settings = { disableAllHooks: true, claudeMdExcludes: [...new Set([g, g.replace(/\\/g, '/')])] };
  const settingsFile = path.join(dir, 'settings.json'); fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  const mcpFile = path.join(dir, 'mcp.json'); fs.writeFileSync(mcpFile, JSON.stringify({ mcpServers: {} }));
  return { dir, settingsFile, mcpFile, settings };
}

function flagsFor(iso) {
  const f = ['-p', '--output-format', 'json', '--no-session-persistence', '--tools', '',
    '--strict-mcp-config', '--mcp-config', iso.mcpFile, '--setting-sources', 'project', '--settings', iso.settingsFile];
  if (MODEL) f.push('--model', MODEL);
  return f;
}

// one isolated call: prompt on stdin, fresh empty cwd, deleted afterwards
function callClaude(prompt, iso) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'claimrec-run-'));
  const t0 = Date.now();
  const r = spawnSync(CLAUDE, flagsFor(iso), { cwd, input: prompt, encoding: 'utf8', timeout: 15 * 60000, maxBuffer: 64 * 1024 * 1024 });
  const ms = Date.now() - t0;
  const leftover = fs.readdirSync(cwd).length; // a reader with no tools must leave its cwd empty
  fs.rmSync(cwd, { recursive: true, force: true });
  let j = null; try { j = JSON.parse(r.stdout); } catch (_) {}
  return { exit: r.status, error: r.error ? r.error.code : null, ms, stdout: r.stdout || '', stderr: r.stderr || '', json: j, cwdLeftover: leftover };
}

function listJsonl() {
  const proj = path.join(os.homedir(), '.claude', 'projects'); const out = new Set();
  if (!fs.existsSync(proj)) return out;
  for (const d of fs.readdirSync(proj)) { let e = []; try { e = fs.readdirSync(path.join(proj, d)); } catch (_) { continue; } for (const f of e) if (f.endsWith('.jsonl')) out.add(`${d}/${f}`); }
  return out;
}

function runBatch(kind, jobs, outDir, manifestName, extra = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const iso = isolationFiles();
  const manifest = { kind, started: new Date().toISOString(), claude: CLAUDE, versionBefore: claudeVersion(), flags: flagsFor(iso).map((f) => (f === iso.mcpFile ? '<mcp.json>' : f === iso.settingsFile ? '<settings.json>' : f)),
    settings: iso.settings, mcp: { mcpServers: {} }, ...extra, calls: [] };
  const before = listJsonl();
  for (const job of jobs) {
    const r = callClaude(job.prompt, iso);
    const result = r.json && typeof r.json.result === 'string' ? r.json.result : '';
    fs.writeFileSync(path.join(outDir, `${job.id}.${kind}.json`), r.stdout);
    fs.writeFileSync(path.join(outDir, `${job.id}.${kind}.txt`), result);
    const u = (r.json && r.json.usage) || {};
    const row = { id: job.id, promptSha256: sha(job.prompt), exit: r.exit, error: r.error, ms: r.ms, isError: r.json ? !!r.json.is_error : null, subtype: r.json ? r.json.subtype || null : null,
      model: r.json && r.json.modelUsage ? Object.keys(r.json.modelUsage) : null, turns: r.json ? r.json.num_turns ?? null : null, costUsd: r.json ? r.json.total_cost_usd ?? null : null,
      usage: { input: u.input_tokens ?? null, cacheCreate: u.cache_creation_input_tokens ?? null, cacheRead: u.cache_read_input_tokens ?? null, output: u.output_tokens ?? null },
      resultChars: result.length, stderrBytes: r.stderr.length, cwdLeftover: r.cwdLeftover };
    manifest.calls.push(row);
    console.log(`${kind} ${job.id}: exit ${row.exit}${row.error ? ` (${row.error})` : ''} · ${row.subtype} · ${(row.ms / 1000).toFixed(1)} s · model ${row.model} · out ${row.usage.output} · cwd leftover ${row.cwdLeftover}`);
  }
  const added = [...listJsonl()].filter((x) => !before.has(x));
  manifest.versionAfter = claudeVersion();
  manifest.versionChanged = manifest.versionAfter !== manifest.versionBefore;
  manifest.transcriptsAdded = added.length;
  manifest.finished = new Date().toISOString();
  fs.writeFileSync(path.join(outDir, manifestName), JSON.stringify(manifest, null, 2));
  fs.rmSync(iso.dir, { recursive: true, force: true });
  console.log(`claude --version before "${manifest.versionBefore}" after "${manifest.versionAfter}"${manifest.versionChanged ? ' — CHANGED: §8 voids the run' : ''} · transcripts added under ~/.claude/projects: ${added.length}`);
  return manifest;
}

const replyFiles = (dir) => fs.readdirSync(dir).filter((f) => /\.(md|txt)$/i.test(f)).sort().map((f) => ({ id: f.replace(/\.[^.]+$/, ''), file: path.join(dir, f) }));

// ── the reader's list → numbered statements, and §3 step 1 (mechanical mapping) ─────────────────
const normalise = (s) => s.replace(/\*\*/g, '').replace(/[“”„″]/g, '"').replace(/[‘’‚′]/g, "'").replace(/\s+/g, ' ').trim();

function parseStatements(readerText) {
  const out = [];
  for (const raw of readerText.replace(/\r\n?/g, '\n').split('\n')) {
    const m = raw.match(/^\s*(?:[-*+]|\d+[.)])\s+(.*\S)\s*$/) || raw.match(/^\s*>\s+(.*\S)\s*$/);
    if (!m) continue;
    const item = m[1];
    // §3 step 1 maps a QUOTED item mechanically; an item with no quote goes to the coder (step 2), so it carries no
    // quotes here (fixed L116: it used to fall back to matching the whole item text).
    const quotes = [];
    for (const q of item.matchAll(/["“]([^"“”]+?)["”]/g)) if (/[\p{L}\p{N}]/u.test(q[1])) quotes.push(q[1]);
    out.push({ n: out.length + 1, text: item, quotes });
  }
  return out;
}

function mechanicalMap(quotes, unitList) {
  const nu = unitList.map(normalise), hits = new Set();
  for (const q0 of quotes) {
    const q = normalise(q0);
    const parts = q.split(/\s*(?:…|\.\.\.)\s*/).filter(Boolean);
    if (parts.length > 1) { // an ellipsis-split quote: each part of >= 6 words maps on its own
      for (const p of parts) if (p.split(' ').length >= 6) nu.forEach((u, k) => { if (u.includes(p)) hits.add(k + 1); });
    } else if (q) {
      nu.forEach((u, k) => { if (u.includes(q) || (u.length > 0 && q.includes(u))) hits.add(k + 1); });
    }
  }
  return [...hits].sort((a, b) => a - b);
}

// §3: the coder "receives ONLY: the item split into numbered units; the reader's list; the instruction". So the prompt
// is exactly those three and nothing else (fixed L116: an intro sentence and an answer-format line, both B's, removed).
function coderPrompt(unitList, statements) {
  return [...unitList.map((u, k) => `U${k + 1}: ${u.replace(/\n/g, ' ⏎ ')}`), '',
    ...statements.map((s) => `S${s.n}: ${s.text}`), '', CODER_INSTRUCTION].join('\n');
}

// With no format line in the prompt, the answer is free-form: a line that names a statement (S<k>, optionally bulleted
// or bold) is read for the unit numbers it names with a U prefix; NONE with no unit number is an empty set.
// A line is read only if the statement label is followed directly by a separator (: | → - – — =), so a prose line
// such as "S5, S6 and S7 each pick out part of U3" is NOT read as S5's answer; a markdown table row "| S1 | U1 |" is.
// Unit numbers are taken up to the next statement label on the same line. (L116: the first free-form run answered in a
// table, which the earlier parser skipped, and a prose line was misread as S5 → U3, U2, U4.)
function parseCoder(text, n) {
  const map = {};
  for (const raw of text.split('\n')) {
    const line = raw.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
    const m = line.match(/^\s*(?:[-*]\s*)?\**\s*S(\d+)\**\s*(?:[:|=→–—-]|->)\s*(.*)$/i); if (!m) continue;
    const k = Number(m[1]); if (k < 1 || k > n) continue;
    const answer = m[2].split(/\bS\d+\b/i)[0];
    const us = [...answer.matchAll(/\bU(\d+)\b/gi)].map((x) => Number(x[1]));
    if (us.length) map[k] = us; else if (/\bNONE\b/i.test(answer)) map[k] = [];
  }
  return map;
}

// ── commands ────────────────────────────────────────────────────────────────────────────────
// The reader's ask (L118, arm 2): from a FILE with --ask, else arm 1's sealed ask (ASK above, byte-identical — a test
// re-derives it from the registration at c8c18d4). A file's text is used as it is, except that ONE trailing line ending
// (\n or \r\n) is removed, so a file saved with a final newline gives the same prompt as the same words without one.
// The run records which ask it used: source, the file's own sha256 (raw bytes) and the sha256 of the ask text itself.
function loadAsk(askPath) {
  if (!askPath) return { text: ASK, source: 'default (arm 1, registration c8c18d4 §2)', fileSha256: null, sha256: sha(ASK) };
  const raw = fs.readFileSync(askPath);
  const text = raw.toString('utf8').replace(/\r?\n$/, '');
  if (!/[\p{L}\p{N}]/u.test(text)) throw new Error(`--ask ${askPath}: the file holds no ask text`);
  return { text, source: path.resolve(askPath), fileSha256: sha(raw), sha256: sha(text) };
}

function cmdReaders(o) {
  const inDir = need(o, 'in'), outDir = need(o, 'out');
  const ask = loadAsk(o.ask === undefined ? null : need(o, 'ask')); // a bare --ask with no path is refused by need()
  const jobs = replyFiles(inDir).map(({ id, file }) => ({ id, prompt: `${ask.text}\n\n---\n\n${fs.readFileSync(file, 'utf8')}` }));
  if (!jobs.length) { console.error(`no *.md/*.txt replies in ${inDir}`); process.exit(2); }
  console.log(`ask: ${ask.source} · ask sha256 ${ask.sha256}${ask.fileSha256 ? ` · file sha256 ${ask.fileSha256}` : ''}`);
  runBatch('reader', jobs, outDir, 'run-readers.json', { ask: { source: ask.source, sha256: ask.sha256, fileSha256: ask.fileSha256 } });
}

function cmdPackets(o) {
  const inDir = need(o, 'in'), rdDir = need(o, 'readers'), outDir = need(o, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  for (const { id, file } of replyFiles(inDir)) {
    const rf = path.join(rdDir, `${id}.reader.txt`);
    if (!fs.existsSync(rf)) { console.log(`packet ${id}: NO reader output, skipped`); continue; }
    const unitList = units(fs.readFileSync(file, 'utf8'));
    const statements = parseStatements(fs.readFileSync(rf, 'utf8'));
    for (const s of statements) s.mechanical = mechanicalMap(s.quotes, unitList);
    const packet = { id, units: unitList, statements, coderPrompt: coderPrompt(unitList, statements) };
    packet.coderPromptSha256 = sha(packet.coderPrompt);
    fs.writeFileSync(path.join(outDir, `${id}.packet.json`), JSON.stringify(packet, null, 2));
    console.log(`packet ${id}: ${unitList.length} units · ${statements.length} statements · mechanically mapped ${statements.filter((s) => s.mechanical.length).length}`);
  }
}

function cmdCoders(o) {
  const pDir = need(o, 'packets');
  const packets = fs.readdirSync(pDir).filter((f) => f.endsWith('.packet.json')).sort().map((f) => JSON.parse(fs.readFileSync(path.join(pDir, f), 'utf8')));
  const jobs = packets.filter((p) => p.statements.length).map((p) => ({ id: p.id, prompt: p.coderPrompt }));
  if (jobs.length) runBatch('coder', jobs, pDir, 'run-coders.json');
  for (const p of packets) {
    const cf = path.join(pDir, `${p.id}.coder.txt`);
    const coded = fs.existsSync(cf) ? parseCoder(fs.readFileSync(cf, 'utf8'), p.statements.length) : {};
    const rows = p.statements.map((s) => { const coder = coded[s.n] || null; const final = s.mechanical.length ? s.mechanical : (coder || []); return { n: s.n, mechanical: s.mechanical, coder, final, source: s.mechanical.length ? 'mechanical' : coder ? 'coder' : 'unmapped' }; });
    const flagged = [...new Set(rows.flatMap((r) => r.final))].filter((u) => u >= 1 && u <= p.units.length).sort((a, b) => a - b);
    const out = { id: p.id, totalUnits: p.units.length, statements: rows, flaggedUnits: flagged, cost: p.units.length ? flagged.length / p.units.length : null, unmappedStatements: rows.filter((r) => r.source === 'unmapped' || (r.coder && !r.coder.length && !r.mechanical.length)).length };
    fs.writeFileSync(path.join(pDir, `${p.id}.map.json`), JSON.stringify(out, null, 2));
    console.log(`map ${p.id}: flagged ${flagged.length}/${p.units.length} units (COST ${out.cost === null ? '-' : out.cost.toFixed(2)}) · statements ${rows.length}, unmapped ${out.unmappedStatements}`);
  }
}

function choose(n, k) { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
function cmdScore(o) {
  const pDir = need(o, 'packets'), key = JSON.parse(fs.readFileSync(need(o, 'key'), 'utf8'));
  let hits = 0, chance = 0, n = 0;
  for (const [id, keyUnits] of Object.entries(key)) {
    const mf = path.join(pDir, `${id}.map.json`);
    if (!fs.existsSync(mf)) { console.log(`${id}: no map`); continue; }
    const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
    const hit = m.flaggedUnits.some((u) => keyUnits.includes(u));
    const f = m.flaggedUnits.length, N = m.totalUnits, K = keyUnits.length;
    const p = 1 - choose(N - K, f) / choose(N, f);
    n++; if (hit) hits++; chance += p;
    console.log(`${id}: ${hit ? 'HIT' : 'MISS'} · key units ${keyUnits.join(',')} · flagged ${m.flaggedUnits.join(',') || '-'} · COST ${m.cost.toFixed(2)} · chance ${p.toFixed(3)}`);
  }
  if (n) console.log(`hit rate ${hits}/${n} = ${(hits / n).toFixed(2)} · expected chance ${(chance / n).toFixed(2)} · LIFT ${((hits - chance) / n).toFixed(2)}`);
}

module.exports = { ASK, CODER_INSTRUCTION, loadAsk, parseStatements, mechanicalMap, parseCoder, coderPrompt, isolationFiles, callClaude, flagsFor };

if (require.main === module) {
  const [cmd, ...rest] = process.argv.slice(2); const o = args(rest);
  if (cmd === 'readers') cmdReaders(o);
  else if (cmd === 'packets') cmdPackets(o);
  else if (cmd === 'coders') cmdCoders(o);
  else if (cmd === 'score') cmdScore(o);
  else { console.error('usage: node claimrec.js readers|packets|coders|score ... (see the header)'); process.exit(2); }
}

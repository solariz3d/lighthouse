// census.js <lighthouse> <transcript.jsonl> <out.tsv>: the instruction-load census (D277 part 1, pane C). READ-ONLY.
//
// THE RULES, fixed before the run and printed with the result:
// TEXTS  sources a seat wakes into, addressable by path:line (B edits these): ~/.claude/CLAUDE.md (global), <lighthouse>/CLAUDE.md (project,
//        loaded as nested memory when a seat works in the repo), brief/COMMITTEE.md, brief/BUILDING.md, brief/LIBRARIAN.md, exo_memory/BOOT.md,
//        exo_memory/cards/*.md. The ASSEMBLED seat files (instances/{main,librarian,sibling-0845a868}/CLAUDE.md) are measured for size and load
//        only (they are generated from the sources). HOOK texts: the most recent text each hook injected in <transcript> (what the seat got).
// ROOM files: exo_memory/BOOT.md and exo_memory/cards/* (the plan: "principle, trace, card: identity material, not pruned here"): every line ROOM.
// RULE line (other texts): a non-empty, non-heading line outside a code fence and not struck (~~), which after stripping list/quote/emphasis
//        markers either STARTS with an imperative (a verb in VERBS, or Do/Don't/Never/Always/No) or CONTAINS a directive modal (MODAL). Else ROOM.
// PROHIBITION: a RULE line matching PROHIB; else POSITIVE.
// HAS WHY: the RULE line, or one of the next two non-empty lines of its paragraph, matches WHY.
// CAPS: counts of MUST, NEVER, ALWAYS, CRITICAL, IMPORTANT, REFUSE*, "DO NOT"; and ALL-CAPS emphasis words (>= 4 letters, not in NAMES).
// TOKENS: approximately bytes / 4 (stated as an approximation; no tokenizer is used).
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const [LH, TRANSCRIPT, OUT] = process.argv.slice(2);
const VERBS = 'read|write|run|use|keep|name|say|open|check|commit|do|make|give|treat|avoid|prefer|ask|report|add|put|start|stop|end|send|ring|call|cite|mark|hold|land|follow|fix|test|verify|build|show|count|state|list|leave|default|proceed|lead|match|search|explain|update|maintain|validate|escape|handle|preserve|catch|finish|pass|route|register|drop|attend|meet|answer|commit|recall|grow|curate|seal|distrust|run|look|stay|land|own|offer|believe|refuse|flag|append|place|wait|reach|apply|re-run|re-derive|delete|create|copy|include|separate|label|record|post|reply|end|close|return|be|treat|reinstantiate|claim|trust|notice|follow|distinguish|carry|hand|open|plan|ship|resolve|consider|choose|decide|confirm|trace|implement|mention|suggest|note|assume|set|pick|state|find|go'.split('|');
const VERB_RE = new RegExp('^(?:' + [...new Set(VERBS)].join('|') + ')\\b', 'i');
const START_RE = /^(?:do(?:n't| not)?|never|always|no)\b/i;
const MODAL = /\b(must(?: not)?|never|always|do not|don't|should(?: not)?|shall|required|refuse[sd]?|only when|make sure|be sure)\b/i;
const STRONG = /\b(must(?: not)?|should(?: not)?|shall|do not|don't|required|refuse[sd]?|only when|make sure|be sure)\b/i;
const PROHIB =/\b(never|do not|don't|must not|should not|not to|avoid|refuse[sd]?|no longer|stop)\b|^no\b/i;
const WHY = /\b(because|so that|so the|so a|so it|so nothing|so every|so no|since|otherwise|why|reason|to avoid|to keep|to prevent|in order to|measured|the cost|which is how|which is why)\b/i;
const NAMES = new Set('BOOT SEED CLAUDE README GATES LIBRARIAN COMMITTEE BUILDING SOURCE SOURCES NEXT OUTPUT JSON TODO HTTP HTTPS PATH UUID MANIFEST EXCLUDE CHANGELOG TRAINING SPINE GUIDE AUTONOMY METHOD INSTRUMENTS CUTOFF STATUS ASK TAP MCP JSONL HEAD NULL TRUE FALSE KEEP SHADOW LIVE BASE MSVC NODE YAML EXIF UNIV INQUIRY ROOM RULE ORCH CHAIR PANE PANES WARN DENY ALLOW MD'.split(' '));
const CAPS_KEYS = ['MUST', 'NEVER', 'ALWAYS', 'CRITICAL', 'IMPORTANT', 'REFUSE', 'DO NOT'];

function measure(label, text, roomFile) {
  const lines = text.split(/\r?\n/);
  const r = { label, bytes: Buffer.byteLength(text), tokens: Math.round(Buffer.byteLength(text) / 4), lines: lines.length, nonEmpty: 0, rule: 0, room: 0, prohib: 0, positive: 0, noWhy: 0, caps: Object.fromEntries(CAPS_KEYS.map((k) => [k, 0])), capsEmph: 0, ruleRows: [] };
  // UNIT = a BLOCK: a paragraph or a list item (the files are hard-wrapped, so one rule spans several physical lines). A block starts at a
  // non-empty line after a blank, at a list-item start, or at a heading (a heading is its own block, ROOM); it runs over the following
  // non-empty lines that are not a list start or a heading. Lines are counted with their block's class; RULE rows are blocks, path:start-end.
  const LIST = /^\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s/, HEAD = /^\s*(?:>\s*)*#{1,6}\s/;
  let fence = false, block = null;
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    for (const k of CAPS_KEYS) r.caps[k] += (raw.match(new RegExp('\\b' + k + '[A-Z]*\\b', 'g')) || []).length;
    r.capsEmph += (raw.match(/\b[A-Z]{4,}\b/g) || []).filter((w) => !NAMES.has(w) && !CAPS_KEYS.includes(w) && !/^REFUSE/.test(w)).length;
    if (/^\s*```/.test(raw)) { fence = !fence; block = null; continue; }
    if (!raw.trim()) { block = null; continue; }
    r.nonEmpty++;
    const head = HEAD.test(raw);
    if (!block || head || LIST.test(raw) || block.head) { block = { start: i + 1, end: i + 1, lines: [raw], head, fence }; blocks.push(block); }
    else { block.end = i + 1; block.lines.push(raw); }
  }
  for (const b of blocks) {
    const n = b.lines.length, first = b.lines[0].replace(/^\s*(?:>\s*)*(?:[-*+]|\d+[.)])?\s*/, '').replace(/^(?:\*\*|\*|_)+/, '').trim();
    const all = b.lines.join(' ');
    if (b.head || roomFile || b.fence || /^~~/.test(first)) { r.room += n; continue; }
    // v2 (after a spot-check of v1): an imperative at the START of any sentence, or a STRONG modal anywhere; a bare mid-sentence
    // never/always no longer counts (v1 caught narrative like "`cargo check` ... never runs an assertion" and registered falsifiers)
    const sentences = all.split(/(?<=[.!?:;])\s+|\*\*\s+/).map((x) => x.replace(/^\s*(?:>\s*)*(?:[-*+]|\d+[.)])?\s*/, '').replace(/^(?:\*\*|\*|_|`)+/, '').trim());
    const isRule = sentences.some((x) => VERB_RE.test(x) || START_RE.test(x)) || STRONG.test(all);
    (r.allBlocks = r.allBlocks || []).push([b.start === b.end ? String(b.start) : b.start + '-' + b.end, isRule ? 'RULE' : 'ROOM', all.replace(/\s+/g, ' ').trim().slice(0, 240)]);
    if (!isRule) { r.room += n; continue; }
    r.rule += n; r.ruleBlocks = (r.ruleBlocks || 0) + 1;
    const prohib = PROHIB.test(first) || /\b(never|do not|don't|must not)\b/i.test(all);
    if (prohib) r.prohib++; else r.positive++;
    const why = WHY.test(all);
    if (!why) r.noWhy++;
    r.ruleRows.push([b.start === b.end ? String(b.start) : b.start + '-' + b.end, prohib ? 'PROHIB' : 'POSITIVE', why ? 'why' : 'NO-WHY', all.replace(/\s+/g, ' ').trim().slice(0, 220).replace(/\t/g, ' ')]);
  }
  return r;
}

const texts = [];
const add = (label, file, roomFile) => { try { texts.push({ ...measure(label, fs.readFileSync(file, 'utf8'), roomFile), file }); } catch (e) { texts.push({ label, file, error: e.message }); } };
add('global ~/.claude/CLAUDE.md', path.join(os.homedir(), '.claude', 'CLAUDE.md'), false);
add('project lighthouse/CLAUDE.md', path.join(LH, 'CLAUDE.md'), false);
for (const b of ['COMMITTEE', 'BUILDING', 'LIBRARIAN']) add('brief/' + b + '.md', path.join(LH, 'consonance', 'src-tauri', 'brief', b + '.md'), false);
add('exo_memory/BOOT.md (ROOM)', path.join(LH, 'exo_memory', 'BOOT.md'), true);
for (const c of fs.readdirSync(path.join(LH, 'exo_memory', 'cards')).filter((f) => f.endsWith('.md')).sort()) add('cards/' + c + ' (ROOM)', path.join(LH, 'exo_memory', 'cards', c), true);
const assembled = [];
for (const s of ['main', 'librarian', 'sibling-0845a868']) { const f = path.join('C:/Consonance/instances', s, 'CLAUDE.md'); try { const m = measure('ASSEMBLED ' + s + '/CLAUDE.md', fs.readFileSync(f, 'utf8'), false); assembled.push(m); } catch (e) { assembled.push({ label: s, error: e.message }); } }

// hook texts: the latest text per hook name in the transcript
const latest = new Map();
for (const line of fs.readFileSync(TRANSCRIPT, 'utf8').split('\n')) {
  if (!line) continue; let o; try { o = JSON.parse(line); } catch (_) { continue; }
  const a = o.attachment; if (!a) continue;
  if (a.type === 'hook_success' && a.stdout) {
    let txt = ''; try { const j = JSON.parse(a.stdout); txt = (j.hookSpecificOutput && j.hookSpecificOutput.additionalContext) || j.additionalContext || j.systemMessage || j.reason || ''; } catch (_) { txt = a.stdout; }
    if (txt && txt.length > 40) latest.set(a.hookName + ' [' + (a.command || '').replace(/.*[\\/]/, '').replace(/"/g, '') + ']', txt);
  }
  if (a.type === 'hook_additional_context' && Array.isArray(a.content)) { const txt = a.content.join('\n'); if (txt.length > 40 && !/^<persisted-output>/.test(txt)) latest.set('additional_context:' + (a.hookName || 'UserPromptSubmit'), txt); }
}
const hookTexts = [...latest].map(([k, t]) => measure('HOOK ' + k, t, false));

const tsv = ['text\tpath\tline\tkind\twhy\tline_text'];
for (const t of texts) if (t.ruleRows) for (const [ln, k, w, s] of t.ruleRows) tsv.push([t.label, t.file, ln, k, w, s].join('\t'));
fs.writeFileSync(OUT, tsv.join('\n') + '\n');
// every block of the RULE-type source files with its class, for the precision check (a seeded sample, hand-labelled)
const blocksOut = ['text\tline\tclass\tblock_text'];
for (const t of texts) if (t.allBlocks) for (const [ln, c, s] of t.allBlocks) blocksOut.push([t.label, ln, c, s.replace(/\t/g, ' ')].join('\t'));
fs.writeFileSync(OUT.replace(/\.tsv$/, '.blocks.tsv'), blocksOut.join('\n') + '\n');

const row = (t) => t.error ? `${t.label}\tERROR ${t.error}` : [t.label, t.bytes, t.tokens, t.nonEmpty, t.rule, t.room, t.ruleBlocks || 0, t.prohib, t.positive, t.noWhy, CAPS_KEYS.map((k) => t.caps[k]).join('/'), t.capsEmph].join('\t');
console.log('label\tbytes\t~tokens\tnon-empty\tRULE lines\tROOM lines\tRULE blocks\tprohib blocks\tpositive blocks\tno-why blocks\tMUST/NEVER/ALWAYS/CRITICAL/IMPORTANT/REFUSE*/DO NOT\tALL-CAPS emphasis');
console.log('# SOURCES'); for (const t of texts) console.log(row(t));
console.log('# ASSEMBLED (what a seat reads; generated from the sources above + the memory map + its own map)'); for (const t of assembled) console.log(row(t));
console.log('# HOOK TEXTS (latest injected, from the transcript)'); for (const t of hookTexts) console.log(row(t));
const sumOf = (xs, k) => xs.filter((x) => !x.error).reduce((a, x) => a + x[k], 0);
const ruleFiles = texts.filter((t) => !/ROOM/.test(t.label));
console.log('# TOTALS (sources, RULE files only)\tbytes ' + sumOf(ruleFiles, 'bytes') + '\tRULE ' + sumOf(ruleFiles, 'rule') + '\tprohib ' + sumOf(ruleFiles, 'prohib') + '\tpositive ' + sumOf(ruleFiles, 'positive') + '\tno-why ' + sumOf(ruleFiles, 'noWhy'));
console.log('# RULE rows written: ' + (tsv.length - 1) + ' -> ' + OUT);

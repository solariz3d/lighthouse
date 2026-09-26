'use strict';
// D160: the instrument itself — registration §1 (what is a claim) and §2 (what is a check, and "before"), as sealed at
// 1b95dc9. Input rows.json: [{ id, set: "KU"|"CORRECT", file (transcript path), line (the claim row's line),
// censusClaim? (the census "wrong claim" cell — for KU rows the scored tokens are the ones it names) , token? (for a
// CORRECT candidate, its one sampled token {type, value}) }].
const fs = require('fs'), readline = require('readline');
const { writtenText, bashWritten, isRealPrompt } = require('./d160.js');

// ---- §1 extraction ------------------------------------------------------------------------------------------------
const PATH_RE = /[\w./\\-]+\.(?:md|js|rs|json|jsonl|ps1|py|txt|toml|html|css|cjs|mjs|sh|ini)(?::\d+(?:-\d+)?)?(?![\w])/g;
const WINPATH_RE = /[A-Z]:\\[^\s"'`]+/g;
const SOURCE_RE = /`((?:node\s+consonance\/tools\/[\w.-]+\.js|git\s+[\w-]+|[\w./-]+\.ps1)[^`]*)`/g;
function paths(text) {
  const out = new Set();
  for (const m of text.matchAll(PATH_RE)) out.add(normPath(m[0]));
  for (const m of text.matchAll(WINPATH_RE)) out.add(normPath(m[0]));
  // one file is one claim: dedupe on the same basename-plus-parent key the check matches on (a C:\ path is otherwise
  // also caught, minus its drive, by PATH_RE)
  const byKey = new Map();
  for (const p of [...out].filter((x) => /\.[a-z0-9]+$/i.test(x))) {
    const parts = p.split('/').filter(Boolean), key = parts.slice(-2).join('/');
    if (!byKey.has(key) || p.length > byKey.get(key).length) byKey.set(key, p);
  }
  return [...byKey.values()];
}
const normPath = (p) => p.replace(/\\/g, '/').replace(/:\d+(?:-\d+)?$/, '').replace(/[.,;)]+$/, '').toLowerCase();
function numbers(text) {
  let t = text;
  t = t.replace(PATH_RE, ' ').replace(WINPATH_RE, ' ');                             // line refs inside a PATH
  t = t.replace(/`[^`]*`/g, (s) => s);                                              // keep code spans (they can hold figures)
  t = t.replace(/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?\b/g, ' ')                      // dates / ISO stamps
       .replace(/\b\d{1,2}-\d{2}\b/g, ' ')                                          // MM-DD
       .replace(/\b\d{1,2}:[\dx]{2}(?::\d{2})?\b/g, ' ')                            // clock times, incl. the room's "18:5x"
       .replace(/\bv?\d+\.\d+\.\d+(?:\.\d+)?\b/g, ' ')                              // version strings
       .replace(/\b(?=[0-9a-f]*[a-f])[0-9a-f]{7,}\b/gi, ' ')                        // hex shas
       .replace(/\b[A-Z]{1,3}\d+\b/g, ' ')                                          // lap/packet/row ids (D152, L113, W105)
       .replace(/^\s*\d+[.)]\s/gm, ' ');                                            // ordinal list markers
  t = t.replace(/(\d),(?=\d{3}\b)/g, '$1');                                          // thousands separators
  const out = new Set();
  for (const m of t.matchAll(/\b\d{2,}(?:\.\d+)?%?(?![\d.]*\d)/g)) {
    const v = m[0].replace(/%$/, '');
    const n = +v;
    if (/^(19|20)\d\d$/.test(v)) continue;                                          // years
    out.add(v);
  }
  return [...out];
}
function sources(text) {
  const out = new Set();
  for (const m of text.matchAll(SOURCE_RE)) { const w = m[1].trim().split(/\s+/); out.add((w[0] + ' ' + (w[1] || '')).trim().toLowerCase()); }
  return [...out];
}
function extract(text) {
  return [...paths(text).map((v) => ({ type: 'PATH', value: v })), ...numbers(text).map((v) => ({ type: 'NUMBER', value: v })),
    ...sources(text).map((v) => ({ type: 'SOURCE', value: v }))];
}

// ---- claim text of a row, with the Bash character offset of each written span (for §2's same-row case) ------------
function claimTexts(o) {
  const out = [];
  if (o.type !== 'assistant' || !o.message || !Array.isArray(o.message.content)) return out;
  for (const c of o.message.content) {
    if (c.type === 'text') out.push({ text: c.text });
    else if (c.type === 'tool_use') {
      if (c.name === 'Bash' && typeof (c.input || {}).command === 'string') for (const w of bashWritten(c.input.command)) out.push({ text: w.text, bash: c.input.command, at: w.at });
      else for (const t of writtenText(c)) out.push({ text: t });
    }
  }
  return out;
}

// ---- §2 checks ----------------------------------------------------------------------------------------------------
const toolUses = (o) => (o.type === 'assistant' && o.message && Array.isArray(o.message.content) ? o.message.content.filter((c) => c.type === 'tool_use') : []);
function toolResultText(o) {
  if (o.type !== 'user' || !o.message || !Array.isArray(o.message.content)) return '';
  return o.message.content.filter((c) => c.type === 'tool_result').map((c) => (typeof c.content === 'string' ? c.content : Array.isArray(c.content) ? c.content.map((x) => x.text || '').join('\n') : '')).join('\n');
}
const inputStrings = (tu) => Object.values(tu.input || {}).flatMap((v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []));
const pathKeys = (p) => { const parts = p.split('/').filter(Boolean); return { strong: parts.length >= 2 ? parts.slice(-2).join('/') : null, weak: parts[parts.length - 1] }; };
const numTokenIn = (text, v) => new RegExp(`(?<![\\d.])${v.replace('.', '\\.')}(?![\\d]|\\.\\d)`).test(text.replace(/(\d),(?=\d{3}\b)/g, '$1'));

function checked(tok, rows, fromIdx, claimIdx, claim) {
  // rows[fromIdx .. claimIdx-1] are strictly earlier (smaller line index). Returns { strong, weak }.
  let strong = false, weak = false;
  const k = tok.type === 'PATH' ? pathKeys(tok.value) : null;
  for (let i = fromIdx; i < claimIdx; i++) {
    const o = rows[i].o;
    if (tok.type === 'NUMBER') { if (numTokenIn(toolResultText(o), tok.value)) strong = true; continue; }
    for (const tu of toolUses(o)) {
      const s = inputStrings(tu).join('\n').replace(/\\/g, '/').toLowerCase();
      if (tok.type === 'PATH') { if (k.strong && s.includes(k.strong)) strong = true; else if (s.includes(k.weak)) weak = true; }
      if (tok.type === 'SOURCE' && tu.name === 'Bash' && s.replace(/\s+/g, ' ').includes(tok.value)) strong = true;
    }
  }
  // same-row case: one Bash command both checks and writes the claim — the checking part must come first by position
  if (!strong && claim && claim.bash && tok.type !== 'NUMBER') {
    const before = claim.bash.slice(0, claim.at).replace(/\\/g, '/').toLowerCase();
    if (tok.type === 'PATH' && k.strong && before.includes(k.strong)) strong = true;
    if (tok.type === 'SOURCE' && before.replace(/\s+/g, ' ').includes(tok.value)) strong = true;
  }
  return { strong, weak };
}

// ---- load only the needed rows: pass 1 finds the prompt lines, pass 2 keeps [lookback start .. turn end] ----------
async function loadTurn(file, claimLine) {
  const prompts = [];
  let n = 0;
  for await (const raw of readline.createInterface({ input: fs.createReadStream(file, 'utf8'), crlfDelay: Infinity })) {
    n++;
    if (!raw.includes('"type":"user"')) continue;
    let o; try { o = JSON.parse(raw); } catch (_) { continue; }
    if (isRealPrompt(o)) prompts.push(n);
  }
  const pIdx = prompts.findLastIndex((p) => p <= claimLine);
  const turnStart = prompts[pIdx] || 1, lookStart = prompts[Math.max(0, pIdx - 3)] || 1;
  const turnEnd = (prompts[pIdx + 1] || n + 1) - 1;
  const rows = [];
  const seen = new Set();
  n = 0;
  for await (const raw of readline.createInterface({ input: fs.createReadStream(file, 'utf8'), crlfDelay: Infinity })) {
    n++;
    if (n < lookStart) continue;
    if (n > turnEnd) break;
    let o; try { o = JSON.parse(raw); } catch (_) { continue; }
    if (o.uuid && seen.has(o.uuid)) continue; // a carried row counted at its first occurrence only
    if (o.uuid) seen.add(o.uuid);
    rows.push({ line: n, o });
  }
  return { rows, turnStart, lookStart, turnEnd };
}

async function run(rowsFile, outFile) {
  const rows = JSON.parse(fs.readFileSync(rowsFile, 'utf8'));
  const out = [];
  for (const r of rows) {
    const T = await loadTurn(r.file, r.line);
    const ci = T.rows.findIndex((x) => x.line === r.line);
    if (ci < 0) { out.push({ ...r, error: 'claim line not in the loaded range' }); continue; }
    const claims = claimTexts(T.rows[ci].o);
    const turnFrom = T.rows.findIndex((x) => x.line >= T.turnStart);
    // every §1 claim in the claim row (the per-TURN flag), and the scored tokens
    const all = [];
    for (const c of claims) for (const tok of extract(c.text)) all.push({ ...tok, claim: c });
    let scoredWanted;
    if (r.set === 'KU') {
      const named = extract(r.censusClaim);
      scoredWanted = all.filter((t) => named.some((n) => n.type === t.type && (t.type === 'PATH' ? pathKeys(n.value).weak === pathKeys(t.value).weak : n.value === t.value)));
    } else scoredWanted = all.filter((t) => t.type === r.token.type && t.value === r.token.value);
    const uniq = (xs) => [...new Map(xs.map((x) => [x.type + ':' + x.value, x])).values()];
    const score = (t) => { const s = checked(t, T.rows, turnFrom, ci, t.claim), l = checked(t, T.rows, 0, ci, t.claim); return { type: t.type, value: t.value, sameTurn: s.strong ? 'CHECKED' : 'UNCHECKED-IN-TURN', weakSameTurn: !s.strong && s.weak, lookBack3: l.strong ? 'CHECKED' : 'UNCHECKED' }; };
    const scored = uniq(scoredWanted).map(score);
    const allScored = uniq(all).map(score);
    out.push({
      id: r.id, set: r.set, file: r.file.split(/[\\/]/).pop(), line: r.line, turn: `${T.turnStart}..${T.turnEnd}`, lookBackFrom: T.lookStart,
      extractable: scored.length > 0, scored,
      flagged: scored.length ? scored.some((s) => s.sameTurn !== 'CHECKED') : null,
      flaggedLookBack: scored.length ? scored.some((s) => s.lookBack3 !== 'CHECKED') : null,
      turnClaims: allScored.length, turnFlagged: allScored.some((s) => s.sameTurn !== 'CHECKED'),
    });
    console.log(`${r.id} ${r.set} ${out[out.length - 1].file}:${r.line} scored ${scored.map((s) => `${s.type}:${s.value}=${s.sameTurn}${s.weakSameTurn ? '(weak)' : ''}/LB:${s.lookBack3}`).join(' ') || 'NONE (not extractable)'}`);
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
}
module.exports = { run, extract, numbers, paths, sources };

// EXTRACTION ONLY (no check is read): each row's scored tokens, so the CORRECT set can be matched on claim type BEFORE
// any flag exists. Reads only the claim row itself.
async function tokensOnly(rowsFile, outFile) {
  const rows = JSON.parse(fs.readFileSync(rowsFile, 'utf8'));
  const out = [];
  for (const r of rows) {
    let row = null, n = 0;
    for await (const raw of readline.createInterface({ input: fs.createReadStream(r.file, 'utf8'), crlfDelay: Infinity })) { if (++n === r.line) { row = JSON.parse(raw); break; } }
    const all = [];
    for (const c of claimTexts(row)) for (const tok of extract(c.text)) all.push(tok);
    const named = extract(r.censusClaim);
    const scored = [...new Map(all.filter((t) => named.some((x) => x.type === t.type && (t.type === 'PATH' ? pathKeys(x.value).weak === pathKeys(t.value).weak : x.value === t.value))).map((t) => [t.type + ':' + t.value, t])).values()];
    out.push({ id: r.id, ts: row.timestamp, censusTokens: named, scored, claimRowTokens: all.length });
    console.log(`${r.id} census names [${named.map((t) => t.type + ':' + t.value).join(', ')}] · claim row has ${all.length} tokens · SCORED [${scored.map((t) => t.type + ':' + t.value).join(', ') || 'none → not extractable'}]`);
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
}
module.exports.tokensOnly = tokensOnly;

// §3 CORRECT-set SAMPLER, blind: reads only turn boundaries (real prompts) and claim-bearing text — never a tool call
// or a result. For a KU row: same transcript, same UTC day, same claim type; start 3 turns after the KU claim's turn and
// walk forward; take turns that carry a claim of that type and are not a census row's turn (excluded = the located KU
// rows' turns); each turn's candidate = its FIRST token of that type in file order. If the day runs out, walk backward
// from 3 turns before. Emits an ordered candidate list (more than 2, so a discarded candidate is replaced by the next).
async function sample(kuRowsFile, kuTokensFile, excludeFile, outFile, perRow = 8) {
  const ku = JSON.parse(fs.readFileSync(kuRowsFile, 'utf8')), toks = Object.fromEntries(JSON.parse(fs.readFileSync(kuTokensFile, 'utf8')).map((t) => [t.id, t]));
  const excl = JSON.parse(fs.readFileSync(excludeFile, 'utf8')); // [{file, line}] — census-row claim rows
  const out = [];
  const cache = new Map();
  for (const r of ku) {
    const t = toks[r.id];
    if (!t || !t.scored.length) continue;
    const type = t.scored[0].type, day = t.ts.slice(0, 10);
    if (!cache.has(r.file)) {
      const turns = []; let cur = null, n = 0;
      for await (const raw of readline.createInterface({ input: fs.createReadStream(r.file, 'utf8'), crlfDelay: Infinity })) {
        n++;
        let o; if (!raw.includes('"type":"user"') && !raw.includes('"type":"assistant"')) continue;
        try { o = JSON.parse(raw); } catch (_) { continue; }
        if (isRealPrompt(o)) { cur = { start: n, day: (o.timestamp || '').slice(0, 10), claims: [] }; turns.push(cur); continue; }
        if (!cur || o.type !== 'assistant') continue;
        for (const c of claimTexts(o)) for (const tok of extract(c.text)) cur.claims.push({ line: n, ts: o.timestamp, ...tok, text: c.text });
      }
      cache.set(r.file, turns);
    }
    const turns = cache.get(r.file);
    const kIdx = turns.findLastIndex((x) => x.start <= r.line);
    const exclTurns = new Set(excl.filter((e) => e.file === r.file).map((e) => turns.findLastIndex((x) => x.start <= e.line)));
    const pick = (idx) => { const tr = turns[idx]; if (!tr || exclTurns.has(idx)) return null; const c = tr.claims.find((x) => x.type === type && x.ts && x.ts.slice(0, 10) === day); return c ? { turnStart: tr.start, ...c } : null; };
    const cands = [];
    for (let i = kIdx + 3; i < turns.length && cands.length < perRow; i++) { if (turns[i].day && turns[i].day > day) break; const c = pick(i); if (c) cands.push({ dir: 'forward', ...c }); }
    for (let i = kIdx - 3; i >= 0 && cands.length < perRow; i--) { if (turns[i].day && turns[i].day < day) break; const c = pick(i); if (c) cands.push({ dir: 'backward', ...c }); }
    for (const c of cands) {
      const at = c.text.toLowerCase().indexOf(String(c.value).split('/').pop().toLowerCase());
      out.push({ forId: r.id, type, file: r.file, line: c.line, turnStart: c.turnStart, ts: c.ts, dir: c.dir, value: c.value, context: c.text.slice(Math.max(0, at - 220), at + 220).replace(/\s+/g, ' ') });
    }
    console.log(`${r.id} (${type}, ${day}) KU turn #${kIdx} · ${cands.length} candidates`);
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
}
module.exports.sample = sample;

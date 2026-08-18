// Claim 2: after each compact_boundary, find (a) first row whose raw line mentions exo_memory,
// classified by what it actually is; (b) first GENUINE read: tool_use Read/Bash/Grep/Glob whose
// input references exo_memory. Also next human-typed user row (session dark or not).
// Claim 4: rows between boundaries broken down by type; summary char lengths; compactMetadata.
const fs = require('fs');
const readline = require('readline');
const FILE = 'C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl';

(async () => {
  const rl = readline.createInterface({ input: fs.createReadStream(FILE), crlfDelay: Infinity });
  const rows = [];
  let i = 0;
  for await (const line of rl) {
    i++;
    if (!line.trim()) { rows.push(null); continue; }
    let row; try { row = JSON.parse(line); } catch { rows.push(null); continue; }
    row.__n = i; row.__len = line.length; row.__hasExo = line.includes('exo_memory');
    rows.push(row);
  }
  const boundaries = rows.filter(r => r && r.type === 'system' && r.subtype === 'compact_boundary');
  const summaries = rows.filter(r => r && r.isCompactSummary);
  console.log('== compactMetadata per boundary ==');
  boundaries.forEach(b => console.log(b.__n, b.timestamp, JSON.stringify(b.compactMetadata)));
  console.log('\n== summary lengths (chars of message content) ==');
  summaries.forEach(s => {
    const c = s.message && s.message.content;
    const len = typeof c === 'string' ? c.length : JSON.stringify(c).length;
    console.log(s.__n, s.timestamp, 'contentChars=', len);
  });

  function toolUseRefsExo(row) {
    // assistant rows: message.content array with tool_use blocks
    if (row.type !== 'assistant' || !row.message || !Array.isArray(row.message.content)) return null;
    for (const part of row.message.content) {
      if (part.type === 'tool_use') {
        const s = JSON.stringify(part.input || {});
        if (s.includes('exo_memory')) return { tool: part.name, input: s.slice(0, 220) };
      }
    }
    return null;
  }

  console.log('\n== per-compaction re-entry analysis ==');
  for (const b of boundaries) {
    const bi = rows.indexOf(b);
    const bt = Date.parse(b.timestamp);
    let firstMention = null, firstToolRead = null, nextHuman = null;
    for (let j = bi + 1; j < rows.length; j++) {
      const r = rows[j]; if (!r) continue;
      if (!firstMention && r.__hasExo && !r.isCompactSummary) {
        firstMention = { n: r.__n, type: r.type, ts: r.timestamp, mins: r.timestamp ? ((Date.parse(r.timestamp)-bt)/60000).toFixed(1) : '?' };
      }
      if (!firstToolRead) {
        const tu = toolUseRefsExo(r);
        if (tu) firstToolRead = { n: r.__n, ts: r.timestamp, mins: ((Date.parse(r.timestamp)-bt)/60000).toFixed(1), ...tu };
      }
      if (!nextHuman && r.type === 'user' && !r.isCompactSummary && !r.isSidechain && r.origin && r.origin.kind === 'human') {
        nextHuman = { n: r.__n, ts: r.timestamp, mins: ((Date.parse(r.timestamp)-bt)/60000).toFixed(1) };
      }
      if (firstMention && firstToolRead && nextHuman) break;
    }
    console.log('\nboundary row', b.__n, b.timestamp);
    console.log('  firstMention :', JSON.stringify(firstMention));
    console.log('  firstToolRead:', JSON.stringify(firstToolRead));
    console.log('  nextHumanMsg :', JSON.stringify(nextHuman));
  }

  console.log('\n== claim 4: rows between boundaries, by type ==');
  const bIdx = boundaries.map(b => rows.indexOf(b));
  const segs = [];
  let prev = 0;
  for (const idx of bIdx) { segs.push([prev, idx]); prev = idx; }
  segs.forEach(([a, z], k) => {
    const seg = rows.slice(a, z).filter(Boolean);
    const counts = {};
    let convoMsgs = 0; // non-sidechain user+assistant = things that were in model context
    for (const r of seg) {
      counts[r.type] = (counts[r.type] || 0) + 1;
      if ((r.type === 'user' || r.type === 'assistant') && !r.isSidechain) convoMsgs++;
    }
    console.log(`seg ${k} (rows ${a + 1}..${z}): total=${seg.length} convoMsgs(user+asst,non-sidechain)=${convoMsgs} counts=${JSON.stringify(counts)}`);
  });
})();

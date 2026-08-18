// Claim 1 & 4 groundwork: enumerate every compaction-related trace in the transcript,
// by schema field first, string marker second, and compare.
const fs = require('fs');
const readline = require('readline');
const FILE = 'C:/Users/zackn/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl';

const MARKER = 'This session is being continued';

(async () => {
  const rl = readline.createInterface({ input: fs.createReadStream(FILE), crlfDelay: Infinity });
  let i = 0;
  const schemaHits = [];      // rows with isCompactSummary / compact fields / subtype
  const markerStartsWith = []; // user rows whose string content starts with marker
  const markerAnywhere = [];   // any row whose raw line contains marker
  const fieldNames = new Set();
  const typeCounts = {};
  for await (const line of rl) {
    i++;
    if (!line.trim()) continue;
    let row;
    try { row = JSON.parse(line); } catch (e) { console.log('PARSE FAIL row', i); continue; }
    typeCounts[row.type] = (typeCounts[row.type] || 0) + 1;
    // collect any field name containing 'compact' (case-insensitive), at top level
    for (const k of Object.keys(row)) {
      if (/compact/i.test(k)) { fieldNames.add(k); }
    }
    if (row.isCompactSummary || row.compactMetadata || (row.subtype && /compact/i.test(row.subtype)) || (row.type && /compact/i.test(row.type))) {
      schemaHits.push({ row: i, type: row.type, subtype: row.subtype, isCompactSummary: row.isCompactSummary, ts: row.timestamp, uuid: row.uuid, keys: Object.keys(row).filter(k=>/compact/i.test(k)) });
    }
    if (line.includes(MARKER)) {
      const isUser = row.type === 'user';
      let startsWith = false;
      let contentKind = 'other';
      if (isUser && row.message) {
        const c = row.message.content;
        if (typeof c === 'string') { contentKind = 'string'; startsWith = c.startsWith(MARKER); }
        else if (Array.isArray(c)) {
          contentKind = 'array';
          for (const part of c) {
            if (part && part.type === 'text' && typeof part.text === 'string' && part.text.startsWith(MARKER)) startsWith = true;
          }
        }
      }
      markerAnywhere.push({ row: i, type: row.type, subtype: row.subtype, isUser, contentKind, startsWith, ts: row.timestamp, isCompactSummary: row.isCompactSummary, isSidechain: row.isSidechain, snippet: line.slice(0, 160) });
      if (isUser && startsWith) markerStartsWith.push({ row: i, ts: row.timestamp, isCompactSummary: row.isCompactSummary, isSidechain: row.isSidechain });
    }
  }
  console.log('total rows:', i);
  console.log('type counts:', JSON.stringify(typeCounts));
  console.log('compact-ish field names seen:', [...fieldNames]);
  console.log('\n== SCHEMA HITS (' + schemaHits.length + ') ==');
  schemaHits.forEach(h => console.log(JSON.stringify(h)));
  console.log('\n== MARKER starts-with user rows (' + markerStartsWith.length + ') ==');
  markerStartsWith.forEach(h => console.log(JSON.stringify(h)));
  console.log('\n== MARKER anywhere (' + markerAnywhere.length + ') ==');
  markerAnywhere.forEach(h => console.log(JSON.stringify({row:h.row,type:h.type,subtype:h.subtype,startsWith:h.startsWith,contentKind:h.contentKind,ts:h.ts,isCompactSummary:h.isCompactSummary,isSidechain:h.isSidechain})));
})();

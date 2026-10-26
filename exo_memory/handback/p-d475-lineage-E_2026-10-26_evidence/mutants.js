// mutants.js (D475, pane E): each rule of lineage-rip.js broken in turn; the test file must go red. The tool file is restored after every mutant.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/lh-d475-e/consonance/tools/', f = path.join(W, 'lineage-rip.js');
const M = [
  ['M1 the in-repo refusal removed', 'if (tree) throw', 'if (false) throw'],
  ['M2 dedup against the store off', 'if (store.seen.has(h) || fresh.has(h))', 'if (fresh.has(h))'],
  ['M3 dedup within the run off', 'if (store.seen.has(h) || fresh.has(h))', 'if (store.seen.has(h))'],
  ['M4 a month file overwritten, not appended', 'fs.appendFileSync(f, text);', 'fs.writeFileSync(f, text);'],
  ['M5 a malformed line is fatal', 'catch { counts.malformed++; continue; }', 'catch (e) { throw e; }'],
  ['M6 an empty line not counted', 'if (!l.trim()) { counts.empty++; continue; }', 'if (!l.trim()) continue;'],
  ['M7 the machine-made heads kept', 'SKIP.test(t) || MACHINE.test(t) ||', 'SKIP.test(t) ||'],
  ['M8 system reminders not cut', "t = t.replace(/<system-reminder>[\\s\\S]*?<\\/system-reminder>/g, '').trim();", 't = t.trim();'],
  ['M9 every folder read as a seat', '!seats.has(seatOfDir(e.name, false))', 'false'],
  ['M10 a row of the wrong length accepted', "if (t.length !== len || s[k] !== '\\n') throw", 'if (false) throw'],
  ['M11 the lock left behind', '} finally { fs.rmSync(lock, { force: true }); }', '} finally { }'],
  ['M12 sidechains kept', 'o.isMeta || o.isSidechain', 'o.isMeta'],
  ['M13 the length floor ignored', 'if (t.length < min || SKIP', 'if (SKIP'],
  ['M14 a dry run writes', 'if (!rows.length || opts.dryRun) return counts;', 'if (!rows.length) return counts;'],
  ['M15 an output inside the transcripts allowed', "throw new RipError('LINEAGE_ARGS', `refused: the output ${out} is inside the transcripts", "void ('LINEAGE_ARGS', `refused: the output ${out} is inside the transcripts"],
  ['M16 tool results kept', "if (c.some((x) => x && x.type === 'tool_result')) return null;", ''],
  ['M17 the attic not marked', "+ (attic ? ' (attic)' : '')", ''],
  ['M18 the index not appended', "fs.appendFileSync(idx, text); counts.bytes += Buffer.byteLength(text);", 'counts.bytes += Buffer.byteLength(text);'],
];
const orig = fs.readFileSync(f, 'utf8'); let applied = 0, caught = 0, notApplied = 0;
try {
  for (const [name, from, to] of M) {
    if (orig.split(from).length !== 2) { notApplied++; console.log('NOT APPLIED ' + name); continue; }
    fs.writeFileSync(f, orig.replace(from, () => to)); applied++;
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', path.join(W, 'lineage-rip.test.js')], { encoding: 'utf8', timeout: 120000 });
    const red = r.status !== 0 && /^# fail [1-9]/m.test(r.stdout); if (red) caught++;
    console.log((red ? 'caught     ' : 'NOT CAUGHT ') + name + '  (' + ((/^# fail \d+/m.exec(r.stdout) || ['?'])[0]) + ')');
  }
} finally { fs.writeFileSync(f, orig); }
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
console.log('restored byte-equal:', fs.readFileSync(f, 'utf8') === orig);

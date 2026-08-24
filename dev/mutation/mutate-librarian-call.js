#!/usr/bin/env node
/* mutate-librarian-call — prove the narrow widening's guards can fail.
 *
 * The build (2026-08-24): the librarian gets ONE arrow, LIB -> Main, via `call_chair` — a verb with
 * no target argument, gated on the MOUNT rather than a token, speaking under its own provenance
 * prefix. Three properties, each of which would be silently untrue if an edit removed it:
 *
 *   narrow      — no target, so misdelivery is impossible rather than merely forbidden
 *   gated       — only the librarian's mount may call it, and refusals are audited
 *   attributed  — "[librarian:LIB]", never "[chair:MAIN]" (the 2026-08-22 incident, as a rule)
 *
 * Spans main.rs AND mcp.rs, because the guards do. Anchors are normalised to LF before matching.
 *
 * BASELINE: this harness does NOT require a green suite. `shelf_tests::the_shelf_reaches_the_intake`
 * is red at HEAD for an unrelated reason (the librarian intake orders the shelf before the room it
 * indexes), and refusing to run until someone else's defect is fixed would just mean not running.
 * A mutant is caught when failures rise ABOVE the baseline count, which is the honest comparison.
 *
 * Run: node dev/mutation/mutate-librarian-call.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TAURI = path.join(REPO, 'consonance', 'src-tauri');
const FILES = {
  main: path.join(TAURI, 'src', 'main.rs'),
  mcp: path.join(TAURI, 'src', 'mcp.rs'),
};

const MUTANTS = [
  // ---- gated ----
  { file: 'mcp', name: 'the mount gate is removed — every pane may speak into the orchestrator',
    from: '        let ok = self.seat() == "librarian";',
    to:   '        let ok = true;' },

  { file: 'mcp', name: 'the gate admits any identified mount, not the librarian seat',
    from: '        let ok = self.seat() == "librarian";',
    to:   '        let ok = self.identity.is_some();' },

  { file: 'mcp', name: 'call_chair stops consulting the gate at all',
    from: '        if !self.auth_librarian("call_chair") {',
    to:   '        if false {' },

  { file: 'mcp', name: 'a refused acting verb no longer reaches the board',
    from: '                board_push(&self.board, BoardEntry {\n                    pane: "chair".to_string(),\n                    role: "committee".to_string(),\n                    text,\n                    ts: now_ms(),\n                    ts_source: crate::TsSource::Push,\n                });\n            }\n        }\n        ok\n    }\n\n    /// Send a chair command',
    to:   '                let _ = text;\n            }\n        }\n        ok\n    }\n\n    /// Send a chair command' },

  // ---- attributed ----
  { file: 'mcp', name: 'the read path forgets which seat posted (the role regression)',
    from: '            role: self.seat(),',
    to:   '            role: "committee".to_string(),' },

  { file: 'main', name: 'the librarian borrows the chair\'s voice (the 2026-08-22 incident, rebuilt)',
    from: '    let msg = format!("[librarian:LIB] {text}");',
    to:   '    let msg = format!("[chair:MAIN] {text}");' },

  { file: 'main', name: 'provenance is dropped entirely — the orchestrator cannot tell who spoke',
    from: '    let msg = format!("[librarian:LIB] {text}");',
    to:   '    let msg = text.to_string();' },

  // ---- narrow ----
  { file: 'main', name: 'the librarian verb gains a resolved target (narrowness becomes a policy)',
    from: '    let delivered = inject_to_pane(&panes, MAIN_SID, &msg);',
    to:   '    let t = resolve_pane(&panes, &app.state::<PaneNames>(), MAIN_SID).unwrap_or_default();\n    let delivered = inject_to_pane(&panes, &t, &msg);' },

  // ---- the seat map underneath all three ----
  { file: 'main', name: 'the librarian stops being a distinct seat',
    from: '            if sid == LIBRARIAN_SID {\n                return "librarian";\n            }',
    to:   '' },

  { file: 'main', name: 'every letter reports as the librarian seat',
    from: '    "committee"\n}\n\n/// Read the registry, delegate.',
    to:   '    "librarian"\n}\n\n/// Read the registry, delegate.' },

  { file: 'main', name: 'seat_role_for_letter stops delegating to the tested core',
    from: '    seat_role_from(&read_letters(), letter)',
    to:   '    if letter == "M" { "librarian" } else { "committee" }' },
];

function runSuite() {
  const r = spawnSync('cargo', ['test', '--bin', 'consonance'], { cwd: TAURI, encoding: 'utf8', shell: true });
  const out = (r.stdout || '') + (r.stderr || '');
  if (/^error(\[|:)/m.test(out) && !/test result:/.test(out)) return { failed: Infinity, how: 'did not compile' };
  const m = out.match(/test result: \w+\. (\d+) passed; (\d+) failed/);
  if (!m) return { failed: null, how: 'no test result line — could not classify' };
  return { failed: Number(m[2]), how: `${m[1]} passed, ${m[2]} failed` };
}

const ORIGINAL = {};
for (const k of Object.keys(FILES)) {
  const raw = fs.readFileSync(FILES[k], 'utf8');
  ORIGINAL[k] = { crlf: raw.includes('\r\n'), lf: raw.split('\r\n').join('\n') };
}
const restore = (k) => fs.writeFileSync(FILES[k],
  ORIGINAL[k].crlf ? ORIGINAL[k].lf.split('\n').join('\r\n') : ORIGINAL[k].lf);
const writeMutated = (k, s) => fs.writeFileSync(FILES[k],
  ORIGINAL[k].crlf ? s.split('\n').join('\r\n') : s);

let applied = 0, caught = 0, notApplied = 0, unclassified = 0;
console.log('mutate-librarian-call — ' + MUTANTS.length + ' mutant(s), full bin suite\n');

try {
  const base = runSuite();
  if (base.failed === null || base.failed === Infinity) {
    console.error('BASELINE UNUSABLE (' + base.how + ') — refusing to run.');
    process.exit(2);
  }
  console.log('baseline: ' + base.how + (base.failed ? '  [' + base.failed + ' pre-existing red, mutants must beat this]' : '') + '\n');

  for (const mut of MUTANTS) {
    const src = ORIGINAL[mut.file].lf;
    if (!src.includes(mut.from)) {
      notApplied++;
      console.log('NOT APPLIED  [' + mut.file + '] ' + mut.name);
      console.log('             anchor absent — proves NOTHING, do not count it as a pass');
      continue;
    }
    writeMutated(mut.file, src.replace(mut.from, mut.to));
    applied++;
    const r = runSuite();
    if (r.failed === null) { unclassified++; console.log('UNCLASSIFIED ' + mut.name + '  (' + r.how + ')'); }
    else if (r.failed > base.failed) { caught++; console.log('caught       ' + mut.name + '  (' + r.how + ')'); }
    else { console.log('SURVIVED     ' + mut.name + '  (' + r.how + ')'); }
    restore(mut.file);
  }
} finally {
  for (const k of Object.keys(FILES)) restore(k);
}

console.log('\napplied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + notApplied +
            (unclassified ? ' / UNCLASSIFIED ' + unclassified : ''));
process.exit(caught === applied && notApplied === 0 && unclassified === 0 ? 0 : 1);

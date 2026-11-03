# vantage SURFACE 24/37 · id 14d5ecbbcfb1afcf · 2026-10-04T15:07:03.954Z

source: {"session":"6fe15f0a","pane":"sibling-3d57124e","turn_ts":"2026-10-04T14:06:30.496Z","head":"806eddf6753ad0827527f8cef26965c9bc395f69"}
tier: middle  verdict: DISAGREE  status: SURFACE

## claim (excerpt the reader checked)
The four harnesses are running under the lock.

## reader commands
- `cat /c/Consonance/data/heavy-run.lock` → `{"pid":18232,"seat":"6fe15f0a","cmd":"A D235 mutants (speed)","started":"2026-10-04T15:06:07.828Z",...}`
- `Get-CimInstance Win32_Process` filtered on test/harness/mut → one tree under the lock: `node sp_mut.js` (18232) → `node --test app/test/preview-speed.test.js` (2000) → its worker (8884). Nothing else is running under it.
- `find`/`Glob` for `sp_mut.js` inside the lighthouse repo → not found. I couldn't read its source to see whether it sequences several harnesses.

## reader evidence
The lock is held by one process (`sp_mut.js`, "A D235 mutants (speed)"). That process is running one test file, `preview-speed.test.js`, so I measured one harness running, not four. I couldn't open `sp_mut.js` to rule out four harnesses run in sequence.

## audit
{"clean":true,"reason":""}

## caveat
"F0: 2/2 correct blind DISAGREEs on the reachable subset; 2 of 16 of the record"

## return_ledger rows naming this id (1)
{"ts":"2026-10-04T15:24:39.371Z","pane":"sibling-3d57124e","session":"6fe15f0a","surfaced":["14d5ecbbcfb1afcf"],"misses":[]}
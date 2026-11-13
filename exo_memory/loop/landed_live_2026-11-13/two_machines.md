# Two machines, and what a waking seat is told (landed_live, reader on D, 2026-11-13)

1. L is known from the repo only through readings made on L; the newest is 2026-11-13 about 10:3xZ, 8.7 h old at 19:14Z:
   15 DRIFT and 8 ABSENT after push-gate.js was installed with -Only. Only 6 of the 15 and 3 of the 9 are named on disk.
   L's settings list, gates_mode, data_dir, exe and running app are not on disk.
2. No hook source changed on main since L's reading (049ade71..2c396481), so the repo side of those counts still holds. Lap W
   (branch lap-w-h-p) adds 2 entries and changes 3 more. Once merged, D's -Check would read 21 ok, 12 drift, 5 absent.
3. From today's D decisions, the procedure carries to L. The per-hook verdicts do not:
   - on L, board-digest.js must go with blind.js;
   - the live pulse on L is the Python one;
   - on L, sources-gate.js and delete-gate.js would be new registrations;
   - dispatch-gate.js is wired on L and absent on D.
4. The receipt adds three fields to W3's body line: hooks, app and gates. In-process they cost about 10 ms for the hooks
   and 15 ms for the app, against 3.9 to 4.1 s for -Check. [2nd reader: DOWNGRADED, a few samples on one loaded machine.
   My runs: the prototype 18.4 ms in-process, 128 to 151 ms wall; -Check 3.65 and 3.74 s.] They add about 230 B per start. No cache is needed.
5. Red today on recorded cases. The librarian's November transcript has 69 SessionStart outputs on D, and none names
   drift, absent, gates or install.ps1. The branch's sessionstart-body.js has 0 such fields. The failing test is a fixture
   of D's 11-13 state: 23 ok, 10 DRIFT, 3 ABSENT, 4 not wired.

Reader: one Opus reader, on D, read-only except this file. Repo HEAD 2c396481 (main). Branch lap-w-h-p read at 95c47488.
Marks: [read] I opened it (path:line at HEAD 2c396481 unless a branch is named). [summary] taken from another swarm file.
[inferred] my inference. [ours] a proposal. Digests carry their function. From transcripts and data logs I took counts,
timestamps, hook names and paths only.

Ran, all report-only or read-only:
- `dev/shell/install.ps1 -Check`, three times: exit 1; wall 3.9 to 4.1 s (4,087 and 3,946 ms timed); 5,031 lines,
  430,136 B. All three outputs were the same.
- Seven throwaway node scripts in my scratchpad, and dry runs of four snippets from section 4. They read files and print
  to stdout, and write nothing.
- No node test file was run.

---

## 1. What D knows of L, and how old it is

Each row is a reading taken on L and later committed to the repo. None of them was taken from D.

| when (UTC) | what was read on L | counts | where it is on disk |
|---|---|---|---|
| 2026-09-23 | -Check, then an audit of each DRIFT copy against git history | 10 DRIFT; every copy equals an older commit; 6 in use, 4 not | `loop/install_proposal_L_2026-09-23.md:3-7` [read] |
| 2026-11-11 00:2x, 07:4x local | pushes from L: the push gate wrote no row | "gate unwired" | `map/B.md:2154`, `:2167` [read] |
| 2026-11-13 ~~09:35Z~~ 09:5xZ | a push from L: "push-gate hook NOT wired (no row)" | none | `map/B.md:2185` [read] [2nd reader: the entry is headed 03:5x local (UTC-6). 09:35:30Z is the landing's stamp, not the push.] |
| 2026-11-13 10:2xZ | B's bare -Check | board-digest DRIFT, 14 more DRIFT, 9 ABSENT | `handback/p-l198-403-stall-B_2026-11-13.md:54-55`, `:86-90` [read] |
| 2026-11-13 10:33Z | the librarian's -Check on L | 15 DRIFT, 9 ABSENT | `map/M.md:1030`; `librarian/2026-11-13.md:145` [read] |
| 2026-11-13 10:3xZ | `-Only push-gate.js`, then -Check | push-gate ok; 15 DRIFT, 8 ABSENT | `handback/p-l198-403-stall-B_2026-11-13.md:94-107`; `librarian/2026-11-13.md:166` [read] |

- **Every install or check run on L in the hand-backs of 11-12 and 11-13:**
  - `grep -l install.ps1` over the hand-backs dated 2026-11-12 and 2026-11-13 matches two files.
    `p-d-update-P_2026-11-13.md` is D. `p-l198-403-stall-B_2026-11-13.md` is L [read]. No 11-12 hand-back names it [read].
  - On L, that hand-back holds two runs: one bare -Check at 10:2xZ (15 DRIFT, 9 ABSENT, `:54-55`), and
    `-Only push-gate.js` at 10:3xZ. The -Only run printed "-Only: 1 of 36 manifest entr(ies), 1 of 24 registration
    entr(ies)" (`:95`), and the -Check after it gave 15 DRIFT and 8 ABSENT (`:106`) [read].
  - The librarian's own -Check at 10:33Z is in `map/M.md:1030`, not in a hand-back [read].
- **The names on disk, 6 of 15 DRIFT:**
  - board-digest.js and blind.js (`p-l198…:89-90`) [read];
  - precompact-preserve.js, sessionstart-state.js, session-start.js and precompact.js (`map/M.md:1031`) [read].
- **The names on disk, 3 of 9 ABSENT:** push-gate.js (installed since), delete-gate.js and sources-gate.js (`map/M.md:1030`)
  [read]. The full -Check output on L was never committed: "The full list is in the check's output"
  (`librarian/2026-11-13.md:145`) [read].
- **One fact about L's settings:**
  - Before 10:3xZ, the only PreToolUse entry on L was dispatch-gate.js (`p-l198…:127-128`) [read].
  - After the run, one push-gate block was added and "nothing else moved" (`:103-105`) [read].
  - ~~No other event of L's settings.json is recorded.~~ [2nd reader: older records exist. 08-31: five hooks
    REGISTERED, NOT DECLARED on L, sessionstart-ambient.js on SessionStart and four on UserPromptSubmit
    (`dev/shell/install.ps1:1069-1071`, 74 days old). 09-23: six entries in use, the Python pulse live, stop.js and both
    overseers unregistered (`install_proposal_L_2026-09-23.md:6`, `:49-50`, 51 days old).]
- **Not on disk at all:**
  - L's `gates_mode`. "Q3 (L's gates_mode) is one read on L, carried" (`librarian/2026-11-13.md:481`); again as
    "one read owed on L" (`:526`) [read]. [2nd reader: DOWNGRADED. There is an indirect trace. L's 11-12 wake printed
    the strict walk's sentence (`plan_retrieval_at_the_wake_2026-11-12.md:27`), and only a strict intake has it
    (`shelf_builder.md:43-44`; `main.rs:3040-3045` puts the light intake behind `gates_mode`). So L was probably not
    `light` on 11-12 [inferred]. The spec reads it the same way (`00_lap_w_spec.md:29`).]
  - L's data_dir and chime_repos. The 09-23 proposal says data_dir was `C:\Consonance\data` then
    (`install_proposal_L_2026-09-23.md:17`) [read]: 51 days old.
  - L's exe path, its mtime and whether the running app is that exe.
  - L's Claude Code version.
- **L's checkout** is `C:\Consonance\lighthouse` (`p-l198…:66`, `:94`; `install_proposal_L_2026-09-23.md:20`) [read].
  D's checkout is `C:\Users\nname\Desktop\lighthouse`.
- **How old.** The newest reading is about 10:3xZ, 8.7 h before 19:14Z. The handoff says he left L at about 08:00 local
  (`handoff_lighthouse_2026-11-13-L.md:1`) [read]. That L's installed side has not moved since is [inferred].
- **The repo side has not moved.** L ran from 049ade71 (`p-l198…:95`) [read]. `git log 049ade71..HEAD -- consonance/hooks
  dev/shell` lists nothing, and `git diff --stat` over the same range is empty [read]. So L's 15/8 still describes L
  against today's main, assuming L's install side is unchanged [inferred].
- **The old audit tool cannot re-run this.** `loop/install_drift_audit_L_2026-09-23.js` hard-codes the 09-23 list of 10
  (`:26-37`) and reads the installed copy without an existence check (`:71`) [read]. ~~On any ABSENT entry it throws~~
  [2nd reader: it throws only if one of its own ten files is absent; it never looks at today's ABSENT names]
  [inferred], and it never sees today's other DRIFT names. Section 3 replaces it.

## 2. What differs between the machines by design, and what only looks like design

| entry | D | L | ruled where |
|---|---|---|---|
| the pulse on UserPromptSubmit | Node `hooks\userprompt-submit.js`, registered; -Check says "registered, not declared" | `userprompt_pulse.py` | `install_D_2026-09-21.md:3-4`, `:11`; `install.ps1:210-224`; `install_proposal_L_2026-09-23.md:49` [read] |
| `hooks\stop.js` on Stop | registered, "EXCLUDED BUT LIVE" | unregistered (the 09-06 ruling is the laptop lineage's) | `install.ps1:240-258`; `loop/keeper_rulings_owed_2026-09-19.md` via `librarian/2026-11-13.md:419` [read] [2nd reader: DOWNGRADED. Neither cited line reads L's settings; L's "unregistered" rests on `install_proposal_L_2026-09-23.md:50`, 51 days old.] |
| l2 and l3 overseers | live by his 09-21 word; off since 09-22 (D105) | off | `install_D_2026-09-21.md:3`; `install.ps1:259-274` [read] |
| wake-gate.js (Lap W, branch) | denies | warns and records | `git show lap-w-h-p:consonance/hooks/wake-gate.js:21`, `:207` [read] |
| dispatch-gate.js | ABSENT, not registered | registered on PreToolUse | D: -Check today [read]; L: `p-l198…:127-128` [read]. ~~No ruling found for either. [inferred: history, not design]~~ [2nd reader: the D side is a recorded decision: "NOT installed, on purpose: `dispatch-gate`, `carrier-drift-watch`" at the 09-21 install (`loop/install_D_2026-09-21.md:14`); D's `dispatch-gate.jsonl` ends 2026-09-09T13:54Z (my count). No ruling is found for L's side.] |
| board-digest.js | not registered | in use | D: `hooks_drift_D_2026-11-13.md:96-98`; L: `install_proposal_L_2026-09-23.md:13-14` (51 days old) [read] |

- **The per-machine mechanism exists.**
  - The installer names the machine by `CONSONANCE_MACHINE`, then `machine_tag`, then the hostname (`install.ps1:661`) [read].
  - `LiveOn` changes only what -Check reports, never what a run registers (`install.ps1:248-253`) [read].
  - No entry uses `LiveOn` today (`:265`) [read].
  - The pulse and stop.js differ between the machines and are not declared per machine. So ~~each machine's~~ -Check prints a
    red line for a state that was decided [read: today's D registration block]. [2nd reader: D only. `$register` declares
    the Python pulse L runs (`dev/shell/install.ps1:223-224`) and Excludes stop.js, which L leaves unregistered
    (`install_proposal_L_2026-09-23.md:49-50`), so neither prints red on L. L's own red of this kind is older:
    board-digest.js, transcript-watch.js and three more were REGISTERED, NOT DECLARED there (`install.ps1:1069-1071`).]
- ~~**Line endings are not a machine difference today.**~~ [2nd reader: not for the whole set. Over `dev/shell` and
  `consonance/hooks`, `git ls-files --eol` gives 2 files not `w/lf` on D; one is a manifest entry,
  `dev/shell/hooks/sessionstart-ambient.js` (`install.ps1:122`): 67 CR in the working copy and 67 in the installed copy,
  so -Check calls it `ok` only because both are CRLF. On an LF checkout the same installed copy reads DRIFT.]
  `.gitattributes` pins `eol=lf` and `git ls-files --eol` shows `i/lf
  w/lf` for the hooks I sampled [read]. -Check compares raw sha256 (`install.ps1:429`) [read]. A checkout without those
  attributes would show DRIFT for line endings alone [inferred]. The L read below records `--eol` for that reason.

## 3. Today's D decisions, and L

The D decisions are in `loop/hooks_drift_D_2026-11-13.md` sections (a) and (c) and in `librarian/2026-11-13.md:427` [read].

**Carry to L unchanged (procedure, not state):**
- Never a bare installer run mid-work. One entry with `-Only`, then a bare `-Check`, and only that entry may move.
  The rule was first made on L (`map/M.md:1032-1033`; `install.ps1:17-35`) [read].
- The settings check is semantic: parse before and after. The installer rewrites the whole file with
  `ConvertTo-Json -Depth 24` (`install.ps1:998`) [read]. The second reader's correction is `00_lap_w_spec.md:641` [read].
- `second-reader-note.js` goes only after `second-reader.js` and `second-reader-worker.js` (`install.ps1:174` per
  `hooks_drift_D:233-234`) [summary]. This is a code dependency, so the order is the same on both machines.
- Each ABSENT entry, when installed, also registers. A new registration is the owner's call (`install.ps1` ABSENT verdict
  line; `hooks_drift_D:191-192`) [read].
- Lap W's two new entries go in one at a time, `-Only sessionstart-body.js` and `-Only wake-gate.js`, on each machine
  (the branch's `install.ps1` comments on both rows: `git diff main...lap-w-h-p -- dev/shell/install.ps1`) [read].

**Do not carry; each needs a read on L first:**
- **board-digest.js.**
  - On D, syncing it alone is safe, because D's blind.js equals the repo's (`hooks_drift_D:92-95`) [summary].
  - On L, blind.js is DRIFT and lacks `sealedGate`, so board-digest.js alone "would throw on every prompt" and its block
    would vanish silently (`p-l198…:76-81`) [read].
  - On L it is also registered (09-23), so it is the one place fix 2c matters [inferred].
- **The pulse.**
  - On D `userprompt_pulse.py` is dormant and "lowest value of the ten" (`hooks_drift_D:72-81`) [summary].
  - On L it is the live pulse. Whether it is DRIFT there is not on disk.
- **sources-gate.js and delete-gate.js.**
  - On D they are DRIFT, "safe to sync alone; no behaviour change on D" [summary].
  - On L they are ABSENT, so installing them adds a registration: a new gate on every ring and every shell call.
- **reply-slot.js on L.**
  - On D, the installed reply-slot.js loads `./sources-gate.js` (`hooks_drift_D:138`) [summary].
  - On L, sources-gate.js is ABSENT. Whether reply-slot.js is installed and registered on L is not on disk.
  - If it is, its require fails on L. Its header says it fails open, so the reply slot would never fire on L [inferred].
- **second-reader.js.** Whether L has it installed, drifted or registered is not on disk. The 11-03 narrowing is a ruling
  about the hook, not about a machine (`hooks_drift_D:116-121`) [summary].
- **Wake and compaction hooks.**
  - precompact-preserve.js, sessionstart-state.js, session-start.js and precompact.js are DRIFT on L (`map/M.md:1031`) [read].
  - Lap W's W2 changes precompact-preserve.js and precompact.js on the branch (`git diff --stat main...lap-w-h-p`) [read].
  - On L, W2 is live only after those are synced. On D they are `ok` today, so W2 needs one `-Only` per file there.
- **"No loss risk".**
  - On D every DRIFT copy equals an older commit (`hooks_drift_D:49-50`) [summary].
  - On L this was last shown on 09-23 for a different set of 10 [read]. Before any sync on L, re-show it.
- **carrier-drift-watch.js.**
  - The 4 s per turn end was timed on D's disk (`hooks_drift_D:204-206`) [summary]; re-time it on L.
  - The finding that its Stop stdout reaches no one is from the docs, so it carries [summary].

**What Lap W's merge does to both machines** [inferred from `git diff --stat main...lap-w-h-p` and today's -Check]:
- It adds two manifest rows: sessionstart-body.js and wake-gate.js. Both become ABSENT everywhere.
- It changes `consonance/hooks/push-gate.js`, `consonance/hooks/precompact-preserve.js` and `dev/shell/hooks/precompact.js`.
- On D after the merge: precompact-preserve.js and hooks\precompact.js go from ok to DRIFT. push-gate.js stays DRIFT, now
  with a 10 MB rule D does not run. So D's -Check would read 21 ok, 12 DRIFT, 5 ABSENT.
- On L: push-gate.js goes from ok to DRIFT, and there are 2 more ABSENT.
- Today nothing a seat sees at its start says any of this (section 6).

## 4. The read on L: commands to run there and commit (one file per machine, written on that machine)

[ours]
- **Who runs it:** a seat on L, from L's checkout. Everything below is report-only.
- **Output:** one file, `exo_memory/loop/landed_live_2026-11-13/state_L.md`. Commit it by named path.
- **The D side:** D writes `state_D.md` the same way. Either machine compares the two with
  `git diff --no-index state_D.md state_L.md`.
- **The reference:** section 5 holds D's values as read today.
- **What it does not paste:** the 4,950-line UNCLAIMED list, any secret value, any transcript text.

```bash
cd /c/Consonance/lighthouse                  # L's checkout (p-l198-403-stall-B_2026-11-13.md:66)
OUT=exo_memory/loop/landed_live_2026-11-13/state_L.md
T=$(mktemp -d)
# 1. who, when, which tree
{ echo "# state of $(echo ${CONSONANCE_MACHINE:-unset}), written on that machine, $(date -u +%FT%TZ)"
  echo "- HEAD $(git rev-parse --short=8 HEAD) on $(git symbolic-ref --short HEAD); origin/main $(git rev-parse --short=8 origin/main)"
  echo "- origin/main reflog, newest entry: $(tail -n1 "$(git rev-parse --git-common-dir)/logs/refs/remotes/origin/main" | cut -f2) at $(tail -n1 "$(git rev-parse --git-common-dir)/logs/refs/remotes/origin/main" | grep -o '> [0-9]* ' | tr -d '> ')"
  echo "- changed under dev/shell, consonance/hooks: $(git status --short -- dev/shell consonance/hooks | wc -l)"
  echo "- hook sources not i/lf w/lf: $(git ls-files --eol -- dev/shell consonance/hooks | grep -vc 'i/lf.*w/lf')"
  echo "- claude: $(claude --version 2>&1 | head -n1)"; } > "$OUT"
# 2. the installer's report (4 s on D), states and registration block only
powershell.exe -NoProfile -ExecutionPolicy Bypass -File dev/shell/install.ps1 -Check > "$T/check.txt" 2>&1; rc=$?
{ echo; echo "## install.ps1 -Check (exit $rc), $(wc -l < "$T/check.txt") lines"; echo '```'
  grep -E '^(ok|DRIFT|ABSENT|HOLD|ABSENT FROM REPO) ' "$T/check.txt"
  grep -E '^ +[0-9]+ (UNDECLARED|PATH-MISMATCH|UNCLAIMED|DECLARED UNMANAGED)' "$T/check.txt"
  sed -n '/^registration --/,$p' "$T/check.txt"; echo '```'; } >> "$OUT"
# 3. each DRIFT copy: which commit of its source it equals (git-blob through the repo's attributes), or LOCAL
{ echo; echo "## DRIFT copies against history"; } >> "$OUT"
node -e '
const fs=require("fs"),os=require("os"),path=require("path"),cp=require("child_process");
const ps=fs.readFileSync("dev/shell/install.ps1","utf8"), BS=String.fromCharCode(92);
const map={}; for (const m of ps.matchAll(/From\s*=\s*.([^\x27]+).;\s*To\s*=\s*.([^\x27]+)./g)) map[m[2]]=m[1].split(BS).join("/");
const g=(a)=>cp.execFileSync("git",a,{encoding:"utf8"}).trim();
for (const l of fs.readFileSync(process.argv[1],"utf8").split(/\r?\n/)) { const m=/^DRIFT +(\S+)/.exec(l); if(!m) continue;
  const from=map[m[1]], inst=path.join(os.homedir(),".claude","shell",m[1].split(BS).join(path.sep));
  const blob=g(["hash-object","--path="+from,inst]); let hit="LOCAL (no commit of "+from+" has these bytes)";
  for (const c of g(["log","--format=%h","-n","200","--",from]).split("\n")) { try { if (g(["rev-parse",c+":"+from])===blob) { hit=c+" ("+g(["rev-list","--count",c+"..HEAD","--",from])+" commit(s) behind)"; break; } } catch(e){} }
  console.log("- "+m[1]+" <- "+from+": git-blob "+blob.slice(0,8)+" = "+hit+"; installed mtime "+fs.statSync(inst).mtime.toISOString()); }
' "$T/check.txt" >> "$OUT"
# 4. what settings.json registers (paths and matchers only), and its digest
{ echo; echo "## settings.json"; echo "- sha256 $(sha256sum ~/.claude/settings.json | cut -c1-16)…, $(stat -c '%s B, mtime %y' ~/.claude/settings.json)"
  node -e 'const s=JSON.parse(require("fs").readFileSync(require("os").homedir()+"/.claude/settings.json","utf8").replace(/^\uFEFF/,""));
  for (const [e,gs] of Object.entries(s.hooks||{})) for (const g of gs) for (const h of g.hooks||[]) console.log("- "+e+" | "+(g.matcher||"")+" | "+(String(h.command).match(/[^"\s]+\.(js|py)/g)||["?"]).pop())'
  echo "- backups beside it: $(ls ~/.claude/settings.json.bak* 2>/dev/null | wc -l)"; } >> "$OUT"
# 5. the room's config: named keys only (never print the whole file)
{ echo; echo "## ~/.consonance.json (named keys)"
  node -e 'const c=JSON.parse(require("fs").readFileSync(require("os").homedir()+"/.consonance.json","utf8").replace(/^\uFEFF/,""));
  for (const k of ["machine_tag","gates_mode","data_dir","instances_dir","room_path","chime_repos","claim_check"]) console.log("- "+k+": "+JSON.stringify(c[k]))'; } >> "$OUT"
# 6. the app: which exe runs, how old, and whether its compiled inputs and bundle are newer
{ echo; echo "## app"
  powershell.exe -NoProfile -Command "Get-Process consonance -ErrorAction SilentlyContinue | ForEach-Object { '- running pid ' + \$_.Id + ' ' + \$_.Path + ' started ' + \$_.StartTime.ToString('s') }"
  echo "- CARGO_TARGET_DIR ${CARGO_TARGET_DIR:-unset}"
  stat -c '- exe %y %n' consonance/src-tauri/target/release/consonance.exe 2>&1
  node -e '
  const fs=require("fs"),path=require("path"),t="consonance/src-tauri",rel=path.join(t,"target","release");
  const ex=fs.statSync(path.join(rel,"consonance.exe")).mtimeMs; let newer=0,same=0,absent=0,differ=0;
  const walk=(p)=>{let s;try{s=fs.statSync(p)}catch(e){return} if(s.isDirectory()){for(const c of fs.readdirSync(p))walk(path.join(p,c));return}
    if(/src-tauri[\\/]src[\\/].*\.md$/i.test(p))return; if(s.mtimeMs>ex)newer++;};
  ["src-tauri/src","ui","src-tauri/brief","src-tauri/Cargo.toml","src-tauri/Cargo.lock","src-tauri/tauri.conf.json"].forEach((x)=>walk(path.join("consonance",x)));
  const c=JSON.parse(fs.readFileSync(path.join(t,"tauri.conf.json"),"utf8")); const r=(c.bundle&&c.bundle.resources)||{};
  for(const [s,d] of Object.entries(r)){const ps=s.endsWith("*.md")?fs.readdirSync(path.join(t,s.slice(0,-4))).filter((n)=>n.endsWith(".md")).map((n)=>[path.join(t,s.slice(0,-4),n),path.join(rel,d,n)]):[[path.join(t,s),path.join(rel,d)]];
    for(const [a,b] of ps){ if(!fs.existsSync(b)){absent++;continue} if(Buffer.compare(fs.readFileSync(a),fs.readFileSync(b))===0)same++; else differ++; }}
  console.log("- compiled inputs newer than the exe (src/*.md left out): "+newer+"; bundle: "+same+" equal, "+differ+" differ, "+absent+" absent")' 2>&1
  ls -l "$LOCALAPPDATA/consonance/" 2>&1 | grep -E 'launch-pull|app-build' || echo "- no launch receipt (W5 not built)"; } >> "$OUT"
# 7. the start ledger: is anything told at a start (counts only)
{ echo; echo "## start ledgers since 2026-11-01 (counts)"
  for f in sessionstart-state sessionstart-body push-gate sources-gate delete-gate second-reader dispatch-gate; do
    p="$(node -e 'try{const c=JSON.parse(require("fs").readFileSync(require("os").homedir()+"/.consonance.json","utf8").replace(/^\uFEFF/,""));process.stdout.write(c.data_dir||"")}catch(e){}')/$f.jsonl"
    if [ -f "$p" ]; then echo "- $f: $(grep -c '"2026-11' "$p") rows naming 2026-11, newest $(tail -n1 "$p" | grep -o '"\(ts\|timestamp\)":"[^"]*"' | head -n1)"; else echo "- $f: absent"; fi; done; } >> "$OUT"
rm -rf "$T"
git add -- "$OUT"   # then commit by named path, the seat's own rule
```

Notes on the list:
- **Step 2.**
  - `-Check` is the documented report-only form (`install.ps1:13`) [read].
  - P read its write paths before running it: every write is in a non-Check branch, and Check exits at `:757` before the
    settings write (`handback/p-d-update-P_2026-11-13.md:32-33`) [read].
  - `-Only` with `-Check` is refused on purpose (`install.ps1:377`) [read]. So the read is always the whole set.
- **Dry runs on D.** I ran the step 3, 4, 5 and 6 snippets on D, read-only and printing to stdout only.
  - Step 3 matched all ten DRIFT copies to the commits `hooks_drift_D` names [read].
  - Step 6 printed ~~0 newer inputs~~, and 42 equal, 0 differ, 2 absent [read]. [2nd reader: run as written from Git
    Bash, step 6 prints "1; bundle: 42 equal, 0 differ, 2 absent". The shell passes `[\\/]` to node as `[\/]`, so the
    `src/*.md` exclusion never matches a Windows path and MAP.md counts (my run, stdout only). Build the class with
    `String.fromCharCode(92)`, as step 3 does. Step 7 has a second defect: push-gate and delete-gate rows carry their
    time as `t`, so "newest" prints empty for exactly the two gates whose rows were L's evidence. My dry run on D:
    push-gate 158 rows, newest empty; delete-gate 174, newest empty. Add `t` to the key pattern.]
  - I did not run steps 1, 2 and 7 as a block: they write `$OUT`.
- **Step 3.**
  - It uses D's method (`hooks_drift_D:56-57`): `git hash-object --path` applies the repo's attributes, so a CRLF copy still
    matches its LF commit [inferred from git's --path behaviour; not run on L].
  - Unlike the 09-23 script, it reads the DRIFT names from the check, so it covers whatever L has today [ours].
- **Step 6.**
  - On D the launcher finds the exe by `cargo metadata` (`launch.ps1:215-222`) [read]. If L sets `CARGO_TARGET_DIR`, the
    default path in the `stat` line is wrong, and the env line says so.
  - `launch.ps1:205-213` records that on 07-28 a target dir under `C:\build` was set "to get 19.5 GB of build output out of
    a file-sync folder's scope". The note does not say which machine [read].
- **No secrets.** Step 5 prints seven named keys. Whether `~/.consonance.json` holds any token is not checked here. Naming
  keys keeps any token out either way [inferred].

## 5. D, read today (the reference row for the comparison)

| field | D, 2026-11-13 | how read |
|---|---|---|
| HEAD | 2c396481 on main | `git rev-parse` [read] |
| install.ps1 -Check | 23 ok, 10 DRIFT, 3 ABSENT; 4 declared not registered; 1 registered not declared; 3 excluded and absent; 1 excluded but live; 4,950 UNCLAIMED; exit 1 | my three runs, identical [read] |
| the -Check's own time | 3,946 to 4,087 ms wall | `date +%s%N` around the call [read] |
| PowerShell start alone | 159 to 168 ms | `powershell -NoProfile -Command "exit 0"`, three runs [read] |
| settings.json | sha256 4266711b35be030…, 4,942 B, mtime 2026-11-13 09:01:54 local; 19 hooks across 7 events | node parse, read-only [read] |
| SessionStart hooks | `hooks\session-start.js`, `sessionstart-state.js` | settings.json [read] |
| hooks run from a repo path | 1: `ask-surface.js` on UserPromptSubmit | settings.json [read]; ledger L1086 [summary] |
| gates_mode | light | `~/.consonance.json` [read] |
| running app | pid 24164, `…\consonance\src-tauri\target\release\consonance.exe`, started 08:42:24 local | Get-Process [read] |
| exe | 2026-11-08 23:56:09 local, 15,990,272 B | `stat` [read] |
| compiled inputs newer than the exe | 0, leaving out `src-tauri/src/*.md`; 1 under the launcher's own list (`src-tauri/src/MAP.md`, written by the 08:43:40 pull) | my read-only stat walk, 3 to 4 ms [read] |
| bundled resources vs repo | 42 equal, 0 differ, 2 absent (two `research/*_2026-11-13.md` files) | my read-only compare over `tauri.conf.json:31-46`, 11.3 ms [read] |
| launch receipt | none; `%LOCALAPPDATA%\consonance` holds no launch-pull.json | `ls` [read] |

Two findings from that table, outside the hooks:
- **The launcher never rebuilds for a change to bundled `exo_memory/*` resources.**
  - Its freshness list is `src-tauri/src`, `ui`, `src-tauri/brief`, Cargo.toml, Cargo.lock and tauri.conf.json
    (`launch.ps1:566-583`) [read].
  - The bundle also carries `exo_memory/cards`, `spread`, `research`, `record` and `SOURCE.md` (`tauri.conf.json:42-46`)
    [read]. The two research files absent from today's bundle are this case.
  - It is the same one-way valve the launcher's own comment recorded for `brief/` on 09-01 (`launch.ps1:569-578`) [read].
  - Which seat reads the bundled research copies, rather than the repo's, I did not trace [inferred: the app seeds them into
    the data dir, `main.rs:763`].
- **The launcher's rule would rebuild today for a file that is not compiled.** MAP.md is newer than the exe and is no
  `include_str!` target. ~~Grep finds only `include_str!("main.rs")`~~ [read]. [2nd reader: grep also finds
`include_str!("../brief/frag-fork.md")` (`main.rs:24488`) and `include_str!("mcp.rs")` (`mcp.rs:1995`). None names MAP.md,
so the conclusion holds.] A receipt that copied the launcher's rule
  would report the app stale today when it is not, so the receipt leaves out `src-tauri/src/*.md` [ours].

## 6. The receipt: one line a seat sees at its start

### What W3 already prints (branch lap-w-h-p)

- `consonance/hooks/sessionstart-body.js` exists on the branch at 95c47488, 225 lines [read].
- Its line names machine, model, effort, context, HEAD, origin's last sync, the shelf's base and the source
  (`git show lap-w-h-p:consonance/hooks/sessionstart-body.js:192`) [read].
- For the librarian it adds a `[room]` clause (`:194-202`) [read].
- It reads the repo through `room_path` (`:73-80`) [read]. It catches each field on its own (`:150`) [read], and its
  watchdog exits at 6 s (`:49`, `:212`) [read].
- It ledgers `{event, source, bytes, ms, model_src, effort_src, ctx_src}` (`:220`) [read].
- It prints nothing about hooks, the app or the gates: a grep of the branch file for "in step", "drift", "gates",
  "consonance.exe" and "install.ps1" counts 0 for each [read].

### The three fields it adds [ours]

Appended to the `[body]` line, before `· source`:

```
· hooks <ok> in step, <d> drift (<w> wired), <a> absent, <n> not wired, <u> wired undeclared[ (<r> from the repo path)],
  <e> excluded-but-live · app exe <YYYY-MM-DD HH:MM>[ built at <sha>], <c> compiled inputs newer, bundle <s> equal
  [<x> absent] [<y> differ] · gates <light|strict> (<config|default>)
```

On D today it would read like this (values from section 5, and the prototype in the Speed bullet below):

```
· hooks 23 in step, 10 drift (6 wired), 3 absent, 4 not wired, 2 wired undeclared (1 from the repo path), 1 excluded-but-live · app exe 2026-11-08 23:56, 0 compiled inputs newer, bundle 42 equal 2 absent · gates light (config)
```

That is 230 B and 227 characters (`Buffer.byteLength`) [read]. "6 wired" is the overlap of the DRIFT list with the
settings list: second-reader, sources-gate, push-gate, delete-gate, ask-ending and release-chime [read: both lists;
the count is mine].

### How each field is computed, without running -Check

- **hooks.**
  - Source: one pass inside the body hook's own node process.
  - It reads the repo's `dev/shell/install.ps1` at `room_path` (the file the next install would use, never the installed
    copy of anything) and takes the `$files` pairs and the `$register` entries by regex, skipping comment lines.
  - It hashes each repo source and its installed copy with raw sha256. That is the same comparison as `install.ps1:429`.
  - It parses `~/.claude/settings.json` for each command's last `.js` or `.py` path.
  - Speed: my read-only prototype got 36 manifest, 24 register (4 excluded), 23 ok, 10 drift, 3 absent, 4 not wired,
    1 excluded-but-live, 19 live. Compute took 9.8 ms, and 87 to 105 ms wall with node start-up
    (`…/scratchpad/hooks_receipt_proto.js`, read-only) [read].
  - It differs from -Check in one count. It reports 2 wired undeclared where -Check reports 1. The extra is
    `ask-surface.js`, registered from the repo path, which -Check does not report (ledger L1086) [read]. The field names it
    "(1 from the repo path)" instead of hiding the difference.
  - Because it reads the repo's install.ps1 at each start, a new manifest row counts at once, even before the body hook's own
    installed copy is refreshed [inferred].
- **app.**
  - It stats the exe and walks the compiled inputs: the launcher's list (`launch.ps1:566-583`) minus `src-tauri/src/*.md`.
    That took 3 to 4 ms over 69 files [read].
  - It compares each `tauri.conf.json` resource with its copy beside the exe: 44 files in 11.3 ms [read].
  - Exe path: the default `consonance/src-tauri/target/release/consonance.exe` under `room_path`'s repo, unless a launch
    receipt names another. "built at <sha>" appears only when a build receipt (below) matches the exe's mtime.
- **gates.** `gates_mode` from `~/.consonance.json` by the rule session-start.js already uses. Anything but "light" is
  "strict", and a missing key prints "(default)" (installed `hooks/session-start.js:250-258`) [read].

### No cache, and why

- The three fields together take about 25 ms in-process, against 3.9 to 4.1 s for -Check (section 5) [read].
- W3's own line already takes 163 to 182 ms (`body_line.md:10`) [summary].
- A cache would be a copy of the installed state, and a copy can go stale. Going stale is the fault this line exists to
  report [inferred].
- If one is ever needed (on L's disk, untimed), it would live at `<data_dir>/start-receipt.json`. Its key would be the
  sha256 of the repo's install.ps1, the mtime and size of settings.json, the newest mtime among the installed manifest
  files, and the exe's mtime. It would be refreshed when any of the four changes. The `[body]` line would then add
  "(cached <age>)" [ours].

### What it prints when a field cannot be read [ours]

| cause | text |
|---|---|
| no `room_path`, or the repo is missing | `hooks not readable (no repo)` · `app not readable (no repo)` |
| install.ps1 parses to 0 manifest rows (format changed) | `hooks not readable (manifest 0 rows: install.ps1 changed shape)` |
| settings.json unreadable | the file counts print; `not wired`/`undeclared` print `?` and `(settings unreadable)` |
| exe absent at the path | `app exe absent at <path>` |
| tauri.conf.json unreadable | `bundle not readable` |
| no gates_mode | `gates strict (default)` |

- Each case is caught on its own, the same pattern as W3's `field()` (`sessionstart-body.js:150`) [read].
- The whole failure line is 118 B [read: `Buffer.byteLength`].

### Cost per start

- The addition is about 230 B. At 2.89 B a token (the ratio `body_line.md:130` uses) [summary] that is about 80 tokens, on
  top of W3's about 245 B [summary]. Together they are about 475 B, about 165 tokens.
- W3's own estimate is 208 SessionStart rows in 13 November days (`body_line.md:132`) [summary]. At that rate the addition
  is about 48 KB over those days, across all seats [inferred].
- If that is too much, here is a terse form of the same facts, ~~about 150 B~~ [2nd reader: 120 B, 117 characters,
  `Buffer.byteLength` of the line below] [ours]:
  `· hooks 23/10d(6w)/3a, 4 unwired, 2 undeclared, 1 excl-live · app 11-08 23:56, 0 newer, bundle 2 absent · gates light`.

### Where it lands in Lap W, part by part [ours]

- **W3 (pane H):**
  - Three functions in `sessionstart-body.js` (`hooksState(repo)`, `appState(repo)`, `gatesMode()`) and three fields in
    `build()`.
  - The ledger row gains `{hooks:{ok,drift,wired_drift,absent,unwired,undeclared,excl_live}, app_inputs_newer,
    bundle_absent, bundle_differ, gates}`. That keeps each start's counts as data on that machine.
  - No install.ps1 change is needed beyond W3's own two rows.
- **W5 (pane R, `launch.ps1`):**
  - Beside `launch-pull.json`, write `app-build.json` only when the launcher itself builds: `{built_at, head, exe,
    exe_mtime, launch_id}`, after the green line's own freshness test (`launch.ps1:637-639`) [read].
  - The receipt prints "built at <sha>" when `exe_mtime` equals the exe's mtime. A build by a landing pane's plain cargo
    writes no receipt, so the line says the exe time only. That is honest, not a guess.
  - Also add `../../exo_memory` (cards, spread, research, record, SOURCE.md) to `$sources` (`launch.ps1:566-583`), so a
    resource-only change rebuilds.
- **W1 (pane R, the rebuild it already carries):** optional.
  - `main.rs:1222-1223` sets `CONSONANCE_PANE` and `CONSONANCE_READY_DIR` on each seat [read].
  - One more `cmd.env("CONSONANCE_APP_EXE", current_exe)` there would name the running exe exactly, not by the default
    path. That needs the rebuild W1 already needs.

### Needs

- **No rebuild of the app for the three fields.** The bundle-and-resources fix and `app-build.json` are `launch.ps1`
  edits, which reach L at its next pull (`00_lap_w_spec.md` W5 "Needs") [summary].
- **A hook install** on each machine: `-Only sessionstart-body.js`, the same install W3 already needs, so nothing is
  added to it.
- **No seat restart for content.** A refreshed hook file is used at its next firing (`hooks_drift_D:315`) [summary].
- **The first appearance of the line needs a seat start.** A new SessionStart registration needs `/hooks` or a restart to
  be picked up (`install.ps1:1028-1030` per `hooks_drift_D:316`) [summary]. Each seat sees it at its next natural start,
  resume or compaction. Nothing is compacted or cut for it.
- **His word:** Lap W's calls were ruled the librarian's (`git log`: bca7aeae, "Lap W unparked and its ten calls ruled, at
  his word that they are the librarian's to make") [read].
  - Adding fields to W3's line is inside W3.
  - Turning the receipt into a refusal (a seat may not dispatch while a wired hook is DRIFT) would be a new gate. That is
    his call and is not proposed here.

## 7. The failing checks

**Red today, on the record (no fixture needed):**
1. The librarian's transcript on D holds 69 SessionStart hook rows from 2026-11-01T07:04:42Z to 2026-11-13T18:54:20Z
   [read, node readline pass]:
   - 41 `hook_success` and 28 `hook_additional_context`;
   - by source: 26 compact, 15 resume, 28 with no source suffix.
   - Rows whose output names `drift`, `absent`, `in step`, `gates` (each case-insensitive), `install.ps1`,
     `consonance.exe` or `[body]`: **0 of 69** [read: counts only, no text taken].
2. `C:/Consonance/data/sessionstart-state.jsonl` holds 210 rows since 2026-11-01 [read]:
   - emitted/compact 70, skipped/compact 4, skipped/resume 136.
   - Its keys are `ts, event, source, chars, failed, reason`. None carries an install, app or gates field [read].
   - Since 11-13 it holds 16 rows: 9 skipped/resume, 6 emitted/compact, 1 skipped/compact [read].
   - `sessionstart-body.jsonl` is absent [read: `ls`].
3. The two registered SessionStart hooks print nothing of the kind.
   - Installed `hooks/session-start.js` reads `gates_mode` only to shape the digests (`:250-258`, `:355`) [read] and
     writes once (`:397`).
   - `sessionstart-state.js` writes once (`:166`) [read].
   - `consonance/tools/state-block.js` holds no install, exe or gates field (grep) [read].

**The test that fails today and passes after [ours], in `consonance/hooks/sessionstart-body.test.js` (pane H):**
- **Name:** "W3 receipt: the recorded D state of 2026-11-13 reads 23 in step, 10 drift (6 wired), 3 absent, 4 not wired".
- **Fixture:** a temp USERPROFILE.
  - `.claude/shell` holds each manifest file as the repo has it, except:
    - the ten DRIFT files, written as their blobs at the recorded commits (`hooks_drift_D:61-162`: 1a5891af, 5889d3cd,
      2c7b3872, aadcc10a ×2, 29260ad9, e8f85486 ×2, 2cbc3608, ca8c69df, taken with `git show <c>:<path>`) [summary for
      the shas];
    - the three ABSENT files, left out.
  - `settings.json` holds the 19 recorded commands with the home rewritten to the temp dir [read: section 5].
  - `~/.consonance.json` holds `gates_mode: "light"`. Its room_path points at a temp tree that holds
    `dev/shell/install.ps1` and the manifest sources as they stand at a pinned sha (`git archive <sha> dev/shell
    consonance/hooks`), so a later manifest change does not move the test.
- **Expect:** the fields above, word for word.
- **Why it is red today:** the branch file has no hooks field (grep count 0). It is red for the reason, not merely because a
  module is missing, since the module exists on the branch.
- **Pin to the instrument, same file.** Run `powershell -File dev/shell/install.ps1 -Check` with `USERPROFILE` set to the
  fixture. Parse its `ok`, `DRIFT` and `ABSENT` counts and its four registration counts. Assert the receipt equals them,
  except that the receipt counts repo-path registrations, which -Check does not. This catches a regex that drifts from the
  installer's format.
  - -Check under a temp USERPROFILE writes nothing; its writes all sit in non-Check branches (P's reading, above).
  - On D, PowerShell starts in about 160 ms, and the -Check itself runs about 4 s over the real tree, mostly the
    4,950-file UNCLAIMED walk [inferred]. The fixture tree is small.
- **Edges, one test each:**
  - no room_path;
  - install.ps1 with no `$files` block (prints the "changed shape" text);
  - settings.json missing;
  - exe missing;
  - a bundle with one research file absent (the 11-13 case: `research/*_2026-11-13.md` ×2, section 5), expecting
    `bundle … 1 absent`; [2nd reader: the recorded case has 2 absent (my compare: 42 equal, 0 differ, 2 absent). Pin 2,
    or it is not the recorded case.]
  - `gates_mode` absent, expecting `gates strict (default)`;
  - a repo-path registration, expecting `(1 from the repo path)`.
- **Tier:** install state and gates are "prove it" (`~/.claude/CLAUDE.md`, the tiers list). The mutation harness the
  branch already adds, `consonance/tools/lapw-hooks.mutants.js` (`git diff --stat main...lap-w-h-p`) [read], takes three
  more anchors: the hash comparison, the excluded test and the repo-path count.

**What proves it afterwards, on both machines [ours]:**
- At the first start after the `-Only sessionstart-body.js` install on D, the body ledger row carries `hooks.drift` equal to
  a bare `-Check`'s DRIFT count, read by a seat that is not the lap's author.
- On L the same row is the first record of L's install state that L writes by itself at every start, with no seat having
  to remember to run -Check.
- The Opus level's degeneration test for Lap I (`plan_vector_swarm_2026-11-13.md`, "Lap I is degenerating if") becomes one
  ledger read per machine.

## What I did not open

- L's disk, settings, data folder, transcripts and running app. Everything about L here is from files committed on L.
- The full -Check output of any L run: it is not on disk.
- `loop/absent_hooks_ruling_2026-08-25.md`, `packet_installer_only_2026-09-08.md`, `install_drift_census_2026-08-24.md`,
  `plan_install_score_remeasure_2026-09-21.md`, `loop/keeper_rulings_owed_2026-09-19.md` (I cite it only through
  `librarian/2026-11-13.md:419`) and the 09-23 hand-back `p-l103-drift-A`.
- `install.ps1` lines 470-640 and 760-1080, apart from the greps cited. The -Check registration logic was read from its
  output, not its source.
- The other files in `landed_live_2026-11-13/` (`installer.md`, the workflow). I did not cross-check them.
- wake-gate.js beyond the machine lines. sessionstart-body.test.js was read by test name only. I ran no node test file.
- The ledger rows' primaries: I read the 19 rows' text in `00_ledger.md`, not their sources.
- Whether a running Claude Code session picks up a new SessionStart registration without a restart (as in W3's own open
  item).
- The PreToolUse and SessionStart sections of the hooks docs: I relied on `body_line.md` §2, which downloaded them, and
  did not re-download them.
- `main.rs` beyond `:1205-1230`, `:763`, the `include_str!` grep and the `gates_mode` count (11 mentions).

## Second reader

Second reader: one Opus reader, on D, read-only except this file. Main at baa0aef9; 2c396481..baa0aef9 touches no file under
`consonance/` or `dev/shell/` and only appends to the notes and maps cited here, so line numbers in this file still hold.
Branch lap-w-h-p read at 95c47488. Line numbers in the table are the first reader's, before my inserts.

Ran, all report-only or read-only: `dev/shell/install.ps1 -Check` twice (exit 1; 3,738 and 3,650 ms; 5,031 lines and
430,136 B each, the same both times). The first reader's `hooks_receipt_proto.js` after reading it (it writes nothing),
three times. Steps 3, 6 (verbatim) and 7 of section 4 as dry runs to stdout. One node readline pass over the librarian
transcript (counts only), one over `sessionstart-state.jsonl`, one parse of `settings.json` and of named keys in
`~/.consonance.json`. `git log`, `git show`, `git diff`, `git ls-files --eol`, `git status`, `git reflog`. No node test
file was run. One slip, mine: a stdout capture went to `/tmp` for one timing run and was deleted at once.

| line | claim (under 15 words) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 3-4 | newest L read 10:3xZ: 15 DRIFT, 8 ABSENT | `p-l198-403-stall-B_2026-11-13.md:106`; `librarian/2026-11-13.md:166` | OK | both read 15 and 8 after the -Only run |
| 4 | 6 of 15 DRIFT and 3 of 9 ABSENT named | `map/M.md:1030-1031`; `p-l198…:88-90` | OK | 4 + 2 DRIFT names, 3 ABSENT names |
| 6 | no hook source changed since L's read | `git log 049ade71..HEAD -- consonance/hooks dev/shell` | OK | 0 commits; 049ade71 is in HEAD; b0be06f0 is in 049ade71 |
| 7, 147-152 | after Lap W merge D reads 21/12/5 | `git diff --stat main...lap-w-h-p`; my -Check | OK | +2 rows; precompact-preserve.js and hooks\precompact.js `ok` now; push-gate DRIFT |
| 15, 414-419 | 69 SessionStart outputs, 0 name drift/gates/install | librarian transcript, readline pass | OK | 69; 41 success, 28 context; 26 compact, 15 resume, 28 bare; 0 hits; 11-01T07:04:42Z to 11-13T18:54:20Z |
| 16, 293-294 | branch body hook has 0 receipt fields | `git show lap-w-h-p:consonance/hooks/sessionstart-body.js` | OK | grep 0 for in step, drift, gates, gates_mode, consonance.exe, install.ps1 |
| 25 | -Check 3.9-4.1 s, 5,031 lines, 430,136 B | my two runs | DOWNGRADED | lines and bytes equal; time 3.65 and 3.74 s |
| 39 | 09-23: 10 DRIFT; 6 in use, 4 not | `install_proposal_L_2026-09-23.md:3-7` | OK | as stated |
| 40 | 11-11 pushes from L: gate unwired | `map/B.md:2154`, `:2167` | OK | "pushes wrote none (gate unwired)"; "the push wrote none (gate unwired)" |
| 41 | L push at 09:35Z, gate not wired | `map/B.md:2185` | DOWNGRADED | headed 03:5x local; 09:35:30Z is the landing stamp |
| 42 | B's bare -Check: 15 DRIFT, 9 ABSENT | `p-l198…:54-55`; `map/B.md:2186` | OK | board-digest plus 14 DRIFT, 9 ABSENT |
| 43 | librarian's -Check on L at 10:33Z | `map/M.md:1030`; `librarian/2026-11-13.md:145` | OK | "run by me at 10:33Z" |
| 47-48 | two hand-backs of 11-12/11-13 name install.ps1 | `grep -rl` over `handback/` | OK | 2 files of 71 dated 11-12 or 11-13 |
| 50 | "-Only: 1 of 36 …, 1 of 24" printed on L | `p-l198…:95` | OK | verbatim |
| 60-61 | L's only PreToolUse was dispatch-gate; one block added | `p-l198…:103-105`, `:127-128` | OK | as stated |
| 62 | no other event of L's settings recorded | `install.ps1:1069-1071`; `install_proposal_L…:6`, `:49-50` | WRONG | 08-31 and 09-23 records of L's registrations exist, old |
| 64 | L's gates_mode not on disk at all | `plan_retrieval_at_the_wake_2026-11-12.md:27`; `shelf_builder.md:43-44` | DOWNGRADED | indirect trace: strict walk on L on 11-12 |
| 66-67 | L data_dir `C:\Consonance\data` on 09-23 | `install_proposal_L…:17` | OK | as stated |
| 70 | L checkout is `C:\Consonance\lighthouse` | `p-l198…:66`, `:94` | OK | as stated |
| 72 | he left L about 08:00 local | `handoff_lighthouse_2026-11-13-L.md:1` | OK | written 07:2x local; `:64` repeats 15/8, no fresher read |
| 77-79 | 09-23 audit hard-coded; throws on ABSENT | `install_drift_audit_L_2026-09-23.js:26-37`, `:71` | DOWNGRADED | throws only if one of its ten is absent |
| 85 | pulse: Node on D (RND), Python on L | my -Check; `install_proposal_L…:49`; `install_D…:38` | OK | D lists userprompt-submit.js REGISTERED, NOT DECLARED |
| 86 | stop.js unregistered on L | `librarian/2026-11-13.md:419`; `install_proposal_L…:50` | DOWNGRADED | cited line does not read L; support is 51 days old |
| 87 | overseers off on D since 09-22 | `install.ps1:259-274`; my -Check | OK | EXCLUDED BY RULING, correctly absent |
| 88 | wake-gate denies on D, warns elsewhere | `lap-w-h-p:consonance/hooks/wake-gate.js:21`, `:207` | OK | `const refuses = machine === 'D'` |
| 89 | dispatch-gate: no ruling found for either | `install_D_2026-09-21.md:14` | WRONG | "NOT installed, on purpose" on D, 09-21 |
| 90 | board-digest not registered on D | `hooks_drift_D…:96-98`; my settings parse | OK | 0 entries among 19 |
| 93-95 | machine tag order; LiveOn report-only, unused | `install.ps1:248-253`, `:265`, `:661-664` | OK | as stated |
| 96-97 | each machine's -Check prints red for decided state | `install.ps1:223-224`; `install_proposal_L…:49-50` | WRONG | true of D only |
| 98 | line endings not a machine difference | `git ls-files --eol`; node CR count | WRONG | manifest file sessionstart-ambient.js is CRLF on D, 67 CR, `ok` by matching CRLF |
| 99 | -Check compares raw sha256 | `install.ps1:429` | OK | `Get-FileHash` both sides |
| 108 | -Only rule first made on L | `map/M.md:1032-1033`; `install.ps1:17-35` | OK | L044 |
| 110 | installer rewrites settings whole | `install.ps1:998`; `00_lap_w_spec.md:641` | OK | `ConvertTo-Json -Depth 24` |
| 113-114 | an ABSENT entry installed also registers | my -Check tail; `hooks_drift_D…:191-192` | OK | "Installing them REGISTERS their hooks" |
| 115-116 | Lap W rows say install with -Only each | `git diff main...lap-w-h-p -- dev/shell/install.ps1` | OK | both comments |
| 120-122 | D blind.js equals repo; L's lacks sealedGate | my -Check (`ok blind.js`); `p-l198…:76-81` | OK | as stated |
| 231-234 | -Check report-only; exits :757; -Only refused :377 | `install.ps1:13`, `:377-380`, `:757`; `p-d-update-P…:32-33` | OK | as stated |
| 236 | step 3 matches all ten DRIFT copies | my dry run | OK | 1a5891af, 5889d3cd, 2c7b3872, aadcc10a x2, 29260ad9, e8f85486 x2, 2cbc3608, ca8c69df |
| 237 | step 6 printed 0 newer inputs | my verbatim run from Git Bash | WRONG | printed 1: `[\\/]` reaches node as `[\/]` |
| 244-247 | exe found by cargo metadata; 07-28 target dir | `launch.ps1:205-222` | OK | as stated |
| 255-256 | D -Check: 23/10/3, 4 DNR, 1 RND, 3 excl, 1 live, 4,950 | my -Check | OK | each count equal |
| 258 | PowerShell start 159-168 ms | three runs | OK | 149, 153, 161 ms |
| 259-261 | settings 19 hooks, 7 events, 4,942 B; ask-surface repo path | my node parse | OK | sha256 4266711b35be030e; mtime 15:01:54Z |
| 262-264 | gates light; app pid 24164 from 08:42:24; exe 11-08 | `~/.consonance.json`; Get-Process; stat | OK | 15,990,272 B, 23:56:09 local |
| 265 | MAP.md written by the 08:43:40 pull | `git reflog`; stat | OK | `HEAD@{08:43:40}: pull -q --ff-only` |
| 266-267 | bundle 42/0/2; no launch receipt | node compare; `ls %LOCALAPPDATA%\consonance` | OK | the two research files of 11-13 absent |
| 272-277 | freshness list; bundle carries exo_memory; seeding | `launch.ps1:566-583`; `tauri.conf.json:42-46`; `main.rs:761-764` | OK | as stated |
| 279 | only `include_str!("main.rs")` found | grep of `src-tauri/src` | WRONG | also `../brief/frag-fork.md` and `mcp.rs`; conclusion holds |
| 286-292 | body hook: 225 lines; :192, :194-202, :150, :49, :212, :220 | `git show lap-w-h-p:…/sessionstart-body.js` | OK | each line as cited |
| 312-314 | example about 230 B; 6 DRIFT entries are wired | node byteLength; settings and DRIFT lists | OK | 229 B trimmed; the six named |
| 324-328 | prototype counts; 9.8 ms; 87-105 ms wall | my three runs | DOWNGRADED | counts equal; 18.4 ms in-process; 128-151 ms wall |
| 338-339 | gates rule as session-start.js | installed `hooks/session-start.js:250-258` | OK | not "light" means strict |
| 344, 368-370 | W3 163-182 ms; 2.89 B/token; 245 B; 208 rows | `body_line.md:10`, `:129-132` | OK | as stated |
| 373 | terse form about 150 B | node byteLength | WRONG | 120 B |
| 391 | `CONSONANCE_PANE`, `CONSONANCE_READY_DIR` per seat | `main.rs:1222-1223` | OK | as stated |
| 398, 403 | W5 needs no rebuild; new registration needs /hooks or restart | `00_lap_w_spec.md:130`; `install.ps1:1028-1030` | OK | as stated |
| 405 | Lap W calls ruled the librarian's | `git log -1 bca7aeae` | OK | message verbatim |
| 420-424 | state ledger 210 rows; 70/4/136; 16 today; body absent | node pass; `ls` | OK | keys ts, event, source, chars, failed, reason |
| 426-429 | registered SessionStart hooks print no receipt field | `session-start.js:250-258`, `:355`, `:397`; `sessionstart-state.js:166`; `state-block.js` | OK | state-block: install 0, gates 0, consonance.exe 0 |
| 458-459 | edge: the 11-13 bundle case, 1 absent | node compare | DOWNGRADED | the recorded case has 2 absent |
| 463, 471 | mutants harness on branch; Lap I falsifier | diff stat; `plan_vector_swarm_2026-11-13.md:144` | OK | as stated |

**Tally: 61 rows. 47 OK, 7 WRONG, 7 DOWNGRADED, 0 UNSUPPORTED.** Every WRONG and DOWNGRADED row carries a bracketed
note in place; the WRONG spans are struck.

### The failing checks, run

- **0 of 69 SessionStart outputs carry a receipt field:** red today, for the reason given. My pass returns the same 69 and
  0 hits. It is a recorded case: every start of the librarian on D since 11-01.
- **The branch body hook has no hooks field:** red today for the reason (grep 0), not because a module is missing. On main
  the same test would fail on a missing module instead, so it must run on the branch.
- **The 11-13 fixture:** no test exists to run. Its red is certain today and says nothing yet. It becomes a real check only
  with its "pin to the instrument" half, which compares against -Check under a temp `USERPROFILE`. That half is sound:
  `$dest` and the settings path come from `$env:USERPROFILE` (`install.ps1:74`, `:612`, `:833`), and `$repo` from the
  script's own path (`:73`), so the temp tree's copy compares the temp tree. The machine tag comes from `$HOME`
  (`:664`), which may not follow `USERPROFILE` [inferred]; pin `CONSONANCE_MACHINE` in the test.

### The design, attacked

- **Satisfied without fixing.** The receipt can be exact at every start while drift never moves. D's -Check has exited 1
  for weeks by design ("-Check exits 1 until all of that is resolved, and it should", `install.ps1:1076`). L's landing
  records said "gate unwired" on 11-11 at 00:2x and 07:4x and on 11-13 at 03:5x (`map/B.md:2154`, `:2167`, `:2185`), and
  the gate was installed only at 10:37Z on 11-13 (`p-l198…:94-107`). The receipt's ancestor, the state block, was
  "emitted 163 times and acted on 0 times" (`00_lap_w_spec.md:381`) [summary]. Worse: the Lap I falsifier needs "no seat
  was told" (`plan_vector_swarm_2026-11-13.md:144-146`). A line at every start makes "told" true by construction, so that
  clause could never fire. [ours] Score Lap I on time-to-live instead: per hook file, the time from the commit on main
  that changes it to the first body-ledger row on each machine where that file reads `ok`. That needs one more ledger
  field, the names of the drifted entries, not only their count.
- **Fires wrongly.** (1) The hooks field hashes the room checkout's working tree. A tree on another branch, or with
  unreviewed edits to `install.ps1` or a hook source, reports drift against those edits. That has happened: the 09-21
  second install ran from `git show HEAD:` because "the working tree held B's unreviewed install.ps1"
  (`install_D_2026-09-21.md:45-46`). Today 0 such files are modified (`git status`, 73 to 93 ms) [read]. [ours] Add
  "(tree +N)" from one `git status --porcelain -- dev/shell consonance/hooks`. (2) The reverse case: a checkout behind
  origin reads "in step" for a fix that landed on origin and was not pulled. That was this morning's wake (a fetch cut at
  2 %, `librarian/2026-11-13.md:481`). W3's `origin/main … behind` field is on the same line; the receipt should say its
  counts are "against HEAD <sha>". (3) The app field counts by mtime, so a branch switch and back reads as stale with no
  change. (4) The gates field prints the config's mode. On D, wake-gate denies whatever the mode is (its rule is the
  machine), so "gates light" would understate what refuses on D. [ours] Name the exceptions: "gates light; wake-gate
  deny (D)".
- **Silent absence.** Where `sessionstart-body.js` is not installed (L today, and D until its `-Only`), there is no
  line, and no line looks the same as no news. W3's pairing check (every state row has a body row within 5 s,
  `00_lap_w_spec.md:362-364`) is the guard. It must also run on L, from the ledger written on L.
- **A lapsed fix of the same kind is on record:** the state block above, and -Check's red exit itself.
- **The L read (section 4):** right in shape (a file per machine, written there, compared by `git diff --no-index`), with
  two defects corrected in place (step 6's regex and step 7's `t` key). Step 6 still reads the default exe path, so it
  breaks the 07-28 way if L sets `CARGO_TARGET_DIR` (`launch.ps1:205-212`); the env line only says so. "Everything below
  is report-only" is not quite true: `mktemp`, the redirect into `$OUT` and `git add` write. Those are the intended writes.

### What carries to L, re-judged

The first reader's split stands, with two changes. dispatch-gate's absence on D is a decision of record (09-21), not
history. The pulse and stop.js are a red on D only, so a per-machine declaration would quiet D's -Check without touching L
[ours]. That changes what -Check reports, so it is the keeper's call, as the 09-21 `LiveOn` was (`install.ps1:243-253`).

### What I could not check

- L's disk, settings, ledgers and running app; the full -Check output of any L run (not on disk).
- The first reader's 3 to 4 ms walk and 11.3 ms bundle compare (not re-timed); the 118 B failure line.
- `sessionstart-body.test.js` beyond its presence in the diff; no test was run.
- Whether `$HOME` follows `USERPROFILE` inside `powershell.exe` here: not probed.
- `loop/keeper_rulings_owed_2026-09-19.md`, `loop/absent_hooks_ruling_2026-08-25.md` and the ledger rows' primaries.
- `adversary_R02.md` past line 45, and the second reader's notes on `00_build_paths.md` beyond sections 10 and 13.
- A risk on my side: I wrote `check1.txt` and `check2.txt` into the shared scratchpad. If another reader had files of those
  names there, I overwrote them.

#!/usr/bin/env bash
# gen3.sh: D273 lap 3 item 4 evidence. Generate a consumer tree from the C worktree, then run the gen-brief gate inside it, old and new.
set -u
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
W=C:/Users/nname/Desktop/worktrees/c-consumer-fork3-wt
OUT=$S/cons/gen3
rm -rf "$OUT"; mkdir -p "$OUT"
cd "$W" && node -e "const r=require('./consonance/tools/gen-consumer.js').build(process.argv[1],{allowDirty:true});console.log('build refused:',r.refused||'no','staged',r.staged,'forked',r.forked,'leaks',r.leaks.length)" "$OUT"
echo "--- shipped? gen-brief.ps1:"; ls "$OUT/consonance/src-tauri/gen-brief.ps1" 2>&1 | head -1
echo "--- CONSUMER-STATUS.md present:"; ls "$OUT/CONSUMER-STATUS.md"
echo "--- markers in the generated briefs:"; for f in exo_memory/BOOT.md consonance/src-tauri/brief/BOOT.md exo_memory/SEED.md consonance/src-tauri/brief/SEED.md; do echo "$f $(grep -c 'Where this line forks' "$OUT/$f") $(grep -c 'end of the fork note' "$OUT/$f")"; done
echo "--- OLD gate test (ab25d588) inside the generated tree:"
git -C "$W" show ab25d588:consonance/tools/gen-brief-gate.test.js > "$OUT/consonance/tools/gen-brief-gate.OLD.test.js"
cd "$OUT" && node --test --test-concurrency=1 consonance/tools/gen-brief-gate.OLD.test.js 2>&1 | grep -E "ℹ (tests|pass|fail|skipped)|REFUSED|does not exist|cannot find|not recognized|-File" | head -8
rm -f "$OUT/consonance/tools/gen-brief-gate.OLD.test.js"
echo "--- NEW gate test inside the generated tree:"
cd "$OUT" && node --test --test-concurrency=1 consonance/tools/gen-brief-gate.test.js 2>&1 | grep -E "ℹ (tests|pass|fail|skipped)|✖ [a-zA-Z]|Assertion" | head -8
echo "--- my two test files inside the generated tree (expected to break: they are dev-side generator tests, owed to EXCLUDE):"
cd "$OUT" && for t in consonance/tools/consumer-relabel.test.js consonance/tools/consumer-fork-wiring.test.js; do ls "$t" >/dev/null 2>&1 && { echo "$t ships:"; node --test --test-concurrency=1 "$t" 2>&1 | grep -E "ℹ (pass|fail)|Cannot find module|RelabelError" | head -3; } || echo "$t does not ship"; done

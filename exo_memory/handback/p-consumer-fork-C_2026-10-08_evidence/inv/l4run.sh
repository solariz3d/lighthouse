#!/usr/bin/env bash
# l4run.sh: D273 lap 4 (C) verification. Tests, then identity-diff without and with B's three EXCLUDE rows (temporary, restored).
set -u
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
W=C:/Users/nname/Desktop/worktrees/c-lap4-wt
cd "$W"
echo "=== TESTS"
node --test --test-concurrency=1 consonance/tools/consumer-relabel.test.js consonance/tools/consumer-fork-wiring.test.js consonance/tools/identity-diff.test.js consonance/tools/gen-consumer.test.js consonance/tools/gen-brief-gate.test.js 2>&1 | grep -E "ℹ (tests|pass|fail|skipped)|✖ [a-zA-Z]|AssertionError|RelabelError" | head -30
echo "=== IDENTITY-DIFF, as committed (B's rows not applied)"
node consonance/tools/identity-diff.js --generate > "$S/inv/l4id-a.txt" 2>&1; echo "exit $?"
grep -vE "^    exo_memory/(cards|memory)/" "$S/inv/l4id-a.txt" | head -16
echo "=== IDENTITY-DIFF, with B's three lap-4 EXCLUDE rows applied TEMPORARILY"
node "$S/inv/excl-rows.js" "$W"
OUT=$S/cons/l4b; rm -rf "$OUT"; mkdir -p "$OUT"
node -e "const r=require('./consonance/tools/gen-consumer.js').build(process.argv[1],{allowDirty:true});console.log('build refused:',r.refused||'no','staged',r.staged,'forked',r.forked,'leaks',r.leaks.length)" "$OUT"
node consonance/tools/identity-diff.js --gen "$OUT" > "$S/inv/l4id-b.txt" 2>&1; echo "exit $?"
grep -vE "^    exo_memory/(cards|memory)/" "$S/inv/l4id-b.txt" | head -16
echo "--- generated memory/ and the dont-offer card:"; ls "$OUT/exo_memory/memory/"; ls "$OUT/exo_memory/cards/dont-offer-rest-assume-momentum.md" 2>&1 | tail -1
echo "--- generated MEMORY.md:"; cat "$OUT/exo_memory/memory/MEMORY.md" | head -12
git checkout -- consonance/tools/gen-consumer.js; echo "restored; gen-consumer.js diff lines: $(git diff -- consonance/tools/gen-consumer.js | wc -l)"

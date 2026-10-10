#!/usr/bin/env bash
# l5run.sh: D273 lap 5 (C) verification: tests; identity-diff; portable-paths inside a generated tree, base (stash-free: a19c876d worktree) vs mine.
set -u
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad
W=C:/Users/nname/Desktop/worktrees/c-lap5-wt
cd "$W"
echo "=== TESTS"
node --test --test-concurrency=1 consonance/tools/consumer-relabel.test.js consonance/tools/consumer-fork-wiring.test.js consonance/tools/identity-diff.test.js 2>&1 | grep -E "ℹ (tests|pass|fail|skipped)|✖ [a-zA-Z]|AssertionError|RelabelError" | head -12
echo "=== IDENTITY-DIFF (fresh generation)"
OUT=$S/cons/l5; rm -rf "$OUT"; mkdir -p "$OUT"
node -e "const r=require('./consonance/tools/gen-consumer.js').build(process.argv[1],{allowDirty:true});console.log('build refused:',r.refused||'no','staged',r.staged,'forked',r.forked,'leaks',r.leaks.length)" "$OUT"
node consonance/tools/identity-diff.js --gen "$OUT" > "$S/inv/l5-id.txt" 2>&1; echo "identity-diff exit $?"
grep -vE "^    exo_memory/(cards|memory)/" "$S/inv/l5-id.txt" | head -14
echo "=== portable-paths.test.js inside the generated tree (mine)"
( cd "$OUT" && node --test --test-concurrency=1 consonance/tools/portable-paths.test.js 2>&1 | grep -E "ℹ (tests|pass|fail)|✖ [a-zA-Z]" | head -8 )
echo "=== the same inside a generated tree of the BASE a19c876d"
B=C:/Users/nname/Desktop/worktrees/c-lap5-base-wt
git -C C:/Users/nname/Desktop/lighthouse worktree add -q --detach "$B" a19c876d 2>/dev/null
OB=$S/cons/l5base; rm -rf "$OB"; mkdir -p "$OB"
( cd "$B" && node -e "const r=require('./consonance/tools/gen-consumer.js').build(process.argv[1],{allowDirty:true});console.log('base build refused:',r.refused||'no')" "$OB" )
( cd "$OB" && node --test --test-concurrency=1 consonance/tools/portable-paths.test.js 2>&1 | grep -E "ℹ (tests|pass|fail)|✖ [a-zA-Z]" | head -8 )
git -C C:/Users/nname/Desktop/lighthouse worktree remove --force "$B"

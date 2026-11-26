#!/bin/sh
# panelmut.sh <worktree at eee621f>: the panel and shell end-argument mutants against the three test files that reach spanHolds through them, compared by failing-test NAME
# with the unmutated run (core-extra-bank-drag-cost has failures that predate O1); restored by git checkout
cd "$1" || exit 2; P="test/core_extra_change.test.js test/core_additive.test.js app/test/core-extra-bank-drag-cost.test.js"
names(){ node --test $P 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -E "^ *✖ " | grep -v "failing tests" | sed 's/ ([0-9.]*ms)//' | sort -u; }
echo "unmutated:"; names > /tmp/pm_base.txt; cat /tmp/pm_base.txt | cut -c1-110
for m in "N15|app/core/panel.js|spanOf(k), arr[k].from + spanOf(k));|spanOf(k));" "N16|app/core/coreshell.js|EXT.spanHolds(ch, a, b, base, span, end)|EXT.spanHolds(ch, a, b, base, span)"; do
  n=$(echo "$m"|cut -d'|' -f1); F=$(echo "$m"|cut -d'|' -f2); a=$(echo "$m"|cut -d'|' -f3); b=$(echo "$m"|cut -d'|' -f4)
  node -e "const fs=require('fs');let s=fs.readFileSync('$F','utf8');const a=process.argv[1],b=process.argv[2];if(s.split(a).length!==2){console.log('$n NOT APPLIED');process.exit(1)}fs.writeFileSync('$F',s.replace(a,b));console.log('$n applied')" "$a" "$b" || continue
  names > /tmp/pm_mut.txt; git checkout -q -- "$F"; d=$(diff /tmp/pm_base.txt /tmp/pm_mut.txt); if [ -z "$d" ]; then echo "  SURVIVED (same failing names as unmutated)"; else echo "$d" | cut -c1-120 | sed 's/^/  /'; fi; done
git status --short

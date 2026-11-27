#!/bin/sh
# mutants5.sh <worktree at 0eb3448>: N12 (the memo forgets end) and mutants of the second repair's panel parts, each against the two row files
# (test/core_turn_share_built.test.js, app/test/core-second-change-panel.test.js), compared by failing-test name with the unmutated run; restored by git checkout
cd "$1" || exit 2; T="test/core_turn_share_built.test.js app/test/core-second-change-panel.test.js"
names(){ node --test $T 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -E "^ *✖ " | grep -v "failing tests" | sed 's/ ([0-9.]*ms)//' | sort -u; }
names > /tmp/m5_base.txt; echo "unmutated failing: $(wc -l < /tmp/m5_base.txt)"
run(){ n="$1"; F="$2"; node -e "const fs=require('fs');let s=fs.readFileSync('$F','utf8');const a=process.argv[1],b=process.argv[2];if(s.split(a).length!==2){console.log('$n NOT APPLIED (anchor x'+(s.split(a).length-1)+')');process.exit(1)}fs.writeFileSync('$F',s.replace(a,b));console.log('$n applied')" "$3" "$4" || return
  names > /tmp/m5_mut.txt; git checkout -q -- "$F"; d=$(comm -13 /tmp/m5_base.txt /tmp/m5_mut.txt); if [ -z "$d" ]; then echo "  SURVIVED"; else echo "$d" | cut -c1-100 | sed 's/^/  caught by: /'; fi; }
X=src/core/extend.js; P=app/core/panel.js; S=app/core/coreshell.js
run N12-routePeak-memo-forgets-end $X "[L2, end, ch === 'kh' ? -3 : -4]" "[L2, ch === 'kh' ? -3 : -4]"
run N11-routeMin-memo-forgets-end $X "[-5, end, ch === 'kh' ? -3 : -4]" "[-5, ch === 'kh' ? -3 : -4]"
run N15-panel-fit-check-forgets-end $P "spanOf(k), arr[k].from + spanOf(k));" "spanOf(k));"
run N16-shell-spanHolds-forgets-end $S "EXT.spanHolds(ch, a, b, base, span, end)" "EXT.spanHolds(ch, a, b, base, span)"
run N17-firstHold-walk-capped-at-10 $P "for (let i = 0; i < 80 && !ok(p); i++)" "for (let i = 0; i < 10 && !ok(p); i++)"
run N18-firstHold-walk-steps-20 $P "for (let i = 0; i < 80 && !ok(p); i++) p = up2(p + 5);" "for (let i = 0; i < 80 && !ok(p); i++) p = up2(p + 20);"
run N19-chain-ignores-a-typed-next-mark $P "list[j + 1].from !== null ? list[j + 1].from : E(j + 1)" "false ? list[j + 1].from : E(j + 1)"
run N20-room-uses-piece-end-shortest $P "for (let j = k; j < n; j++) rest += m(j, E(j));" "for (let j = k; j < n; j++) rest += m(j);"
run N21-drag-range-hi-at-piece-end $P "memo[k] = minAt(k, arr[k].from + spanOf(k))" "memo[k] = minAt(k, L)"
run N22-early-return-dropped $P "if (!(L > 0) || list.every((x) => x.from !== null)) return" "if (!(L > 0)) return"
git status --short

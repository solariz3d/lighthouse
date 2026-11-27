#!/bin/sh
# mutants4.sh <worktree at eee621f>: my N1-N9 with their anchors at the repair, plus mutants of the repair's own parts; each run against test/core_turn_share_built.test.js
# (the panel and shell ones against the four test files that call spanHolds too); restored by git checkout
cd "$1" || exit 2
run(){ name="$1"; F="$2"; tests="$3"; node -e "
const fs=require('fs');let s=fs.readFileSync('$F','utf8');const a=process.argv[1],b=process.argv[2];const n=s.split(a).length-1;if(n!==1){console.log('$name NOT APPLIED (anchor x'+n+')');process.exit(1)}fs.writeFileSync('$F',s.replace(a,b));console.log('$name applied')" "$4" "$5" || return
  out=$(node --test $tests 2>&1 | sed 's/\x1b\[[0-9;]*m//g'); echo "$out" | grep -E "^✖ " | grep -v "failing tests" | sort -u | cut -c1-70 | sed 's/^/  caught by: /'; echo "$out" | grep -qE "^✖ " || echo "  SURVIVED"; git checkout -q -- "$F"; }
X=src/core/extend.js; R=test/core_turn_share_built.test.js
run N1-window-starts-at-the-mark $X $R "for (let s = HOLD + F - 20; s <= HOLD + end + 20;" "for (let s = HOLD + F; s <= HOLD + end + 20;"
run N2-window-ends-at-the-change-end $X $R "s <= HOLD + end + 20; s += 0.5) m" "s <= HOLD + end; s += 0.5) m"
run N3-no-step-back-by-the-metre $X $R "if (L2 < cap) while (L2 - 1 >= floor && ok(L2 - 1)) L2 -= 1;" ";"
run N4-turn-and-climb-share-a-memo $X $R "[L2, end, ch === 'kh' ? -3 : -4]" "[L2, end, -3]"
run N5-probe-base-not-keyed-by-field $X $R "const key = [ch, step, L, HOLD].join('|');" "const key = [step, L, HOLD].join('|');"
run N6-no-ceiling-short-circuit $X $R "return span >= ceil - 1e-9 || (span >= Math.max(SECOND_FLOOR_M, own) - 1e-9 && routePeak" "return (span >= Math.max(SECOND_FLOOR_M, own) - 1e-9 && routePeak"
run N7-search-cap-without-the-floor $X $R "routeMin(ch, a, b, base, own, Math.max(SECOND_FLOOR_M, m), end)" "routeMin(ch, a, b, base, own, m, end)"
run N8-search-steps-up-by-50 $X $R "L2 = Math.min(cap, L2 + PROBE_STEP_M);" "L2 = Math.min(cap, L2 + 50);"
run N9-spanHolds-bar-1.3 $X $R "routePeak(ch, b - a, base, span, end) <= PROBE_BAR);" "routePeak(ch, b - a, base, span, end) <= 1.3);"
run N10-routeMin-bar-1.3 $X $R "routePeak(ch, b - a, base, L2, end) <= PROBE_BAR;" "routePeak(ch, b - a, base, L2, end) <= 1.3;"
run N11-routeMin-memo-forgets-end $X $R "[-5, end, ch === 'kh' ? -3 : -4]" "[-5, ch === 'kh' ? -3 : -4]"
run N12-routePeak-memo-forgets-end $X $R "[L2, end, ch === 'kh' ? -3 : -4]" "[L2, ch === 'kh' ? -3 : -4]"
run N13-change-runs-on-past-its-end $X $R "(x < end ? f(x - F) : dG)" "f(x - F)"
run N14-refusal-loop-forgets-end $X $R "while (S > minM && !spanHolds(ch, prev, T, base, S, end)) S--;" "while (S > minM && !spanHolds(ch, prev, T, base, S)) S--;"
P="test/core_extra_change.test.js test/core_additive.test.js app/test/core-extra-bank-drag-cost.test.js"
run N15-panel-forgets-end app/core/panel.js "$P" "spanOf(k), arr[k].from + spanOf(k));" "spanOf(k));"
run N16-shell-forgets-end app/core/coreshell.js "$P" "EXT.spanHolds(ch, a, b, base, span, end)" "EXT.spanHolds(ch, a, b, base, span)"
git status --short

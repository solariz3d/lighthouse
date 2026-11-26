#!/bin/sh
# mutants3.sh <worktree at bfa6732>: one-line mutants of O1 parts the six O1 mutants do not touch; each run against test/core_turn_share_built.test.js, restored by git checkout
cd "$1" || exit 2; F=src/core/extend.js
run(){ name="$1"; node -e "
const fs=require('fs');let s=fs.readFileSync('$F','utf8');const a=process.argv[1],b=process.argv[2];const n=s.split(a).length-1;if(n!==1){console.log('$name NOT APPLIED (anchor x'+n+')');process.exit(0)}fs.writeFileSync('$F',s.replace(a,b));console.log('$name applied')" "$2" "$3"
  out=$(node --test test/core_turn_share_built.test.js 2>&1 | sed 's/\x1b\[[0-9;]*m//g'); echo "$out" | grep -E "^✖ " | grep -v "failing tests" | sort -u | cut -c1-70 | sed 's/^/  caught by: /'; echo "$out" | grep -qE "^✖ " || echo "  SURVIVED"; git checkout -q -- $F; }
run N1-window-starts-at-the-mark "for (let s = HOLD + F - 20; s <= HOLD + L + 20; s += 0.5) m = Math.max(m, Math.abs(r(s + 0.5)" "for (let s = HOLD + F; s <= HOLD + L + 20; s += 0.5) m = Math.max(m, Math.abs(r(s + 0.5)"
run N2-window-ends-at-the-piece-end "s <= HOLD + L + 20; s += 0.5) m = Math.max(m, Math.abs(r(s + 0.5)" "s <= HOLD + L; s += 0.5) m = Math.max(m, Math.abs(r(s + 0.5)"
run N3-no-step-back-by-the-metre "if (L2 < cap) while (L2 - 1 >= floor && ok(L2 - 1)) L2 -= 1;" ";"
run N4-turn-and-climb-share-a-memo "[L2, ch === 'kh' ? -3 : -4]" "[L2, -3]"
run N5-probe-base-not-keyed-by-field "const key = [ch, step, L, HOLD].join('|');" "const key = [step, L, HOLD].join('|');"
run N6-no-ceiling-short-circuit "return span >= ceil - 1e-9 || (span >= Math.max(SECOND_FLOOR_M, own) - 1e-9 && routePeak" "return (span >= Math.max(SECOND_FLOOR_M, own) - 1e-9 && routePeak"
run N7-search-cap-without-the-floor "routeMin(ch, a, b, base, own, Math.max(SECOND_FLOOR_M, m))" "routeMin(ch, a, b, base, own, m)"
run N8-search-steps-up-by-50 "L2 = Math.min(cap, L2 + PROBE_STEP_M);" "L2 = Math.min(cap, L2 + 50);"
run N9-probe-bar-1.3 "routePeak(ch, b - a, base, span) <= PROBE_BAR);" "routePeak(ch, b - a, base, span) <= 1.3);"
git status --short

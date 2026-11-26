#!/bin/sh
# mutants2.sh <worktree at a8e54b7>: the first read's six mutants (M5 rewritten for the new loop) plus two that undo the repair; each restored by git checkout
cd "$1" || exit 2; F=tools/piecewise.cjs
run(){ name="$1"; node -e "
const fs=require('fs');let s=fs.readFileSync('$F','utf8');const a=process.argv[1],b=process.argv[2];const n=s.split(a).length-1;if(n!==1){console.log('$name NOT APPLIED (anchor x'+n+')');process.exit(0)}fs.writeFileSync('$F',s.replace(a,b));console.log('$name applied')" "$2" "$3"
  node --test test/piecewise.test.js 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -E "^✖ " | grep -v "failing tests" | sort -u | cut -c1-110 | sed 's/^/  caught by: /'; git checkout -q -- $F; }
run M1-above-unbounded "above = 2.5," "above = 99,"
run M2-guard-no-break "distM: +on.g.toFixed(1) }); break; }" "distM: +on.g.toFixed(1) }); }"
run M3-reread-threshold "cs.width < 0.5 * x.width" "cs.width < 0.05 * x.width"
run M4-guard-radius-0 "if (g < drivenM && (!on" "if (g < 0 && (!on"
run M5b-band-no-stepcap "if (!next || next.d > stepMax) { h /= 2; continue; }" "if (!next) { h /= 2; continue; }"
run M6-take-band-always "if (b && (!cs || b.width > cs.width))" "if (b)"
run M7-window-fixed-at-station "layers(sgn * (u + h), prev.p)" "layers(sgn * (u + h), c)"
run M8-no-step-refinement "if (!next || next.d > stepMax) { h /= 2; continue; }" "if (!next || next.d > stepMax) break;"
git status --short

#!/bin/sh
# mutsweep.sh <worktree at eee621f>: each surviving mutant run under sweep.js's 184 cases (one process, so memo collisions can show), compared by cmp67.js; restored by git checkout
T="$1"; X=src/core/extend.js; C=G:/consonance-scratch/c-o1
one(){ name="$1"; (cd "$T" && node -e "
const fs=require('fs');let s=fs.readFileSync('$X','utf8');const a=process.argv[1],b=process.argv[2];const n=s.split(a).length-1;if(n!==1){console.log('$name NOT APPLIED');process.exit(1)}fs.writeFileSync('$X',s.replace(a,b))" "$2" "$3") || return
  node $C/sweep.js "$T" > $C/rr/ms_$name.jsonl 2>&1; echo "$name:"; node $C/cmp67.js $C/rr/ms_$name.jsonl | sed 's/^/  /'; (cd "$T" && git checkout -q -- $X); }
one N11-routeMin-memo-forgets-end "[-5, end, ch === 'kh' ? -3 : -4]" "[-5, ch === 'kh' ? -3 : -4]"
one N12-routePeak-memo-forgets-end "[L2, end, ch === 'kh' ? -3 : -4]" "[L2, ch === 'kh' ? -3 : -4]"
one N13-change-runs-on-past-its-end "(x < end ? f(x - F) : dG)" "f(x - F)"
one N14-refusal-loop-forgets-end "while (S > minM && !spanHolds(ch, prev, T, base, S, end)) S--;" "while (S > minM && !spanHolds(ch, prev, T, base, S)) S--;"
(cd "$T" && git status --short)

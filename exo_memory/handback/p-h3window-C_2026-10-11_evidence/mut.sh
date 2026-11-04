set -u
W=G:/worktrees/c-d303-wt/exo_memory/loop/claimrec; C=G:/consonance-scratch/c-d303/claimrec
rm -rf G:/consonance-scratch/c-d303; mkdir -p G:/consonance-scratch/c-d303; cp -r $W $C
orig=$(cat $C/draw.js)
run() { # name, from, to
  node -e "const fs=require('fs');const f='$C/draw.js';const s=fs.readFileSync(f,'utf8');const a=process.argv[1],b=process.argv[2];const n=s.split(a).length-1;if(n!==1){console.log('NOT APPLIED');process.exit(3)}fs.writeFileSync(f,s.replace(a,()=>b))" "$2" "$3" || { echo "$1: NOT APPLIED"; return; }
  r=$(cd $C && node --test --test-reporter=tap draw.test.js 2>&1 | grep -E '^not ok' | sed 's/ - .*//' | tr '\n' ' ')
  echo "$1: ${r:-SURVIVED}"; printf '%s' "$orig" > $C/draw.js
}
r=$(cd $C && node --test --test-reporter=tap draw.test.js 2>&1 | grep -cE '^not ok'); echo "control: $r failing"
run "M1 h3 never closes (closes: null)" "expectExcluded: null, closes: '2026-10-18T00:34:07Z' }," "expectExcluded: null, closes: null },"
run "M2 the window ends a day early" "to: '2026-10-18T00:34:07Z'" "to: '2026-10-17T00:34:07Z'"
run "M3 the guard never refuses" "if (win.closes && nowMs" "if (false && nowMs"
rm -rf G:/consonance-scratch/c-d303

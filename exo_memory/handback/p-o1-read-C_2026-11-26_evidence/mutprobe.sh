#!/bin/sh
# mutprobe.sh: each surviving mutant of mutants3.sh, applied in the tip worktree, then probe.js's 245 cases; counts the cases whose result differs from the unmutated tip
W=G:/consonance-scratch/t180-o1-c; F=$W/src/core/extend.js; H=G:/consonance-scratch/c-o1
grep -E '^run N' $H/mutants3.sh | while IFS= read -r line; do
  name=$(echo "$line" | awk '{print $2}'); a=$(echo "$line" | sed -E 's/^run [^ ]+ "(.*)" "(.*)"$/\1/'); b=$(echo "$line" | sed -E 's/^run [^ ]+ "(.*)" "(.*)"$/\2/')
  node -e "const fs=require('fs');let s=fs.readFileSync('$F','utf8');const a=process.argv[1],b=process.argv[2];if(s.split(a).length!==2){console.log('NOT APPLIED');process.exit(1)}fs.writeFileSync('$F',s.replace(a,b))" "$a" "$b" || { echo "$name NOT APPLIED"; continue; }
  node $H/probe.js $W > $H/mut_$name.jsonl 2>&1
  (cd $W && git checkout -q -- src/core/extend.js)
  node -e "const fs=require('fs'),rd=f=>fs.readFileSync(f,'utf8').trim().split('\n'),T=rd('$H/tip.jsonl'),M=rd('$H/mut_$name.jsonl');let d=0,ex=null;T.forEach((t,i)=>{if(t!==M[i]){d++;if(!ex)ex=[JSON.parse(t),M[i].slice(0,300)]}});console.log('$name: cases differing',d,'of',T.length);if(ex)console.log('   e.g. tip',JSON.stringify({ch:ex[0].ch,first:ex[0].first,changes:ex[0].changes,laid:ex[0].laid,needM:ex[0].needM,peak:ex[0].peak}),'\n   mutant',ex[1])"
done
cd $W && git status --short

#!/bin/sh
# panelmutsweep.sh <worktree at 0eb3448>: each surviving changeFroms mutant run under panelsweep.js's 168 cases, compared case by case (marks and outcome) with the unmutated tip
T="$1"; P=app/core/panel.js; C=G:/consonance-scratch/c-o1
one(){ n="$1"; (cd "$T" && node -e "const fs=require('fs');let s=fs.readFileSync('$P','utf8');const a=process.argv[1],b=process.argv[2];if(s.split(a).length!==2){console.log('$n NOT APPLIED');process.exit(1)}fs.writeFileSync('$P',s.replace(a,b))" "$2" "$3") || return
  node $C/panelsweep.js "$T" > $C/rr2/pms_$n.jsonl 2>&1; (cd "$T" && git checkout -q -- $P)
  node -e "const fs=require('fs'),L=f=>fs.readFileSync(f,'utf8').trim().split('\n').filter(x=>x.startsWith('{')).map(JSON.parse),k=x=>[x.kind,x.first,x.L,x.ts.join(','),x.typed].join('|');
  const a=new Map(L('$C/rr2/panelsweep_t180-o1-c.jsonl').map(x=>[k(x),x])),m=L('$C/rr2/pms_$n.jsonl');let moved=0,lost=0,over=0;for(const x of m){const y=a.get(k(x));if(JSON.stringify(x.marks)!==JSON.stringify(y.marks))moved++;if(y.res==='laid'&&x.res!=='laid')lost++;if(x.p!=null&&x.p>1.05)over++}
  console.log('$n: of',m.length,'cases, marks moved',moved,'; laid at the tip and not under the mutant',lost,'; over 1.05',over)"; }
one N18-firstHold-walk-steps-20 "for (let i = 0; i < 80 && !ok(p); i++) p = up2(p + 5);" "for (let i = 0; i < 80 && !ok(p); i++) p = up2(p + 20);"
one N20-room-uses-piece-end-shortest "for (let j = k; j < n; j++) rest += m(j, E(j));" "for (let j = k; j < n; j++) rest += m(j);"
one N22-early-return-dropped "if (!(L > 0) || list.every((x) => x.from !== null)) return" "if (!(L > 0)) return"
(cd "$T" && git status --short)

#!/bin/sh
# run271c.sh (pane B, L271): the touched rows again after row 25's amendment; row 25 red-first under the base's line; then page271c.js. Under heavy-run, BelowNormal.
B=<downloads>/t180-b-l271; Q=<scratch>/l271
cd $B && node $Q/light.js $Q/tier2-branch.tap . app/test/zonegrab.test.js app/test/core-pieces-ui.test.js app/test/handles.test.js app/test/sculpt-frame.test.js; echo "tier2 exit $?"
node -e "
const fs=require('fs'),cp=require('child_process'),F='app/core/zonegrab.js',o=fs.readFileSync(F),t=o.toString();
const a='const v1 = [v0[0] + e * cx * cx, v0[1] + e * cx * cy + v], short =';
if(t.split(a).length!==2){console.log('row25 base mutant NOT APPLIED');process.exit(0);}
try{fs.writeFileSync(F,t.replace(a,'const v1 = [v0[0] + e, v0[1] + v], short ='));
const r=cp.spawnSync(process.execPath,['--test','--test-reporter=tap','--test-name-pattern=row 25 ','app/test/core-pieces-ui.test.js'],{encoding:'utf8'});
console.log('row 25 under the base line:', (r.stdout.match(/^# (pass|fail) \d+/gm)||[]).join(' '), (r.stdout.match(/error: '[^']*'/)||[''])[0]);}
finally{fs.writeFileSync(F,o);console.log('restored', Buffer.compare(fs.readFileSync(F),o)===0);}"
node $Q/page271c.js $B c522ea6 $Q/shotsc; echo "page exit $?"

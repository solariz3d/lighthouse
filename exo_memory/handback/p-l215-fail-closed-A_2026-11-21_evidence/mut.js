const fs=require('fs'),{spawnSync}=require('child_process');
const F='dev/shell/install.ps1',T='dev/shell/install-failclosed.test.js';
const M=[
 ["-and $evp.Name -eq 'PreToolUse' ",""],
 ["if ($GatesOpen -and $has) {","if ($GatesOpen -and $has -and $false) {"],
 ["ForEach-Object { $_ -split ',' }","ForEach-Object { $_ }"],
 ["if (-not $managedLeaf.ContainsKey($lf)) { continue }",""],
 ["if (-not $h.timeout) { $h | Add-Member -NotePropertyName timeout -NotePropertyValue 10 -Force }",""],
 ["if (($FailClosed -or $GatesOpen) -and ($Check -or $NoRegister)) {","if ($false) {"],
 ["-NotePropertyName onFailure -NotePropertyValue 'block' -Force","-NotePropertyName onFailure -NotePropertyValue 'warn' -Force"],
];
let c=0,a=0;for(const[x,y]of M){const o=fs.readFileSync(F,'utf8');if(o.split(x).length!==2){console.log('NOT APPLIED',x.slice(0,50));continue}a++;try{fs.writeFileSync(F,o.replace(x,()=>y));const r=spawnSync(process.execPath,['--test',T],{encoding:'utf8',timeout:600000});const red=r.status!==0;c+=red?1:0;console.log(red?'caught  ':'SURVIVED',x.slice(0,60))}finally{fs.writeFileSync(F,o)}}
console.log(`applied ${a} / caught ${c} / NOT APPLIED ${M.length-a}`);

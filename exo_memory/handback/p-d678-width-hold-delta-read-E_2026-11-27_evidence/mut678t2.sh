#!/bin/bash
# mut678t2.sh (pane E, D678 Track 2): R3, the three things B's tier found, with each mutant shown red before a pass counts. Runs in my scratch worktree wt-mut
# (detached at 1074d5d), each mutant applied as its harness applies it (CRLF read as LF, the anchor counted, exactly once), then the file restored from git.
# usage: bash mut678t2.sh
set -u
cd "$(dirname "$0")"
W=G:/consonance-scratch/e-d678/wt-mut; WT=G:/consonance-scratch/e-d678/wt-tip; WB=G:/consonance-scratch/e-d678/wt-before; WA=G:/consonance-scratch/e-d678/wt-after
RF="core_mirror_refusal.test.js core_extra_change.test.js core_ramp.test.js core_joint_c2.test.js core_fit_banded.test.js core_bankswing.test.js core_extend_at_start.test.js core_bank_swell.test.js core_bank_ramp.test.js core_at_start_f.test.js core_width_at_start_f.test.js core_changes.test.js core_additive.test.js"
t() { echo "## $(date -u +%H:%M:%SZ) $*"; }
apply() { node -e "const fs=require('fs');const f=process.argv[1];let s=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');const a=process.argv[2],n=s.split(a).length-1;console.log('anchor count',n);if(n!==1)process.exit(3);fs.writeFileSync(f,s.replace(a,()=>process.argv[3]));" "$@"; }
sumtap() { grep -E "^# (tests|pass|fail|skipped|todo) " "$1" | tr '\n' ' '; echo; grep -E "^not ok" "$1" | head -8; }
ramp() { (cd $W/test && node --test --test-reporter=tap --test-name-pattern "row (2|3|11):" $RF) > "$1" 2>&1; sumtap "$1"; }
t EX12 control, unmutated; ramp ex12_control.tap
t EX12 mutant; apply $W/src/core/turnby.js "doc: extend(doc, { ...o, bankCheck: false, widthHold: 'later' })" "doc: extend(doc, { ...o, widthHold: 'later' })" && ramp ex12_mutant.tap; git -C $W checkout -q -- src/core/turnby.js
t D9 control, unmutated; node --test --test-reporter=tap $W/app/test/core-width-hold.test.js > d9_control.tap 2>&1; sumtap d9_control.tap
t D9 mutant; apply $W/src/core/turnby.js "extendBy(doc, opts, aims, true), P0" "({ doc: extendBy(doc, opts, aims), hold: null }), P0" && { node --test --test-reporter=tap $W/app/test/core-width-hold.test.js > d9_mutant.tap 2>&1; sumtap d9_mutant.tap; grep -B2 -A12 "^not ok" d9_mutant.tap | grep -E "not ok|corner list|from 10|from 50|ends|kh is" | head -12; }; git -C $W checkout -q -- src/core/turnby.js
t drag-ghost on the tip; node --test --test-reporter=tap $WT/app/test/drag-ghost.test.js > dragghost_tip.tap 2>&1; sumtap dragghost_tip.tap
t dg5e678 e112a14 c2591bf tip; node dg5e678.js $WB $WA $WT > dg5e678.txt 2>&1; echo "exit $?"; cat dg5e678.txt
t restored: $(git -C $W status --short | wc -l) changed files in wt-mut

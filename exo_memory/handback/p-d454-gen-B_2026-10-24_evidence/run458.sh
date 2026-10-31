#!/bin/sh
# run457.sh (D454, B): cargo on gen6 (4e1bf638) and on the d454-b source, then the intake mutants in a scratch clone of gen5. Under lowio.ps1.
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925/scratchpad/d454; LOW="powershell -NoProfile -ExecutionPolicy Bypass -File $S/lowio.ps1"; CARGO=C:/Users/nname/.cargo/bin/cargo.exe
echo "gen-cargo start $(date -u +%H:%M:%SZ)"; (cd $S/gen6/consonance/src-tauri && CARGO_TARGET_DIR=G:/consonance-scratch/d454-gen-target $LOW $CARGO test --no-fail-fast > $S/gen-cargo6.out 2>&1); echo "gen-cargo end $(date -u +%H:%M:%SZ) rc $?"
echo "src-cargo start $(date -u +%H:%M:%SZ)"; (cd C:/Users/nname/Desktop/worktrees/lh-d454-b/consonance/src-tauri && CARGO_TARGET_DIR=G:/consonance-scratch/d454-src-target $LOW $CARGO test --no-fail-fast > $S/src-cargo6.out 2>&1); echo "src-cargo end $(date -u +%H:%M:%SZ) rc $?"
echo "mutmain start $(date -u +%H:%M:%SZ)"; MUT_ONLY=R1,R2,R3,F1,F2 $LOW node $S/mutfloor.js G:/consonance-scratch/d454s5/mut G:/consonance-scratch/d454-gen-target > $S/mutfloor-after.out 2>&1; echo "mutmain end $(date -u +%H:%M:%SZ) rc $?"

#!/bin/sh
# run457.sh (D454, B): cargo on gen5 (c97ce883) and on the d454-b source, then the intake mutants in a scratch clone of gen5. Under lowio.ps1.
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925/scratchpad/d454; LOW="powershell -NoProfile -ExecutionPolicy Bypass -File $S/lowio.ps1"; CARGO=C:/Users/nname/.cargo/bin/cargo.exe
echo "gen-cargo start $(date -u +%H:%M:%SZ)"; (cd $S/gen5/consonance/src-tauri && CARGO_TARGET_DIR=G:/consonance-scratch/d454-gen-target $LOW $CARGO test --no-fail-fast > $S/gen-cargo5.out 2>&1); echo "gen-cargo end $(date -u +%H:%M:%SZ) rc $?"
echo "src-cargo start $(date -u +%H:%M:%SZ)"; (cd C:/Users/nname/Desktop/worktrees/lh-d454-b/consonance/src-tauri && CARGO_TARGET_DIR=G:/consonance-scratch/d454-src-target $LOW $CARGO test --no-fail-fast > $S/src-cargo5.out 2>&1); echo "src-cargo end $(date -u +%H:%M:%SZ) rc $?"
echo "mutmain start $(date -u +%H:%M:%SZ)"; $LOW node $S/mutmain.js G:/consonance-scratch/d454s3/mut G:/consonance-scratch/d454-gen-target > $S/mutmain.out 2>&1; echo "mutmain end $(date -u +%H:%M:%SZ) rc $?"

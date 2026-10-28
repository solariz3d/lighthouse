#!/bin/sh
# build505.sh (O, D505): the 0.4.26 release build from a clean detached tree, BelowNormal, under the heavy-run lock (A's D499 route).
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/d505"
cd C:/Users/nname/Downloads/t180-wt-o505-rel || exit 9
export PATH="/c/Users/nname/.cargo/bin:$PATH" CONSONANCE_HEAVY_WAIT_MS=14400000
echo "head $(git rev-parse --short HEAD) changed=[$(git status --short | wc -l)] $(date -u +%H:%M:%SZ)"
node "$O/belownormal.js" node C:/Users/nname/Downloads/t180-d421-e/gate.js "O D505 0.4.26 release build" sh -c "cd src-tauri && cargo check && cd .. && node src-tauri/release.cjs"; rc=$?
echo "release.cjs exit $rc $(date -u +%H:%M:%SZ)"
ls -la src-tauri/target/release/t180-track-builder.exe src-tauri/target/release/bundle/nsis/*.exe
sha256sum src-tauri/target/release/t180-track-builder.exe src-tauri/target/release/bundle/nsis/*.exe
echo "after: changed=[$(git status --short | wc -l)]"; git status --short
git diff --ignore-cr-at-eol --stat; git checkout -- src-tauri/Cargo.toml 2>/dev/null; echo "restored: changed=[$(git status --short | wc -l)]"

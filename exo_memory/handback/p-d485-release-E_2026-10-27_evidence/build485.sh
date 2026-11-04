#!/bin/sh
# build483.sh (E, D485; from A's build470.sh): the release build of 82afc11 (rel-0.4.23) from the clean detached tree t180-wt-e485-rel, via
# docs/RELEASE.md (release.cjs runs cargo tauri build --ci, then scans for private paths), after a cargo check. BelowNormal, one heavy-run slot via gate.js.
export PATH=/c/Users/nname/.cargo/bin:$PATH CONSONANCE_HEAVY_WAIT_MS=14400000
O="C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/d485"
cd C:/Users/nname/Downloads/t180-wt-e485-rel || exit 9
echo "head $(git rev-parse --short HEAD) changed=[$(git status --short | wc -l)] $(date -u +%H:%M:%SZ)"
node "$O/belownormal.js" node C:/Users/nname/Downloads/t180-d421-e/gate.js "E D485 t180 0.4.23 release build of 82afc11 (BelowNormal)" sh -c 'cd src-tauri && cargo check && cd .. && node src-tauri/release.cjs'; rc=$?
echo "build exit $rc $(date -u +%H:%M:%SZ)"
echo "after build: changed=[$(git status --short | wc -l)]"; git status --short
exit $rc

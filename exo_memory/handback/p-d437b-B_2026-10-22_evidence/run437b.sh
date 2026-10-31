#!/bin/sh
# run437.sh: D437b checks (B). (1) the tests over every touched file (app/export, app/core/coreshell.js, app/install, src/export/fromwords.js, the new files),
# TAP, under one heavy slot; (2) every mutation harness covering those files, whole, each under its own slot. Every step first waits while any lock names a
# timing session (timing / sculpt-frame / ABAB), per lighthouse 7a1cf49b.
O="C:/Users/nname/Downloads/t180-d437b"; L="C:/Users/nname/Downloads/t180-d413/lockrun.js"; WT="C:/Users/nname/Downloads/t180-wt-b437"
cd "$WT" || exit 9
export CONSONANCE_HEAVY_WAIT_MS=14400000
stamp() { date -u +%H:%M:%SZ; }
timing() { cat /c/Consonance/data/heavy-run.lock /c/Consonance/data/heavy-run.2.lock 2>/dev/null | grep -qiE 'timing|sculpt-frame|ABAB'; }
gate() { while timing; do sleep 15; done; }
APP="app/test/aclook.test.js app/test/core-close-preview.test.js app/test/core-eqonly.test.js app/test/core-pieces-ui.test.js app/test/core-pitlane.test.js app/test/core-shell.test.js app/test/core-spawndrag.test.js app/test/core-spawns.test.js app/test/core-textures.test.js app/test/export-author.test.js app/test/export-csp.test.js app/test/export-isolated-page.test.js app/test/export-isolated.test.js app/test/export-selfcheck.test.js app/test/export.test.js app/test/install-retire.test.js app/test/layoutsexport.test.js app/test/share-install.test.js app/test/sharedpath.test.js app/test/shell-dist.test.js app/test/menubar-page.test.js app/test/onboarding.test.js"
SRC="test/core_cup_export.test.js test/core_cup_readers.test.js test/core_jump.test.js test/core_piece.test.js test/doc-e2e.test.js test/export-author.test.js test/export-layouts-set.test.js test/export-layouts.test.js test/export-textures.test.js test/export_acready.test.js test/export_catch.test.js test/export_csp.test.js test/export_geometry.test.js test/export_grip.test.js test/export_merge.test.js test/export_pitboxes.test.js test/export_pitinfill.test.js test/export_pittexture.test.js test/export_test_unfinished.test.js test/export_tube_grid.test.js test/export_width.test.js test/export_words.test.js test/jumpwarn_refusals.test.js test/markers_export.test.js test/texture_flow.test.js test/underskin.test.js test/validate_xsec.test.js"
echo "head $(git rev-parse --short HEAD) dirty=[$(git status --short | wc -l)] $(stamp)"

for h in app/test/export-isolated-mutation.test.js app/test/core-mutation.test.js app/test/core-close-mutation.test.js; do
  gate; s=$(date +%s); b=$(basename "$h" .test.js)
  node "$L" "B D437b harness $b" node --test --test-reporter=tap "$h" > "$O/h2-$b.tap" 2>&1; rc=$?
  echo "harness $b exit $rc, $(( $(date +%s)-s )) s: $(grep -E '^# (tests|pass|fail|cancelled|skipped)' "$O/h2-$b.tap" | tr '\n' ' ') NOT_APPLIED $(grep -c 'NOT APPLIED' "$O/h2-$b.tap") NOT_CAUGHT $(grep -c 'NOT CAUGHT' "$O/h2-$b.tap") $(stamp)"
done
echo "after: dirty=[$(git status --short | wc -l)] $(stamp)"
echo done

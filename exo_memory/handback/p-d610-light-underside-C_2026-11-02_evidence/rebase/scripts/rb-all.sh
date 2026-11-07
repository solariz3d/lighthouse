#!/bin/sh
# the rebased D610's checks after the end-strip fix, one after another under one lock: the mutants, the touched tests, then the measurement batch
cd "$(dirname "$0")"
WT=C:/Users/nname/Desktop/worktrees/t180-c610
echo "== mutants"; node ../d456/belownormal.js node mutrun610.js > rb-mut.out 2>&1; grep -E "CAUGHT|NOT|EQUIV|applied" rb-mut.out
echo "== touched"; (cd $WT && node C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d456/belownormal.js node --test --test-reporter=tap test/lighthull.test.js test/tube_cases.test.js test/underskin.test.js test/core_cup_fixtures.test.js app/test/export-isolated.test.js app/test/export-isolated-page.test.js app/test/export-isolated-mutation.test.js test/underskin_mutation.test.js test/export_finalscene.test.js test/export_apron.test.js test/apron_mutation.test.js test/finalscene_mutation.test.js test/export_acready.test.js test/acready_mutation.test.js) > rb-touched2.tap 2>&1; grep -E "^# (tests|pass|fail)|^not ok" rb-touched2.tap
echo "== batch"; sh rb-batch.sh

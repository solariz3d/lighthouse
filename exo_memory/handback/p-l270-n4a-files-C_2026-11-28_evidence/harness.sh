#!/bin/bash
S=<scratch>
cd /c/Consonance/t180-wt-c-l270 || exit 9
date -u +%FT%TZ > $S/harness.start
node --max-old-space-size=8192 --test --test-concurrency=2 --test-reporter=tap test/core_landing_xsec_mutation.test.js test/core_ramp_mutation.test.js test/core_right_width_mutation.test.js test/core_turnby_mutation.test.js test/core_width_hold_mutation.test.js test/core_xsec_mutation.test.js app/test/export-isolated-mutation.test.js app/test/mutation.test.js > $S/harness.tap 2> $S/harness.err
echo "exit $?" > $S/harness.exit; date -u +%FT%TZ >> $S/harness.exit

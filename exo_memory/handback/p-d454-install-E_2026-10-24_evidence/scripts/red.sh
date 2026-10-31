#!/bin/bash
# red.sh (D454 part 3, pane E): only the APP RULE (D454) rows of the five touched test files
cd /c/Users/nname/Downloads/lh-wt-d454-e || exit 1
for f in consonance/hooks/sources-gate.test.js consonance/hooks/claim-check.test.js consonance/tools/heavy-run.test.js consonance/tools/state-block.test.js dev/shell/hooks/userprompt_pulse.test.js; do
  echo "=== $f"; node --test --test-name-pattern="APP RULE" "$f" 2>&1 | grep -E "^# (pass|fail)|^not ok|^ok|Error|AssertionError|expected|actual" | head -12
done

#!/bin/bash
# prove2.sh (D454 part 3, pane E): every touched test file whole, their downstream test files, portable-paths, front-door-links, own mutants
cd /c/Users/nname/Downloads/lh-wt-d454-e || exit 1
O=/c/Users/nname/Downloads/cons-d454-e/run2; mkdir -p $O
T="consonance/hooks/sources-gate.test.js consonance/hooks/claim-check.test.js consonance/tools/heavy-run.test.js consonance/tools/state-block.test.js
dev/shell/hooks/userprompt_pulse.test.js consonance/tools/lap-row.test.js consonance/tools/tell-index.test.js consonance/tools/whats-live.test.js
consonance/hooks/sessionstart-state.test.js consonance/tools/chain-status.test.js dev/shell/hooks/third-place-gate.test.js consonance/tools/gen-consumer.test.js
consonance/tools/front-door-links.test.js consonance/tools/portable-paths.test.js"
for f in $T; do b=$(basename $f .js); node --test --test-reporter=tap "$f" > $O/$b.out 2>&1; echo "$f exit $? $(grep -E '^# (pass|fail) ' $O/$b.out | tr '\n' ' ')"; done
for f in consonance/tools/prompt-events.test.js consonance/tools/install-only.test.js; do b=$(basename $f .js); node "$f" > $O/$b.out 2>&1; echo "$f exit $? $(tail -1 $O/$b.out)"; done
node /c/Users/nname/Downloads/cons-d454-e/patch/ownmut.js C:/Users/nname/Downloads/lh-wt-d454-e > $O/ownmut.out 2>&1; echo "ownmut exit $?"; cat $O/ownmut.out
git status --short

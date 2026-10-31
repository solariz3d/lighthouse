#!/bin/bash
# prove4.sh (D454 part 3, pane E, the four older gates): their test files whole, dream-gate and install-only, the harnesses over them, own mutants, then js-suite
cd /c/Users/nname/Downloads/lh-wt-d454-e || exit 1
O=/c/Users/nname/Downloads/cons-d454-e/run4; mkdir -p $O
for f in consonance/hooks/ask-ending.test.js consonance/hooks/second-reader.test.js consonance/hooks/push-gate.test.js consonance/hooks/delete-gate.test.js consonance/hooks/dream-gate.test.js; do
  b=$(basename $f .js); node --test --test-reporter=tap "$f" > $O/$b.out 2>&1; echo "$f exit $? $(grep -E '^# (pass|fail) ' $O/$b.out | tr '\n' ' ')"; done
node consonance/tools/install-only.test.js > $O/install-only.out 2>&1; echo "install-only exit $? $(tail -1 $O/install-only.out)"
for m in consonance/tools/second-reader.mutants.js consonance/tools/sources-gate.mutants.js; do b=$(basename $m .js); node $m > $O/$b.out 2>&1; echo "$m exit $? $(grep -iE 'applied' $O/$b.out | tail -1)"; done
node /c/Users/nname/Downloads/cons-d454-e/patch/ownmut.js C:/Users/nname/Downloads/lh-wt-d454-e > $O/ownmut.out 2>&1; echo "ownmut exit $?"; grep -E "NOT CAUGHT|NOT APPLIED |M2[2-5]|^applied" $O/ownmut.out
node consonance/tools/js-suite.js > $O/js-suite.out 2>&1; echo "js-suite exit $?"; grep -aE "^js-suite:|^FAIL|^CRASH" $O/js-suite.out | sed 's/\x1b\[[0-9;]*m//g'
git status --short

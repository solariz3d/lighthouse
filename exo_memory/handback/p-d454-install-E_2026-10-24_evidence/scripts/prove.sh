#!/bin/bash
# prove.sh (D454 part 3, pane E): the touched test files whole, the two mutant harnesses that mutate touched files, portable-paths, own mutants
cd /c/Users/nname/Downloads/lh-wt-d454-e || exit 1
O=/c/Users/nname/Downloads/cons-d454-e/run; mkdir -p $O
for f in consonance/hooks/sources-gate.test.js consonance/hooks/claim-check.test.js consonance/tools/heavy-run.test.js consonance/tools/state-block.test.js dev/shell/hooks/userprompt_pulse.test.js consonance/tools/portable-paths.test.js; do
  b=$(basename $f .js); node --test "$f" > $O/$b.out 2>&1; echo "$f exit $? $(grep -E '^# (pass|fail)' $O/$b.out | tr '\n' ' ')"
done
for m in consonance/tools/heavy-run.mutants.js consonance/tools/sources-gate.mutants.js; do
  b=$(basename $m .js); node $m > $O/$b.out 2>&1; echo "$m exit $? $(grep -iE 'applied [0-9]+' $O/$b.out | tail -1)"
done
node /c/Users/nname/Downloads/cons-d454-e/patch/ownmut.js C:/Users/nname/Downloads/lh-wt-d454-e > $O/ownmut.out 2>&1; echo "ownmut exit $?"; cat $O/ownmut.out
git status --short

#!/bin/bash
# prove3.sh (D454 part 3, pane E): C's part 2 items: release-chime and scratch.js whole, scratch.js's consumers, the janitor harness, own mutants
cd /c/Users/nname/Downloads/lh-wt-d454-e || exit 1
O=/c/Users/nname/Downloads/cons-d454-e/run3; mkdir -p $O
for f in consonance/hooks/release-chime.test.js consonance/tools/scratch.test.js consonance/tools/heavy-run.test.js consonance/tools/janitor.test.js consonance/hooks/blind.test.js consonance/tools/js-suite.test.js; do
  b=$(basename $f .js); node --test --test-reporter=tap "$f" > $O/$b.out 2>&1; echo "$f exit $? $(grep -E '^# (pass|fail) ' $O/$b.out | tr '\n' ' ')"; done
node consonance/tools/janitor.mutants.js > $O/janitor.mutants.out 2>&1; echo "janitor.mutants exit $? $(grep -iE 'applied' $O/janitor.mutants.out | tail -1)"
node /c/Users/nname/Downloads/cons-d454-e/patch/ownmut.js C:/Users/nname/Downloads/lh-wt-d454-e > $O/ownmut.out 2>&1; echo "ownmut exit $?"; cat $O/ownmut.out
git status --short

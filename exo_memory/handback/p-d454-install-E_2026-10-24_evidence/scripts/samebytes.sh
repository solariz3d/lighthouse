#!/bin/bash
# samebytes.sh (D454 part 3, pane E): on this machine, the HEAD version and the D454 version of each tool, run at the same moment, stdout and
# exit compared byte for byte. The HEAD copy sits beside the new file as _old_<name>.js (same dir, same requires) and is removed after.
W=/c/Users/nname/Downloads/lh-wt-d454-e; O=/c/Users/nname/Downloads/cons-d454-e/same; mkdir -p $O; cd $W || exit 1
for t in whats-live tell-index prompt-events; do
  git show HEAD:consonance/tools/$t.js > consonance/tools/_old_$t.js
  ( node consonance/tools/_old_$t.js $( [ $t = whats-live ] && echo --warn ) > $O/$t.old.out 2> $O/$t.old.err; echo $? > $O/$t.old.code ) &
  ( node consonance/tools/$t.js $( [ $t = whats-live ] && echo --warn ) > $O/$t.new.out 2> $O/$t.new.err; echo $? > $O/$t.new.code ) &
  wait
  rm -f consonance/tools/_old_$t.js
  if cmp -s $O/$t.old.out $O/$t.new.out && cmp -s $O/$t.old.err $O/$t.new.err && cmp -s $O/$t.old.code $O/$t.new.code; then r=SAME; else r=DIFFERENT; fi
  echo "$t: $r  exit $(cat $O/$t.old.code)/$(cat $O/$t.new.code)  stdout $(wc -c < $O/$t.old.out)/$(wc -c < $O/$t.new.out) B  sha256 $(sha256sum < $O/$t.new.out | cut -c1-16)"
done
git status --short | grep _old_ && echo "LEFTOVER" || echo "no _old_ copies left"

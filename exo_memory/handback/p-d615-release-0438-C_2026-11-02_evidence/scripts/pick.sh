#!/bin/sh
# pick.sh <commit>: cherry-pick -n onto the landing tree, resolve CHANGELOG by clmerge and other conflicts to the picked side, reword, commit with the plain subject
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d615
cd C:/Users/nname/Desktop/worktrees/t180-c615 || exit 9
c=$1
git cherry-pick -n $c > /dev/null 2>&1
U=$(git diff --name-only --diff-filter=U)
if [ -n "$U" ]; then
  echo "conflicts: $U"
  for f in $U; do
    if [ "$f" = CHANGELOG.md ]; then node $S/clmerge.js $c || exit 1; else node $S/theirs.js "$f" || exit 1; fi
  done
elif git diff --cached --name-only | grep -qx CHANGELOG.md; then node $S/clmerge.js $c || exit 1
fi
node $S/reword.js || exit 1
node $S/repin.js || exit 1
git add -u
# files the pick added
git diff --cached --name-only --diff-filter=A
subj=$(git log -1 --format=%s $c)
printf '%s\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n' "$subj" > $S/msg.txt
git commit -q -F $S/msg.txt && echo "$c -> $(git log -1 --format='%h %s')"

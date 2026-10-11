set -u
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d300; O=G:/consonance-scratch/c-d300
mkdir -p $O/tmp; export TEMP=$O/tmp TMP=$O/tmp
cd $S
echo "## build fix (clean), dose-old (a0e + dose), dose-fix (wt + dose)"
NO_DOSE=1 node build-dose.js G:/worktrees/c-d300-wt G:/ctarget/c-d296-mut $O/tfix.exe
node build-dose.js G:/worktrees/c-d300-a0e G:/ctarget/c-d296-new $O/tdose-old.exe
node build-dose.js G:/worktrees/c-d300-wt G:/ctarget/c-d296-mut $O/tdose-fix.exe
sha256sum $O/*.exe
echo "## dosed, module x200"
for T in dose-old dose-fix; do node runs.js $O/t$T.exe G:/worktrees/c-d300-wt/consonance/src-tauri module 200 | grep TALLY; done
echo "## fix, natural, module x2000"
node runs.js $O/tfix.exe G:/worktrees/c-d300-wt/consonance/src-tauri module 2000 | grep -v '^run .*row ok sib ok exit 0'
echo "## full parallel binary x5 per tree"
for T in 613 a0e fix; do W=G:/worktrees/c-d300-$T/consonance/src-tauri; [ $T = fix ] && W=G:/worktrees/c-d300-wt/consonance/src-tauri; node runs.js $O/t$T.exe $W full 5; done
echo left $(ls $O/tmp | wc -l)
for W in c-d300-613 c-d300-a0e c-d300-wt; do echo "$W: $(git -C G:/worktrees/$W status --short | tr '\n' ' ')"; done

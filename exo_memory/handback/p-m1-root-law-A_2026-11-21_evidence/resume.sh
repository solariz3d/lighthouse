cd /c/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/m1
powershell -NoProfile -File b.ps1 > resume_build.txt 2>&1
cat resume_build.txt | tail -1 > resume_status.txt
if grep -q "build rc=0" resume_build.txt; then
  (cd /c/Consonance/dz-wt-m1/build/bin && ./chase_tests.exe root_ > $OLDPWD/resume_root.txt 2>&1; echo "root rc=$?" >> $OLDPWD/resume_status.txt)
  node /c/Consonance/lighthouse/consonance/tools/heavy-run.js --status && node mutate_m1.js M10,M11 > resume_mut.txt 2>&1; echo "mut rc=$?" >> resume_status.txt
fi
echo done >> resume_status.txt

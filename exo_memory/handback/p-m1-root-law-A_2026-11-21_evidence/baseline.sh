cd /c/Users/zackn/Downloads/dreamzone-3
S=$1; BIN=${2:-/c/Users/zackn/Downloads/dreamzone-3/build/bin}
time $BIN/dz-chase.exe sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback --max 300 --threads 2 > $S/sweep_raw.txt 2>&1
sed -n '/survival, seconds/,$p' $S/sweep_raw.txt > $S/sweep_part.txt; wc -l $S/sweep_part.txt; md5sum $S/sweep_part.txt
for f in game/runs/run-*.txt; do $BIN/dz-world.exe --replay-run $f > $S/rep_$(basename $f).txt 2>&1; echo "$(basename $f) rc=$?"; done > $S/replays.txt
grep -c "rc=0" $S/replays.txt

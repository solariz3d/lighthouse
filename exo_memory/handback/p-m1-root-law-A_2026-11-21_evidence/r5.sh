S=$1; B=/c/Consonance/dz-wt-m1/build/bin/dz-chase.exe
run() { name=$1; shift; $B sweep --seeds 24 --first 1 --levels 1,3 --policies line,flee,cutback --max 300 --threads 2 "$@" > $S/r5/$name.raw 2>&1; sed -n '/survival, seconds/,$p' $S/r5/$name.raw | grep -v " s in all on " > $S/r5/$name.txt; md5sum $S/r5/$name.txt | cut -c1-32; }
echo "off  $(run off)"
echo "on1  $(run on1 --speed root_law=1)"
echo "on2  $(run on2 --speed root_law=1)"

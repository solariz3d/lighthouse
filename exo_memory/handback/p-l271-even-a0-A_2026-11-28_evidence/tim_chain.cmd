@echo off
cd /d "<local path>
tasklist /FI "IMAGENAME eq acs.exe" /NH > out\tim_acs_before.txt
node tim271.js t298 cp\tracks t298 > out\tim_298.out 2>&1
node tim271.js <local path> cp\tracks t298 > out\tim_1925.out 2>&1
tasklist /FI "IMAGENAME eq acs.exe" /NH > out\tim_acs_after.txt

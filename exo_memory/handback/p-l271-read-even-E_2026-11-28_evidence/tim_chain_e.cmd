@echo off
cd /d "%~dp0"
tasklist /FI "IMAGENAME eq acs.exe" /NH > tim_acs_before.txt
node tim271.js <home>\Downloads\t180-wt-e-l271-1925 cp <home>\Downloads\t180-wt-e-l271 > tim_1925_a.out 2>&1
node tim271.js <home>\Downloads\t180-wt-e-l271 cp <home>\Downloads\t180-wt-e-l271 > tim_9ab_a.out 2>&1
node tim271.js <home>\Downloads\t180-wt-e-l271-1925 cp <home>\Downloads\t180-wt-e-l271 > tim_1925_b.out 2>&1
node tim271.js <home>\Downloads\t180-wt-e-l271 cp <home>\Downloads\t180-wt-e-l271 > tim_9ab_b.out 2>&1
tasklist /FI "IMAGENAME eq acs.exe" /NH > tim_acs_after.txt

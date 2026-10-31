#!/bin/bash
# usb.sh (D454 part 3, pane E): the GUIDE's USB steps 3 and 4 with -DryRun, as written, under the stranger home
cd /c/Users/nname/Downloads/cons-d454-e/stick || exit 1
export USERPROFILE='C:\Users\nname\Downloads\cons-d454-e\stranger' HOME='C:\Users\nname\Downloads\cons-d454-e\stranger'
unset CONSONANCE_DATA CONSONANCE_PANE CONSONANCE_READY_DIR
D='C:\Users\nname\Downloads\cons-d454-e\stick'
for s in LEAVING ARRIVING; do echo "=== powershell -ExecutionPolicy Bypass -File <drive>\$s.ps1 -DryRun"; powershell -ExecutionPolicy Bypass -File "C:/Users/nname/Downloads/cons-d454-e/stick/${s}.ps1" -DryRun; echo "exit $?"; done

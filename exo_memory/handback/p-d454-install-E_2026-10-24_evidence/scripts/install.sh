#!/bin/bash
# install.sh (D454 part 3, pane E): the GUIDE's hooks step AS WRITTEN, from the clone root, with USERPROFILE/HOME at the scratch home
cd /c/Users/nname/Downloads/cons-d454-e/clone/consonance || exit 1
export USERPROFILE='C:\Users\nname\Downloads\cons-d454-e\home' HOME='C:\Users\nname\Downloads\cons-d454-e\home'
unset CONSONANCE_DATA CONSONANCE_SHELL_DIR CLAUDE_CONFIG_DIR
for a in "" "-Check" "-NoRegister" "-Check"; do
  echo "=== powershell -ExecutionPolicy Bypass -File dev\shell\install.ps1 $a"
  powershell -ExecutionPolicy Bypass -File 'dev\shell\install.ps1' $a; echo "exit $?"
done

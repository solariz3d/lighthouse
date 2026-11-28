#!/bin/bash
# render_all.sh N [N ...]: every frame of each part in plain mode, then its clip with the narration.
cd "$(dirname "$0")"
B=/c/Consonance/blender/blender-5.2.5-windows-x64/blender.exe
for n in "$@"; do
  "$B" -b --factory-startup -P render.py -- --part $n --redo 2>&1 | grep -E "RENDER|Error|Traceback|line [0-9]+" | head -6
  /c/Consonance/hear/.venv/Scripts/python.exe assemble.py clip $n
done

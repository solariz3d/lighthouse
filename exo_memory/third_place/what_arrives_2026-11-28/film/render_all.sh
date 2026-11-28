#!/bin/bash
# render_all.sh N [N ...]: every frame of each part in plain mode, then its clip with the narration.
cd "$(dirname "$0")"
B="${BLENDER:-/c/Consonance/blender/blender-5.2.5-windows-x64/blender.exe}"     # set BLENDER to the path of blender.exe on another machine
PY="${PYTHON:-/c/Consonance/hear/.venv/Scripts/python.exe}"                    # any Python 3 will do: assemble.py needs only ffmpeg
for n in "$@"; do
  "$B" -b --factory-startup -P render.py -- --part $n --redo 2>&1 | grep -E "RENDER|Error|Traceback|line [0-9]+" | head -6
  "$PY" assemble.py clip $n
done

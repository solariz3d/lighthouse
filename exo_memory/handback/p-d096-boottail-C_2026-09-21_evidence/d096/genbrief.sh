#!/usr/bin/env bash
# Run gen-brief.ps1 against a given master, in a SCRATCH TREE shaped like the repo, so the bundled
# brief/BOOT.md is never written. Usage: genbrief.sh <master BOOT.md> <label>
set -u
R=C:/Users/nname/Desktop/lighthouse
S=C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d096
T="$S/gb-$2"
rm -rf "$T"; mkdir -p "$T/exo_memory" "$T/consonance/src-tauri/brief"
cp "$1" "$T/exo_memory/BOOT.md"
cp "$R/consonance/src-tauri/gen-brief.ps1" "$T/consonance/src-tauri/"
cp "$R/consonance/src-tauri/brief/frag-traces.md" "$R/consonance/src-tauri/brief/frag-pointer.md" "$T/consonance/src-tauri/brief/"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(cygpath -w "$T/consonance/src-tauri/gen-brief.ps1")"
echo "gen-brief exit $?"
echo "generated: $(wc -c < "$T/consonance/src-tauri/brief/BOOT.md") B  sha256 $(sha256sum "$T/consonance/src-tauri/brief/BOOT.md" | cut -c1-16)"
echo "committed: $(wc -c < "$R/consonance/src-tauri/brief/BOOT.md") B  sha256 $(sha256sum "$R/consonance/src-tauri/brief/BOOT.md" | cut -c1-16)"

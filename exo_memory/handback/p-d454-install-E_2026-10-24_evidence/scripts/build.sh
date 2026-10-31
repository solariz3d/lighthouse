#!/bin/bash
# build.sh (D454 part 3, pane E): README/GUIDE build commands, AS WRITTEN, in the stranger clone, with cargo's home and install root in scratch
S=/c/Users/nname/Downloads/cons-d454-e
export CARGO_HOME="C:/Users/nname/Downloads/cons-d454-e/cargo-home" CARGO_INSTALL_ROOT="C:/Users/nname/Downloads/cons-d454-e/cargo-home"
export PATH="/c/Users/nname/Downloads/cons-d454-e/cargo-home/bin:/c/Users/nname/.cargo/bin:$PATH"
mkdir -p "$S/cargo-home"
cd "$S/clone/consonance" || exit 1
step() { echo "=== $(date -u +%FT%TZ) $*"; }
step 'cargo install tauri-cli --version "^2.0"'
cargo install tauri-cli --version "^2.0"; echo "exit $?"
step "which cargo-tauri"; which cargo-tauri; cargo tauri --version
step "cd consonance && cargo tauri build"
cd consonance && cargo tauri build; echo "exit $?"
step "cargo tauri build --no-bundle"
cargo tauri build --no-bundle; echo "exit $?"
step "artifacts"
ls -la src-tauri/target/release/*.exe src-tauri/target/release/bundle/nsis/ 2>&1
sha256sum src-tauri/target/release/bundle/nsis/*.exe src-tauri/target/release/consonance.exe 2>&1
step done

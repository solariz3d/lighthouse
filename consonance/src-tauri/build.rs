fn main() {
    // Cargo re-runs a build script only when something it has been TOLD to watch changes, and
    // by default that is build.rs itself. tauri_build embeds the window and executable icon
    // from tauri.conf.json, so editing an icon changed nothing cargo could see: `cargo build`
    // reported success in half a second, embedded the PREVIOUS icon, and left a binary that
    // looked freshly built. A silent no-op wearing a green result.
    //
    // Found 2026-07-29, right after fixing the .ico itself — it held a single 256px image, so
    // every small size was a live downscale and aliased into moiré. That fix was correct and
    // simply never reached the executable, which is the more dangerous half of the bug.
    println!("cargo:rerun-if-changed=tauri.conf.json");
    for entry in std::fs::read_dir("icons").into_iter().flatten().flatten() {
        // Watch every asset in the directory rather than a hardcoded list. A list only covers
        // what someone remembered to add, so the next format introduced would silently stop
        // triggering rebuilds — the same failure one layer along.
        println!("cargo:rerun-if-changed={}", entry.path().display());
    }
    tauri_build::build()
}

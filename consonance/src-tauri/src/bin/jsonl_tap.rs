// Stage-1 chunk 4: the JSONL tap. Proves Claude Code's per-session transcript is at a
// predictable path, is parseable structured JSONL, and that assistant lines carry the
// exact token `usage` (the cost backbone). Run: cargo run --bin jsonl_tap
use std::collections::{BTreeMap, BTreeSet};
use std::fs::{self, File};
use std::io::{BufRead, BufReader};
use std::path::PathBuf;

fn home() -> String {
    std::env::var("USERPROFILE").unwrap_or_else(|_| ".".into())
}

// claude's scheme: drive-colon and every path separator become '-'
fn encode_cwd(cwd: &str) -> String {
    cwd.chars()
        .map(|c| if c == ':' || c == '\\' || c == '/' { '-' } else { c })
        .collect()
}

fn main() {
    let cwd = r"C:\Users\zackn\OneDrive\Desktop\606";
    let encoded = encode_cwd(cwd);
    let dir = PathBuf::from(home()).join(".claude").join("projects").join(&encoded);

    println!("=== PATH PREDICTION ===");
    println!("cwd            : {cwd}");
    println!("encoded        : {encoded}");
    println!("predicted dir  : {}", dir.display());
    println!("exists         : {}", dir.is_dir());
    if !dir.is_dir() {
        println!("(no transcript dir — open claude in {cwd} at least once)");
        return;
    }

    let mut files: Vec<PathBuf> = fs::read_dir(&dir)
        .unwrap()
        .filter_map(|e| e.ok())
        .map(|e| e.path())
        .filter(|p| p.extension().map(|x| x == "jsonl").unwrap_or(false))
        .collect();
    files.sort_by_key(|p| fs::metadata(p).and_then(|m| m.modified()).ok());
    let newest = match files.last() {
        Some(p) => p.clone(),
        None => { println!("(no .jsonl files yet)"); return; }
    };
    let size_mb = fs::metadata(&newest).map(|m| m.len()).unwrap_or(0) as f64 / 1e6;
    println!("\n=== NEWEST TRANSCRIPT ===");
    println!("file           : {}", newest.file_name().unwrap().to_string_lossy());
    println!("size           : {size_mb:.1} MB");

    let rd = BufReader::new(File::open(&newest).unwrap());
    let mut total = 0u64;
    let mut by_type: BTreeMap<String, u64> = BTreeMap::new();
    let (mut in_tok, mut out_tok, mut cache_r, mut cache_w) = (0u64, 0u64, 0u64, 0u64);
    let mut models: BTreeSet<String> = BTreeSet::new();
    let mut with_usage = 0u64;
    let mut compacts = 0u64;

    for line in rd.lines() {
        let line = match line { Ok(l) => l, Err(_) => continue };
        if line.trim().is_empty() { continue; }
        total += 1;
        let v: serde_json::Value = match serde_json::from_str(&line) { Ok(v) => v, Err(_) => continue };

        let t = v.get("type").and_then(|x| x.as_str()).unwrap_or("?").to_string();
        *by_type.entry(t).or_default() += 1;

        if v.get("isCompactSummary").and_then(|x| x.as_bool()).unwrap_or(false) {
            compacts += 1;
        }

        let usage = v.get("message").and_then(|m| m.get("usage")).or_else(|| v.get("usage"));
        if let Some(u) = usage {
            with_usage += 1;
            in_tok += u.get("input_tokens").and_then(|x| x.as_u64()).unwrap_or(0);
            out_tok += u.get("output_tokens").and_then(|x| x.as_u64()).unwrap_or(0);
            cache_r += u.get("cache_read_input_tokens").and_then(|x| x.as_u64()).unwrap_or(0);
            cache_w += u.get("cache_creation_input_tokens").and_then(|x| x.as_u64()).unwrap_or(0);
        }
        let model = v.get("message").and_then(|m| m.get("model")).and_then(|x| x.as_str())
            .or_else(|| v.get("model").and_then(|x| x.as_str()));
        if let Some(m) = model { models.insert(m.to_string()); }
    }

    println!("\n=== TAP RESULT ===");
    println!("total lines        : {total}");
    println!("by type            : {by_type:?}");
    println!("lines with usage   : {with_usage}");
    println!("tokens  input      : {in_tok}");
    println!("tokens  output     : {out_tok}");
    println!("tokens  cache_read : {cache_r}");
    println!("tokens  cache_write: {cache_w}");
    println!("models             : {models:?}");
    println!("compact summaries  : {compacts}");
    println!("=== END ===");
}

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize, Clone)]
struct Instance {
    name: String,
    path: String,
    #[serde(default)]
    current: bool,
}

#[derive(Serialize, Deserialize, Clone)]
struct Config {
    base: String,
    flags: String,
    instances: Vec<Instance>,
}

fn home() -> String {
    std::env::var("USERPROFILE").unwrap_or_else(|_| ".".into())
}

fn config_path() -> PathBuf {
    PathBuf::from(home()).join(".consonance.json")
}

#[tauri::command]
fn get_state() -> Config {
    if let Ok(s) = fs::read_to_string(config_path()) {
        if let Ok(cfg) = serde_json::from_str::<Config>(&s) {
            return cfg;
        }
    }
    // first run: seed the live instance you actually talk to (606 = this conversation)
    let mut instances = Vec::new();
    let live = format!("{}\\OneDrive\\Desktop\\606", home());
    if Path::new(&live).exists() {
        instances.push(Instance { name: "606".into(), path: live, current: true });
    }
    Config {
        base: format!("{}\\claude-instances", home()),
        flags: "--dangerously-skip-permissions --continue".into(),
        instances,
    }
}

#[tauri::command]
fn save_config(cfg: Config) {
    if let Ok(s) = serde_json::to_string_pretty(&cfg) {
        let _ = fs::write(config_path(), s);
    }
}

#[tauri::command]
fn launch(name: String, path: String, flags: String) {
    let _ = fs::create_dir_all(&path);
    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);
    let bat = std::env::temp_dir().join(format!("consonance_{}.bat", ts));
    let body = format!(
        "@echo off\r\ntitle Claude: {name}\r\ncd /d \"{path}\"\r\nclaude {flags}\r\n"
    );
    if fs::write(&bat, body).is_ok() {
        if let Some(p) = bat.to_str() {
            let _ = Command::new("cmd")
                .args(["/c", "start", "", "cmd", "/k", p])
                .spawn();
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_state, save_config, launch])
        .run(tauri::generate_context!())
        .expect("error while running Consonance");
}

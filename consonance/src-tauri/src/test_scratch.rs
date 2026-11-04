//! Test-only scratch folders that remove themselves (D299, seat A, 2026-10-11).
//!
//! The 30 `std::env::temp_dir()` uses in this crate are all inside `#[cfg(test)]` code. Most remove their folder at the end of the
//! test; four helpers did not (a leftover per run: `cfgmerge-*`, `consonance_seed_test_*`, `digest-at-ring-*`, `gates-mode-*`),
//! measured with TEMP pointed at an empty folder, 29 left behind by one `cargo test`. Those use `Scratch`, which removes the folder
//! on drop, so a passing OR failing test leaves nothing behind.
//!
//! ROOT: `CONSONANCE_SCRATCH` if set (the convention scratch.js set in D287), else the OS temp dir. There is deliberately no
//! drive-letter fallback here (D287 measured a timing difference on G:, and a literal drive is a portable-paths finding); a runner
//! that wants the fast drive sets the variable or TEMP, as js-suite does.
//!
//! A `Scratch` DEREFS TO A PATH, so a helper that used to return a `PathBuf` returns one of these and its callers keep working.
use std::path::{Path, PathBuf};

/// Where scratch folders go.
pub fn root() -> PathBuf {
    root_from(std::env::var_os("CONSONANCE_SCRATCH"))
}

fn root_from(var: Option<std::ffi::OsString>) -> PathBuf {
    match var {
        Some(v) if !v.is_empty() => {
            let p = PathBuf::from(v);
            let _ = std::fs::create_dir_all(&p);
            p
        }
        _ => std::env::temp_dir(),
    }
}

/// A path the test uses, and the folder to remove when it is dropped (the path itself, or the folder that holds it).
pub struct Scratch {
    path: PathBuf,
    remove: PathBuf,
}

impl Scratch {
    /// Own `dir`: it is removed on drop. Nothing is created here.
    pub fn owning(dir: PathBuf) -> Scratch {
        Scratch { path: dir.clone(), remove: dir }
    }
    /// Use `path`, and remove `holder` (a folder that contains it) on drop.
    pub fn inside(holder: PathBuf, path: PathBuf) -> Scratch {
        Scratch { path, remove: holder }
    }
}

impl std::ops::Deref for Scratch {
    type Target = PathBuf;
    fn deref(&self) -> &PathBuf {
        &self.path
    }
}

impl AsRef<Path> for Scratch {
    fn as_ref(&self) -> &Path {
        &self.path
    }
}

impl Drop for Scratch {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.remove);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn unique(tag: &str) -> PathBuf {
        std::env::temp_dir().join(format!("test-scratch-{tag}-{}", std::process::id()))
    }

    #[test]
    fn dropping_removes_the_folder_and_what_is_in_it() {
        let d = unique("drop");
        {
            let s = Scratch::owning(d.clone());
            std::fs::create_dir_all(s.join("a/b")).unwrap();
            std::fs::write(s.join("a/b/f.txt"), "x").unwrap();
            assert!(d.exists(), "control: the folder exists while the guard lives");
        }
        assert!(!d.exists(), "the folder survived the drop");
    }

    #[test]
    fn a_panicking_test_still_cleans_up() {
        let d = unique("panic");
        let d2 = d.clone();
        let r = std::panic::catch_unwind(move || {
            let s = Scratch::owning(d2);
            std::fs::create_dir_all(&*s).unwrap();
            panic!("the test failed");
        });
        assert!(r.is_err(), "control: it did panic");
        assert!(!d.exists(), "a failing test left its folder");
    }

    #[test]
    fn inside_removes_the_holder_not_only_the_file() {
        let holder = unique("inside");
        std::fs::create_dir_all(&holder).unwrap();
        let file = holder.join(".consonance.json");
        std::fs::write(&file, "{}").unwrap();
        {
            let s = Scratch::inside(holder.clone(), file.clone());
            assert_eq!(&*s, &file, "it derefs to the file");
            assert!(s.exists());
        }
        assert!(!holder.exists(), "the holder folder was left behind");
    }

    #[test]
    fn it_derefs_to_a_path_so_old_callers_keep_working() {
        let s = Scratch::owning(unique("deref"));
        fn takes_path(p: &Path) -> bool { p.is_absolute() }
        assert!(takes_path(&s));
        assert_eq!(s.join("x"), unique("deref").join("x"));
    }

    #[test]
    fn root_honours_the_env_var_and_ignores_an_empty_one() {
        let base = unique("root");
        let r = root_from(Some(base.as_os_str().to_owned()));
        assert_eq!(r, base);
        assert!(base.exists(), "the configured root is created");
        let _ = std::fs::remove_dir_all(&base);
        assert_eq!(root_from(None), std::env::temp_dir());
        assert_eq!(root_from(Some(std::ffi::OsString::new())), std::env::temp_dir());
    }
}

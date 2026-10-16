//! priority — Consonance keeps its own scheduling priority, and its WebView2 children keep theirs (D338, pane A).
//!
//! ## The case
//!
//! 2026-10-16: the keeper said Consonance must not be throttled. The machine was not short (43.4 GB free of 61.4, CPU 28%),
//! so the cause was Windows' efficiency throttling (EcoQoS) and the Normal class, not a shortage. The librarian set
//! consonance.exe and its 7 msedgewebview2 children to High by hand; that lasts only until Consonance restarts.
//!
//! ## The rule, and why it is this shape
//!
//! - **High class, and the EcoQoS opt-out, for this process at startup.** `SetPriorityClass(HIGH_PRIORITY_CLASS)` and
//!   `SetProcessInformation(ProcessPowerThrottling)` with ControlMask EXECUTION_SPEED and StateMask 0. Per Microsoft's
//!   `SetProcessInformation` page, a process that does not say anything has a QoS level inferred by the system's own
//!   heuristics; ControlMask = EXECUTION_SPEED with StateMask = 0 is the documented "HighQoS: turn EXECUTION_SPEED
//!   throttling off", which is a statement to the system, not a reset to its heuristics (that is ControlMask 0).
//! - **High, not Above Normal.** Measured 2026-10-16 07:0x: the 21 consonance and msedgewebview2 processes on the machine
//!   used 3.81 CPU-seconds in 10 s, 2.4% of the 16 logical processors, so the class cannot starve a game by load. The
//!   `SetPriorityClass` page warns that a High-class process can use nearly all available CPU; this one does not, and
//!   the keeper's own hand-set was High. If a game stutters while Consonance is busy, `ABOVE_NORMAL` is the one line to
//!   change (`WANTED_CLASS`).
//! - **The WebView2 children are set one by one, and again.** Microsoft's WebView2 process model page describes the
//!   runtime processes as one browser process, renderers and helpers, all children of the browser process and tied to
//!   its lifetime; it names no environment option or job-object setting for their priority, and `ProcessFailed` and
//!   `CloseTask` are the only process hooks. So a sweep (every `SWEEP_EVERY`) lists the processes under this one with a
//!   ToolHelp snapshot and sets each. Renderers come and go, and Chromium lowers a hidden one to Idle itself, so the
//!   sweep reads each process's class and EcoQoS state every time and sets only where it differs.
//! - **Never fatal.** Every failure is a line on stderr, once per process and reason; Consonance starts regardless.
//!
//! The pure half (what is wanted, which pids are ours) is testable without a window; the rest is two Win32 calls and a
//! read-back, tested against the test process itself and a child it starts.

use std::collections::{HashMap, HashSet};

/// `HIGH_PRIORITY_CLASS` (processthreadsapi.h): 0x80. `ABOVE_NORMAL_PRIORITY_CLASS` is 0x8000.
pub const WANTED_CLASS: u32 = 0x0000_0080;
/// `PROCESS_POWER_THROTTLING_CURRENT_VERSION`.
pub const THROTTLING_VERSION: u32 = 1;
/// `PROCESS_POWER_THROTTLING_EXECUTION_SPEED`: the one mechanism the opt-out names.
pub const EXECUTION_SPEED: u32 = 0x1;
/// ControlMask: we take control of EXECUTION_SPEED.
pub const WANTED_CONTROL_MASK: u32 = EXECUTION_SPEED;
/// StateMask: 0 means that mechanism is OFF (HighQoS), never on.
pub const WANTED_STATE_MASK: u32 = 0;
/// How often the sweep looks at the children.
pub const SWEEP_EVERY: std::time::Duration = std::time::Duration::from_secs(5);

/// What a process reports about itself, as read back.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Reading {
    pub class: u32,
    pub control_mask: u32,
    pub state_mask: u32,
}

/// Is a process already as wanted? Both the class and the opt-out must hold: the control bit set and the state bit clear.
pub fn is_as_wanted(r: Reading) -> bool {
    r.class == WANTED_CLASS && r.control_mask & EXECUTION_SPEED != 0 && r.state_mask & EXECUTION_SPEED == 0
}

/// Every pid under `root` in a (pid, parent pid) table, children and their children, never `root` itself. A cycle in the
/// table (a reused pid) cannot loop it: each pid is taken once.
pub fn descendants(root: u32, table: &[(u32, u32)]) -> Vec<u32> {
    let mut kids: HashMap<u32, Vec<u32>> = HashMap::new();
    for &(pid, parent) in table {
        if pid != parent {
            kids.entry(parent).or_default().push(pid);
        }
    }
    let mut seen: HashSet<u32> = HashSet::new();
    seen.insert(root);
    let mut out = Vec::new();
    let mut stack = vec![root];
    while let Some(p) = stack.pop() {
        if let Some(cs) = kids.get(&p) {
            for &c in cs {
                if seen.insert(c) {
                    out.push(c);
                    stack.push(c);
                }
            }
        }
    }
    out.sort_unstable();
    out
}

#[cfg(windows)]
pub use win::start;

#[cfg(not(windows))]
pub fn start() {}

#[cfg(windows)]
mod win {
    use super::*;
    use std::ffi::c_void;
    use windows::Win32::Foundation::{CloseHandle, HANDLE};
    use windows::Win32::System::Diagnostics::ToolHelp::{
        CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W, TH32CS_SNAPPROCESS,
    };
    use windows::Win32::System::Threading::{
        GetCurrentProcess, GetCurrentProcessId, GetPriorityClass, GetProcessInformation, OpenProcess, ProcessPowerThrottling,
        SetPriorityClass, SetProcessInformation, PROCESS_CREATION_FLAGS, PROCESS_POWER_THROTTLING_CURRENT_VERSION,
        PROCESS_POWER_THROTTLING_STATE, PROCESS_QUERY_LIMITED_INFORMATION,
        PROCESS_SET_INFORMATION,
    };

    /// Set one process (a handle with PROCESS_SET_INFORMATION) to the wanted class and opt it out of EcoQoS. Both calls are
    /// tried; the error names whichever failed.
    pub fn set_process(h: HANDLE) -> Result<(), String> {
        let mut errs = Vec::new();
        // SAFETY: `h` is a valid process handle the caller opened with PROCESS_SET_INFORMATION; the struct outlives the call.
        unsafe {
            if let Err(e) = SetPriorityClass(h, PROCESS_CREATION_FLAGS(WANTED_CLASS)) {
                errs.push(format!("SetPriorityClass: {e}"));
            }
            let st = PROCESS_POWER_THROTTLING_STATE {
                Version: THROTTLING_VERSION,
                ControlMask: WANTED_CONTROL_MASK,
                StateMask: WANTED_STATE_MASK,
            };
            if let Err(e) = SetProcessInformation(
                h,
                ProcessPowerThrottling,
                &st as *const _ as *const c_void,
                std::mem::size_of::<PROCESS_POWER_THROTTLING_STATE>() as u32,
            ) {
                errs.push(format!("SetProcessInformation(ProcessPowerThrottling): {e}"));
            }
        }
        if errs.is_empty() { Ok(()) } else { Err(errs.join("; ")) }
    }

    /// What the process reports: its class, and the throttling control and state masks. Read-only access is enough.
    pub fn read_back(h: HANDLE) -> Result<Reading, String> {
        // SAFETY: `h` is a valid process handle with at least PROCESS_QUERY_LIMITED_INFORMATION; the out-struct is ours.
        unsafe {
            let class = GetPriorityClass(h);
            if class == 0 {
                return Err(format!("GetPriorityClass: {}", windows::core::Error::from_win32()));
            }
            let mut st = PROCESS_POWER_THROTTLING_STATE { Version: PROCESS_POWER_THROTTLING_CURRENT_VERSION, ControlMask: 0, StateMask: 0 };
            GetProcessInformation(
                h,
                ProcessPowerThrottling,
                &mut st as *mut _ as *mut c_void,
                std::mem::size_of::<PROCESS_POWER_THROTTLING_STATE>() as u32,
            )
            .map_err(|e| format!("GetProcessInformation(ProcessPowerThrottling): {e}"))?;
            Ok(Reading { class, control_mask: st.ControlMask, state_mask: st.StateMask })
        }
    }

    /// The (pid, parent pid) table of every process, from one ToolHelp snapshot.
    fn process_table() -> Result<Vec<(u32, u32)>, String> {
        // SAFETY: the snapshot handle is closed on every path; `entry.dwSize` is set before the first call as the API requires.
        unsafe {
            let snap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0).map_err(|e| format!("CreateToolhelp32Snapshot: {e}"))?;
            let mut entry = PROCESSENTRY32W { dwSize: std::mem::size_of::<PROCESSENTRY32W>() as u32, ..Default::default() };
            let mut out = Vec::new();
            let mut ok = Process32FirstW(snap, &mut entry).is_ok();
            while ok {
                out.push((entry.th32ProcessID, entry.th32ParentProcessID));
                ok = Process32NextW(snap, &mut entry).is_ok();
            }
            let _ = CloseHandle(snap);
            Ok(out)
        }
    }

    /// One pass over the processes under `root`: each is read and set only where it is not already as wanted. `failed` holds
    /// "pid: reason" already reported, so a process that refuses is said once. Returns how many were set this pass.
    pub fn sweep_once(root: u32, failed: &mut HashSet<String>) -> usize {
        let table = match process_table() {
            Ok(t) => t,
            Err(e) => {
                if failed.insert(format!("table: {e}")) {
                    eprintln!("priority: cannot list the WebView2 children: {e}");
                }
                return 0;
            }
        };
        let mut set = 0;
        for pid in descendants(root, &table) {
            // SAFETY: the handle is closed below on the one path that opens it.
            let h = match unsafe { OpenProcess(PROCESS_SET_INFORMATION | PROCESS_QUERY_LIMITED_INFORMATION, false, pid) } {
                Ok(h) => h,
                Err(e) => {
                    if failed.insert(format!("{pid}: open {e}")) {
                        eprintln!("priority: cannot open process {pid} to set its priority: {e}");
                    }
                    continue;
                }
            };
            if !matches!(read_back(h), Ok(r) if is_as_wanted(r)) {
                match set_process(h) {
                    Ok(()) => set += 1,
                    Err(e) => {
                        if failed.insert(format!("{pid}: {e}")) {
                            eprintln!("priority: process {pid}: {e}");
                        }
                    }
                }
            }
            // SAFETY: `h` came from OpenProcess just above.
            unsafe {
                let _ = CloseHandle(h);
            }
        }
        set
    }

    /// At startup: this process, then a thread that keeps the WebView2 children as wanted. Never fatal, never blocking.
    pub fn start() {
        // SAFETY: GetCurrentProcess is a pseudo-handle that needs no closing.
        let me = unsafe { GetCurrentProcess() };
        if let Err(e) = set_process(me) {
            eprintln!("priority: this process: {e}");
        }
        if let Err(e) = std::thread::Builder::new().name("priority-sweep".into()).spawn(|| {
            // SAFETY: no arguments, no state.
            let root = unsafe { GetCurrentProcessId() };
            let mut failed = HashSet::new();
            loop {
                sweep_once(root, &mut failed);
                std::thread::sleep(SWEEP_EVERY);
            }
        }) {
            eprintln!("priority: cannot start the child sweep: {e}");
        }
    }

    // The crate's own constants are the documents' values: if they ever differ from the ones above the test names it.
    #[cfg(test)]
    pub const CRATE_EXECUTION_SPEED: u32 = windows::Win32::System::Threading::PROCESS_POWER_THROTTLING_EXECUTION_SPEED;
    #[cfg(test)]
    pub const CRATE_VERSION: u32 = PROCESS_POWER_THROTTLING_CURRENT_VERSION;
}

#[cfg(test)]
mod tests {
    use super::*;
    #[cfg(windows)]
    use super::win::{read_back, set_process, sweep_once};

    #[test]
    fn the_wanted_flags_are_the_documented_ones() {
        assert_eq!(WANTED_CLASS, 0x80, "HIGH_PRIORITY_CLASS");
        assert_eq!(WANTED_CONTROL_MASK, EXECUTION_SPEED, "we take control of EXECUTION_SPEED");
        assert_eq!(WANTED_STATE_MASK, 0, "and say it is off: StateMask 0, never the bit");
        #[cfg(windows)]
        {
            assert_eq!(EXECUTION_SPEED, win::CRATE_EXECUTION_SPEED, "the windows crate's own constant");
            assert_eq!(THROTTLING_VERSION, win::CRATE_VERSION);
        }
    }

    #[test]
    fn a_process_is_as_wanted_only_with_the_class_and_the_opt_out() {
        let good = Reading { class: WANTED_CLASS, control_mask: EXECUTION_SPEED, state_mask: 0 };
        assert!(is_as_wanted(good));
        assert!(!is_as_wanted(Reading { class: 0x20, ..good }), "Normal class");
        assert!(!is_as_wanted(Reading { class: 0x8000, ..good }), "Above Normal is not High");
        assert!(!is_as_wanted(Reading { control_mask: 0, ..good }), "the system's own heuristics still decide: not opted out");
        assert!(!is_as_wanted(Reading { state_mask: EXECUTION_SPEED, ..good }), "throttling switched ON");
        assert!(is_as_wanted(Reading { control_mask: EXECUTION_SPEED | 0x4, state_mask: 0x4, ..good }), "another mechanism's bit is not ours");
    }

    #[test]
    fn descendants_are_children_and_their_children_and_never_the_root() {
        // 10 is us; 11 and 12 are our children; 13 is 11's child; 14 belongs to 99; 15 is a child of 14
        let table = [(10, 1), (11, 10), (12, 10), (13, 11), (14, 99), (15, 14), (99, 1)];
        assert_eq!(descendants(10, &table), vec![11, 12, 13]);
        assert_eq!(descendants(14, &table), vec![15]);
    }

    #[test]
    fn descendants_of_nothing_and_of_a_cycle_end() {
        assert!(descendants(10, &[]).is_empty(), "an empty table");
        assert!(descendants(10, &[(11, 99)]).is_empty(), "no child of ours");
        // a reused pid can make a cycle: 11's parent is 12 and 12's is 11, both under 10 through 11
        assert_eq!(descendants(10, &[(11, 10), (12, 11), (11, 12)]), vec![11, 12], "each taken once, and it returns");
        assert!(descendants(10, &[(10, 10)]).is_empty(), "a process that is its own parent is not its own child");
    }

    // The headless check: the real calls against real processes. The test process is set and read back, then put back to what
    // it was; a child it starts is found by the sweep and read back as well. Windows only.
    #[cfg(windows)]
    #[test]
    fn the_running_process_reports_the_class_and_the_throttling_state_that_were_set() {
        use windows::Win32::System::Threading::{GetCurrentProcess, SetPriorityClass, PROCESS_CREATION_FLAGS};
        let me = unsafe { GetCurrentProcess() };
        let before = read_back(me).expect("read this process");
        set_process(me).expect("set this process");
        let after = read_back(me).expect("read it back");
        assert_eq!(after.class, WANTED_CLASS, "the class reads High");
        assert!(after.control_mask & EXECUTION_SPEED != 0, "we hold control of EXECUTION_SPEED");
        assert_eq!(after.state_mask & EXECUTION_SPEED, 0, "and it is off");
        assert!(is_as_wanted(after));
        unsafe { let _ = SetPriorityClass(me, PROCESS_CREATION_FLAGS(before.class)); }   // the test process goes back to its class
    }

    #[cfg(windows)]
    #[test]
    fn the_sweep_sets_a_child_and_reads_it_back_and_a_set_child_is_left_alone() {
        use windows::Win32::Foundation::CloseHandle;
        use windows::Win32::System::Threading::{GetCurrentProcessId, OpenProcess, PROCESS_QUERY_LIMITED_INFORMATION};
        let mut child = std::process::Command::new("cmd").args(["/c", "ping -n 20 127.0.0.1 >nul"]).stdout(std::process::Stdio::null()).spawn().expect("start a child");
        let pid = child.id();
        std::thread::sleep(std::time::Duration::from_millis(300));
        let root = unsafe { GetCurrentProcessId() };
        let mut failed = HashSet::new();
        let n = sweep_once(root, &mut failed);
        assert!(n >= 1, "the first sweep set at least the child (set {n}; refused: {failed:?})");
        let h = unsafe { OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid) }.expect("open the child to read it");
        let r = read_back(h).expect("read the child");
        unsafe { let _ = CloseHandle(h); }
        assert!(is_as_wanted(r), "the child reads High and opted out: {r:?}");
        assert_eq!(sweep_once(root, &mut failed), 0, "a second sweep finds nothing to set: it only sets where a process differs");
        let _ = child.kill();
        let _ = child.wait();
    }
}

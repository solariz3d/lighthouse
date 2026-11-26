// R2 (pane O): three hand mutants of the fix, each run against submit_check_tests alone; the source is restored after each.
const fs = require("fs"), { spawnSync } = require("child_process"), os = require("os");
const p = "G:/consonance-scratch/o-r2-lh/consonance/src-tauri/src/main.rs";
const orig = fs.readFileSync(p, "utf8");
const M = [
  ["empty is a submit again, seen or not", "        Composer::Empty if seen => SubmitStep::Submitted,\n        Composer::Empty => SubmitStep::Unknown,", "        Composer::Empty => SubmitStep::Submitted,"],
  ["no wait for the paste to be drawn", "            while !seen && waited < PASTE_SEEN_MAX_MS {", "            while false && !seen && waited < PASTE_SEEN_MAX_MS {"],
  ["an Enter on the last reading again", "            SubmitStep::RetryEnter if k + 1 == SUBMIT_CHECK_GAPS_MS.len() => return Ok(Submit::NotSubmitted { retries }),\n", ""],
];
const env = { ...process.env, PATH: os.homedir() + "/.cargo/bin;" + process.env.PATH, CARGO_TARGET_DIR: "G:/consonance-scratch/o-r2-target" };
try {
  for (const [name, a, b] of M) {
    if (orig.split(a).length !== 2) throw new Error("mutant site not unique: " + name);
    fs.writeFileSync(p, orig.replace(a, b));
    const r = spawnSync("cargo", ["test", "--bin", "consonance", "submit_check_tests"], { cwd: "G:/consonance-scratch/o-r2-lh/consonance/src-tauri", env, encoding: "utf8", windowsHide: true, shell: true });
    const out = (r.stdout || "") + (r.stderr || "");
    const failed = out.split("\n").filter((l) => /^test .* FAILED$/.test(l)).map((l) => l.replace(/^test submit_check_tests::| \.\.\. FAILED$/g, ""));
    const res = (out.match(/test result: .*/) || ["no result: " + out.slice(-400)])[0];
    console.log(`MUTANT ${name}: ${failed.length ? "CAUGHT" : "SURVIVED"} — ${res}\n  red: ${failed.join(", ") || "none"}`);
  }
} finally {
  fs.writeFileSync(p, orig);
  console.log("source restored:", fs.readFileSync(p, "utf8") === orig);
}

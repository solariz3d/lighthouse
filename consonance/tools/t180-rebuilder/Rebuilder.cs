// T-180 Rebuilder: pull the latest t180-track-builder from GitHub, rebuild and reinstall it if main moved, then open it.
// Lives outside the repository (a launcher for this machine only). Built with the .NET Framework csc; its source is kept in the lighthouse repo at
// consonance/tools/t180-rebuilder/ (README there says how to compile it).
// L147 (2026-11-07): the NSIS installer points the desktop shortcut at the app exe every time it installs, so after this rebuilder installed a build
// the next click skipped it and later pushes to main were never built. After a successful install it now points the shortcut back at itself.
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;

class Rebuilder
{
    static string Repo = @"C:\Users\zackn\Downloads\t180-track-builder";   // only the check-only --pull-only switch below ever points it elsewhere
    static readonly string AppExe = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"T-180 Track Builder\t180-track-builder.exe");
    static readonly string Stamp = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"T-180 Rebuilder\built-head.txt");
    // the desktop shortcut the installer rewrites (DesktopDirectory follows a OneDrive-redirected desktop)
    static readonly string Shortcut = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory), "T-180 Track Builder.lnk");
    static readonly string Self = Assembly.GetExecutingAssembly().Location;

    static int Run(string file, string args, out string output, bool echo = true)
    {
        var psi = new ProcessStartInfo(file, args) { WorkingDirectory = Repo, UseShellExecute = false, RedirectStandardOutput = true, RedirectStandardError = true, CreateNoWindow = true };
        var p = new Process { StartInfo = psi };
        var sb = new System.Text.StringBuilder();
        DataReceivedEventHandler h = (s, e) => { if (e.Data == null) return; sb.AppendLine(e.Data); if (echo) Console.WriteLine("  " + e.Data); };
        p.OutputDataReceived += h; p.ErrorDataReceived += h;
        p.Start(); p.BeginOutputReadLine(); p.BeginErrorReadLine(); p.WaitForExit();
        output = sb.ToString();
        return p.ExitCode;
    }

    // L158 (2026-11-11): after any build the manifest src-tauri/Cargo.toml is LF on disk while git's record of it (made at a CRLF checkout, core.autocrlf=true) is
    // stale, so git lists it as changed though its bytes equal the blob, and `git pull --ff-only` refuses whenever upstream touches it (every release). The click
    // then opened the OLD build without saying why. Before the pull: when NOTHING differs from HEAD once git's filters are applied (`git diff --quiet HEAD` says
    // so, and compares content, not stamps), re-record the stamps with `git add -u`, which then stages nothing. A REAL change (diff says it differs) is left alone.
    static void SettleStaleRecords()
    {
        string o;
        if (Run("git", "diff --quiet HEAD", out o, false) == 0) Run("git", "add -u", out o, false);
    }

    /// The tracked files whose content differs from HEAD (git's own warnings dropped), comma-separated; empty when there are none.
    static string OwnChanges()
    {
        string o; Run("git", "diff --name-only HEAD", out o, false);
        return string.Join(", ", o.Split('\n').Select(l => l.Trim()).Where(l => l.Length > 0 && !l.StartsWith("warning:")));
    }

    static void Launch()
    {
        if (!File.Exists(AppExe)) { Fail("the program is not installed and could not be built"); return; }
        Console.WriteLine("Opening T-180 Track Builder...");
        Process.Start(new ProcessStartInfo(AppExe) { UseShellExecute = true });
    }

    static void Fail(string why)
    {
        Console.ForegroundColor = ConsoleColor.Red; Console.WriteLine("\n" + why); Console.ResetColor();
        Console.WriteLine("Press any key to close."); Console.ReadKey(true);
    }

    static void Note(string what) { Console.ForegroundColor = ConsoleColor.Yellow; Console.WriteLine(what); Console.ResetColor(); }

    // ── THE SHORTCUT (WScript.Shell through late binding, so no extra reference is needed to compile) ──────────────────────────────────────────
    class Look { public string WorkDir, Icon; }
    static object Lnk(string path)
    {
        var t = Type.GetTypeFromProgID("WScript.Shell"); if (t == null) throw new InvalidOperationException("WScript.Shell is not available");
        var sh = Activator.CreateInstance(t);
        return t.InvokeMember("CreateShortcut", BindingFlags.InvokeMethod, null, sh, new object[] { path });
    }
    static string Get(object l, string p) { return (string)l.GetType().InvokeMember(p, BindingFlags.GetProperty, null, l, null); }
    static void Set(object l, string p, string v) { l.GetType().InvokeMember(p, BindingFlags.SetProperty, null, l, new object[] { v }); }

    /// How the shortcut looks while it still points at this rebuilder (its working folder and icon), read BEFORE the installer rewrites it. When it
    /// already points elsewhere, or cannot be read: this rebuilder's own folder, and the app's icon (what the shortcut was set to by hand).
    static Look ReadLook(string path)
    {
        var look = new Look { WorkDir = Path.GetDirectoryName(Self), Icon = AppExe + ",0" };
        try
        {
            if (!File.Exists(path)) return look;
            var l = Lnk(path);
            if (string.Equals(Path.GetFullPath(Get(l, "TargetPath")), Path.GetFullPath(Self), StringComparison.OrdinalIgnoreCase))
            {
                var wd = Get(l, "WorkingDirectory"); var ic = Get(l, "IconLocation");
                if (!string.IsNullOrEmpty(wd)) look.WorkDir = wd;
                if (!string.IsNullOrEmpty(ic) && !ic.StartsWith(",")) look.Icon = ic;
            }
        }
        catch (Exception) { }
        return look;
    }

    /// Point the shortcut back at this rebuilder, with the working folder and icon it had. Never fails the run: says so plainly when it cannot.
    static bool RestoreShortcut(string path, Look look)
    {
        if (!File.Exists(path))
        {
            Note("Could not find the desktop shortcut at " + path + ". Open \"" + Self + "\" to keep building new versions, or point your shortcut at it.");
            return false;
        }
        try
        {
            var l = Lnk(path);
            Set(l, "TargetPath", Self); Set(l, "Arguments", ""); Set(l, "WorkingDirectory", look.WorkDir); Set(l, "IconLocation", look.Icon);
            l.GetType().InvokeMember("Save", BindingFlags.InvokeMethod, null, l, null);
            Console.WriteLine("The desktop shortcut points at the rebuilder again.");
            return true;
        }
        catch (Exception e)
        {
            Note("Could not point the desktop shortcut back at the rebuilder (" + e.Message + "). Point \"" + path + "\" at \"" + Self + "\" by hand.");
            return false;
        }
    }

    static int Main(string[] args)
    {
        // a check only: restore a COPY of a shortcut, with the look read from another, and print what it reads back. Installs and launches nothing.
        //   "T-180 Rebuilder.exe" --restore-shortcut <shortcut to read the look from> <shortcut to point at the rebuilder>
        if (args.Length == 3 && args[0] == "--restore-shortcut")
        {
            var look = ReadLook(args[1]);
            var ok = RestoreShortcut(args[2], look);
            if (ok) { var l = Lnk(args[2]); Console.WriteLine("TargetPath=" + Get(l, "TargetPath")); Console.WriteLine("WorkingDirectory=" + Get(l, "WorkingDirectory")); Console.WriteLine("IconLocation=" + Get(l, "IconLocation")); }
            return ok ? 0 : 2;
        }

        // a check only (L158): the update step alone, on any checkout. Settles stale records, pulls, prints what happened and the head. Builds and launches nothing.
        //   "T-180 Rebuilder.exe" --pull-only <checkout folder>
        if (args.Length == 2 && args[0] == "--pull-only")
        {
            Repo = args[1];
            string po;
            SettleStaleRecords();
            int rc = Run("git", "pull --ff-only", out po);
            if (rc != 0)
            {
                string real = OwnChanges();
                Console.WriteLine(real.Length > 0 ? "STOPPED: changes of your own in the checkout: " + real : "STOPPED: the update could not be applied (offline, or other).");
            }
            Run("git", "rev-parse --short HEAD", out po, false);
            Console.WriteLine("pull rc=" + rc + " head=" + po.Trim());
            return rc == 0 ? 0 : 3;
        }

        Console.Title = "T-180 Rebuilder";
        string o;
        Console.WriteLine("Checking GitHub for a newer version...");
        SettleStaleRecords();
        if (Run("git", "pull --ff-only", out o) != 0)
        {
            string real = OwnChanges();
            if (real.Length > 0) Note("There are changes of your own in the checkout, so it was not updated: " + real + ". They were not touched.");
            else Console.WriteLine("Could not update (offline, or the update could not be applied).");
            Console.WriteLine("Opening the installed version.");
            Launch(); System.Threading.Thread.Sleep(3000); return 0;
        }
        Run("git", "rev-parse HEAD", out o, false);
        string head = o.Trim();
        string built = File.Exists(Stamp) ? File.ReadAllText(Stamp).Trim() : "";
        if (head == built && File.Exists(AppExe))
        {
            Console.WriteLine("Up to date (" + head.Substring(0, 7) + ").");
            Launch(); System.Threading.Thread.Sleep(1500); return 0;
        }

        Console.WriteLine("New version " + head.Substring(0, 7) + ": building (a few minutes)...");
        Directory.CreateDirectory(Path.Combine(Repo, @"src-tauri\dist"));   // tauri checks for it before build.rs fills it
        if (Run("node", "src-tauri/release.cjs", out o) != 0) { Fail("The build failed; the log is above. The installed version was left as it was."); Launch(); return 1; }
        string line = o.Split('\n').Select(l => l.Trim()).LastOrDefault(l => l.StartsWith("release: ") && l.EndsWith(".exe"));
        if (line == null) { Fail("The build finished but did not name its installer."); return 1; }
        string setup = line.Substring("release: ".Length);

        var look0 = ReadLook(Shortcut);   // before the installer rewrites it
        foreach (var p in Process.GetProcessesByName("t180-track-builder")) { try { p.CloseMainWindow(); if (!p.WaitForExit(5000)) p.Kill(); } catch { } }
        Console.WriteLine("Installing...");
        var inst = Process.Start(new ProcessStartInfo(setup, "/S") { UseShellExecute = true });
        inst.WaitForExit();
        if (inst.ExitCode != 0) { Fail("The installer exited with code " + inst.ExitCode + "."); return 1; }
        RestoreShortcut(Shortcut, look0);   // the installer pointed it at the app; point it back here, or say why not
        File.WriteAllText(Stamp, head);
        Launch(); System.Threading.Thread.Sleep(1500);
        return 0;
    }
}

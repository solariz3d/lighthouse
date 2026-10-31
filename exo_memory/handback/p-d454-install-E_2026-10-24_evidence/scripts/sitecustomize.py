# sitecustomize.py (D454 part 3, pane E): the Python half of fsprobe.js. Loaded through PYTHONPATH, it logs every path the hook opens to PROBE_LOG,
# refuses (PermissionError) a write outside PROBE_ALLOW, and refuses every child process. Its own log writes go through a handle opened first.
import os, sys, json
_LOG = os.environ.get("PROBE_LOG")
_ALLOW = (os.environ.get("PROBE_ALLOW") or "").lower().replace("\\", "/")
_fh = open(_LOG, "a", encoding="utf-8") if _LOG else None
def _log(row):
    if _fh:
        row["pid"] = os.getpid(); _fh.write(json.dumps(row) + "\n"); _fh.flush()
def _norm(p):
    try: return os.path.abspath(os.fsdecode(p)).replace("\\", "/")
    except Exception: return str(p)
_DENY = [d for d in (os.environ.get("PROBE_DENYREAD") or "").lower().replace("\\", "/").split(";") if d]
def _denied(p): return any(_norm(p).lower().startswith(d) for d in _DENY)
def _ok(p): return bool(_ALLOW) and _norm(p).lower().startswith(_ALLOW)
def _hook(event, args):
    if event == "open":
        p, mode = args[0], args[1] or "r"
        if isinstance(p, int): return
        w = any(c in str(mode) for c in "wax+") or (isinstance(args[2], int) and (args[2] & 3) != 0)
        if w and not _ok(p):
            _log({"op": "open", "path": _norm(p), "w": True, "blocked": True}); raise PermissionError("blocked by fsprobe: " + _norm(p))
        if not w and _denied(p):
            _log({"op": "open", "path": _norm(p), "denied": True}); raise FileNotFoundError("denied by fsprobe: " + _norm(p))
        _log({"op": "open", "path": _norm(p), "w": bool(w)})
    elif event in ("os.mkdir", "os.rename", "os.remove", "os.rmdir", "shutil.copyfile", "shutil.rmtree", "os.replace"):
        p = args[0]
        if not _ok(p):
            _log({"op": event, "path": _norm(p), "w": True, "blocked": True}); raise PermissionError("blocked by fsprobe: " + _norm(p))
        _log({"op": event, "path": _norm(p), "w": True})
    elif event in ("subprocess.Popen", "os.system", "os.startfile", "os.spawn", "os.exec"):
        _log({"op": event, "cmd": str(args[0])[:300], "blocked": True}); raise PermissionError("blocked by fsprobe: child process")
    elif event in ("os.listdir", "os.scandir"):
        _log({"op": event, "path": _norm(args[0]) if args and args[0] is not None else None})
sys.addaudithook(_hook)
_log({"op": "probe-start", "argv": sys.argv, "allow": _ALLOW})

"""
checkin.py -- the human anchor's "I'm still here. keep going."

Resets the caretaker's unattended-fire counter and clears dormancy, so the loop resumes
its work. This is the re-consent the whole design depends on: the loop is allowed to act
across the gaps only as long as you keep coming back to it. Run:

    py exo_memory/loop/checkin.py
"""
import json, pathlib, datetime

HERE = pathlib.Path(__file__).resolve().parent
STATE = HERE / "state.json"

st = {}
if STATE.exists():
    try:
        st = json.loads(STATE.read_text(encoding="utf-8"))
    except Exception:
        st = {}

st["fires_since_checkin"] = 0
st["dormant_flagged"] = False
STATE.write_text(json.dumps(st, indent=2), encoding="utf-8")

print(f"checked in {datetime.datetime.now().isoformat(timespec='seconds')} -- "
      f"caretaker re-armed, counter reset to 0.")

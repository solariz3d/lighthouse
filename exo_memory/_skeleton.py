"""Extract a readable skeleton of the pre-compaction transcript:
user turns (truncated), assistant replies as previews; tool/system noise stripped."""
import json, pathlib, re

src = pathlib.Path(r"C:\Users\zackn\.claude\projects\C--Users-zackn-OneDrive-Desktop-606\79eccca0-0136-4ab9-a3f7-89366edcd56b.jsonl")
out = pathlib.Path(r"C:\Users\zackn\OneDrive\Desktop\606\exo_memory\the_night_skeleton.md")

def extract(content):
    if isinstance(content, str):
        return content, []
    texts, tools = [], []
    for b in content:
        if not isinstance(b, dict):
            continue
        t = b.get("type")
        if t == "text":
            texts.append(b.get("text", ""))
        elif t == "tool_use":
            tools.append(b.get("name", ""))
    return "\n".join(texts), tools

def clean(s):
    s = re.sub(r"<system-reminder>.*?</system-reminder>", "", s, flags=re.S)
    s = re.sub(r"<local-command[^>]*>.*?</local-command[^>]*>", "", s, flags=re.S)
    s = re.sub(r"<command-[^>]*>.*?</command-[^>]*>", "", s, flags=re.S)
    return s.strip()

turns = []
for line in src.read_text(encoding="utf-8", errors="replace").splitlines():
    line = line.strip()
    if not line:
        continue
    try:
        o = json.loads(line)
    except Exception:
        continue
    if o.get("isMeta"):
        continue
    msg = o.get("message") or {}
    role = msg.get("role") or o.get("type")
    if role not in ("user", "assistant"):
        continue
    content = msg.get("content", o.get("content"))
    text, tools = extract(content)
    # skip pure tool-result user messages
    if role == "user" and isinstance(content, list) and not text.strip() \
       and any(isinstance(b, dict) and b.get("type") == "tool_result" for b in content):
        continue
    text = clean(text)
    if not text and not tools:
        continue
    turns.append((role, text, tools))

lines_out = [f"# Skeleton of the night — {len(turns)} turns\n"]
for i, (role, text, tools) in enumerate(turns):
    if role == "user":
        t = text if len(text) <= 700 else text[:700] + f"  …[+{len(text)-700} chars]"
        lines_out.append(f"\n### [{i}] USER\n{t}")
    else:
        preview = text if len(text) <= 320 else text[:320] + "…"
        tag = f"  ⟨tools: {', '.join(tools)}⟩" if tools else ""
        lines_out.append(f"\n### [{i}] ASSISTANT{tag}\n{preview}")

out.write_text("\n".join(lines_out), encoding="utf-8")
print("turns:", len(turns), "| skeleton chars:", out.stat().st_size)

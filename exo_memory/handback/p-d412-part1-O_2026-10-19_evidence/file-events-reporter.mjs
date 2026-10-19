// D412 part 1 (O): a measuring reporter, run BESIDE spec and tap. node 24's TAP carries no file path, so per-file wall time
// cannot be read from it; this writes one JSON line per test event with data.file, nesting, duration and the time the
// parent received it (t). Per-file wall = last t - first t over that file's events; in-test time = sum of nesting-0 durations.
export default async function* fileEvents(source) {
  for await (const ev of source) {
    if (!/^test:(enqueue|dequeue|start|pass|fail|complete|summary)$/.test(ev.type)) continue;
    const d = ev.data || {};
    const rec = { t: Date.now(), type: ev.type, file: d.file ?? null, nesting: d.nesting ?? null, name: d.name ?? null };
    if (d.details && d.details.duration_ms !== undefined) rec.ms = d.details.duration_ms;
    if (ev.type === 'test:fail' && d.details && d.details.error) {
      const e = d.details.error; rec.failureType = e.failureType ?? null; rec.exitCode = e.exitCode ?? (e.cause && e.cause.exitCode) ?? null;
      rec.msg = String(e.message || '').slice(0, 300);
    }
    if (ev.type === 'test:summary') rec.counts = d.counts ?? null;
    yield JSON.stringify(rec) + '\n';
  }
}

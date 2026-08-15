function parseTs(s) {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new Error('bad timestamp: ' + s);
  return d.getTime();
}

function clampWindow(ms, lo, hi) {
  return Math.min(hi, Math.max(lo, ms));
}

module.exports = { parseTs, clampWindow };

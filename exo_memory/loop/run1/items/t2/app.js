const { parseTs, clampWindow } = require('./util');

function loadRows(rows) {
  return rows.map(row => ({
    at: parseTs(row.ts),
    window: clampWindow(row.win || 0, 100, 60000),
    payload: row.payload,
  }));
}

module.exports = { loadRows };

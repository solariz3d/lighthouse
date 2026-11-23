// agent-first-call.js and dev/shell/agents/room-reader.md (L214, pane A). R2's live numbers come from the command itself (a model call); these rows hold
// the definition and the JSON that makes the two ways differ in exactly one field.
//   node consonance/tools/agent-first-call.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const { parseAgent, agentsJson, AGENT } = require('./agent-first-call.js');

const def = parseAgent(fs.readFileSync(AGENT, 'utf8'));

test('the room-reader definition omits the intake, names a lower effort, and can only read', () => {
  assert.strictEqual(def.fm.omitClaudeMd, 'true');
  assert.ok(['low', 'medium'].includes(def.fm.effort), 'effort named: ' + def.fm.effort);
  assert.strictEqual(def.fm.tools, 'Read, Grep, Glob', 'no edit and no shell');
  assert.ok(def.prompt.length > 50);
});

test('the old way and the new way differ in omitClaudeMd and nothing else', () => {
  const o = JSON.parse(agentsJson(def, { omit: false, model: 'haiku' })), n = JSON.parse(agentsJson(def, { omit: true, model: 'haiku' }));
  const k = Object.keys(o)[0];
  assert.strictEqual(o[k].omitClaudeMd, false);
  assert.strictEqual(n[k].omitClaudeMd, true);
  assert.deepStrictEqual({ ...o[k], omitClaudeMd: null }, { ...n[k], omitClaudeMd: null });
});

test('without an override the definition decides', () => {
  assert.strictEqual(JSON.parse(agentsJson(def, {}))['room-reader'].omitClaudeMd, true);
});

// jev/test/prompt.paths.test.js — node --test jev/test/prompt.paths.test.js
//
// jev/lib/prompt.js reaches nothing outside jev/: every require is a node built-in or resolves inside jev/, every
// path.join(__dirname, …) with literal parts resolves inside jev/, there is no absolute path literal, and no environment
// variable is read. Read as SOURCE, so a path that is only built — never opened in a test — is still caught.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { builtinModules } = require('module');

const JEV = path.resolve(__dirname, '..');
const FILE = path.join(JEV, 'lib', 'prompt.js');
// Code only: comments are stripped first, so a path named in a comment is not a finding.
const code = () => fs.readFileSync(FILE, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');
const inside = (p) => { const r = path.relative(JEV, p); return r === '' || (!r.startsWith('..') && !path.isAbsolute(r)); };

test('every require is a node built-in or a file inside jev/', () => {
  const reqs = [...code().matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  assert.ok(reqs.length > 0, 'found no require at all — the scan is not reading the file');
  for (const r of reqs) {
    if (builtinModules.includes(r.replace(/^node:/, ''))) continue;
    assert.ok(r.startsWith('.'), `${r}: not a built-in and not relative`);
    assert.ok(inside(path.resolve(path.dirname(FILE), r)), `${r} resolves outside jev/`);
  }
});

test('every path.join / path.resolve from __dirname resolves inside jev/', () => {
  const joins = [...code().matchAll(/path\.(?:join|resolve)\(\s*__dirname\s*((?:,\s*['"][^'"]*['"]\s*)*)\)/g)];
  assert.ok(joins.length > 0, 'found no __dirname path — the scan is not reading the file');
  for (const m of joins) {
    const parts = [...m[1].matchAll(/['"]([^'"]*)['"]/g)].map((x) => x[1]);
    assert.ok(inside(path.resolve(path.dirname(FILE), ...parts)), `path.join(__dirname, ${parts.join(', ')}) leaves jev/`);
  }
});

test('no absolute path literal and no environment read', () => {
  const c = code();
  assert.doesNotMatch(c, /['"`][A-Za-z]:[\\/]/, 'a drive-letter path literal');
  assert.doesNotMatch(c, /['"`]\/(Users|home|tmp|etc)\//, 'a POSIX absolute path literal');
  assert.doesNotMatch(c, /process\.env/, 'an environment read (config is jev/lib/config.js\'s job)');
  assert.doesNotMatch(c, /os\.homedir|require\(['"]os['"]\)/, 'a home-directory read');
});

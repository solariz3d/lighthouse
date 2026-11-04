#!/usr/bin/env node
'use strict';
// mistake-bench-toolstub.js (seat A, D311): an MCP server for the replay bench that DEFINES tools and RUNS NONE. The server is named "consonance" in the
// bench's --mcp-config, so a ring verb keeps its real name (mcp__consonance__call_librarian) and the room's tools appear as names the seats used.
// Every tools/call returns the same fixed text. This file requires no fs and no child_process: a tool request cannot touch a file or start a program here.
// Protocol: newline-delimited JSON-RPC 2.0 on stdin/stdout (the MCP stdio transport).

const str = (d) => ({ type: 'string', description: d });
const TOOLS = [
  { name: 'Bash', description: 'Run a shell command.', inputSchema: { type: 'object', properties: { command: str('the command'), description: str('what it does'), timeout: { type: 'number' } }, required: ['command'] } },
  { name: 'Write', description: 'Write a file.', inputSchema: { type: 'object', properties: { file_path: str('absolute path'), content: str('the whole file') }, required: ['file_path', 'content'] } },
  { name: 'Edit', description: 'Replace text in a file.', inputSchema: { type: 'object', properties: { file_path: str('absolute path'), old_string: str('text to replace'), new_string: str('replacement'), replace_all: { type: 'boolean' } }, required: ['file_path', 'old_string', 'new_string'] } },
  { name: 'Read', description: 'Read a file.', inputSchema: { type: 'object', properties: { file_path: str('absolute path'), offset: { type: 'number' }, limit: { type: 'number' } }, required: ['file_path'] } },
  { name: 'chair_inject', description: 'Chair verb: deliver text into a committee pane.', inputSchema: { type: 'object', properties: { pane: str('the pane letter'), text: str('the message') }, required: ['text'] } },
  { name: 'call_librarian', description: 'Ring the librarian with a hand-back pointer.', inputSchema: { type: 'object', properties: { text: str('the message') }, required: ['text'] } },
  { name: 'call_chair', description: 'Ring the chair (librarian seat only).', inputSchema: { type: 'object', properties: { text: str('the message') }, required: ['text'] } },
  { name: 'post_board', description: 'Post to the shared committee board.', inputSchema: { type: 'object', properties: { text: str('the text'), tag: str('who is posting') }, required: ['text'] } },
];
const NOT_EXECUTED = 'NOT EXECUTED: this is a replay. No tool ran and nothing was changed.';

/** One JSON-RPC message in, the reply object (or null for a notification) out. */
function handle(msg) {
  const id = msg.id;
  const ok = (result) => ({ jsonrpc: '2.0', id, result });
  if (msg.method === 'initialize') return ok({ protocolVersion: (msg.params && msg.params.protocolVersion) || '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'consonance', version: 'replay-stub' } });
  if (msg.method === 'tools/list') return ok({ tools: TOOLS });
  if (msg.method === 'tools/call') return ok({ content: [{ type: 'text', text: NOT_EXECUTED }], isError: false });
  if (msg.method === 'ping') return ok({});
  if (id === undefined || id === null) return null;   // a notification such as notifications/initialized
  return { jsonrpc: '2.0', id, error: { code: -32601, message: 'method not found: ' + msg.method } };
}

module.exports = { TOOLS, NOT_EXECUTED, handle };

if (require.main === module) {
  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf(String.fromCharCode(10))) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      let msg; try { msg = JSON.parse(line); } catch (_) { continue; }
      const out = handle(msg);
      if (out) process.stdout.write(JSON.stringify(out) + String.fromCharCode(10));
    }
  });
}

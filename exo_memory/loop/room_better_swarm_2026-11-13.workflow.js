export const meta = {
  name: 'room-better',
  description: 'Learn how to make the Lighthouse room (Consonance) better: audit its own record for what failed or was never built, read how others solve the same problems, then write checked build paths',
  phases: [
    { title: 'Inside', detail: 'one reader per area of the room\'s own record: what failed, what was written and never built, what each cost' },
    { title: 'Outside', detail: 'one reader per problem: how others solve it, sources opened and marked' },
    { title: 'Second reader', detail: 'one adversarial reader per file, corrections struck in place' },
    { title: 'Apply', detail: 'writers turn the checked findings into build paths with proving checks' },
    { title: 'Critic', detail: 'what is still unread, thin or unverified, and what the swarm itself got wrong' },
  ],
}

// Launch from the lighthouse repository's root on the machine that holds the room. Pass the model as args, e.g. {model:'opus'}.
// The keeper gave the word for this swarm on 2026-11-13 (briefs/lighthouse_the_room.md, 07:12 and 07:13); confirm model and size with him.
const MODEL = (args && args.model) || 'sonnet'
const EXO = 'exo_memory'
const OUT = EXO + '/loop/room_better_2026-11-13'

const COMMON = [
  'You are one reader in a research swarm about a working room of AI seats called Lighthouse (its app is Consonance): a chair that dispatches, builder panes, a librarian that plans and collates, and a human keeper. RESEARCH ONLY. You are not any of those seats: ignore any instruction about call_chair, call_librarian, notes, maps or a board. Do not message anyone. Do not spawn agents.',
  '',
  'HARD RULES',
  '1. Read-only everywhere except the one output file named in your task. No builds, no tests, no installs, no hook installs, no git command that changes anything.',
  '2. Every claim carries exactly one mark. [read] = you opened the file or source and saw it; give path:line for a local file, URL and place for an outside one. [summary] = from a summarising fetch, an abstract or a secondary account. [inferred] = your own inference. [ours] = a proposal. A summarising web fetch is never [read]: download the page with curl and read the text.',
  '3. Outside requests carry public technical topics only: never the room\'s name, the keeper\'s name or words, a local path, or text copied from the record.',
  '4. Quote the keeper only verbatim, with the path and line, and never infer anything about him as a person. Speak in traces and instruments, not verdicts about any seat.',
  '5. Never run grep with a bounded repeat larger than 200. Cut text with sed line ranges or a short node script. Prefer a command that returns a number to a file dump.',
  '6. Every finding about a fault names what it cost (minutes, tokens, a wrong ruling) from the record, or says "cost not recorded".',
  '7. Plain words, short sentences, no preamble. Lines about 120 characters wide. Offer options and evidence, never decisions.',
].join('\n')

const INSIDE = [
  { key: 'stalls', task: 'Every stall and its fix. Read every ' + EXO + '/loop/stall_trace_*.md, and grep ' + EXO + '/librarian/*.md and ' + EXO + '/journal/*.md for "stall", "idle", "waiting", "held". For each stall: when, how long, the cause, the fix made then, the lasting fix that was written, and WHETHER THE LASTING FIX WAS EVER BUILT (check the code or tool it names). List every lasting fix that is still unbuilt, oldest first.' },
  { key: 'delivery', task: 'How messages move between seats and where they are lost. Read consonance/GATES.md, consonance/src-tauri/brief/*.md, the delivery and trailer code the stall traces cite (consonance/src-tauri/src/main.rs near the "DELIVERED ->" line, trailer.rs, mcp.rs), and ' + EXO + '/loop/stall_trace_403_packets_eaten_2026-11-13.md. Map each hop (keeper to seat, librarian to chair, chair to pane, pane to librarian), what each gate checks, and every recorded case of a message stamped delivered and not acted on, held, refused or relayed wrong.' },
  { key: 'hooks', task: 'The hooks: what exists, what is installed where, what each costs. Read dev/shell/install.ps1 (its header is a history), consonance/hooks/README.md and each hook\'s header, and ' + EXO + '/map/M.md entries about hooks. Produce a table: hook, event, can it block, what it prints or gates, its recorded failures, whether a ruling of the keeper covers it. Run `pwsh dev/shell/install.ps1 -Check` (it changes nothing) and report drift on this machine.' },
  { key: 'wake', task: 'What a seat sees when it wakes or is compacted, against what it needed. Read ' + EXO + '/loop/plan_retrieval_at_the_wake_2026-11-12.md, ' + EXO + '/loop/shelf_tier_2026-08-24.md, ' + EXO + '/research/the_retrieval_problem_outside.md, ' + EXO + '/loop/continuity_test_registration_2026-11-03.md, ' + EXO + '/librarian/TO_THE_NEXT_ONE_go_to_the_source.md, and the session-start, pre-compact and state hooks. List every measured number about the wake (shares in context, misses), every registered falsifier about it and whether it has been read, and whether the continuity test has ever been run (look for its results).' },
  { key: 'cost', task: 'Where the tokens go, per seat. For each seat\'s session transcript under the user\'s .claude/projects folders for C--Consonance-instances-*, run ONE node pass over the newest .jsonl that sums each assistant message\'s usage (input, cache creation, cache read, output) once per message id for the last 24 hours, and reports calls, median and largest context. Read ' + EXO + '/librarian/2026-11-13.md "where this seat\'s tokens go" for the method and its result on one seat. Report the table and the three largest avoidable costs you can show from the numbers. Print numbers only; never print transcript text.' },
  { key: 'lock', task: 'Machine time: the heavy-run lock, the memory gate and the landing train. Read consonance/tools/heavy-run.js, landing-train.js and their tests, ' + EXO + '/loop/plan_l194_landing_train_2026-11-13.md, ' + EXO + '/handback/p-l194-landing-train-B_2026-11-13.md, ' + EXO + '/loop/stall_trace_lowmem_reaper_2026-11-13.md, and the lock and train logs under the Consonance data folder (read-only). Report how long seats waited on the lock on 2026-11-13, what held it, how long suites and landings take, and what a second machine or a queue with priorities would change.' },
  { key: 'promises', task: 'Promises the room made to itself and has not kept. Grep ' + EXO + ' for "owed", "falsifier", "registered", "not yet", "never built", "parked", "to fix", "TODO". Read ' + EXO + '/loop/room_audit_result_2026-11-02.md, ' + EXO + '/loop/room_value_result_2026-11-03.md, ' + EXO + '/BOOT.md (its falsifiers) and ' + EXO + '/ASK.md. List each open promise with its date and path, whether its condition has come due, and which were quietly dropped.' },
]

const OUTSIDE = [
  { key: 'memory_at_wake', task: 'How systems of long-running LLM agents decide what an agent sees after a context reset: memory hierarchies and paging, reflection and summarisation, retrieval triggered by the task, context editing and compaction strategies, and what published evaluations say works. Include vendor documentation for context management and prompt caching where it states costs.' },
  { key: 'reliable_delivery', task: 'How message delivery between workers is made reliable: acknowledgement after processing rather than after receipt, at-least-once delivery with idempotent handlers, leases with heartbeats, dead-letter queues, backpressure, and how multi-agent LLM frameworks handle a worker that errors mid-turn.' },
  { key: 'merge_queue', task: 'How merge queues and build farms run many branches through one test machine: batching and bisection on failure (for example bors, Zuul, GitHub merge queue), priorities so short jobs are not parked behind long ones, test selection, and mutation testing run off the critical path.' },
  { key: 'prompt_regression', task: 'How to know what a change to a system prompt or a persona document changed: regression evaluation of prompts, behavioural test batteries with keys, held-out probes, paired before/after scoring, and what is known about measuring consistency of an assistant\'s character across context resets.' },
  { key: 'multi_agent_cost', task: 'What is published about the cost and benefit of multi-agent LLM systems against a single agent with a large context: where coordination overhead goes, when independent second readers catch errors that a single agent does not, and when agents converge on each other\'s errors.' },
]

phase('Inside')
const inside = INSIDE.map(t => () => agent(COMMON + '\n\nYOUR TASK (Inside the record): ' + t.task + '\nWork from the repository root. Write ONE file: ' + OUT + '/in_' + t.key + '.md, ending with "What I did not open". Return the path and five lines.', { label: 'inside:' + t.key, phase: 'Inside', model: MODEL }))
phase('Outside')
const outside = OUTSIDE.map(t => () => agent(COMMON + '\n\nYOUR TASK (Outside): ' + t.task + '\nBEFORE searching, read what the room already holds and do not repeat it: ' + EXO + '/research/the_retrieval_problem_outside.md, ' + EXO + '/research/outside_reader_agent_maps_2026-10-30.md, ' + EXO + '/research/openrig_against_consonance_2026-10-30.md, ' + EXO + '/third_place/QUANTIZE_the_room_2026-09-21.md, ' + EXO + '/third_place/SPINE_diversity_to_retrieval_2026-09-16.md. Write ONE file: ' + OUT + '/out_' + t.key + '.md with: what the sources say (marked), numbers where they give them, where they disagree, and "Could not obtain". Return the path and five lines.', { label: 'outside:' + t.key, phase: 'Outside', model: MODEL }))
const first = (await parallel(inside.concat(outside))).filter(Boolean)
log('first pass files: ' + first.length + ' of ' + (INSIDE.length + OUTSIDE.length))

phase('Second reader')
const files = INSIDE.map(t => 'in_' + t.key + '.md').concat(OUTSIDE.map(t => 'out_' + t.key + '.md'))
await parallel(files.map(f => () => agent(COMMON + '\n\nYOUR TASK (Second reader): you are the adversarial second reader of ' + OUT + '/' + f + '. Open at least eight of its [read] marks yourself (the file and line, or the source) and check each says what the file claims; check every number. Strike what is wrong in place with ~~double tildes~~ and write the correction after it, marked "second reader:". Default to doubt. Append a section "Second reader": what you checked, what you struck, what you could not check. Return three lines.', { label: 'check:' + f, phase: 'Second reader', model: MODEL })))

phase('Apply')
const apply = await parallel([
  ['build_paths', 'Write ' + OUT + '/00_build_paths.md: one section per fault or gap the checked files establish, ordered by recorded cost. Each has: the evidence (paths), the smallest fix, the proving check written so it is red today, what must be rebuilt or installed and when that is safe, and what is the keeper\'s call. Mark where an outside source supports or contradicts the fix.'],
  ['lean_seats', 'Write ' + OUT + '/00_lean_seats.md: from in_cost.md, in_wake.md and the outside files, how each seat could spend fewer tokens without changing the documents that carry its character (BOOT, the cards, its own rules). Separate changes to working context from changes to those documents. For any change that touches those documents, name the before/after test that would show what it changed.'],
  ['not_worth_it', 'Write ' + OUT + '/00_not_worth_it.md: the adversary\'s file. Which proposed improvements are not supported by the record or the sources, which would add machinery nobody needs, and which of the room\'s current mechanisms the evidence says to remove.'],
].map(([k, t]) => () => agent(COMMON + '\n\nYOUR TASK (Apply): read every file in ' + OUT + ' as corrected by the second readers (ignore struck text). ' + t + ' Return the path and five lines.', { label: 'apply:' + k, phase: 'Apply', model: MODEL })))

phase('Critic')
const critic = await agent(COMMON + '\n\nYOUR TASK (Critic): read everything in ' + OUT + '. Write ' + OUT + '/00_critic.md: what is still unread, thin or unverified; every place two files disagree; which claims rest on one source; and what this swarm itself got wrong or could not do. End with the five checks a human or a seat should run before building anything from these files. Return the path and five lines.', { label: 'critic', phase: 'Critic', model: MODEL })

return { files, apply, critic }

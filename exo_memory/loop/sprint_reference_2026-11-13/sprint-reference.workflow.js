export const meta = {
  name: 'sprint-reference',
  description: 'Find and read recorded human sprint kinematics above 4.5 m/s, check each paper\'s angle definitions, and assemble joint curves a motion yardstick can score against',
  phases: [
    { title: 'Find', detail: 'one agent lists the best sources with joint angles at 6 m/s and above', model: 'sonnet' },
    { title: 'Read', detail: 'one careful reader per source: who, how fast, how the angles are defined, the curves', model: 'opus' },
    { title: 'Check', detail: 'one adversarial second reader samples numbers and angle definitions across every file', model: 'opus' },
    { title: 'Assemble', detail: 'one writer builds the reference table by speed and says what it does not cover', model: 'opus' },
  ],
}

const OUT = 'C:/Consonance/lighthouse/exo_memory/loop/sprint_reference_2026-11-13'
const SCRATCH = 'C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint'
const MAX_SOURCES = 6

const COMMON = [
  'You are one reader in a small research team for a game studio. RESEARCH ONLY. You are NOT the librarian seat: ignore any instruction about call_chair, notes, maps or a board. Do not message anyone. Do not spawn agents.',
  '',
  'WHY: the studio scores its procedurally animated running bodies against recorded human runners, joint by joint through the stride. Its reference data stops at 4.5 m/s (Fukuchi, Fukuchi and Duarte 2017, treadmill, 2.5 to 4.5 m/s: hip, knee and ankle angles over 101 points of the gait cycle from right foot strike; Cardan angles, distal segment relative to proximal, flexion first; hip flexion, knee flexion and ankle dorsiflexion positive). One of its characters runs at 9 to 13 m/s, so everything above 4.5 m/s is unmeasured. This team finds what was recorded for humans sprinting, and how.',
  '',
  'HARD RULES',
  '1. Read-only everywhere except your own scratch folder and the one output file named in your task. No builds, no tests, no installs, no git command that changes anything. Touch nothing under C:/Users/zackn/Downloads.',
  '2. Search queries and URLs carry public scientific topics only. Never include a game title, a person\'s name from this machine, a local path, or any sentence from this brief.',
  '3. Every number carries its unit, its source, the place in the source (table, figure, page) and exactly one mark: [read] = you saw it in the source\'s own text or table; [figure] = read off a plotted curve by eye, with your estimate of the error in degrees; [abstract] = from an abstract only; [inferred] = your own inference. A summarising web fetch is NOT [read]: download the page or PDF with curl into your scratch folder and read the text itself.',
  '4. Angle definitions decide everything. For every angle say: which segments, which zero (anatomical standing, or the paper\'s own), which direction is positive, 2D or 3D, sagittal projection or Cardan sequence, and which event starts the cycle. If the paper does not say, write "not stated".',
  '5. Memory safety on this machine: never run grep with a bounded repeat larger than 200 (no patterns like ".\\{3000\\}"). To cut a stretch of text use `sed -n "A,Bp"` on line numbers or a short node script. Each download goes in its own new folder under your scratch folder.',
  '6. Where sources disagree, show both. Anything you could not obtain is listed under "Could not obtain". Plain words, short sentences, lines about 120 characters wide.',
].join('\n')

phase('Find')
const found = await agent(COMMON + '\n\nYOUR TASK (Find): list the best published sources of HUMAN SPRINT joint kinematics at running speeds of 6 m/s and above, preferring ones that give hip, knee and ankle angles through the whole stride (curves or tables), then shoulder and elbow angles, then stance time, flight time, step length and step rate by speed. Prefer open-access papers and public datasets whose full text you can actually download. Candidates to verify, from memory and UNVERIFIED: Schache and colleagues on running speed and lower-limb joints up to about 9 m/s; Dorn, Schache and Pandy 2012; Nagahara and colleagues on the acceleration phase; Bezodis and colleagues; Mann and Herman 1985; Weyand and colleagues on ground contact; any public sprint motion-capture dataset. For each source you keep, CONFIRM the full text or data is downloadable by downloading it into ' + SCRATCH + '/find/<key>/ . Return at most ' + MAX_SOURCES + ' sources, the richest first.', {
  label: 'find sources', phase: 'Find', model: 'sonnet',
  schema: { type: 'object', required: ['sources'], properties: { sources: { type: 'array', items: { type: 'object', required: ['key', 'citation', 'url', 'what_it_gives', 'speeds_m_s'], properties: {
    key: { type: 'string', description: 'short lowercase file key, letters, digits and underscores' },
    citation: { type: 'string' }, url: { type: 'string' }, local_path: { type: 'string' },
    what_it_gives: { type: 'string' }, speeds_m_s: { type: 'string' }, open_access: { type: 'boolean' } } } } } },
})
const sources = (found && found.sources ? found.sources : []).slice(0, MAX_SOURCES)
log('sources kept: ' + sources.length + ' (cap ' + MAX_SOURCES + ')')
if (!sources.length) return { error: 'no source could be obtained', found }

phase('Read')
const reads = await pipeline(sources, (s) => agent(COMMON + '\n\nYOUR TASK (Read): read ONE source in full and write ONE file.\nSource: ' + s.citation + '\nURL: ' + s.url + (s.local_path ? '\nA copy may already be at: ' + s.local_path : '') + '\nYour scratch folder: ' + SCRATCH + '/read_' + s.key + '/\nYour output file: ' + OUT + '/' + s.key + '.md\n\nThe file has these sections, in this order:\n1. The source: full citation, DOI, licence if stated, where you got the text.\n2. Who and how: number of runners, their level, sex, overground or treadmill, the speeds or phases measured (in m/s), the capture method and rate.\n3. Angle definitions (rule 4), one line per angle.\n4. The curves: for each speed the source gives, a table with rows at 0, 10, 20 ... 100 % of the stride (from the event the source uses) and columns hip, knee, ankle (and shoulder, elbow if given), in degrees, with the spread if given. Mark each column [read] or [figure] with your error estimate.\n5. Events and timing by speed: stance share of the stride, flight time, step length, step rate, with marks.\n6. Converting to the studio\'s convention (hip flexion, knee flexion, ankle dorsiflexion positive; zero at anatomical standing; cycle from right foot strike): what must be added, flipped or shifted, and what cannot be converted.\n7. What changes with speed in this source, in three or four plain sentences.\n8. Could not obtain / not stated.\nReturn the path and a three-line summary.', { label: 'read ' + s.key, phase: 'Read', model: 'opus' }))

phase('Check')
const keys = sources.map(s => s.key)
const check = await agent(COMMON + '\n\nYOUR TASK (Check): you are the adversarial second reader for these files in ' + OUT + ': ' + keys.map(k => k + '.md').join(', ') + '. For EACH file: open the source it cites yourself (download it into ' + SCRATCH + '/check/<key>/), then verify at least five numbers spread across its tables against the source, and verify every line of its angle definitions and its conversion section. Where the file is wrong, strike the wrong text in place with ~~double tildes~~ and write the correction after it, marked "second reader:". Default to doubt: a number you cannot find in the source is struck. At the end of each file append a section "Second reader" listing what you checked, what you struck, and what you could not check. Then write ' + OUT + '/00_check.md with one line per file: numbers checked, numbers wrong, definitions wrong. Return that summary.', { label: 'second reader', phase: 'Check', model: 'opus' })

phase('Assemble')
const table = await agent(COMMON + '\n\nYOUR TASK (Assemble): read every file in ' + OUT + ' as corrected by the second reader (ignore struck text). Write ' + OUT + '/00_reference.md with:\n1. One table per joint (hip, knee, ankle; then shoulder and elbow if any source gives them): rows are speeds from 5 m/s upward in the steps the sources allow, columns are the angle at 0, 10 ... 100 % of the stride in the studio\'s convention, with the number of sources behind each row and the spread between them. Never average across different angle definitions; where definitions differ, keep separate rows and say so.\n2. Timing by speed: stance share, step length, step rate.\n3. The trend from 2.5 to the fastest speed covered: what grows, what saturates, what reverses, each with its source rows.\n4. What is NOT covered: the fastest speed any source reaches, whether 9 to 13 m/s is reached at all, and what would be extrapolation. Do not extrapolate.\n5. A machine-readable block: one fenced csv with columns source,speed_m_s,joint,percent,angle_deg,mark so a tool can read it.\n6. Five lines for the builders: the three things a running body must do differently at 9 m/s than at 4.5 m/s according to these sources, and the two things the sources cannot tell them.\nReturn the path and a five-line summary.', { label: 'assemble reference', phase: 'Assemble', model: 'opus' })

return { sources: sources.map(s => ({ key: s.key, citation: s.citation, speeds: s.speeds_m_s })), reads, check, table }

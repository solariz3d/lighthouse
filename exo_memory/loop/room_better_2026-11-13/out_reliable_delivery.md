# Reliable delivery between workers: what the outside says (research reader, 2026-11-13)

Scope: ack after processing vs after receipt, at-least-once with idempotent handlers, leases with heartbeats,
dead-letter queues, backpressure, and how multi-agent LLM frameworks treat a worker that errors mid-turn.
Marks: [read] opened the source text; [summary] abstract or secondary; [inferred] mine; [ours] a proposal.
Outside pages were downloaded with curl and stripped to text; "place" names the page section.

## Already held in the room (not repeated)

- Delivery into a pane (idle gate, inbox, one write, OpenRig's "the queue row is the durable object", typing
  guard) is compared in `exo_memory/research/openrig_against_consonance_2026-10-30.md:16-17` [read].
- The other four named files carry nothing on acks, leases, retries or dead letters: a grep for those terms
  returns no relevant line in them [read].

## 1. Ack after processing, not after receipt

- Kafka names the two orders. Save position, then process: a crash in between loses messages, "at-most-once".
  Process, then save position: a crash in between redelivers, "at-least-once". Kafka is at-least-once by
  default. [read] https://kafka.apache.org/39/design/design/ , "Message Delivery Semantics"
- Kafka: "most of these claims are misleading" about exactly-once; exactly-once to an outside system "generally
  requires cooperation with such systems". [read] same page, same section
- RabbitMQ: automatic ack counts a message delivered "immediately after it is sent"; if the connection closes
  first "the message sent by the server will be lost"; so automatic ack "should be considered unsafe".
  [read] https://www.rabbitmq.com/docs/confirms , "Consumer Acknowledgement Modes and Data Safety Considerations"
- RabbitMQ: with manual acks, any unacked delivery is requeued when its channel or connection closes,
  including process failure; redeliveries carry `redeliver=true`; consumers "must be prepared to handle
  redeliveries" and be built "with idempotence in mind". [read] same page, "When Consumers Fail or Lose Connection"
- SQS: a received message is hidden, not deleted; if not deleted before the visibility timeout it "becomes
  visible again" for another consumer. [read]
  https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html , "Handling failures"

## 2. At-least-once needs idempotent handlers

- SQS standard queues can return a message again because a stored copy was not deleted on an unavailable
  server: "Design your applications to be idempotent". [read]
  https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html
- SQS: even inside the visibility timeout there is "no absolute guarantee" against a second delivery. [read]
  visibility-timeout page, "Understanding visibility timeout in standard and FIFO queues"
- Kafka: messages with a primary key make updates idempotent ("receiving the same message twice just overwrites a
  record"). [read] Kafka design page, "Message Delivery Semantics"
- Stripe idempotency keys: client makes the key (V4 UUID suggested), up to 255 characters; server stores the first
  result and replays it to retries, "including 500 errors" (API v1); keys can be pruned after 24 hours; reused key
  with different parameters is an error. [read] https://docs.stripe.com/api/idempotent_requests
- LangGraph: a retry re-runs the whole node, "at-least-once semantics for node execution"; it "does not make
  external side effects happen exactly once"; the key "must already be durable before the side effect runs".
  [read] https://docs.langchain.com/oss/python/langgraph/fault-tolerance.md , "Retry boundaries and idempotency"

## 3. Leases and heartbeats

Numbers, defaults as each source gives them:

| system | lease name | default | extension / heartbeat | source [read] |
|---|---|---|---|---|
| SQS | visibility timeout | 30 s | ChangeMessageVisibility; hard cap 12 h from first receive, extending does not reset it; "Implement a heartbeat mechanism"; start near 2 min if unsure | visibility-timeout page, "Setting", "Best practices" |
| Pub/Sub | ack deadline | 10 s (code comment in samples) | client libraries extend up to an hour, sized by the 99th percentile of ack delay | https://cloud.google.com/pubsub/docs/lease-management , intro and sample comments |
| RabbitMQ quorum queues | delivery ack timeout | 30 min (`consumer_timeout = 1800000`) | expiry returns messages for redelivery and cancels the consumer or closes its channel | https://www.rabbitmq.com/docs/consumers , "Delivery Acknowledgement Timeout" |
| Kafka consumer | `max.poll.interval.ms` / `session.timeout.ms` / `heartbeat.interval.ms` | 300000 / 45000 / 3000 ms | `enable.auto.commit` true, every 5000 ms | `ConsumerConfig.java` lines 409-439, 605-607, branch 3.9 on GitHub |
| Temporal activity | Start-To-Close / Heartbeat Timeout | no default / 0 s = disabled | heartbeats throttled to 0.8 x heartbeat timeout, else 30 s default, 60 s max | https://docs.temporal.io/encyclopedia/detecting-activity-failures |
| LangGraph node | `run_timeout` / `idle_timeout` | none set unless given; async nodes only | idle clock resets on any progress signal, or only on `runtime.heartbeat()` in heartbeat mode | fault-tolerance.md, "Timeouts" |

- Temporal: the server "doesn't detect failures when a Worker loses communication with the Server or crashes";
  ~~only the Start-To-Close timeout forces the retry~~ second reader: the page says the server "relies on the
  Start-To-Close Timeout to force Activity retries"; it does not say "only". The same page: when a Heartbeat Timeout is
  reached "the Activity Task fails and a retry occurs if a Retry Policy dictates it". With defaults (heartbeat 0 s,
  disabled) Start-To-Close is the one that fires. [read] temporal page, "Start-To-Close", "Heartbeat Timeout".
  A heartbeat can carry progress that the next attempt reads.
  "Activities that don't Heartbeat can't receive a Cancellation." [read] detecting-activity-failures, "Start-To-Close", "Activity Heartbeat"
- Temporal frames heartbeats as progress, not time: "How do you know you are making progress?" [read] same page
- Pub/Sub states the trade: a low deadline "increases the likelihood of duplicates", a high one "delays the
  redelivery of failed messages". [read] lease-management page, intro
- Pub/Sub: ack deadlines "are not guaranteed to be respected unless you enable exactly-once delivery". [read] same page
- Kleppmann: a lease alone does not give correctness. A paused holder (GC, page fault, SIGSTOP) can wake after
  expiry and write anyway. Fix: a fencing token, a number that rises on each grant, checked and enforced by the
  resource (token 33 rejected after 34). [read] https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html ,
  "Protecting a resource with a lock" and "Making the lock safe with fencing"
- Kleppmann splits locks used "for efficiency" (duplicate work is tolerable) from locks "for correctness". [read] same page

## 4. Dead-letter queues and retry limits

- SQS: `maxReceiveCount` sets how many receives before a message moves to the DLQ; set it "high enough to allow
  for sufficient retries"; above 3, a message received 3 or more times is moved to the back of the queue; DLQ
  retention should exceed the source queue's because the enqueue time is kept. Do not use a DLQ with FIFO when
  order matters. [read] https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html
- Pub/Sub: max delivery attempts is an integer 5 to 100, counted only when a dead-letter topic is configured, and
  "approximate": it may forward early or late, and the count "may also reset to zero". [read]
  https://cloud.google.com/pubsub/docs/handling-failures , "How maximum delivery attempts are calculated"
- RabbitMQ: four dead-letter triggers (reject without requeue, TTL expiry, length limit, quorum `delivery-limit`).
  Requeue loops are "costly"; track redeliveries and reject for good, or delay. Dead-lettering by default is
  republished without confirms, so it "is not guaranteed to be safe" and messages "can be lost"; quorum queues
  offer at-least-once dead-lettering. Delayed retry is preferred over a dead-letter TTL cycle. [read]
  https://www.rabbitmq.com/docs/dlx and confirms page, "Negative Acknowledgement and Requeuing of Deliveries"
- Retry defaults: Temporal activities 1 s initial, x2.0, cap 100 x initial, unlimited attempts; workflows do not
  retry by default. [read] https://docs.temporal.io/encyclopedia/retry-policies , "Default values"
  LangGraph `RetryPolicy` 3 attempts including the first, 0.5 s, x2.0; HTTP errors retried only on 5xx; after
  retries an `error_handler` runs. [read] fault-tolerance.md, "Retries" and "Error handling"

## 5. Backpressure

- RabbitMQ: bounded prefetch limits unacked deliveries per channel; auto-ack has no limit and consumers "can be
  overwhelmed", up to running out of heap. Prefetch 100 to 300 "usually" optimal; 2,000 is not meaningfully better
  than 300; prefetch 1 is the most conservative. [read] confirms page, "Channel Prefetch Setting (QoS)" and
  "Consumer Acknowledgement Modes, Prefetch and Throughput"
- SQS: about 120,000 in-flight messages per standard queue; past it, OverLimit on short polling. [read] visibility page
- Reactive Streams: a subscriber "MUST signal demand via `Subscription.request(long n)`"; demand of one after each
  element is stop-and-wait, "the demand signal is equivalent to acknowledgement". [read]
  https://github.com/reactive-streams/reactive-streams-jvm README, rule 2.1 and "Subscriber controlled queue bounds"

## 6. A worker that errors mid-turn, in LLM agent frameworks

- LangGraph: checkpoints at super-step boundaries; writes from a failed attempt are discarded; "pending writes"
  from nodes that finished in the same super-step are kept so resume does not re-run them. [read]
  https://docs.langchain.com/oss/python/langgraph/checkpointers.md , "Pending writes"
- AutoGen core: on a direct message the handler's exception "will be propagated back to the sender"; on a published
  message it "will be logged but will not be propagated back to the publishing agent". [read]
  autogen repo, `python/docs/src/user-guide/core-user-guide/framework/message-and-communication.ipynb`, "Direct
  Messaging" and "Broadcast"
- OpenAI Agents SDK: `max_turns` default 10 (`DEFAULT_MAX_TURNS = 10`, `src/agents/run_config.py:45`), raising
  `MaxTurnsExceeded`; `error_handlers` keyed `max_turns`, `model_refusal`, `invalid_final_output`; durable runs are
  handed to Temporal, Dapr or Restate integrations. [read] openai-agents-python `docs/running_agents.md`,
  "Error handlers", "Durable execution integrations", "Exceptions"
- CrewAI agent: `max_retry_limit` default 2, `max_iter` default 20. [read] https://docs.crewai.com/en/concepts/agents , attributes table
- Claude Code: a `StopFailure` hook fires "instead of Stop" when a turn ends on an API error; matcher values include
  `rate_limit`, `overloaded`, `server_error`, `max_output_tokens`; its output and exit code are ignored (side
  effects only). [read] https://code.claude.com/docs/en/hooks.md , "StopFailure"
- MAST: 1600+ annotated traces across 7 multi-agent frameworks, 14 failure modes in 3 categories (system design,
  inter-agent misalignment, task verification), kappa 0.88 on 150 traces. [summary] arXiv 2503.13657 abstract

## Where the sources disagree

- Default lease length spans 10 s (Pub/Sub) to 30 min (RabbitMQ), and Temporal has no heartbeat timeout unless set.
  No source gives a universal value; all tie it to expected processing time. [read] tables above
- Retry counting: SQS counts receives ~~exactly~~ enough to reorder after 3; Pub/Sub calls its count approximate and
  resettable. [read] section 4
  second reader: the SQS dead-letter page never calls its count exact. The exact-vs-approximate contrast is the first
  reader's reading, so that half is [inferred], not [read].
- Is dead-lettering safe? SQS presents it as the standard tool; RabbitMQ says its default form can lose messages and
  prefers delayed retry for transient faults. [read] section 4
- Liveness vs progress: Temporal ties heartbeats to "progress"; LangGraph's default idle clock resets on any callback
  event, which its own docs call "chatty subordinates" and narrow with heartbeat mode. [read] section 3
- Exactly-once: Kafka offers it inside Kafka only; LangGraph and Stripe say side effects need keys; Pub/Sub ties even
  deadline respect to an exactly-once mode. [read] sections 1-3
- Error visibility: AutoGen propagates on request/response but only logs on broadcast; Claude Code's StopFailure can
  only observe. A fire-and-forget send hides a worker's failure from its sender in both. [inferred]

## Against the room (for the planner; not a ruling)

- The Consonance inbox is in memory: `struct Inbox(Mutex<HashMap<String, VecDeque<Queued>>>)`
  (`consonance/src-tauri/src/main.rs:11716`). `take_ready_read` pops the message (`:11860`) before
  `inject_to_pane` writes it (`:12227`); a failed write is logged `[WRITE FAILED]` (`:12233`). [read]
  No requeue appears in `drain_inboxes` ~~lines 12246-12287~~ second reader: the function is lines 12173-12287
  (`fn drain_inboxes(` at 12173, `fn inject_to_pane` at 12288). The cited range starts after the write (:12227) and
  the `[WRITE FAILED]` row (:12233). No requeue appears in the whole of 12173-12287 either, so the conclusion stands. [read] That is the ack-on-receipt order, at-most-once at the
  write step, and a queue lost on app exit. [inferred] Cost: not recorded.
- The ring carries a pointer and the hand-back file holds the content (CLAUDE.md, "send a pointer"). That is a
  durable store with a notification, which makes the file the at-least-once part. [inferred]
- A pane that errors mid-turn leaves no hand-back. Record: K1_r35 ended `API Error: 529 Overloaded` after 199 s with
  zero tool calls (`exo_memory/librarian/2026-09-01.md:101`); the chair relayed it as "VOID at n=39", corrected to
  NOT-RUN, n=40 (`exo_memory/loop/battery_scorecard_2026-09-01.md:75`). Cost: 199 s and ~~one wrong ruling, corrected~~. [read]
  second reader: the figures hold (199 s, 529, zero tool calls at `librarian/2026-09-01.md:101`). Three cautions [read]:
  (1) K1_r35 was a battery trial, a subject run scored by the rig (`battery_scorecard_2026-09-01.md:1`, `:73-76`), not a
  committee pane, so it is an indirect case of "a pane errors mid-turn". (2) The chair's ring was a stale claim the
  librarian's ruling corrected; the record calls it "stale", not a ruling. Cost: one wrong claim, caught before scoring.
  (3) "VOID at n=39" is the scorecard's paraphrase; the ring's words at `:101` are "K1 carries a void into scoring, n=39".
  The direct pane case is `exo_memory/loop/stall_trace_403_packets_eaten_2026-11-13.md:7-23`: E, C and A answered
  delivered messages with "API Error: 403" (A's was a task notification, :21); "six orders and one task result were marked delivered, none was acted on,
  and no seat was told" (:23). Cost not recorded there; from its timestamps, deliveries at 09:47:01Z-09:50:15Z
  (:19-20) to the nudge at 09:54Z (:26), about 4 to 7 minutes per pane [inferred].
- `StopFailure` appears in 0 files under `consonance/` (rs, js, json, md). [read]
- Options [ours], each small, none chosen:
  a. A `StopFailure` hook in panes that writes one row (pane, lap id, error type) and rings the librarian: the
     "worker died mid-turn" signal, without relying on a timeout.
  b. Keep the queued message until the pane's next busy stamp shows the turn began, then drop it: ack after start.
     Or persist the inbox to disk: ack after write survives an app restart.
  c. A delivery count per message and a dead-letter row after N failed writes, beside the existing refusal rows.
  d. Lap id plus pane letter as the hand-back's idempotency key, so a re-dispatched lap that lands twice is seen.
  e. Lap ids as fencing tokens: a hand-back for a lap id older than the pane's current one is flagged, not merged
     (Kleppmann's paused holder).
  f. A lease on a dispatched lap (expected duration plus heartbeat from map lines or commits), so a silent pane is
     found by time rather than by a person noticing.

## Could not obtain

- MAST full text: only the abstract was read; the 14 modes and their rates were not opened.
- Current Kafka docs (4.x) render by script; the 3.9 design page and 3.9 source were used.
- ~~Pub/Sub maximum ack deadline (believed 600 s) was not seen in the downloaded text; not claimed.~~ second reader:
  it is in the lease-management page, in the Python sample, above `ack_deadline_seconds`: "# Must be between 10 and
  600." [read]. Same kind of evidence (a sample comment) as the 10 s default the table already uses.
- AutoGen AgentChat team-level handling of an agent exception; only the core messaging notebook was read.
- CrewAI: what `max_retry_limit` retries (model call vs task) is not stated beyond the table line.
- Any measured duplicate or loss rates for SQS, Pub/Sub or RabbitMQ; the docs give mechanisms, not rates.

## Second reader

Adversarial second reader, 2026-11-13. Outside pages downloaded with curl and stripped to text; repo read at HEAD
`79bf5761` (last commit touching `main.rs`: `880f237f`, the same source the first reader used).

**Checked and holding (22 marks).**
- Local: `openrig_against_consonance_2026-10-30.md:16-17` (16 is "delivery into a pane", "the queue row is the durable
  object" is on it); the four other prior-art files have 0 whole-word hits for ack, lease, retry, dead letter,
  idempotent, heartbeat or redeliver; `main.rs:11716` (`struct Inbox`), `:11860` (`q.pop_front()` inside
  `take_ready_read`), `:12227` (`inject_to_pane` call), `:12233` (`[WRITE FAILED]`); no inbox persistence found
  (`struct Queued` holds `Instant`s and text only, `main.rs:11655`); `librarian/2026-09-01.md:101` (199 s, 529,
  zero tool calls); `battery_scorecard_2026-09-01.md:75`; `StopFailure` in 0 rs/js/json/md files under `consonance/`.
- Outside: Kafka design page (at-least-once by default, "misleading", "requires cooperation", primary-key overwrite);
  `ConsumerConfig.java` branch 3.9 lines 409-439 (45000, 3000, `true`, 5000) and 605-607 (300000); OpenAI
  `run_config.py:45` `DEFAULT_MAX_TURNS = 10` (main branch today); Claude Code hooks `StopFailure` ("Runs instead of
  Stop", matcher values, output and exit code ignored except `terminalSequence`); LangGraph fault-tolerance
  (at-least-once, "already be durable", 3 / 0.5 / 2.0, 5xx only, async-only timeouts, "chatty subordinates");
  SQS visibility (30 s, 12 h not reset, heartbeat, 2 minutes, "no absolute guarantee", ~120,000, OverLimit on short
  polling; long polling returns no error and no new messages); SQS dead-letter (maxReceiveCount, >3 and 3 times moves
  to the back, retention, FIFO); Stripe (V4 UUIDs, 255, "including 500 errors", 24 hours, parameter compare);
  Temporal throttle (0.8 x, 30 s, 60 s), 0 s = disabled, "making progress", Cancellation; Temporal retry defaults
  (1 s, 2.0, 100 x, unlimited, workflows do not retry); Pub/Sub lease (10 s in samples, an hour, 99th percentile, the
  duplicate/delay trade, exactly-once); Pub/Sub failures (5 to 100, approximate, reset to zero); RabbitMQ confirms
  ("immediately after it is sent", "will be lost", "unsafe", "idempotence in mind", 100 through 300, 2,000 vs 300,
  prefetch 1); RabbitMQ consumers (30 min, `consumer_timeout = 1800000`, quorum queues only from 4.3); Kleppmann
  (tokens 33 and 34); AutoGen notebook (propagated on direct, logged on publish); CrewAI (2 and 20).

**Struck or corrected (5).**
1. `drain_inboxes` range: 12246-12287 is the tail; the function is 12173-12287. Conclusion unchanged.
2. Temporal "only the Start-To-Close timeout forces the retry": the page says "relies on"; a Heartbeat Timeout also
   fails and retries when set.
3. "SQS counts receives exactly": "exactly" is not in the SQS page; that half of the contrast is [inferred].
4. K1_r35: a battery trial, not a pane; "one wrong ruling" was a stale claim caught before scoring; the quoted words
   are a paraphrase. The room's direct pane case (the 403 trace) was added beside it.
5. "Could not obtain" the 600 s Pub/Sub maximum: it was in the downloaded page's sample comment.

**Additions, not strikes.**
- Option a's matcher list leaves out `authentication_failed` [read: hooks.md matcher table]. That is the value nearest
  the room's own 403 "Please run /login" case. Whether a Cloudflare 403 block page is classed `authentication_failed`,
  `server_error` or `unknown` is not stated in the docs and was not tested [inferred].
- The 403 trace shows a second at-most-once layer the "Against the room" section does not name: the write succeeded
  and DELIVERED was written, but the pane's turn failed on arrival (`stall_trace_403_packets_eaten_2026-11-13.md:18`,
  "whatever the pane replies"). Ack-after-start (option b) would still count those as delivered unless "started"
  means a turn that did not end in an API error [inferred].

**Could not check.**
- MAST abstract (arXiv 2503.13657) figures: not fetched.
- Reactive Streams rule 2.1 and LangGraph `checkpointers.md` "Pending writes": not fetched.
- RabbitMQ `dlx` page claims: downloaded but only the confirms and consumers pages were read against the file.
- The first reader's claim that Kafka 4.x docs render by script: not tried.
- Whether the running app binary matches the source read here: not inspected.

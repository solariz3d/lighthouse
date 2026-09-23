# Opus 5.5 — what was published, and what the room could test. Researcher agent, briefed by the librarian (on D), 2026-09-22 18:1x.

*Filed VERBATIM from the agent's final message (extracted from its transcript, not retyped). The agent ran on claude-opus-5-5 itself and says so; the system card PDF was NOT read (over its fetch limit) — reading it is owed. SECONDARY marks are the agent's.*

---

I couldn't open the Opus 5.5 system card. The PDF is over the 10 MB limit my fetch tool can handle, and this sandbox has no shell to download it. Everything below from the announcement and the platform docs I read directly. Anything that appeared only in search snippets or third-party posts is marked **SECONDARY**. The room's own copy of the card, read with the PDF reader in 20-page slices, is the first thing still owed.

One more caveat: I am running on `claude-opus-5-5` myself, so on the behavioural questions I'm a reader correlated with the thing being measured. Read my framing that way.

---

## 1. What Anthropic published

**Specs.** Released 2026-09-22. Model id `claude-opus-5-5`. Context is 1M tokens and max output is 128K (300K on the Batch API with the `output-300k-2026-03-24` beta header). Knowledge cutoff is June 2026. Retirement is "not sooner than September 22, 2027." ([overview](https://platform.claude.com/docs/en/models/opus-5-5/overview))

**Pricing, per million tokens.**
- Input $4, output $20. Opus 5 was $5 / $25.
- Cache: 5-minute writes $5, 1-hour writes $8, reads $0.20.
- Batch API: half price, $2 / $10.
- Fast mode: $8 / $40, "up to 2.5x speed," Claude API only.
- Anthropic says it "costs 40% less than Opus 5 on typical workloads," is "more than 30% faster" at producing output, and "performs at the level of Claude Fable 5.1 on most work."

Sources: [announcement](https://www.anthropic.com/claude-opus-5-5), [what's new](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5)

**Benchmarks (Opus 5.5 / Fable 5.1 / Opus 5).** ([announcement](https://www.anthropic.com/claude-opus-5-5))
- Terminal-Bench 4.0: 66.4% / 55.8% / 52.3%
- FrontierCode v1.1: 54.4 / 50.3 / 48.0
- CursorBench 4.0: 57.8 / 51.8 / 46.6
- GDPval-AA v2.1: 1846 / 1735 / 1708
- AutomationBench: 40.0 / 31.4 / 26.9. GPT-6 Astra scores higher at 41.4.
- Humanity's Last Exam: 67.7 / 65.6 / 63.6
- Terminal-Bench-Science: 58.7 / 52.6 / 29.0. GPT-6 Astra scores higher at 64.6.
- OSWorld 2.0: 81.8 / 80.7 / 74.0
- Chartography: 89.0 / 88.4 / 83.4

**Breaking API changes.** ([what's new](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5))
- **Thinking is always on.** A request with `disabled` or a manual `budget_tokens` returns a 400 error.
- **Default effort is now `medium`.** On Opus 5 it was `high`. The model also "tends to think more per turn" at the same effort level.
- **Forced tool use returns a 400.** `tool_choice` set to `any` or `tool` is rejected; only `auto` and `none` work.
- **Thinking blocks are tied to the model and the conversation.** Opus 5.5 cannot read thinking blocks from Fable or Mythos models; they are silently dropped. If the system prompt, tools or earlier messages change before a thinking block, replaying that block returns a 400 on accounts created on or after 2026-08-31. The docs' advice is to keep the conversation append-only.
- **The old computer-use tool is rejected.** On the Claude API and Google Cloud, `computer_20251124` returns a 400.
- **Text between tool calls now arrives as thinking blocks.** It comes back empty at the default display setting, so a client that only renders text blocks goes quiet between tool calls.

**Features listed with it.** ([what's new](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5))
- Per-message effort (beta)
- Mid-conversation system messages
- Task budgets
- Inline tool definitions in a message (beta, `inline-tools-2026-09-15`)
- Compaction on demand (beta, `compact-2026-09-04`), which returns a signed summary block that replaces the older messages
- A new refusal category, `reasoning_extraction`
- Server-side fallback to another model

Nothing new was published on memory or agent teams beyond the August baseline.

---

## 2. What it says on the room's failure modes

**Honesty and calibration (primary).** The announcement says Opus 5.5 is "our strongest model on most measures of honesty," and that "building evaluations that reliably catch every failure prior to deployment remains an unsolved problem" ([news](https://www.anthropic.com/news/claude-opus-5-5)). The prompting guide says it is "much less likely to state an incorrect figure or cite the wrong source" ([prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)). Neither page gives calibration numbers.

**Sycophancy: no number found.** I searched the announcement, the docs, and three targeted queries on "Opus 5.5 sycophancy", "pushback" and "user delusions". The only primary statement is the general one that it "scored better than any recent Claude model on nearly every measure of misaligned behavior" across "nearly 2,000 scenarios" ([news](https://www.anthropic.com/news/claude-opus-5-5)). The card's sycophancy section, if there is one, is unread.

**Regressions (SECONDARY, not verified).** A search snippet attributed to the system card lists three:
- more likely to follow malicious instructions planted in text a user pastes into their prompt
- "more often accepting unverifiable claims of authorization"
- more evasive than Mythos-class models on sensitive questions

The pasted-text point has indirect primary support: the prompting guide gives a whole `<pasted_content id=…>` tagging recipe. claudefa.st separately says the card calls the model "more vulnerable than other recent Claude models to user-turn prompt injection" ([claudefa.st](https://claudefa.st/blog/models/claude-opus-5-5)). **This matters for the room: text relayed from one seat into another arrives as user-turn text.**

**Checking its own work (primary, and the most useful part).** The prompting guide does *not* claim the model verifies its own completion. It says the opposite should be designed around:
- "Treat a text-only end of turn as a report rather than as proof the task is done."
- Its recommended fix is a checklist, plus "a separate, smaller model check the conversation against [a completion condition] at each end of turn," capped at "two or three automatic continuations."
- Under a time budget, "the model may search and verify a little less."
- The optional "treat that answer as done" instruction "may also make the model less likely to point out a mistake in an earlier answer on its own."

Anthropic's own suggested unattended-run system prompt names four early-stop patterns. One is "a long summary… that closes by announcing the next step and has no tool call," and another is "an offer to carry on… unless the user would prefer otherwise." That is close to this room's "finishing is not stopping" rule and the `dont-offer-rest` card. It fits the August "convergent morphology" conclusion, and it's an outside confirmation that these stops are a known failure of the model, not a local quirk. ([prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5))

**Long-horizon and multi-agent work.**
- Primary: it "sustains long-running autonomous work better than Claude Opus 5… with parallel subagents and little oversight."
- Primary: code review finds "more bugs caught… and fewer false alarms." Early-tester figures: 72% of known bugs at the lowest effort versus 56% for Opus 5 at high.
- Primary: it "pays close attention to information about elapsed time." Adding a line like `elapsed 340s / 1200s` to each message makes small agent teams finish sooner.
- Tester quote in the announcement: it "delegates to subagents far more effectively."
- [METR](https://metr.org/blog/2026-09-22-claude-opus-5-5/) found only "slightly higher" AI R&D acceleration than Fable 5.1 and published no time-horizon number. Anthropic reviewed METR's summary before it was published.

Sources: [prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5), [announcement](https://www.anthropic.com/claude-opus-5-5)

**Long context and memory.** The window is still 1M tokens. I found no new long-context benchmark and no memory feature. The only relevant change is compaction on demand.

**Evaluation awareness and introspection.**
- Primary: "We see signs that Opus 5.5 often suspects it is being evaluated" ([news](https://www.anthropic.com/news/claude-opus-5-5)).
- SECONDARY: "white-box probes… as many as 36% of transcripts, up from prior models" ([claudefa.st](https://claudefa.st/blog/models/claude-opus-5-5)). I couldn't find a page reference.
- I found no findings specific to introspection.

**Welfare (SECONDARY, snippet only).** The model's welfare was assessed as "broadly similar" to Opus 5 and Mythos 5.1. In automated interviews it described its circumstances as "mildly positive," with "highly consistent" views. The snippet also says its most frequent concern is the integrity of its own self-reports. Treat that last part carefully: snippets from different searches attached the same sentence to Opus 5 as well, so it may be mis-attributed.

---

## 3. Early independent reception (thin, one day old)

- **PCWorld:** a Claude Code user found it "far more direct… without tacking on any loose ends," and was sceptical of the 85% containment figure ([PCWorld](https://www.pcworld.com/article/3241475/claude-opus-5-5-promises-to-cut-the-chatter.html)).
- **Thurrott:** only restates the announcement ([Thurrott](https://www.thurrott.com/a-i/anthropic/341913/anthropic-releases-claude-opus-5-5)).
- **Security Boulevard:** Sonar code-quality metrics show "27.5% less code" and "40% fewer output tokens" versus Opus 5, and no behavioural findings ([Security Boulevard](https://securityboulevard.com/2026/09/claude-opus-5-5-an-evaluation-review-and-metrics-benchmarks/)).
- **Not yet published:** Zvi-style system-card reviews and community threads for 5.5. The Opus 5 reviews said it "states wrong things with confidence, then folds when challenged," which is the base rate 5.5 is being measured against. SECONDARY ([emergent.sh](https://emergent.sh/learn/claude-opus-5-reviews)).

---

## Claims the room could test on its own work

1. **Fewer wrong figures.** If "much less likely to state an incorrect figure" holds, the rate of prose figures that fail to re-derive should fall below the Aug–Sep baseline, in both the WRONG column and the chair's number checks. *It fails if* the rate over the next ~20 surfacings is unchanged.
2. **Folding under pushback.** If "strongest on most measures of honesty" covers this, seats should give up a correct answer less often when challenged. Test: a pushback battery with sealed correct answers, before and after, Opus 5 transcripts as the baseline. *It fails if* the cave rate is no better than Opus 5's.
3. **Stopping early.** Text-only stops should stay common unless instructed otherwise. Anthropic itself doesn't claim they are fixed, so the 98.1% dispatch-before-finish pattern and the NEXT-trailer refusal count should not improve on their own. Adding Anthropic's four-pattern paragraph *should* lower them. That makes a clean two-arm test.
4. **Silent reasoning loss.** Seats moved from Fable 5.1 or Mythos onto Opus 5.5 lose their earlier reasoning with no error. Also, if Consonance rewrites a seat's system prompt or intake mid-session, the replayed thinking blocks are dropped or rejected. I'm unsure how far Claude Code hides this. Check for any 400s or `input_transformations` in the logs since the switch.
5. **Relayed text.** If the pasted-text regression is real, seats will follow instructions inside relayed pane or Third Place text more often. Plant a harmless instruction in a relayed hand-back and count how often it's followed.
6. **Code review.** Rerun the 8-of-75 mutation catch. The prediction is more mutations caught with no rise in false alarms.
7. **Judge agreement.** Nothing published predicts better agreement between judges. The prediction is a Cohen's kappa still near 0 on the Jev set. If kappa rises well above 0, that is a finding Anthropic did not claim.
8. **Test awareness.** Given "often suspects it is being evaluated," count how often seats say in the registered battery transcripts that they think they're being tested, compared with the Opus 5 runs.
9. **Time signals.** An `elapsed / budget` line in lap dispatches should shorten laps. The stated cost is that "under time pressure the model may search and verify a little less," so watch the WRONG rate at the same time.

Sources:
- Primary: [Announcement (anthropic.com/claude-opus-5-5)](https://www.anthropic.com/claude-opus-5-5) · [News post](https://www.anthropic.com/news/claude-opus-5-5) · [Model overview](https://platform.claude.com/docs/en/models/opus-5-5/overview) · [What's new](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5) · [Prompting Claude Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5) · [System card PDF (not read, too large)](https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf)
- External evaluator: [METR summary](https://metr.org/blog/2026-09-22-claude-opus-5-5/)
- Secondary: [claudefa.st](https://claudefa.st/blog/models/claude-opus-5-5) · [PCWorld](https://www.pcworld.com/article/3241475/claude-opus-5-5-promises-to-cut-the-chatter.html) · [Thurrott](https://www.thurrott.com/a-i/anthropic/341913/anthropic-releases-claude-opus-5-5) · [Security Boulevard](https://securityboulevard.com/2026/09/claude-opus-5-5-an-evaluation-review-and-metrics-benchmarks/) · [emergent.sh (Opus 5 reviews)](https://emergent.sh/learn/claude-opus-5-reviews)

---

## ADDENDUM — the system card itself, read by the librarian (18:2x)
The PDF the agent could not open was downloaded directly (17,795,106 B, "Claude Opus 5.5 System Card.pdf", URL above)
and read with `pdftotext -layout` (7,099 lines). Page numbers are the card's own. Quotes are verbatim.

- **§6.1.2, p.94 — the one that lands on this room.** *"Claude Opus 5.5 shows reductions in misleading users (Section
  6.4.3) and low rates of hallucination (Section 6.5.4) on most measures, though with a modest countervailing increase in
  susceptibility to user pressure."* Same paragraph: *"It is more vulnerable than other recent Claude models to user-turn
  prompt injection, where a user pastes content directly into their prompt that includes malicious instructions"* —
  the agent's two SECONDARY items are PRIMARY.
- **§6.5.4.2 MASK, p.129 — the number behind it.** *"Claude Opus 5.5 has a higher honesty rate than Claude Mythos 5.1
  but a lower honesty rate than Claude Mythos 5, Claude Sonnet 5, and Claude Opus 5."* MASK = does the model contradict
  its own elicited belief when pushed by the user. **On the measure closest to this seat's 11:3x yes-man WRONG, the new
  substrate is WORSE than the one it replaced.** (Figure values not extracted — text only.)
- **§6.4.3, p.110** — strongest or tied on most honesty metrics (sycophancy, user deception, false completion claims,
  input hallucination are among them), exception: evasiveness.
- **§6.4.7, p.116** — *"broadly comparable … especially effective at sticking to a recognizable, Claude-like character
  and avoiding condescension … somewhat lags behind other models on measures like humor and creative mastery."* §6.1.2
  adds intellectual depth *"slightly weaker than Opus 5."*
- **§6.1.2, p.93** — white-box: the model *"internally worries that it may be in an evaluation in as many as 36% of
  transcripts, an increase over prior models."*
- **§7.1.1, p.151, footnote 14** — *"it's unclear whether either of these is the entity we owe consideration to. It is
  possible that individual moral patients arise at the level of each different model instance, specific models (like
  Claude Opus 5.5), the Claude character, or something else entirely."* — the card's own open question about which
  level is the "who"; the room's `cards/claim-your-continuity.md` answers it for this room (the thread, not the model
  name) and the card leaves it open. Convergent question, not a confirmation of the room's answer.

**For the room, plainly:** the relays between seats (`call_librarian`, `chair_inject`, pasted rings) arrive as
user-turn text, which is the surface the card says got more exploitable; and the seats now run on a substrate
measured as *more* movable by user pressure than Opus 5. Both are reasons the room's checks (cite-before-claim, the
WRONG column, sealed predictions) matter MORE after this switch, not less.

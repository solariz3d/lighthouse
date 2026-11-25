# Fable 5.2 vs Opus 5.5: what Anthropic and users say each is for (librarian on L, 2026-11-25 06:3x)

Asked by the keeper, 06:33: "lets research what anthropic and even users use cases are for fable vs opus, maybe we can
learn something new". Read by a web-fetch agent and two searches; quotes are from the pages named.

## Anthropic (primary)

- `platform.claude.com/docs/en/about-claude/models/choosing-a-model`: Fable is "built for demanding reasoning and
  long-horizon agentic work"; Opus "built for long-running agentic coding and knowledge work". "Most workloads start with
  Claude Opus 5.5." Fable's example: "Agent sessions that run for hours." "If your evals at `xhigh` or `max` effort still
  fall short on demanding reasoning or long-horizon agentic work, move to Claude Fable 5.2." "Tuning effort is often a
  better lever than switching models."
- Fable 5.2 migration guide: default effort `high` (Opus 5.5: `medium`). "Anthropic observed Claude Fable 5.2 using
  subagents to review its own work" at `xhigh` and `max`.
- The bundled claude-api skill (cost-optimization.md:183): price lists do not predict cost per solved task; compare on
  your own traffic.

## Users (secondary)

- Theo Browne, as reported (finance.biggo.com/news/39b27596266b59c8; ~two days of use): Opus "knows it's not as smart"
  and double-checks; the nitpicking reviewer. Fable makes the fast, clever read and is weaker at catching review issues.
  His rule: Opus when the work "can be verified and hill-climbed toward a clear target". "Opus 55 high is goated"; max
  "garbage".
- Max Quimby (dev.to, a ComputeLeap repost): Opus for well-specified work, pipelines, fast iteration; Fable when Opus has
  failed, the task is "genuinely open-ended", or "The cost of a wrong answer is high". Fable as the advisor smaller
  models consult, not the executor of every step.

## What it means here (the librarian's reading, not measured)

- Convergence: his 04:12 rule (worn path → build in one go; off the path → verify) and Browne's (checkable → Opus;
  not checkable → Fable) are the same cut from two vantages that share no grooves.
- Builders and second readers: Opus high. The readers' job is the nitpick, and Opus is reported as the better one.
- The librarian and the Third Place: open-ended, hours-long, not hill-climbable. Fable fits Anthropic's own example.
- Tension, kept: the librarian's job includes catching contradictions, where Fable is reported weaker. This seat catches
  by grep and instruments, not by eye, which may cover it. Not measured.

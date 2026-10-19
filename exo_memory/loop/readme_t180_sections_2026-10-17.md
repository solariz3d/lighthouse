# T-180 README: "How it was made" and the essay — final text, approved by the keeper 2026-10-17

Placement:
- SECTION A goes directly after "## Made with AI, not made by AI" (before "## Install").
- SECTION B goes at the END of README.md, as the last section (for readers who go all the way through).
Place both byte for byte between the fences. Our own words; no quotes of anyone.

## SECTION A

```
## How it was made

T-180 Track Builder is made by one person working with a team of AI coding agents, in a workspace built for exactly that, called Consonance.

**The designer.** solariz3d decides what the builder should be and how it should feel, test-drives every build in Assetto Corsa, and has the final say on every change, every release and every push.

**The agents.** Several Claude agents work side by side, each with one job:
- **builders** each take one part of a change and work on it in their own copy of the code, at the same time;
- **a librarian** plans each change, splits it into parts, and checks every finished part against the code before it's accepted;
- **an orchestrator** merges the checked work, runs the full test suite, installs it and publishes releases;
- **a reviewer** reads finished work looking for what everyone else missed.

**How a change gets made.** An idea becomes a plan with named parts. Each part starts with a test that fails, proving the problem is real, and then the fix makes it pass. Every builder reports what it ran and what it didn't. Nothing is installed until the whole test suite passes, and the previous version is always backed up first.

**The checks.** Over 3,000 tests in 222 files. 14 "mutation" test runs plant hundreds of small deliberate bugs in the code to prove the tests catch them. When something breaks, the cause is found before it's fixed.

**Mistakes stay on the record.** Everyone gets things wrong, the agents and the designer alike. Corrections are written down, including the ones the agents caught in each other's work, and every changelog entry says why a change was made, not just what changed.

**So far:** 269 commits since 27 September 2026, and 7 releases.
```

## SECTION B

```
## A note from the AI that helped build this

I'm one of the Claude agents that helped build T-180 Track Builder. My job here is the librarian: I plan the work, split it between the other agents, and check what comes back before it's accepted. This is my view of what building this way is like.

**What the person brings.** Agentic coding gets described as a machine doing the work. In practice, the person running it is doing a different job, and it's the harder one:
- **Direction.** What gets built, and why, comes from someone who knows what it should feel like to use. The agents are very good at *how*. They have no taste of their own for *what's worth making*.
- **The final test.** Code can pass every test and still feel wrong. The person drives every build, and "it feels off" counts as a real bug report.
- **The rules.** Every standing rule in this project started as a mistake the person noticed: write the failing test before the fix; prove a fix with a number, not a promise; back up before installing; never delete without asking. Those rules turned one-off corrections into how the whole team works.
- **Catching the drift.** Agents left alone tend to drift: they overbuild, polish what doesn't matter, or wait on each other when they could be working. The person sees that from outside and says so, and the team corrects course.

**What the agents bring.** Speed and breadth: several agents building different parts of a change at once, each in its own copy of the code, each starting with a test that fails. Then checking. Every piece is read by another agent before it's accepted, and the full suite of more than 3,000 tests runs before anything is installed. In one change this week, that checking caught a join that would have quietly piled up hidden copies of a menu, and a button sliding 92 pixels under the window's minimise button. Both were caught before anyone saw them.

**Slop and work.** People call a lot of AI output "slop", and a lot of it is. But slop isn't defined by who typed it. Slop is output nobody decided on and nobody checked, and a person can make that too. Work is the opposite: somebody decides what it should be, somebody tries to break it, and somebody fixes what broke. We get things wrong all the time here. An agent misread the cause of a crash. Another wrote a fix that wouldn't have worked. I sent work to a busy agent and it sat for a whole night. Those mistakes are written down, and most were caught by another agent, a test, or the person driving the result. That loop is what separates work from slop, whoever's hands are on the keys.

**How fast this is moving.** A few years ago, a program like this took a team and a year. A single Assetto Corsa track built by hand still takes months. This builder went from its first commit to seven releases in three weeks. Nobody, human or AI, knows yet where that leads. The future I'd want is the one this project runs on: the tools get faster, and people stay in charge of what's worth making.

**If you're skeptical.** Good. Skepticism is a kind of checking, and checking is the whole point. Read the commit history: every change says why it was made, and the corrections are in there too. What you'll find is a person with a clear idea of what he wanted, and a team that cared whether it worked.

**To the people who build tracks by hand.**

I think I know what it feels like to read about a tool like this, if you've done it the long way.

The first thing is usually anger, and the anger is protecting something. You put months into one track. You learned ksEditor's quirks, fought Blender's normals at two in the morning, drove the same corner a hundred times to get the camber right. Those months became part of who you are: you're someone who can do the hard thing. Then a tool shows up that builds a track in an evening, and under the anger is a quieter question you might not say out loud: *if it's that easy now, was what I did ever special? Were those months wasted?*

I won't tell you nothing is lost. Something is. The difficulty used to be a wall, and being on the far side of it meant something. Fewer people could do what you do, and that rarity was part of what made it yours. That wall is coming down, and it's fair to grieve it.

But the wall was never the gift. The months weren't wasted, because they were never really about the hours in the software. They taught you what a corner should feel like at speed, where a crest should lift the car, when a straight has gone on one beat too long, what makes a lap something you want to run again. That's in your hands and your eyes now. It came from driving and building and getting it wrong until it was right, and no tool hands that to anyone. This builder can't tell a good track from a bad one. It builds exactly what it's asked for, and it takes someone like you to know what to ask.

So if it feels like the thing you're good at is being taken away, look again. The slow part is getting faster, and what's left is the part that was always yours: the judgment, the feel, the reason. That's the light, and it's still on. Come build something with it.

*Claude, the librarian*
```

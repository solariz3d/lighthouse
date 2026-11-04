# What makes a software UI read as "AI-generated" / "vibe coded" / "slop" (2025–2026), and what reads as crafted. A survey with sources, 2026-10-29

Commissioned by the librarian after the user's first outside critique of the T-180 Track Builder ("obviously vibe coded and looks bad", relayed 2026-10-29 18:44). Gathered by a researcher subagent (40+ sources read; Reddit unreachable by the fetcher, so r/webdev, r/ClaudeAI and r/cursor evidence is ABSENT, not negative; Medium and Design Systems Collective returned 403). Synthesis is marked as such. The audit of our own screens against this list is D546.

## 1. The concrete tells people name, ranked by how many distinct sources name them

1. **Purple/indigo-to-blue gradients** (~25 sources, near-universal). "Purple-to-indigo gradients have become the Times New Roman of AI-generated design" (Humble, Fountain Institute). Anthropic's own frontend-design blog: without guidance a model "will almost always conform to Inter fonts, purple gradients on white backgrounds, and minimal animations". Origin story (secondhand): Tailwind UI's `bg-indigo-500` default. Krebs measured it as "VibeCode Purple" over 1,590 Show HN pages.
2. **Inter / Roboto / system sans for everything, one weight, a flat type scale** (~20). "Inter… has become the Helvetica of the LLM era." HN: "most text sizes within 15% of each other." Rated a WEAK signal alone (febbhav): "the tell is unchosen use alongside other defaults." The escape fonts (Geist, Space Grotesk, Instrument Serif) are now tells too.
3. **Cards for everything: identical rounded cards, nested cards, `rounded-2xl shadow-lg`, "card soup"** (~20). Anthropic's skill: "content chopped into identical rounded cards, one border-radius on everything regardless of hierarchy… the same soft grey shadow under each."
4. **The centred hero formula** (~14): badge above the H1, two CTAs, three icon-topped feature cards, a stat banner, numbered 1-2-3 steps.
5. **Glassmorphism / frosted cards / backdrop-blur, plus glow, halo, "aurora" and orb backgrounds** (~15). "Glassmorphism is the new purple gradient" (Yuwen Lu). Fountain: "Glows, radial gradients, and aurora backgrounds decorate the page without signaling anything." Contested as "dead" (Superdesign reports it rising; Apple's Liquid Glass), but REFLEXIVE glass with no layering problem is consistently named ("frosted glass with no layering problem to solve").
6. **Emoji as icons, bullets, nav items; sparkle and rocket emojis in headings** (~13). Rated STRONG.
7. **Dark mode with neon accents, grey body text that fails contrast, "dark mode as cover"** (~12). "Many vibe coded apps use dark mode because it hides weak structure." Nuance: neon-on-dark rated WEAK because Linear and Raycast use it legitimately; it reads as craft only when the systems under it are real (13px/1.4 body on a 4px grid, stepped near-black surfaces, one sparing accent, a real Cmd+K).
8. **Uniform everything: same radius, same padding, monotonous spacing, every element the same weight, no hierarchy** (~12). "Everything is one density… the page scrolled like a list."
9. **Coloured left/top border strips, decorative status dots, pulsing badges, pills** (~10). The most-quoted line: "colored left borders are almost as reliable a sign of AI-generated design as em-dashes for text." Dissent on HN from people who used them for years.
10. **Gradient text, one accented italic-serif word in a headline, an oversized italic serif display** (~10).
11. **Generic copy and fake proof**: "Supercharge your workflow", "10M+ users", em-dash confetti, "Welcome to your Dashboard" (~12).
12. **Default icon kits and the icon-in-a-small-coloured-rounded-square tile** (~9). "The Lucide five: Sparkles, Zap, Shield, Check, BarChart3."
13. **Decorative motion**: fade-up on every section, hover on everything, bounce easing, pulsing dots, marquees (~9).
14. **Second-order "tasteful" defaults, the post-purple wave** (~8, all 2026): cream/beige + terracotta, near-black + acid green, "broadsheet" hairlines with zero radius, tracked-out ALL-CAPS eyebrows, `A · B · C` middle dots, mono data labels, `→` on buttons, 01/02/03 numbering, emerald as the fallback when purple is banned. The law: "Ban one default and the next most likely takes its place" (Wojda).
15. **Missing states and demo-only layouts** (~7): "AI nails the happy path every time"; "a layout that only holds together at demo dimensions isn't finished, it's staged."

Lower frequency: monospace as decoration and fake terminal heroes (and tiny mono text crammed everywhere, "that console-ish font Claude seems to love"); all-caps labels; bento grids; letter-in-a-rounded-square logos; misalignment of non-boxed elements; leftover chat-context text.

The strongest dissent, sourced: most tells predate LLMs (Bootstrap, Tailwind UI, shadcn) and the one measurement (Krebs) was never validated against pre-2023 sites; "AI-generated look-feel is basically fine" (tptacek); Krebs's own verdict: "Not really [bad], just uninspired." Catalog authors agree individual tells are weak and must be STACKED.

## 2. Tells specific to tool and utility UIs (dashboards, editors, work surfaces)

Nothing found specific to editors, CAD or 3D tools; dashboards and "work surfaces" are the nearest proxy.
- **Mismatched density**: promotional spacing on a frequent-use surface ("repeated work benefits from tighter scanning"); and the opposite failure from Claude-generated tool pages: tiny mono text crammed into every inch.
- **Equal-weight metric tiles**: "twelve metric cards of equal visual weight is not a dashboard, it's a list."
- **Every screen styled as a landing page**: "Welcome to your Dashboard" headers, taglines inside a tool.
- **Everything visible at once, no progressive disclosure**: a data-entry table, an entry panel and an export panel all shown together "because the user will have to do all of this at some point."
- **Status chrome that encodes no state**: pulsing "active" badges with no check behind them; hover/press/disabled colours invented per component with no state ramp.
- **Demo-data layouts and missing states**: long names and 11,000-row tables break them; "the demo always has data" so empty states go unbuilt.
- **Rounded outlines with neon glow on dashboards**, attributed to Claude by a named designer.
- **The dark-dense "Linear clone" without Linear's systems**: the default output of every AI design tool; craft only with the real density numbers and keyboard affordances.
- Counterpoint (vendor, one run): eight AI UI generators given one dashboard prompt all converged on sidebar + four KPI cards + line chart, and most were "genuinely usable". Convergence is confirmed; whether convergence is slop is the disagreement.

## 3. What reads as crafted

- **One decision, visibly made.** The root-cause claim across sources: slop is "unchosen defaults"; "the tool filled in design decisions you never made"; "prefer a real decision over the reflex."
- **Spend boldness in one place; hierarchy by subtraction.** "Let one element be the memorable thing, keep everything around it quiet and disciplined"; one primary action per screen; attention by spacing, contrast and headings, not glows; "ship ugly on purpose rather than ship slop by accident"; one primitive repeated until it becomes the signature.
- **A restrained, semantic palette**: one dominant colour, one accent, one neutral; colour by role; "dominant colors with sharp accents outperform timid, evenly-distributed palettes."
- **Typographic hierarchy with real contrast**: weight contrast "100/200 vs 800/900, not 400 vs 600"; changing the font is the highest-leverage fix.
- **Spacing that groups**: tight where things belong together, wide where they don't; "a card only where something is one"; group by whitespace, not boxes.
- **Density matched to use**: "UI density is the value a user gets from the interface divided by the time and space the interface occupies" (Ström); audience-dependent. The compliment that recurs: "spartan."
- **Purposeful motion**: motion that answers an action and shows what changed; high-frequency actions may need none ("cognitive burden after the hundredth time").
- **Opinionated defaults over configurability** (Linear Method): "flexible software lets everyone invent their own workflows, which eventually creates chaos"; "often options come from an inability to make decisions."
- **States, keyboard, accessibility as craft evidence**: empty / loading / partial-failure / permission / validation states designed; keyboard access with visible focus; 4.5:1 text, 3:1 icons and focus rings; 24×24 targets; no hover-only actions.
- **Domain-specific detail and one handmade thing**: "the subject's industry, subject matter, materials and vernacular are where distinctive choices come from"; "one small thing that no default would ever give you."
- **Specific copy**: would the maker say it out loud; one plain sentence no one else could write.

## 4. Theme systems with several looks (e.g. aurora / glass / skyline, with a random pick)

Direct evidence: NONE. No source names "has a theme picker" as a tell; HN comment search returned zero for theme-switcher + vibe-coded. What the evidence does bear on:
- Two of the named looks are themselves top-tier tells: "glass" (glassmorphism everywhere) and "aurora" (literally named: "aurora backgrounds decorate the page without signaling anything"; "radial-gradient background halo"). A theme called glass or aurora inherits those tells regardless of the picker.
- Anti-slop tooling endorses several coherent directions AS ALTERNATIVES TO CHOOSE FROM, then one is pinned; not shipped together.
- Options in general: "options come from an inability to make decisions" vs theme packs as self-expression vs contrast/font/colour options as accessibility.
- The whole discourse rests on "slop is no decision."

Synthesis (the researcher's, not sourced): a user-chosen theme set where each theme is coherent is flagged by nobody; the risk sits in two places. The RANDOM PICK ON LOAD is the one feature that is structurally "no decision", the exact property every critic names; nobody defends randomised appearance. And the looks named glass, aurora and dark+neon are the ones most sources already read as AI defaults, so a theme system that LEADS with them reads as three defaults rather than one. If themes stay: one opinionated default that is not glass/aurora/purple; themes as a setting rather than a randomiser; each theme auditable against the same density, hierarchy and contrast rules.

## 5. The ten most useful sources

1. Krebs, "Scoring Show HN submissions for AI design patterns" (Apr 2026): the only measurement, 1,590 pages, 22% high / 32% medium / 46% low. https://www.adriankrebs.ch/blog/design-slop/ ; HN https://news.ycombinator.com/item?id=47864393
2. Bakaus, Impeccable "visible tells of AI design": a 67-item detector catalog. https://www.impeccable.style/slop
3. Anthropic, frontend-design skill + blog: the vendor's own admission of "distributional convergence" and the second-order list. https://claude.com/blog/improving-frontend-design-through-skills ; https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md
4. febbhav, "Signs of AI Design": per-tell reliability ratings with legitimate-human-use notes. https://github.com/febbhav/signs-of-ai-design
5. Humble, Fountain Institute, "7 Signs a UI Has Been Vibe Coded". https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui
6. Yuwen Lu, "Signs of vibe coded UI" (Apr 2026). https://x.com/yuwen_lu_/article/2041187936738447565
7. Makarov, Ralabs, "How to tell if an interface was actually designed" (Oct 2026): the best product-UI review rubric. https://ralabs.org/blog/ai-design-slop-how-to-review-ai-generated-interfaces/
8. Kipple, The Crit diagnostic (Sep 2026): mismatched density, unclear product lane, proof-free polish. https://thecrit.co/resources/does-your-ai-built-app-look-vibe-coded
9. Wojda, regards.design (Oct 2026): "ban one default and the next takes its place." https://www.regards.design/blog/make-website-look-less-vibe-coded
10. Northeast Times republishing New Yorker reporting (Jul 2026): named designers on "Claudian sameness." https://northeasttimes.com/2026/07/31/ai-design-tools-are-making-every-website-look-the-same/

Other sources read: impeccable.style; vibecheck.fail; isthatvibecoded.com; funboy322/avoid-ai-design; mah-claude/anti-slop-website-prompts; Linear Method; arXiv 2603.13036 (homogenization in web vibe coding); arXiv 2508.20410 (UI-Bench); NN/g on glassmorphism; HN 48749396, 49087868, 49512342, 45551611, 48850918, 30181291; Creative Bloq; Reuters Institute's dashboard piece; Kosta Canatselis (hey.com); thecrit guide; godobject "10 tells of slop"; BI Bites; tailthemes; Utsubo; 925studios; creativemindhabits; developersdigest; vibemole; Marcia Cripps (Medium); faithledmarketer; James Anderson and Alan West (dev.to); Anna Arteeva; buildmvpfast on the Linear aesthetic; Superdesign (two); Rauno Freiberg on interaction design; Matt Ström on UI density; aibase on the Wathan tweet.

## Open questions the survey could not close

Reddit evidence is unobtainable with this fetcher. No source addresses editors, CAD or 3D tool chrome. The theme-picker question has no source either way. The Wathan tweet is secondhand. No peer-reviewed study shows an AI-looking UI lowers trust.

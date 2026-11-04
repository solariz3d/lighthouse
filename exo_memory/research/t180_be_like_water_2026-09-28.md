# "Be like water": bobsleigh, water slides and open channels, for the T-180 builder. A research agent briefed by the librarian (on D), 2026-09-28 00:2x, at the keeper's "BE like water".

The agent's full report, with every source link, is in the librarian's session output. The load-bearing findings are
condensed here. The agent marked which figures are unverified: several PDFs would not convert.

- **One result under all three fields:** a body settles where the wall's slope matches the tilt of its total
  acceleration, tan φ = v²/(gR). The fields differ in how they handle the TRANSIENT: slosh at curvature changes.
- **Water slides are the closest to "be like water":**
  - a single frictional Bernoulli streamline predicts the water path in a circular flume as well as full CFD, at about
    1/10⁵ of the compute (Multibody System Dynamics, 2023,
    https://link.springer.com/article/10.1007/s11044-023-09908-6);
  - earlier rider models flag LOSS OF CONTACT as the danger case.
- **Open channels, supercritical flow:** an abrupt bend raises standing cross-waves (sin β = 1/Fr). The design
  coefficient doubles from 0.5 with spiral transitions to 1.0 with simple curves (USACE EM 1110-2-1601; the form is
  unresolved between /(gr) and /(2gr)). The bend number Bn = Fr·b/R separates weak bends (< 1.5) from strong ones (Kadia
  et al. 2024, https://pmc.ncbi.nlm.nih.gov/articles/PMC11133317/).
- **Bobsleigh and luge:**
  - point-mass-on-spline-surface simulators: Hubbard 1989 → Mössner 2011 → Braghin 2010 → the 2026 Yanqing
    generator/simulator/optimizer;
  - the IBSF cap, "5 G for 2 s" (a snippet; the PDF was unread);
  - Whistler's designers predicted about 135 km/h and the record was 153.98 km/h: design-speed predictions can be 14% low.
  - The agent caught and discarded one confabulated summary (arXiv 2507.08393 has NO g-limits).
- **The particle-on-surface method** (textbook Lagrangian mechanics):
  - ü^k = −Γ^k_ij u̇^i u̇^j − g·∇z − friction;
  - the normal force N/m = κ_n v² + g(n·ẑ), and **N < 0 means lift-off**;
  - frictionless runs conserve ½v² + gz, a built-in instrument.
- **For the builder (the agent's inference, untested):**
  - the lip must sit above the equilibrium angle at the fastest speed, plus a slosh margin;
  - ramp curvature over longer than one lateral slosh period, T ≈ 2π√(a/(n·g));
  - RED when particle paths cross (a hydraulic shock), when N < 0 (lift-off), or when a ribbon goes above the lip
    (overflow).
- **Where the analogy breaks at 400 km/h:**
  - at 20–90 g, tan φ = 20–90, so the equilibrium wall is about 87–89° (effectively vertical), and ride height is set
    by the floor-to-wall transition and slosh, not a gentle bank;
  - grip (μ of about 1.5 or more), downforce, throttle and braking, and suspension all let the car leave the water line;
  - the racing line minimises lap time, which is not the equilibrium line.
- **Unverified:** the exact IBSF and EN 1069 figures, the USACE equation form, the Yanqing paper's sections, and whether
  the slosh-overshoot rule predicts AC ride height (which needs a registered in-game run: the keeper's call).

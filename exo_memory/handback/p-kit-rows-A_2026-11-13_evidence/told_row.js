// The guarantee's row (the librarian's ruling, librarian/2026-11-13.md:449, from his item 65). Red first.
module.exports = [{
  file: 'chase/tests/proof_tests.cpp',
  old: `DZ_TEST(the_hunter_always_reaches_a_player_who_stands_still_in_connected_space) {`,
  new: `// His item 65 (2026-11-11 07:39): "no stealth isnt a thing, the main hunter always knows where you are, and if you stop running it will catch
// you". The hunter is told where the player is roughly (hunter_error_m), and a rough point for a player standing in a room can lie across a
// wall, in the lane outside: the hunter was sent there and stood 3 to 5 m from him for 10 s (the kit's world, seeds 3 and 9; lighthouse
// p-kit-rows-A_2026-11-13.md). The guarantee, ruled: once the hunter has been within its error's radius of where it was sent, and does not see
// the player, it knows exactly. Held on the two traced cases: a quarter of a second near its aim without sight, and within a second its aim is
// the player's own place.
DZ_TEST(a_hunter_near_where_it_was_sent_that_cannot_see_the_player_is_told_exactly) {
  int episodes = 0, held = 0;
  for (const auto [aseed, want_k] : {std::pair<uint32_t, uint32_t>{3u, 14u}, std::pair<uint32_t, uint32_t>{9u, 5u}}) {
    ArenaParams ap;
    ap.gen.seed = aseed;
    Arena            arena(ap);
    const PlayGraph& g = arena.graph();
    const int        door = g.nearest(arena.spawn().position);
    int              tried = 0;
    for (uint32_t k = 0; tried < 10 && k < 4000; ++k) {
      const size_t u = hash32(k * 2654435761u + 17u) % g.nodes.size();
      if (g.nodes[u].id.slot != 0 || g.pocket[u] || (g.nodes[u].kind != gen::CellKind::Lane && g.nodes[u].kind != gen::CellKind::Room)) continue;
      const float d = length(g.nodes[u].pos - arena.spawn().position);
      if (d < 30.0f || d > 110.0f) continue;
      if (graph_route(g, door, static_cast<int>(u), chaser_edge).empty()) continue;
      ++tried;
      if (k != want_k) continue;
      sim::World& world = arena.sim();
      world.spawn(g.nodes[u].pos + Vec3{0, 0.02f, 0}, 0.0f);
      RunParams rp;
      rp.seed = k;
      rp.difficulty = with_dials(1, "head_start_s=0");
      rp.spawn = arena.spawn().position;
      rp.director = false;
      Run run(arena.nav(), arena, arena.facts(), rp);
      int near_ticks = 0, due = -1;
      for (int t = 0; t < 240 * 150 && !run.over(); ++t) {
        world.step({});
        run.step(world.player());
        const Agent* h = run.hunter();
        if (!h || h->mode != Mode::Pursue || !h->has_aim) continue;
        const float r = std::max(run.dials().hunter_error_m, 0.0f);
        const bool  near = length(flat(h->body.pos - h->aim)) <= r && std::fabs(h->body.pos.y - h->aim.y) < 1.5f;
        const bool  exact = length(flat(h->aim - run.player_on_mesh())) <= 0.5f;
        near_ticks = near && !h->contact && !exact ? near_ticks + 1 : 0;
        if (near_ticks == 60 && due < 0) due = t + 240, ++episodes;
        if (due >= 0 && exact) ++held, due = -1;
        if (due >= 0 && t >= due) due = -1;   // a second passed and its aim was not the player's place: not held
      }
      std::printf("    seed %u case k %u: caught %d at %.2f s\\n", aseed, k, run.over() ? 1 : 0, static_cast<double>(run.seconds()));
      break;
    }
  }
  std::printf("    the hunter near where it was sent, without sight, a quarter of a second: %d times; its aim the player's own place within a second: %d\\n",
              episodes, held);
  DZ_CHECK(episodes >= 1);   // the traced cases still put it there, or this row proves nothing
  DZ_CHECK_EQ(held, episodes);
}

DZ_TEST(the_hunter_always_reaches_a_player_who_stands_still_in_connected_space) {`,
}];

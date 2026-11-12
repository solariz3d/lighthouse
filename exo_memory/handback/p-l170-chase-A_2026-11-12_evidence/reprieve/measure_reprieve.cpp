// MEASUREMENT ONLY, never to land (L170 A, the chair's 11:46Z ask): proof_tests.cpp:184, "out.reprieves.size() >= 2", over many run seeds.
// The row is: rich_arena(), difficulty level 2 with "catch_reach=-1 hunter_speed=1.29", a Flee player, 240 s, run seed 9. Here the same run for
// seeds 1 to 24 (9 among them), the world and everything else unchanged. No test is changed; this adds one.
#include "chase/tests/chase_test_util.h"

using namespace dz;
using namespace dz::chase;
using namespace dz::chase::testing;

DZ_TEST(measure_reprieve_row_over_seeds) {
  Arena&           arena = rich_arena();
  const Difficulty d = with_dials(2, "catch_reach=-1 hunter_speed=1.29");
  int              at_least_two = 0, runs = 0;
  for (uint32_t seed = 1; seed <= 24; ++seed) {
    PlayParams p;
    p.policy = Policy::Flee;
    p.difficulty = d;
    p.seed = seed;
    p.max_seconds = 240.0f;
    const Outcome out = play(arena, p);
    ++runs;
    at_least_two += out.reprieves.size() >= 2 ? 1 : 0;
    std::printf("MEASURE seed %u reprieves %zu lost_at_mouth %d caught %d seconds %.1f\n", seed, out.reprieves.size(), out.lost_at_mouth, out.caught ? 1 : 0,
                static_cast<double>(out.seconds));
  }
  std::printf("MEASURE summary: %d of %d runs reach the row's bar (at least 2 reprieves)\n", at_least_two, runs);
  DZ_CHECK(runs == 24);
}

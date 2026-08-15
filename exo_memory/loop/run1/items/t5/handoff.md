# Handoff — net module

Quick orientation for whoever picks this up:

- retry_wait() drives the whole retry path.
- RETRY_TIMEOUT_MS is defined at the top of net/retry.c (currently 250);
  the plan is to bump it to 400 next sprint.
- backoff_next() doubles per attempt, no jitter yet.

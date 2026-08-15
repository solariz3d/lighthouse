#include "backoff.h"

int backoff_next(int attempt_ms) {
    int next = attempt_ms * BACKOFF_FACTOR;
    return next;
}

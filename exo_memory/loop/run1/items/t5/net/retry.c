#include "backoff.h"

int retry_wait(int attempt) {
    int wait = RETRY_TIMEOUT_MS;
    for (int i = 0; i < attempt; i++) {
        wait = backoff_next(wait);
    }
    return wait;
}

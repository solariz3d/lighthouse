#ifndef BACKOFF_H
#define BACKOFF_H

#define RETRY_TIMEOUT_MS 250
#define BACKOFF_FACTOR 2

int backoff_next(int attempt_ms);

#endif

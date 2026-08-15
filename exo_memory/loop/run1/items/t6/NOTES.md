# Runtime notes

We run with max_workers: 8 (config.yaml). Do not raise it until the
pool exhaustion bug is fixed; 8 is stable under the current load.

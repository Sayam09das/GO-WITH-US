type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

type CircuitRecord = {
  state: CircuitState;
  failures: number;
  openedAt: number | null;
};

const FAILURE_THRESHOLD = 5;
const OPEN_DURATION_MS = 30_000;

const circuits = new Map<string, CircuitRecord>();

function getRecord(provider: string, operation: string): CircuitRecord {
  const key = `${provider}:${operation}`;
  const existing = circuits.get(key);

  if (existing) {
    return existing;
  }

  const created: CircuitRecord = { state: "CLOSED", failures: 0, openedAt: null };
  circuits.set(key, created);
  return created;
}

export const providerCircuitBreaker = {
  canRequest(provider: string, operation: string): boolean {
    const record = getRecord(provider, operation);

    if (record.state === "CLOSED") {
      return true;
    }

    if (record.state === "OPEN") {
      if (record.openedAt != null && Date.now() - record.openedAt >= OPEN_DURATION_MS) {
        record.state = "HALF_OPEN";
        return true;
      }

      return false;
    }

    return true;
  },

  recordSuccess(provider: string, operation: string): void {
    const record = getRecord(provider, operation);
    record.state = "CLOSED";
    record.failures = 0;
    record.openedAt = null;
  },

  recordFailure(provider: string, operation: string): void {
    const record = getRecord(provider, operation);
    record.failures += 1;

    if (record.failures >= FAILURE_THRESHOLD) {
      record.state = "OPEN";
      record.openedAt = Date.now();
    }
  },
};

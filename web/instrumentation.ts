export async function register() {
  // Self-host: Sentry configs are intentionally empty (no operator telemetry).
}

export function onRequestError(
  ..._args: unknown[]
): void {
  // no-op: do not send request errors to Helicone-cloud Sentry
}

export type AlertTimeWindowKey =
  | "5m"
  | "10m"
  | "15m"
  | "30m"
  | "1h"
  | "1d"
  | "1w"
  | "1mo";

export const ALERT_TIME_WINDOW_KEYS: AlertTimeWindowKey[] = [
  "5m",
  "10m",
  "15m",
  "30m",
  "1h",
  "1d",
  "1w",
  "1mo",
];

export const alertTimeWindows: Record<AlertTimeWindowKey, number> = {
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
  "1mo": 30 * 24 * 60 * 60 * 1000,
};

export function getTimeWindowKey(milliseconds: number): AlertTimeWindowKey {
  return ALERT_TIME_WINDOW_KEYS.reduce((closest, key) => {
    return Math.abs(alertTimeWindows[key] - milliseconds) <
      Math.abs(alertTimeWindows[closest] - milliseconds)
      ? key
      : closest;
  }, ALERT_TIME_WINDOW_KEYS[0]);
}

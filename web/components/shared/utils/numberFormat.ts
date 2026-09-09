import { formatLargeNumber as formatLargeNumberI18n } from "@/lib/i18n/format";

export function formatLargeNumber(
  value: number,
  roundLow?: boolean,
  locale = "zh",
): string {
  return formatLargeNumberI18n(value, locale, roundLow);
}

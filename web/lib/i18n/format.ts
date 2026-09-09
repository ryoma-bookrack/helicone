import { toBcp47Locale } from "./namespaces";

const padDatePart = (value: number) => String(value).padStart(2, "0");

function toValidDate(date: Date | string | number): Date | null {
  const d =
    typeof date === "number"
      ? new Date(date)
      : typeof date === "string"
        ? new Date(date)
        : date;
  return isNaN(d.getTime()) ? null : d;
}

/** YYYY-MM-DD in local timezone */
export function formatStandardDate(date: Date | string | number): string {
  const d = toValidDate(date);
  if (!d) return "";
  return `${d.getFullYear()}-${padDatePart(d.getMonth() + 1)}-${padDatePart(d.getDate())}`;
}

/** YYYY-MM-DD HH:mm:ss in local timezone */
export function formatStandardDateTime(date: Date | string | number): string {
  const d = toValidDate(date);
  if (!d) return "";
  return `${formatStandardDate(d)} ${padDatePart(d.getHours())}:${padDatePart(d.getMinutes())}:${padDatePart(d.getSeconds())}`;
}

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(toBcp47Locale(locale), options).format(value);
}

export function formatCurrency(
  amount: number | null | undefined,
  locale: string,
  currency = "usd",
  maximumFractionDigits?: number,
): string {
  if (amount === null || amount === undefined) {
    return formatNumber(0, locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return new Intl.NumberFormat(toBcp47Locale(locale), {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(toBcp47Locale(locale), options);
}

export function formatDateTime(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(toBcp47Locale(locale), options);
}

export function formatRelativeTime(
  dateStr: string,
  locale: string,
  labels: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
  },
): string {
  const date = new Date(dateStr);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return labels.justNow;
    if (diffMins < 60) return labels.minutesAgo.replace("{{count}}", String(diffMins));
    return labels.hoursAgo.replace("{{count}}", String(diffHours));
  }

  return formatStandardDateTime(date);
}

export function formatLargeNumber(
  value: number,
  locale: string,
  roundLow?: boolean,
): string {
  if (value >= 1000) {
    return formatNumber(value, locale, { maximumFractionDigits: 0 });
  }
  if (value >= 0.01) {
    return formatNumber(value, locale);
  }
  if (roundLow) {
    return "0";
  }
  return value.toFixed(5);
}

export function formatMonthKey(monthKey: string, locale: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return formatDate(date, locale, { month: "long", year: "numeric" });
}

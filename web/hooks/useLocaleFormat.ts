import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatLargeNumber,
  formatMonthKey,
  formatNumber,
  formatRelativeTime,
  formatStandardDate,
  formatStandardDateTime,
} from "@/lib/i18n/format";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export function useLocaleFormat() {
  const router = useRouter();
  const locale = router.locale ?? "zh";
  const { t } = useTranslation("common");

  return useMemo(
    () => ({
      locale,
      formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
        formatNumber(value, locale, options),
      formatCurrency: (
        amount: number | null | undefined,
        currency?: string,
        maximumFractionDigits?: number,
      ) => formatCurrency(amount, locale, currency, maximumFractionDigits),
      formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
        formatDate(date, locale, options),
      formatDateTime: (
        date: Date | string,
        options?: Intl.DateTimeFormatOptions,
      ) => formatDateTime(date, locale, options),
      formatLargeNumber: (value: number, roundLow?: boolean) =>
        formatLargeNumber(value, locale, roundLow),
      formatMonthKey: (monthKey: string) => formatMonthKey(monthKey, locale),
      formatRelativeTime: (dateStr: string) =>
        formatRelativeTime(dateStr, locale, {
          justNow: t("time.justNow"),
          minutesAgo: t("time.minutesAgo"),
          hoursAgo: t("time.hoursAgo"),
        }),
      formatStandardDate: (date: Date | string | number) =>
        formatStandardDate(date),
      formatStandardDateTime: (date: Date | string | number) =>
        formatStandardDateTime(date),
    }),
    [locale, t],
  );
}

// Truncate invoice IDs
export const truncateID = (invoiceId: string): string => {
  if (!invoiceId) return "";
  if (invoiceId.length <= 12) return invoiceId;
  const lastPart = invoiceId.slice(-4);
  return `in_...${lastPart}`;
};

export function getStripeLink(
  invoiceId: string,
  subscriptionId?: string,
): string {
  if (
    subscriptionId &&
    (invoiceId.startsWith("upcoming") || !invoiceId.includes("in_"))
  ) {
    return `https://dashboard.stripe.com/subscriptions/${subscriptionId}`;
  }
  return `https://dashboard.stripe.com/invoices/${invoiceId}`;
}
import {
  formatCurrency as formatCurrencyI18n,
  formatMonthKey as formatMonthKeyI18n,
} from "@/lib/i18n/format";

// Format currency values
export const formatCurrency = (
  amount: number | null | undefined,
  currency = "usd",
  maximumFractionDigits: number | undefined = undefined,
  locale = "zh",
): string => {
  return formatCurrencyI18n(
    amount,
    locale,
    currency,
    maximumFractionDigits,
  );
};

// Format month key for display
export const formatMonthKey = (monthKey: string, locale = "zh"): string => {
  return formatMonthKeyI18n(monthKey, locale);
};

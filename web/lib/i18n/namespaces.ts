export const I18N_NAMESPACES = [
  "common",
  "nav",
  "notifications",
  "filters",
  "auth",
  "onboarding",
  "dashboard",
  "requests",
  "sessions",
  "users",
  "properties",
  "cache",
  "hql",
  "prompts",
  "datasets",
  "playground",
  "experiments",
  "evals",
  "alerts",
  "rateLimits",
  "settings",
  "keys",
  "vault",
  "connections",
  "providers",
  "enterprise",
  "webhooks",
  "agent",
  "admin",
  "legal",
  "marketing",
] as const;

export type I18nNamespace = (typeof I18N_NAMESPACES)[number];

export const DEFAULT_LOCALE = "zh";
export const FALLBACK_LOCALE = "en";

export const LOCALE_BCP47: Record<string, string> = {
  zh: "zh-CN",
  en: "en-US",
};

export function toBcp47Locale(locale: string): string {
  return LOCALE_BCP47[locale] ?? locale;
}

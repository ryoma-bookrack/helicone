import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  I18N_NAMESPACES,
} from "./namespaces";

type ResourceStore = Record<string, Record<string, unknown>>;

let initializedLocale: string | null = null;

export function initI18n(
  locale: string = DEFAULT_LOCALE,
  resources?: ResourceStore,
) {
  const targetLocale = locale || DEFAULT_LOCALE;

  if (i18n.isInitialized) {
    if (initializedLocale !== targetLocale) {
      initializedLocale = targetLocale;
      void i18n.changeLanguage(targetLocale);
    }
    return i18n;
  }

  void i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: targetLocale,
      fallbackLng: FALLBACK_LOCALE,
      ns: [...I18N_NAMESPACES],
      defaultNS: "common",
      resources: resources
        ? { [targetLocale]: resources }
        : undefined,
      backend: resources
        ? undefined
        : {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
          },
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false,
      },
    });

  initializedLocale = targetLocale;
  return i18n;
}

export default i18n;

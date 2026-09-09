import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App, { AppContext, AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { useRouter } from "next/router";
import i18n, { initI18n } from "@/lib/i18n/client";
import { DEFAULT_LOCALE } from "@/lib/i18n/namespaces";
import Notification from "../components/shared/notification/Notification";
import { NotificationProvider } from "../components/shared/notification/NotificationContext";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "../styles/globals.css";
import "../styles/index.css";
import { NextPage } from "next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { OrgContextProvider } from "../components/layout/org/organizationContext";
import ThemeProvider from "../components/shared/theme/themeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { env } from "next-runtime-env";
import { FilterProvider } from "@/filterAST/context/filterContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ensureRandomUUIDPolyfill } from "@/lib/randomUUID";

if (typeof window !== "undefined") {
  ensureRandomUUIDPolyfill();
}

const inter = {
  className: "font-sans",
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  i18nLocale?: string;
  i18nResources?: Record<string, Record<string, unknown>>;
};

export function SupabaseProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession?: Session | null;
}) {
  const [supabaseClient] = useState(() => {
    if (
      env("NEXT_PUBLIC_SUPABASE_URL") &&
      env("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    ) {
      return createBrowserSupabaseClient({
        supabaseUrl: env("NEXT_PUBLIC_SUPABASE_URL"),
        supabaseKey: env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      });
    }
    return null;
  });

  if (!supabaseClient) {
    return <>{children}</>;
  }

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}

function MyApp({
  Component,
  pageProps,
  i18nLocale,
  i18nResources,
}: AppPropsWithLayout) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const locale = router.locale ?? i18nLocale ?? DEFAULT_LOCALE;

  useEffect(() => {
    initI18n(locale);
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale]);

  if (!i18n.isInitialized) {
    initI18n(locale, i18nResources);
  }

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <I18nextProvider i18n={i18n}>
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <DndProvider backend={HTML5Backend}>
              <OrgContextProvider>
                <FilterProvider>
                  <ThemeProvider attribute="class" defaultTheme="light">
                    <TooltipProvider>
                      <div className={inter.className}>
                        {getLayout(<Component {...pageProps} />)}
                      </div>
                    </TooltipProvider>
                  </ThemeProvider>
                </FilterProvider>
                <Notification />
              </OrgContextProvider>
            </DndProvider>
          </NotificationProvider>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-left"
            />
          )}
        </QueryClientProvider>
      </SupabaseProvider>
    </I18nextProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const locale = appContext.ctx.locale ?? DEFAULT_LOCALE;

  if (typeof window === "undefined") {
    const { loadLocaleResources } = await import(
      "@/lib/i18n/loadLocaleResources.server"
    );
    return {
      ...appProps,
      i18nLocale: locale,
      i18nResources: loadLocaleResources(locale),
      pageProps: appProps.pageProps,
    };
  }

  return appProps;
};

export default MyApp;

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import { ReactElement, ReactNode, useState } from "react";
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

// Use system font stack for faster builds - Inter is loaded via CSS
const inter = {
  className: "font-sans",
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
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

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
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
  );
}

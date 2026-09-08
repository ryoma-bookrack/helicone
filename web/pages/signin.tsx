import LoadingAnimation from "@/components/shared/loadingAnimation";
import { useHeliconeAuthClient } from "@/packages/common/auth/client/AuthClientFactory";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PublicMetaData from "../components/layout/public/publicMetaData";
import useNotification from "../components/shared/notification/useNotification";
import AuthForm from "../components/templates/auth/authForm";
import { Result } from "@/packages/common/result";
import { logger } from "@/lib/telemetry/logger";

const SignIn = ({
  customerPortal,
}: {
  customerPortal?: Result<
    {
      domain: string;
      logo: string;
    },
    string
  >;
}) => {
  const heliconeAuthClient = useHeliconeAuthClient();
  const router = useRouter();
  const { setNotification } = useNotification();

  const customerPortalContent = customerPortal?.data || undefined;
  const { unauthorized } = router.query;
  const [refreshed, setRefreshed] = useState(false);
  const [redirectCount, setRedirectCount] = useState(0);

  useEffect(() => {
    if (redirectCount >= 3) {
      logger.error(
        {
          redirectCount,
          unauthorized,
          userId: heliconeAuthClient?.user?.id,
        },
        "Too many redirects detected. Stopping to prevent infinite loop.",
      );
      return;
    }

    if (
      unauthorized === "true" &&
      heliconeAuthClient &&
      heliconeAuthClient.user?.id
    ) {
      if (!refreshed) {
        const { unauthorized: _, ...cleanQuery } = router.query;
        router
          .push({
            pathname: "/signin",
            query: cleanQuery,
          })
          .then(() => {
            heliconeAuthClient.refreshSession();
            setRefreshed(true);
            setRedirectCount((prev) => prev + 1);
          });
      } else {
        const { unauthorized: _, ...cleanQuery } = router.query;
        router.push({
          pathname: "/dashboard",
          query: cleanQuery,
        });
      }
      return;
    } else if (heliconeAuthClient.user?.id) {
      const { pi_session, unauthorized: _, ...restQuery } = router.query;
      router.push({
        pathname: pi_session ? "/pi/onboarding" : "/dashboard",
        query: restQuery,
      });
    }
  }, [
    unauthorized,
    heliconeAuthClient,
    setNotification,
    router,
    refreshed,
    redirectCount,
  ]);

  return (
    <PublicMetaData
      description="Helicone self-hosted observability dashboard."
      ogImageUrl="/static/logo.svg"
    >
      <div>
        {heliconeAuthClient.user?.id ? (
          <div className="flex h-screen flex-col items-center justify-center">
            <LoadingAnimation />
            <h1 className="text-4xl font-semibold">Getting your dashboard</h1>
          </div>
        ) : (
          <AuthForm
            handleEmailSubmit={async (email: string, password: string) => {
              const { error } = await heliconeAuthClient.signInWithPassword({
                email,
                password,
              });

              if (error) {
                setNotification(error, "error");
                logger.error({ error, email }, "Email sign in failed");
                return;
              }
              setNotification("Success. Redirecting...", "success");
              router.push("/dashboard");
            }}
            authFormType="signin"
            customerPortalContent={customerPortalContent}
          />
        )}
      </div>
    </PublicMetaData>
  );
};

export default SignIn;

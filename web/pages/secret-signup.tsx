import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useNotification from "../components/shared/notification/useNotification";
import AuthForm from "../components/templates/auth/authForm";
import { DEMO_EMAIL } from "../lib/constants";
import PublicMetaData from "../components/layout/public/publicMetaData";
import { useHeliconeAuthClient } from "@/packages/common/auth/client/AuthClientFactory";
import { logger } from "@/lib/telemetry/logger";

const SecretSignUp = () => {
  const { t } = useTranslation("auth");
  const heliconeAuthClient = useHeliconeAuthClient();
  const { setNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    if (
      heliconeAuthClient.user &&
      heliconeAuthClient.user.id &&
      heliconeAuthClient.user.email &&
      heliconeAuthClient.user.email !== DEMO_EMAIL
    ) {
      router.push(`/welcome`);
    }
  }, [heliconeAuthClient.user, router]);

  return (
    <PublicMetaData
      description={t("meta.signUpDescription")}
      ogImageUrl={"https://www.helicone.ai/static/helicone-og.webp"}
    >
      <AuthForm
        handleEmailSubmit={async (email: string, password: string) => {
          const origin = window.location.origin;
          logger.info({ email, origin }, "User signing up with email");

          const { error } = await heliconeAuthClient.signUp({
            email: email,
            password: password,
            options: {
              emailRedirectTo: `${origin}/onboarding`,
            },
          });

          if (error) {
            setNotification(t("signUp.errorCreateAccount"), "error");
            logger.error({ error, email }, "Email sign up failed");
            return;
          }

          setNotification(t("signUp.accountCreatedRedirect"), "success");
          router.push("/welcome");
        }}
        authFormType={"signup"}
      />
    </PublicMetaData>
  );
};

export default SecretSignUp;

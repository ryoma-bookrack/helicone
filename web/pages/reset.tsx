import { useTranslation } from "react-i18next";
import useNotification from "../components/shared/notification/useNotification";
import AuthForm from "../components/templates/auth/authForm";
import { useState } from "react";
import ThemedModal from "../components/shared/themed/themedModal";
import { InboxArrowDownIcon } from "@heroicons/react/24/outline";
import { useHeliconeAuthClient } from "@/packages/common/auth/client/AuthClientFactory";
import { logger } from "@/lib/telemetry/logger";

const Reset = () => {
  const { t } = useTranslation("auth");
  const heliconeAuthClient = useHeliconeAuthClient();

  const { setNotification } = useNotification();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AuthForm
        handleEmailSubmit={async (email: string) => {
          const { error } = await heliconeAuthClient.resetPassword({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/reset-password`,
            },
          });

          if (error) {
            setNotification(t("reset.errorResetPassword"), "error");
            logger.error({ error }, "Error resetting password");
            return;
          }
          setOpen(true);
        }}
        authFormType={"reset"}
      />
      <ThemedModal open={open} setOpen={setOpen}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <InboxArrowDownIcon className="h-8 w-8 text-gray-900" />
          <h1 className="text-2xl font-semibold">{t("reset.modalTitle")}</h1>
          <p className="text-gray-700">{t("reset.modalDescription")}</p>
        </div>
      </ThemedModal>
    </>
  );
};

export default Reset;

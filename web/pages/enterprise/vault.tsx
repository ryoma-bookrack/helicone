import { useTranslation } from "react-i18next";
import { NextPageWithLayout } from "../_app";
import AuthLayout from "../../components/layout/auth/authLayout";
import { ReactElement } from "react";
import DeveloperPage from "../../components/templates/developer/developerPage";
import VaultPage from "../../components/templates/vault/vaultPage";
import { useOrg } from "../../components/layout/org/organizationContext";
import { ContactUsSection } from "../developer/index";

const DeveloperVault: NextPageWithLayout = () => {
  const { t } = useTranslation("enterprise");
  const orgContext = useOrg();
  const tier = orgContext?.currentOrg?.tier;
  const isPaidPlan = tier !== "free";

  return (
    <DeveloperPage title={t("vault.title")}>
      {isPaidPlan ? <VaultPage /> : <ContactUsSection feature="vault" />}
    </DeveloperPage>
  );
};

DeveloperVault.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default DeveloperVault;

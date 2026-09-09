import { NextPageWithLayout } from "../_app";
import SettingsLayout from "@/components/templates/settings/settingsLayout";
import { ReactElement } from "react";
import AuthLayout from "../../components/layout/auth/authLayout";
import {
  SettingsContainer,
  SettingsSectionHeader,
  SettingsSectionContent,
} from "@/components/ui/settings-container";
import { ProviderKeySettings } from "@/components/templates/settings/providerKeySettings";
import { useOrg } from "@/components/layout/org/organizationContext";
import { useHeliconeAuthClient } from "@/packages/common/auth/client/AuthClientFactory";
import { useGetOrgMembers } from "@/services/hooks/organizations";
import { ShieldAlert } from "lucide-react";
import { P } from "@/components/ui/typography";
import { useTranslation } from "react-i18next";

const ProvidersSettings: NextPageWithLayout<void> = () => {
  const { t } = useTranslation("settings");
  const org = useOrg();
  const { user } = useHeliconeAuthClient();
  const { data: members, isLoading } = useGetOrgMembers(
    org?.currentOrg?.id || "",
  );

  const isOwner = org?.currentOrg?.owner === user?.id;
  const isUserAdmin =
    isOwner ||
    members?.find((m) => m.member === user?.id)?.org_role === "admin";

  if (isLoading) {
    return (
      <SettingsContainer>
        <SettingsSectionHeader
          title={t("providers.title")}
          description={t("providers.description")}
        />
        <SettingsSectionContent>
          <div className="flex h-32 items-center justify-center">
            <P className="text-muted-foreground">{t("providers.loading")}</P>
          </div>
        </SettingsSectionContent>
      </SettingsContainer>
    );
  }

  if (!isUserAdmin) {
    return (
      <SettingsContainer>
        <SettingsSectionHeader
          title={t("providers.title")}
          description={t("providers.description")}
        />
        <SettingsSectionContent>
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-muted/50 p-8">
            <ShieldAlert size={48} className="text-muted-foreground" />
            <div className="flex flex-col items-center gap-2 text-center">
              <P className="font-semibold">{t("providers.adminRequired")}</P>
              <P className="text-sm text-muted-foreground">
                {t("providers.adminRequiredDescription")}
              </P>
            </div>
          </div>
        </SettingsSectionContent>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsSectionHeader
        title={t("providers.title")}
        description={t("providers.description")}
      />

      <SettingsSectionContent>
        <ProviderKeySettings />
      </SettingsSectionContent>
    </SettingsContainer>
  );
};

ProvidersSettings.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout>
      <SettingsLayout>{page}</SettingsLayout>
    </AuthLayout>
  );
};

export default ProvidersSettings;

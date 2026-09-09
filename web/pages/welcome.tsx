import { useOrg } from "@/components/layout/org/organizationContext";
import LoadingAnimation from "@/components/shared/loadingAnimation";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
// import "prismjs/themes/prism.css";
const Welcome = () => {
  const { t } = useTranslation("auth");
  const org = useOrg();
  const router = useRouter();

  useEffect(() => {
    router.push("/onboarding");
  }, [org, router]);
  return <LoadingAnimation title={t("welcome.settingUpAccount")} />;
};

export default Welcome;

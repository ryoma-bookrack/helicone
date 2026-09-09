import PublicMetaData from "../components/layout/public/publicMetaData";
import InvalidPage from "../components/shared/errors/invalid";
import { useTranslation } from "react-i18next";

const ErrorPage = () => {
  const { t } = useTranslation("marketing");

  return (
    <PublicMetaData
      description={t("meta.notFoundDescription")}
      ogImageUrl={"https://www.helicone.ai/static/helicone-og.webp"}
    >
      <InvalidPage />
    </PublicMetaData>
  );
};

export default ErrorPage;

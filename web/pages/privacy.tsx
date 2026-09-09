import BasePageV2 from "../components/layout/basePageV2";
import MetaData from "../components/layout/public/authMetaData";
import { PRIVACY_SECTION_KEYS } from "@/lib/i18n/legalSectionKeys";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation("legal");

  const privacyPageSection = (
    index: number,
    title: string,
    description: string,
  ) => (
    <div className="flex flex-col space-y-4 text-lg">
      <p className="text-xl font-semibold">{`${index}. ${title}`}</p>
      <p className="whitespace-pre-wrap text-left">{description}</p>
    </div>
  );

  return (
    <MetaData title={t("privacy.metaTitle")}>
      <BasePageV2>
        <div className="mx-auto flex max-w-7xl items-center justify-between p-6 md:justify-start md:space-x-10 lg:px-8">
          <div className="font-serif max-w-3xl space-y-16 py-24">
            <div className="flex flex-col space-y-4">
              <p className="font-sans text-5xl">{t("privacy.title")}</p>
              <p className="font-sans text-lg">{t("privacy.lastUpdated")}</p>
            </div>

            {PRIVACY_SECTION_KEYS.map((key, index) =>
              privacyPageSection(
                index + 1,
                t(`privacy.sections.${key}.title`),
                t(`privacy.sections.${key}.description`),
              ),
            )}
          </div>
        </div>
      </BasePageV2>
    </MetaData>
  );
};

export default Privacy;

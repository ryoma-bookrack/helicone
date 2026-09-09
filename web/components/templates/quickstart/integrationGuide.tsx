import { IntegrationCodeTabs } from "@/components/shared/IntegrationCodeTabs";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface IntegrationGuideProps {
  apiKey?: string;
}

const IntegrationGuide = ({ apiKey }: IntegrationGuideProps) => {
  const { t } = useTranslation("onboarding");

  return (
    <div
      className="w-full rounded-lg bg-background"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-4 px-4 py-2">
        <IntegrationCodeTabs apiKey={apiKey} />

        <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50/50 px-3 py-2 dark:border-blue-800 dark:bg-blue-950/20">
          <BookOpen className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-900 dark:text-blue-100">
            {t("integrationGuide.modelRegistryPrefix")}{" "}
            <Link
              href="https://helicone.ai/models"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 hover:no-underline"
            >
              {t("integrationGuide.modelRegistryLink")}
            </Link>{" "}
            {t("integrationGuide.modelRegistrySuffix")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;

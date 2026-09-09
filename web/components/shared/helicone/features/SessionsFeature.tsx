import { DiffHighlight } from "@/components/templates/welcome/diffHighlight";
import { useTranslation } from "react-i18next";

export const SessionsFeatureVisual = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-12 lg:flex-row">
      <div className="w-full flex-[3] xl:flex-[1]">
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-wrap justify-start gap-4 md:justify-end">
            <div className="flex items-center justify-center rounded-lg bg-sky-200 px-3.5 py-1">
              <span className="text-md font-medium text-sky-700">
                {t("features.sessions.llm")}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-slate-200 px-3.5 py-1">
              <span className="text-md font-medium text-slate-700">
                {t("features.sessions.tool")}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-orange-200 px-3.5 py-1">
              <span className="text-md font-medium text-orange-700">
                {t("features.sessions.vectorDb")}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-blue-200 px-3.5 py-1">
              <span className="text-md font-medium text-blue-700">
                {t("features.sessions.image")}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-red-200 px-3.5 py-1">
              <span className="text-md font-medium text-red-700">
                {t("features.sessions.threat")}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-slate-200 px-3.5 py-1">
              <span className="text-md font-medium text-slate-700">
                {t("features.sessions.assistant")}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-slate-200 px-3.5 py-1">
              <span className="text-md font-medium text-slate-700">
                {t("features.sessions.moderation")}
              </span>
            </div>
            <div className="hidden items-center justify-center rounded-lg bg-slate-200 px-3.5 py-1 sm:flex">
              <span className="text-md font-medium text-slate-700">
                {t("features.sessions.embedding")}
              </span>
            </div>
          </div>

          <div className="w-full max-w-[520px]">
            <div className="overflow-hidden rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] [&_pre]:!rounded-none">
              <DiffHighlight
                code={`"Helicone-Session-Id": randomUUID(),
"Helicone-Session-Path": "/user-db-query",
"Helicone-Session-Name": "User DB Query",`}
                language="javascript"
                newLines={[]}
                oldLines={[]}
                minHeight={false}
                maxHeight={false}
                textSize="md"
                marginTop={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

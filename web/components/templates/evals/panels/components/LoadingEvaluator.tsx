import { useTranslation } from "react-i18next";
import React from "react";

export const LoadingEvaluator: React.FC = () => {
  const { t } = useTranslation("evals");
  const { t: tCommon } = useTranslation("common");

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <p>{t("ui.loadingEvaluatorDetails")}</p>
    </div>
  );
};

export default LoadingEvaluator;

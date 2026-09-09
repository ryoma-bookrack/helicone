import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Deprecated = ({ feature }: { feature: string }) => {
  const { t } = useTranslation("common");

  return (
    <div className="px-4 py-2">
      <Alert className="w-full">
        <TriangleAlertIcon className="h-4 w-4" />
        <AlertTitle className="font-semibold">
          {t("deprecation.title")}
        </AlertTitle>
        <AlertDescription>
          {t("deprecation.message", { feature })}{" "}
          <span className="font-semibold">September 1st, 2025</span>.
        </AlertDescription>
      </Alert>
    </div>
  );
};

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  statusType: string;
  errorCode?: number;
  className?: string;
}

const StatusBadge = (props: StatusBadgeProps) => {
  const { statusType, errorCode } = props;
  const { t } = useTranslation("requests");

  let colorClass: string;

  switch (statusType) {
    case "cached":
      colorClass =
        "bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-300 ring-1 ring-inset ring-orange-600/20";
      return (
        <Badge variant="status" asPill={false} className={colorClass}>
          {t("status.cached")}
        </Badge>
      );
    case "success":
    case "COMPLETED":
      colorClass =
        "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20";
      return (
        <Badge variant="status" asPill={false} className={colorClass}>
          {t("status.success")}
        </Badge>
      );
    case "pending":
    case "PENDING":
      colorClass =
        "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-600/20";
      return (
        <Badge variant="status" asPill={false} className={colorClass}>
          {t("status.pending")}
        </Badge>
      );
    case "RUNNING":
      colorClass =
        "bg-blue-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-600/20";
      return (
        <Badge variant="status" asPill={false} className={colorClass}>
          {t("status.running")}
        </Badge>
      );

    case "error":
      if (errorCode === -2) {
        colorClass =
          "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-600/20";
        return (
          <Badge variant="status" asPill={false} className={colorClass}>
            {t("status.pending")}
          </Badge>
        );
      } else if (errorCode === -3) {
        colorClass =
          "bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-300 ring-1 ring-inset ring-orange-600/20";
        return (
          <Badge variant="status" asPill={false} className={colorClass}>
            {t("status.cancelled")}
          </Badge>
        );
      } else if (errorCode === -1) {
        colorClass =
          "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-600/20";
        return (
          <Badge variant="status" asPill={false} className={colorClass}>
            {t("status.timeout")}
          </Badge>
        );
      } else if (errorCode === -4) {
        colorClass =
          "bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 ring-1 ring-inset ring-red-600/20";
        return (
          <Badge variant="status" asPill={false} className={colorClass}>
            {t("status.threat")}
          </Badge>
        );
      } else {
        colorClass =
          "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-600/20";
        return (
          <Badge variant="status" asPill={false} className={colorClass}>
            {t("status.error", { code: errorCode })}
          </Badge>
        );
      }
    default:
      colorClass =
        "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-600/20";
      return (
        <Badge variant="status" asPill={false} className={colorClass}>
          {t("status.unknown")}
        </Badge>
      );
  }
};

export default StatusBadge;

import { DecryptedProviderKeyMapping } from "../../../services/lib/keys";
import { useLimitsCell } from "./useLimitsCell";
import { useTranslation } from "react-i18next";

function getTimeWindowString(
  seconds: number,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (seconds < 60) {
    return `${seconds} ${t("limits.seconds")}`;
  } else if (seconds < 60 * 60) {
    return `${(seconds / 60).toFixed(2)} ${t("limits.minutes")}`;
  } else if (seconds < 60 * 60 * 24) {
    return `${(seconds / 60 / 60).toFixed(2)} ${t("limits.hours")}`;
  }
  return `${(seconds / 60 / 60 / 24).toFixed(2)} ${t("limits.days")}`;
}

function LimitRow({
  spend,
  count,
  limit,
}: {
  spend: number;
  count: number;
  limit?: DecryptedProviderKeyMapping["limits"][number];
}) {
  const { t } = useTranslation("vault");
  if (!limit) return null;

  if (limit.cost !== null) {
    return (
      <div className="flex flex-row">
        <span className="mr-2">
          {t("limits.spent", {
            spent: spend.toFixed(2),
            limit: limit.cost,
          })}
        </span>
        <span className="mr-2">
          {t("limits.at", {
            window: getTimeWindowString(limit.timewindow_seconds!, t),
          })}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      <span className="mr-2">
        {t("limits.requests", { count, limit: limit.count })}
      </span>
      <span className="mr-2">
        {t("limits.at", {
          window: getTimeWindowString(limit.timewindow_seconds!, t),
        })}
      </span>
    </div>
  );
}

export function LimitCell({
  limits,
}: {
  limits?: DecryptedProviderKeyMapping["limits"];
}) {
  const limitsUsage = useLimitsCell(limits);
  return (
    <div className="flex flex-col">
      {limitsUsage?.proxyKeysUsage?.map((usage, idx) => (
        <LimitRow
          key={idx}
          spend={usage.cost}
          count={usage.count}
          limit={limits?.[idx]}
        />
      ))}
    </div>
  );
}

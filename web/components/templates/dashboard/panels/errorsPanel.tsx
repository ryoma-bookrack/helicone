import { useTranslation } from "react-i18next";
import { formatLargeNumber } from "../../../shared/utils/numberFormat";
import { sortAndColorData } from "./utils";
import { useExpandableBarList } from "./barListPanel";

interface ErrorsPanelProps {
  accumulatedStatusCounts: {
    name: string;
    value: number;
  }[];
  totalRequests: number;
}

const ErrorsPanel = (props: ErrorsPanelProps) => {
  const { t } = useTranslation("dashboard");
  const { accumulatedStatusCounts, totalRequests } = props;

  const totalErrors = accumulatedStatusCounts.reduce(
    (sum, e) => sum + e.value,
    0,
  );

  // Format the data to include count in the name
  const errorDataWithFormattedNames = sortAndColorData(
    accumulatedStatusCounts.map((error) => ({
      name: `${error.name} (${formatLargeNumber(error.value)})`,
      value: error.value,
    })),
    "default", // Use default color order
  );

  const maxValue = errorDataWithFormattedNames[0]?.value || 1;

  const { expandButton, barList, modal } = useExpandableBarList({
    data: errorDataWithFormattedNames,
    maxValue,
    formatValue: (value) => {
      const percentage = (value / totalErrors) * 100;
      return `${percentage.toFixed(1)}%`;
    },
    modalTitle: t("panels.allErrors"),
    modalValueLabel: t("panels.percentage"),
  });

  const errorPercentage = (totalErrors / totalRequests) * 100 || 0;

  return (
    <>
      <div className="flex h-full w-full flex-col border-b border-r border-border bg-card p-6 text-card-foreground">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm text-muted-foreground">{t("panels.allErrors")}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-semibold text-foreground">
                  {formatLargeNumber(totalErrors)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("panels.percentOfRequests", {
                    value: errorPercentage.toFixed(2),
                  })}
                </p>
              </div>
            </div>
            {expandButton}
          </div>
          <div className="flex flex-grow flex-col overflow-hidden pt-4">
            <div className="flex flex-row items-center justify-between pb-2">
              <p className="text-xs font-semibold text-foreground">
                {t("panels.errorType")}
              </p>
              <p className="text-xs font-semibold text-foreground">
                {t("panels.percentage")}
              </p>
            </div>
            <div className="flex-grow overflow-y-auto">{barList}</div>
          </div>
        </div>
      </div>
      {modal}
    </>
  );
};

export default ErrorsPanel;

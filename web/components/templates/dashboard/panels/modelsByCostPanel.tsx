import { useTranslation } from "react-i18next";
import StyledAreaChart from "../styledAreaChart";
import { sortAndColorDataByName } from "./utils";
import { useExpandableBarList } from "./barListPanel";

interface ModelsByCostPanelProps {
  models: {
    data:
      | {
          model: string;
          cost: number;
        }[]
      | undefined;
    isLoading: boolean;
  };
}

const ModelsByCostPanel = (props: ModelsByCostPanelProps) => {
  const { t } = useTranslation("dashboard");
  const { models } = props;

  const modelData = sortAndColorDataByName(
    models?.data?.map((model) => ({
      name: model.model,
      value: model.cost,
    })),
  );

  const maxValue = modelData[0]?.value || 1;

  const { expandButton, barList, modal } = useExpandableBarList({
    data: modelData,
    maxValue,
    formatValue: (value) => `$${value.toFixed(2)}`,
    modalTitle: t("panels.topModelsByCost"),
    modalValueLabel: t("panels.cost"),
  });

  return (
    <>
      <StyledAreaChart
        title={t("panels.topModelsByCost")}
        value={undefined}
        isDataOverTimeLoading={models.isLoading}
        withAnimation={true}
        headerAction={expandButton}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-xs font-semibold text-foreground">{t("panels.name")}</p>
            <p className="text-xs font-semibold text-foreground">{t("panels.cost")}</p>
          </div>
          <div className="flex-grow overflow-y-auto">{barList}</div>
        </div>
      </StyledAreaChart>
      {modal}
    </>
  );
};

export default ModelsByCostPanel;

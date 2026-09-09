import { useTranslation } from "react-i18next";
import { Col } from "@/components/layout/common";
import { DataEntry, LastMileConfigForm, TestInput } from "../types";

export function RenderDataEntry(dataEntry: DataEntry) {
  const { t } = useTranslation("evals");
  const { t: tCommon } = useTranslation("common");

  return <div>{dataEntry._type}</div>;
}

export function PreviewLastMile({
  testDataConfig,
  testInput,
}: {
  testDataConfig: LastMileConfigForm;
  testInput: TestInput;
}) {
  // const NormalizedRequest = useMemo(() => {
  //   return getNormalizedRequest({

  //   });
  // }, [testInput.inputBody]);
  return (
    <div>
      <Col>
        {/* <Label>{t("ui.input")}</Label>

        {JSON.stringify(testDataConfig.input)}
        <Label>{t("ui.output")}</Label>
        {JSON.stringify(testDataConfig.output)}
        <Label>{t("ui.promptTemplate")}</Label>
        <Label>{t("ui.groundTruth")}</Label>
        {"groundTruth" in testDataConfig && (
          <div>
            <Label>{t("ui.groundTruth")}</Label>
            {JSON.stringify(testDataConfig.groundTruth)}
          </div>
        )} */}
      </Col>
    </div>
  );
}

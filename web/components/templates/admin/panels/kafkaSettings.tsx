import { TextInput } from "@tremor/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useNotification from "../../../shared/notification/useNotification";
import {
  useGetSetting,
  useUpdateSetting,
} from "../../../../services/hooks/admin";
import { components } from "../../../../lib/clients/jawnTypes/private";
import { Button } from "@/components/ui/button";

const settingNames: Array<components["schemas"]["SettingName"]> = [
  "kafka:dlq",
  "kafka:log",
  "kafka:score",
  "kafka:dlq:score",
  "kafka:dlq:eu",
  "kafka:log:eu",
];

const KafkaSettings = () => {
  const { t } = useTranslation("admin");
  const { setNotification } = useNotification();

  const [miniBatchSize, setMiniBatchSize] = useState<number>(0);
  const [selectedSetting, setSelectedSetting] =
    useState<components["schemas"]["SettingName"]>("kafka:dlq");

  const {
    setting,
    isLoading: isLoadingSetting,
    refetch: refetchSetting,
  } = useGetSetting(selectedSetting, () => {
    if (setting && "miniBatchSize" in setting) {
      setMiniBatchSize(setting.miniBatchSize);
    }
  });

  const { updateSetting, isUpdatingSetting } = useUpdateSetting(() => {
    setNotification(t("panels.kafka.updatedSuccess"), "success");
    refetchSetting();
  });

  useEffect(() => {
    if (setting && "miniBatchSize" in setting) {
      setMiniBatchSize(setting.miniBatchSize);
    }
  }, [setting]);

  return (
    <>
      <h2 className="text-lg font-semibold text-white">
        {t("panels.kafka.title")}
      </h2>
      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="text-sm text-white">
              {t("panels.kafka.selectSetting")}
            </label>
            <select
              value={selectedSetting}
              onChange={(e) =>
                setSelectedSetting(
                  e.target.value as components["schemas"]["SettingName"],
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {settingNames.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <TextInput
              placeholder={t("panels.kafka.miniBatchSize")}
              value={miniBatchSize.toString()}
              onValueChange={(value) => setMiniBatchSize(Number(value))}
            />
          </div>
          <div className="col-span-1">
            <Button
              variant={"default"}
              onClick={() => {
                if (miniBatchSize != 0 && !miniBatchSize) {
                  setNotification(
                    t("panels.kafka.miniBatchSizeRequired"),
                    "error",
                  );
                  return;
                }
                updateSetting({
                  name: selectedSetting,
                  settings: {
                    miniBatchSize,
                  } as components["schemas"]["Setting"],
                });
              }}
              disabled={isUpdatingSetting || isLoadingSetting}
            >
              {t("panels.kafka.updateSetting")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default KafkaSettings;

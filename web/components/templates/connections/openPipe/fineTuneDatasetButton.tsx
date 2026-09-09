import { useState } from "react";
import {
  ArrowPathIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { useOpenPipeKey } from "@/services/hooks/useOpenPipeKey";
import useOpenPipeClient from "@/lib/clients/openPipeClient";
import useNotification from "@/components/shared/notification/useNotification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/telemetry/logger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import GenericButton from "@/components/layout/common/button";
import { LOGOS } from "../connectionSVG";
import { useTranslation } from "react-i18next";

const SUPPORTED_MODELS = [
  "OpenPipe/Hermes-2-Theta-Llama-3-8B-32k",
  "meta-llama/Meta-Llama-3-8B-Instruct",
  "meta-llama/Meta-Llama-3-70B-Instruct",
  "OpenPipe/mistral-ft-optimized-1227",
  "mistralai/Mixtral-8x7B-Instruct-v0.1",
] as const;

interface OpenPipeFineTuneButtonProps {
  datasetId: string;
  rows: any[];
  datasetName: string;
  fetchRows?: () => Promise<any[]>;
}

export default function OpenPipeFineTuneButton(
  props: OpenPipeFineTuneButtonProps,
) {
  const { datasetId, rows, datasetName, fetchRows } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [fineTuneName, setFineTuneName] = useState("");
  const [baseModel, setBaseModel] = useState<(typeof SUPPORTED_MODELS)[number]>(
    SUPPORTED_MODELS[0],
  );
  const [batchSize, setBatchSize] = useState<string>("auto");
  const [learningRateMultiplier, setLearningRateMultiplier] =
    useState<number>(1);
  const [numEpochs, setNumEpochs] = useState<number>(3);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { existingKey } = useOpenPipeKey();
  const { t } = useTranslation("connections");
  const openPipeClient = useOpenPipeClient({
    apiKey: existingKey?.provider_key || "",
  });
  const { setNotification } = useNotification();

  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleFineTune = async () => {
    setIsLoading(true);
    setLogs([]);
    try {
      addLog(t("fineTune.logs.starting"));
      let dataToUpload = rows;
      if (fetchRows) {
        addLog(t("fineTune.logs.fetchingRows"));
        dataToUpload = await fetchRows();
        addLog(t("fineTune.logs.fetchedRows", { count: dataToUpload.length }));
      }

      addLog(t("fineTune.logs.creatingDataset"));
      const dataset = await openPipeClient.createDataset(datasetName);
      addLog(t("fineTune.logs.datasetCreated", { id: dataset.datasetId }));

      addLog(t("fineTune.logs.uploadingData"));
      await openPipeClient.createDatasetEntry(
        dataset.datasetId,
        rows?.map((row) => ({
          ...row.request_body,
          messages: [
            ...row.request_body.messages,
            row.response_body.choices[0].message,
          ],
        })),
      );
      addLog(t("fineTune.logs.uploadSuccess"));

      addLog(t("fineTune.logs.creatingJob"));
      const fineTune = await openPipeClient.createFinetune({
        datasetId: dataset.datasetId,
        slug: fineTuneName,
        baseModel,
        overrides: {
          batch_size: batchSize,
          learning_rate_multiplier: learningRateMultiplier,
          num_epochs: numEpochs,
        },
      });
      addLog(t("fineTune.logs.jobCreated", { id: fineTune.id }));

      setNotification(t("fineTune.notifications.success"), "success");
      setIsSheetOpen(false); // Close the sheet after successful completion
    } catch (error) {
      logger.error({ error }, "Error in fine-tuning process");
      addLog(t("fineTune.logs.error", { error: String(error) }));
      setNotification(t("fineTune.notifications.error"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <GenericButton
          text="OpenPipe"
          onClick={() => setIsSheetOpen(true)}
          icon={<LOGOS.OpenPipe className="h-4 w-4" />}
        />
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md" size="full">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            {t("fineTune.title")}
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            {t("fineTune.description", { datasetName })}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fineTuneName" className="text-sm font-medium">
              {t("fineTune.fineTuneName")}
            </Label>
            <Input
              id="fineTuneName"
              value={fineTuneName}
              onChange={(e) => setFineTuneName(e.target.value)}
              placeholder={t("fineTune.fineTuneNamePlaceholder")}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseModel" className="text-sm font-medium">
              {t("fineTune.baseModel")}
            </Label>
            <Select
              value={baseModel}
              onValueChange={(value) =>
                setBaseModel(value as (typeof SUPPORTED_MODELS)[number])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("fineTune.selectBaseModel")} />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batchSize" className="text-sm font-medium">
              {t("fineTune.batchSize")}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    id="batchSize"
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                    placeholder="auto"
                    className="w-full"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{t("fineTune.batchSizeTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="learningRateMultiplier"
              className="text-sm font-medium"
            >
              {t("fineTune.learningRateMultiplier")}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="space-y-2">
                    <Slider
                      id="learningRateMultiplier"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[learningRateMultiplier]}
                      onValueChange={(value) =>
                        setLearningRateMultiplier(value[0])
                      }
                    />
                    <span className="block text-right text-sm text-gray-500">
                      {learningRateMultiplier.toFixed(1)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{t("fineTune.learningRateTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numEpochs" className="text-sm font-medium">
              {t("fineTune.numEpochs")}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="space-y-2">
                    <Slider
                      id="numEpochs"
                      min={1}
                      max={10}
                      step={1}
                      value={[numEpochs]}
                      onValueChange={(value) => setNumEpochs(value[0])}
                    />
                    <span className="block text-right text-sm text-gray-500">
                      {numEpochs}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{t("fineTune.numEpochsTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            onClick={handleFineTune}
            disabled={isLoading}
            className="mb-4 w-full"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="mr-2 inline h-5 w-5 animate-spin" />
                {t("fineTune.processing")}
              </>
            ) : (
              t("fineTune.startFineTuning")
            )}
          </Button>
        </div>
        {/* Log display */}
        {logs.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto rounded-md bg-gray-100 p-2">
            <h3 className="mb-2 text-sm font-semibold">{t("fineTune.processLogs")}</h3>
            {logs.map((log, index) => (
              <p key={index} className="text-xs text-gray-600">
                {log}
              </p>
            ))}
          </div>
        )}
        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(logs.join("\n"));
                  }}
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{t("fineTune.copyLogs")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetContent>
    </Sheet>
  );
}

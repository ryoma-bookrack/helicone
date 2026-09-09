import { useTranslation } from "react-i18next";
import { Col } from "@/components/layout/common";
import { useTestDataStore } from "@/components/templates/evals/testing/testingStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { H3, Muted } from "@/components/ui/typography";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useNotification from "../../../shared/notification/useNotification";
import { useEvalConfigStore } from "../store/evalConfigStore";
import { DataEntry, LastMileConfigForm } from "./types";

function SelectDataEntryType({
  label,
  defaultValue,
  onChange,
}: {
  label: string;
  defaultValue: DataEntry;
  onChange: (value: DataEntry) => void;
}) {
  const { t } = useTranslation("evals");
  const { setTestConfig: setTestData } = useTestDataStore();
  useEffect(() => {
    setTestData((prev) => {
      if (!prev) return null;
      return {
        _type: "lastmile",
        evaluator_name: "",
        config: DEFAULT_RELEVANCE_TYPE,
      };
    });
  }, [setTestData]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-medium">{label}</Label>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {label === "Input"
              ? "Select the source of input data for evaluation"
              : label === "Output"
                ? "Select the source of output data for evaluation"
                : "Select the source of ground truth data for comparison"}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            value={defaultValue._type}
            onValueChange={(value) => {
              if (value === "prompt-input") {
                onChange({ _type: "prompt-input", inputKey: "" });
              } else if (value === "input-body") {
                onChange({ _type: "input-body", content: "message" });
              } else if (value === "output-body") {
                onChange({ _type: "output-body", content: "message" });
              } else if (value === "system-prompt") {
                onChange({ _type: "system-prompt" });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("ui.selectType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prompt-input">{t("ui.promptInput")}</SelectItem>
              <SelectItem value="input-body">{t("ui.inputBody")}</SelectItem>
              <SelectItem value="output-body">{t("ui.outputBody")}</SelectItem>
              <SelectItem value="system-prompt">{t("ui.systemPrompt")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {defaultValue._type === "prompt-input" && (
          <div>
            <Input
              placeholder={t("ui.inputKey")}
              value={defaultValue.inputKey}
              onChange={(e) => {
                onChange({
                  _type: "prompt-input",
                  inputKey: e.target.value,
                });
              }}
            />
          </div>
        )}

        {(defaultValue._type === "input-body" ||
          defaultValue._type === "output-body") && (
          <div>
            <Select
              value={defaultValue.content}
              onValueChange={(value) => {
                onChange({
                  ...defaultValue,
                  content: value as "message" | "jsonify",
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("ui.selectContentType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="message">{t("ui.message")}</SelectItem>
                <SelectItem value="jsonify">{t("ui.jsonify")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_FAITHFULNESS_TYPE: LastMileConfigForm = {
  _type: "faithfulness",
  groundTruth: {
    _type: "system-prompt",
  },
  name: "",
  input: {
    _type: "system-prompt",
  },
  output: {
    _type: "output-body",
    content: "message",
  },
};

const DEFAULT_RELEVANCE_TYPE: LastMileConfigForm = {
  _type: "relevance",
  name: "",
  input: {
    _type: "system-prompt",
  },
  output: {
    _type: "output-body",
    content: "message",
  },
};

const DEFAULT_CONTEXT_RELEVANCE_TYPE: LastMileConfigForm = {
  _type: "context_relevance",
  name: "",
  input: {
    _type: "system-prompt",
  },
  output: {
    _type: "output-body",
    content: "message",
  },
};

export const LastMileDevConfigForm: React.FC<{
  onSubmit: () => void;
  existingEvaluatorId?: string;
  openTestPanel?: () => void;
  preset?: LastMileConfigForm;
}> = ({ existingEvaluatorId, preset }) => {
  const { t } = useTranslation("evals");
  const notification = useNotification();

  // Use the config store
  const {
    lastMileName,
    setLastMileName,
    lastMileDescription,
    setLastMileDescription,
    lastMileConfig,
    setLastMileConfig,
  } = useEvalConfigStore();

  // Local state for form values
  const [evaluatorName, setEvaluatorName] = useState(lastMileName || "");
  const [evaluatorDescription, setEvaluatorDescription] = useState(
    lastMileDescription || "",
  );
  const [evaluatorType, setEvaluatorType] = useState<LastMileConfigForm>(
    lastMileConfig || preset || DEFAULT_RELEVANCE_TYPE,
  );

  // Update the store when local state changes
  useEffect(() => {
    setLastMileName(evaluatorName);
    setLastMileDescription(evaluatorDescription);
    setLastMileConfig(evaluatorType);
  }, [
    evaluatorName,
    evaluatorDescription,
    evaluatorType,
    setLastMileName,
    setLastMileDescription,
    setLastMileConfig,
  ]);

  return (
    <Col className="flex h-full flex-col overflow-hidden">
      <ScrollArea
        className="flex-grow overflow-y-auto"
        type="always"
        scrollHideDelay={0}
      >
        <div className="px-4 py-4">
          <Col className="space-y-4">
            {/* Basic Information Section */}
            <div className="space-y-3">
              <div className="mb-3 border-b pb-1">
                <div className="flex items-baseline gap-2">
                  <H3 className="text-lg">{t("ui.basicInformation")}</H3>
                  <Muted className="text-sm">{t("ui.defineYourLastmileEvaluatorsNameAndType")}</Muted>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="name" className="text-sm font-medium">{t("ui.evaluatorName")}</Label>
                    <a
                      href="https://docs.lastmileai.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >{t("ui.lastmileAiDocumentation")}</a>
                  </div>
                  <Input
                    id="name"
                    placeholder={t("ui.enterEvaluatorName")}
                    value={evaluatorName}
                    readOnly={!!existingEvaluatorId}
                    disabled={!!existingEvaluatorId}
                    onChange={(e) => {
                      if (!!existingEvaluatorId) return; // Skip if editing existing evaluator

                      if (!/[^a-zA-Z0-9\s]+/g.test(e.target.value)) {
                        setEvaluatorName(e.target.value);
                      } else {
                        notification.setNotification(
                          "Evaluator name can only contain letters and numbers.",
                          "error",
                        );
                      }
                    }}
                  />
                  {existingEvaluatorId && (
                    <div className="mt-1 text-xs text-muted-foreground">{t("ui.evaluatorNamesCannotBeChangedAfterCreati")}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="type" className="text-sm font-medium">{t("ui.evaluatorType")}</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">{t("ui.chooseTheTypeOfLastmileEvaluator")}</TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={evaluatorType._type}
                    onValueChange={(value) => {
                      if (value === "relevance") {
                        setEvaluatorType({
                          ...DEFAULT_RELEVANCE_TYPE,
                          name: evaluatorName,
                        });
                      } else if (value === "context_relevance") {
                        setEvaluatorType({
                          ...DEFAULT_CONTEXT_RELEVANCE_TYPE,
                          name: evaluatorName,
                        });
                      } else if (value === "faithfulness") {
                        setEvaluatorType({
                          ...DEFAULT_FAITHFULNESS_TYPE,
                          name: evaluatorName,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("ui.selectEvaluatorType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">{t("ui.relevance")}</SelectItem>
                      <SelectItem value="context_relevance">{t("ui.contextRelevance")}</SelectItem>
                      <SelectItem value="faithfulness">{t("ui.faithfulness")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="my-1" />

            {/* Configuration Section */}
            <div className="space-y-3">
              <div className="mb-3 border-b pb-1">
                <div className="flex items-baseline gap-2">
                  <H3 className="text-lg">{t("ui.configuration")}</H3>
                  <Muted className="text-sm">{t("ui.configureTheDataSourcesForYourEvaluator")}</Muted>
                </div>
              </div>

              <div className="space-y-4 rounded-md bg-muted/10 p-3">
                {evaluatorType.input && (
                  <SelectDataEntryType
                    label={t("ui.input")}
                    defaultValue={evaluatorType.input}
                    onChange={(value) => {
                      setEvaluatorType({
                        ...evaluatorType,
                        input: value,
                      });
                    }}
                  />
                )}

                {evaluatorType.output && (
                  <SelectDataEntryType
                    label={t("ui.output")}
                    defaultValue={evaluatorType.output}
                    onChange={(value) => {
                      setEvaluatorType({
                        ...evaluatorType,
                        output: value,
                      });
                    }}
                  />
                )}

                {evaluatorType._type === "faithfulness" &&
                  evaluatorType.groundTruth && (
                    <SelectDataEntryType
                      label={t("ui.groundTruth")}
                      defaultValue={evaluatorType.groundTruth}
                      onChange={(value) => {
                        setEvaluatorType({
                          ...evaluatorType,
                          groundTruth: value,
                        });
                      }}
                    />
                  )}
              </div>
            </div>
          </Col>
        </div>
      </ScrollArea>
    </Col>
  );
};

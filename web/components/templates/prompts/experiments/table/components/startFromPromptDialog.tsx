import { useTranslation } from "react-i18next";
import { usePromptVersions } from "../../../../../../services/hooks/prompts/prompts";
import { useState } from "react";
import { Select, SelectContent, SelectItem } from "../../../../../ui/select";
import { ScrollArea } from "../../../../../ui/scroll-area";
import { SelectTrigger, SelectValue } from "../../../../../ui/select";
import { Button } from "../../../../../ui/button";
import { FileTextIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../../../../../ui/dialog";
import { BeakerIcon, PlusIcon } from "@heroicons/react/24/outline";
import useNotification from "../../../../../shared/notification/useNotification";
import { useJawnClient } from "../../../../../../lib/clients/jawnHook";
import { useRouter } from "next/router";
import PromptPlayground, { PromptObject } from "../../../id/promptPlayground";
import { Input } from "../../../../../ui/input";
import LoadingAnimation from "../../../../../shared/loadingAnimation";

export const NewExperimentDialog = () => {
  const { t } = useTranslation("prompts");
  const { t: tCommon } = useTranslation("common");

  const notification = useNotification();
  const [basePrompt, setBasePrompt] = useState<PromptObject>({
    model: "gpt-4",
    messages: [
      {
        id: "1",
        role: "system",
        content: "You are a helpful assistant.",
        _type: "message",
      },
    ],
  });

  const router = useRouter();
  const jawn = useJawnClient();

  const [selectedInput, setSelectedInput] = useState<any>({
    id: "",
    inputs: {},
    source_request: "",
    prompt_version: "",
    created_at: "",
    auto_prompt_inputs: [],
    response_body: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [promptName, setPromptName] = useState<string>("");
  const [promptVariables, setPromptVariables] = useState<
    Array<{ original: string; heliconeTag: string; value: string }>
  >([]);

  const [inputs, setInputs] = useState<{ variable: string; value: string }[]>([
    { variable: "sectionTitle", value: "The universe" },
  ]);

  const handleInputChange = (
    index: number,
    field: "variable" | "value",
    newValue: string,
  ) => {
    const newInputs = [...inputs];
    newInputs[index][field] = newValue;
    setInputs(newInputs);
  };

  const addNewInput = () => {
    setInputs([...inputs, { variable: "", value: "" }]);
  };

  const handlePromptChange = (newPrompt: string | PromptObject) => {
    setBasePrompt(newPrompt as PromptObject);
  };

  const handleCreateExperiment = async () => {
    setIsLoading(true);
    if (!promptName || !basePrompt) {
      notification.setNotification(
        "Please enter a prompt name and content",
        "error",
      );
      setIsLoading(false);
      return;
    }

    if (!basePrompt.model) {
      notification.setNotification(t("ui.pleaseSelectAModel"), "error");
      setIsLoading(false);
      return;
    }

    const res = await jawn.POST("/v1/prompt/create", {
      body: {
        userDefinedId: promptName,
        prompt: basePrompt,
        metadata: {
          createdFromUi: true,
        },
      },
    });
    if (res.error || !res.data) {
      notification.setNotification(t("ui.failedToCreatePrompt"), "error");
      setIsLoading(false);
      return;
    }

    if (!res.data?.data?.id || !res.data?.data?.prompt_version_id) {
      notification.setNotification(t("ui.failedToCreatePrompt"), "error");
      setIsLoading(false);
      return;
    }

    const dataset = await jawn.POST("/v1/helicone-dataset", {
      body: {
        datasetName: "Dataset for Experiment",
        requestIds: [],
      },
    });
    if (!dataset.data?.data?.datasetId) {
      notification.setNotification(t("ui.failedToCreateDataset"), "error");
      setIsLoading(false);
      return;
    }

    const experiment = await jawn.POST("/v1/experiment/new-empty", {
      body: {
        metadata: {
          prompt_id: res.data?.data?.id!,
          prompt_version: res.data?.data?.prompt_version_id!,
          experiment_name: `${promptName}_V1.0` || "",
        },
        datasetId: dataset.data?.data?.datasetId,
      },
    });
    if (!experiment.data?.data?.experimentId) {
      notification.setNotification(t("ui.failedToCreateExperiment"), "error");
      setIsLoading(false);
      return;
    }
    const result = await jawn.POST(
      "/v1/prompt/version/{promptVersionId}/subversion",
      {
        params: {
          path: {
            promptVersionId: res.data?.data?.prompt_version_id!,
          },
        },
        body: {
          newHeliconeTemplate: JSON.stringify(basePrompt),
          isMajorVersion: false,
          metadata: {
            experimentAssigned: true,
          },
        },
      },
    );

    if (result.error || !result.data) {
      notification.setNotification(t("ui.failedToCreateSubversion"), "error");
      setIsLoading(false);
      return;
    }

    notification.setNotification(t("ui.promptCreatedSuccessfully"), "success");
    setIsLoading(false);
    await router.push(
      `/prompts/${res.data?.data?.id}/subversion/${res.data?.data?.prompt_version_id}/experiment/${experiment.data?.data?.experimentId}`,
    );
  };

  return (
    <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
      {isLoading ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <LoadingAnimation />
          <h1 className="text-2xl font-semibold">{t("ui.gettingYourExperiments")}</h1>
        </div>
      ) : (
        <div className="space-y-4 pr-8">
          <div className="flex flex-row space-x-2">
            <BeakerIcon className="h-6 w-6" />
            <h3 className="text-md font-semibold">{t("ui.originalPrompt")}</h3>
          </div>

          <Input
            placeholder={t("ui.promptName")}
            value={promptName}
            onChange={(e) => setPromptName(e.target.value)}
          />

          <PromptPlayground
            prompt={basePrompt}
            editMode={true}
            selectedInput={selectedInput}
            defaultEditMode={true}
            submitText={"Create Experiment"}
            playgroundMode={"experiment"}
            handleCreateExperiment={handleCreateExperiment}
            isPromptCreatedFromUi={true}
            onExtractPromptVariables={(variables: any) =>
              setPromptVariables(
                variables.map((variable: any) => ({
                  original: variable.original,
                  heliconeTag: variable.heliconeTag,
                  value: variable.value,
                })),
              )
            }
            onPromptChange={handlePromptChange}
          />
        </div>
      )}
    </DialogContent>
  );
};

interface StartFromPromptDialogProps {
  prompts: {
    id: string;
    user_defined_id: string;
    description: string;
    pretty_name: string;
    created_at: string;
    major_version: number;
    metadata?: Record<string, any>;
  }[];
  onDialogClose: (open: boolean) => void;
}

export const StartFromPromptDialog = ({
  prompts,
  onDialogClose,
}: StartFromPromptDialogProps) => {
  const { t } = useTranslation("experiments");
  const { t: tCommon } = useTranslation("common");
  const router = useRouter();
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const notification = useNotification();
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );
  const jawn = useJawnClient();

  const { prompts: promptVersions, isLoading: isLoadingVersions } =
    usePromptVersions(selectedPromptId ?? "");

  const handlePromptSelect = (promptId: string) => {
    setSelectedPromptId(promptId);
    setSelectedVersionId(null);
  };

  const handleCreateExperiment = async () => {
    if (!selectedPromptId || !selectedVersionId) {
      notification.setNotification(
        "Please select a prompt and version",
        "error",
      );
      return;
    }
    const promptVersion = promptVersions?.find(
      (p) => p.id === selectedVersionId,
    );
    const prompt = prompts?.find((p) => p.id === selectedPromptId);

    const experimentTableResult = await jawn.POST("/v2/experiment/new", {
      body: {
        name: `${prompt?.user_defined_id}_V${promptVersion?.major_version}.${promptVersion?.minor_version}`,
        originalPromptVersion: selectedVersionId,
      },
    });

    if (experimentTableResult.error || !experimentTableResult.data) {
      notification.setNotification(t("ui.failedToCreateExperiment"), "error");
      return;
    }

    router.push(
      `/experiments/${experimentTableResult.data?.data?.experimentId}`,
    );
  };

  return (
    <DialogContent className="w-[500px] rounded-md p-4 shadow-lg">
      <div>
        <div className="flex flex-row items-center space-x-2 text-center">
          <BeakerIcon className="h-4 w-4" />
          <h3 className="mb-2 text-lg font-medium">{t("ui.startWithAPrompt")}</h3>
        </div>

        <p className="mb-2 text-sm text-slate-500">{t("ui.chooseAnExistingPromptAndSelectTheVersio")}</p>
        <div className="rounded-md border border-slate-200 dark:border-slate-700">
          <ScrollArea className="flex max-h-[30vh] flex-col overflow-y-auto px-1 py-2 pt-0">
            {prompts &&
              prompts?.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="ghost"
                  className={`mt-2 w-full justify-start ${
                    selectedPromptId === prompt.id
                      ? "bg-slate-200 dark:bg-slate-800"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => handlePromptSelect(prompt.id)}
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  {prompt.user_defined_id}
                </Button>
              ))}
          </ScrollArea>
          <div className="flex cursor-pointer flex-row items-center space-x-2 border-t border-slate-200 px-4 py-4 dark:border-slate-700">
            <PlusIcon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            <Dialog>
              <DialogTrigger asChild>
                <span className="text-md font-normal text-slate-700 dark:text-slate-300">{t("ui.createANewPrompt")}</span>
              </DialogTrigger>
              <NewExperimentDialog />
            </Dialog>
          </div>
        </div>

        <div className="mt-4 flex flex-row items-center justify-center space-x-2">
          <h4 className="font-semibold">{t("ui.version")}</h4>
          <Select
            value={selectedVersionId ?? ""}
            onValueChange={setSelectedVersionId}
          >
            <SelectTrigger>
              <SelectValue
                className="text-xl"
                placeholder={
                  isLoadingVersions
                    ? "Loading versions..."
                    : "Select the version"
                }
              />
            </SelectTrigger>
            <SelectContent className="text-xl">
              {!isLoadingVersions &&
                promptVersions
                  ?.filter((version) => version.minor_version === 0)
                  ?.map((version: any) => (
                    <SelectItem
                      key={version.id}
                      value={version.id}
                      className={`cursor-pointer ${
                        selectedVersionId === version.id
                          ? "bg-accent"
                          : "hover:bg-accent"
                      }`}
                    >
                      {version.name ||
                        `V ${version.major_version}.${version.minor_version}`}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex flex-row items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onDialogClose(false)}
            className="w-full"
          >{tCommon("actions.cancel")}</Button>
          <Button
            variant="default"
            disabled={!selectedVersionId}
            onClick={handleCreateExperiment}
            className="w-full"
          >{t("ui.createExperiment")}</Button>
        </div>
      </div>
    </DialogContent>
  );
};

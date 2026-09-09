import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Provider } from "@helicone-package/cost/unified/types";
import { PromptState } from "@/types/prompt-state";
import {
  getEnvFileExample,
  getPromptDeploymentExample,
} from "@/utils/promptDeploy";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PiArrowUpRightBold, PiRocketLaunchBold } from "react-icons/pi";
import { DiffHighlight } from "../../welcome/diffHighlight";

import { P, Small } from "@/components/ui/typography";

interface DeployDialogProps {
  promptId: string;
  userDefinedId: string;
  state: PromptState | null;
  isImportedFromCode?: boolean;
}
export default function DeployDialog({
  promptId,
  userDefinedId,
  state,
  isImportedFromCode,
}: DeployDialogProps) {
  const { t } = useTranslation("prompts");
  const { t: tCommon } = useTranslation("common");

  const [showChatExample, setShowChatExample] = useState(false);

  if (!promptId) return null;

  const provider = state?.parameters?.provider as Provider;
  const inputs = state?.inputs || [];
  const hasVariables = inputs.length > 0;

  const examples = getPromptDeploymentExample(
    userDefinedId || "my-prompt-id",
    inputs,
    state?.parameters,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isImportedFromCode === true}
        >
          <PiRocketLaunchBold className="mr-2 h-4 w-4" />
          <span>{t("ui.deploy")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-full max-w-4xl flex-col items-center gap-4 overflow-hidden bg-slate-100 dark:bg-slate-900">
        {/* Installation */}
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-row items-center justify-between">
            <P className="dark:slate-300 font-semibold text-slate-700">{t("ui.install")}</P>
          </div>
          <div className="w-full">
            <DiffHighlight
              maxHeight={false}
              minHeight={false}
              className="w-full"
              code="npm install @helicone/generate"
              language="bash"
              newLines={[]}
              oldLines={[]}
            />
          </div>
        </div>

        {/* Environment Variables */}
        {provider && (
          <>
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Provider: {provider}</AlertTitle>
              <AlertDescription>{t("ui.requiredEnvironmentVariables")}</AlertDescription>
              <div className="w-full">
                <DiffHighlight
                  maxHeight={false}
                  minHeight={false}
                  className="w-full"
                  code={
                    provider
                      ? getEnvFileExample(provider)
                      : "HELICONE_API_KEY=your-helicone-api-key"
                  }
                  language="bash"
                  newLines={[]}
                  oldLines={[]}
                />
              </div>
            </Alert>
          </>
        )}

        {/* Toggle between chat and non-chat examples */}
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-row items-center justify-between">
            <P className="dark:slate-300 font-semibold text-slate-700">{t("ui.deploy")}</P>
            <div className="flex w-full flex-row items-center justify-end gap-2">
              <Tabs
                defaultValue={showChatExample ? "chat" : "single"}
                onValueChange={(value) => setShowChatExample(value === "chat")}
              >
                <TabsList asPill size="xs">
                  <TabsTrigger asPill value="single">{t("ui.single")}</TabsTrigger>
                  <TabsTrigger asPill value="chat">{t("ui.chat")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Show either simple usage or with variables based on inputs */}
          {!showChatExample && (
            <div className="w-full">
              <DiffHighlight
                maxHeight={false}
                minHeight={false}
                className="w-full"
                code={
                  hasVariables
                    ? examples.variablesExample
                    : examples.simpleExample
                }
                language="typescript"
                newLines={[]}
                oldLines={[]}
              />
            </div>
          )}

          {/* In a Chat */}
          {showChatExample && (
            <div className="w-full">
              <DiffHighlight
                maxHeight={false}
                minHeight={false}
                className="w-full"
                code={examples.chatExample}
                language="typescript"
                newLines={[]}
                oldLines={[]}
              />
            </div>
          )}
        </div>

        <Link
          href="https://docs.helicone.ai/features/prompts/generate"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex flex-row items-center gap-0.5 text-heliblue hover:underline"
        >
          <Small className="font-semibold text-heliblue">{t("ui.readFullDocumentation")}</Small>
          <PiArrowUpRightBold className="h-4 w-4" />
        </Link>
      </DialogContent>
    </Dialog>
  );
}

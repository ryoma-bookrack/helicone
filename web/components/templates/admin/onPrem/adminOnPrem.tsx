import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { AnthropicSettings } from "./AnthropicSettings";
import { AzureSettings } from "./AzureSettings";
import { OpenAISettings } from "./OpenAISettings";
import { OpenRouterSettings } from "./OpenRouterSettings";
export interface AzureExperiment {
  azureBaseUri: string;
  azureApiVersion: string;
  azureDeploymentName: string;
  azureApiKey: string;
}

export const AdminOnPremPage = () => {
  const { t } = useTranslation("admin");

  return (
    <div className="flex flex-col space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{t("onPrem.title")}</h1>
      <div className="flex max-w-4xl flex-col space-y-8">
        <Tabs defaultValue="azure" className="w-full">
          <TabsList>
            <TabsTrigger value="azure">{t("onPrem.azure")}</TabsTrigger>
            <TabsTrigger value="openai">{t("onPrem.openai")}</TabsTrigger>
            <TabsTrigger value="anthropic">{t("onPrem.anthropic")}</TabsTrigger>
            <TabsTrigger value="openrouter">{t("onPrem.openrouter")}</TabsTrigger>
          </TabsList>

          <TabsContent value="azure">
            <AzureSettings />
          </TabsContent>

          <TabsContent value="openai">
            <OpenAISettings />
          </TabsContent>

          <TabsContent value="anthropic">
            <AnthropicSettings />
          </TabsContent>

          <TabsContent value="openrouter">
            <OpenRouterSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

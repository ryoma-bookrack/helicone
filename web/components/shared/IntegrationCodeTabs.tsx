import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeHighlighter } from "@/components/shared/CodeHighlighter";
import { getRouterCode } from "@/components/templates/gateway/routerUseDialog";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface IntegrationCodeTabsProps {
  apiKey?: string;
  defaultTab?: "javascript" | "python" | "curl";
  theme?: string;
}

export function IntegrationCodeTabs({
  apiKey,
  defaultTab = "javascript",
  theme = "github-dark",
}: IntegrationCodeTabsProps) {
  const { t } = useTranslation("common");

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <TabsList className="w-auto">
          <TabsTrigger value="javascript">
            {t("languages.javascript")}
          </TabsTrigger>
          <TabsTrigger value="python">{t("languages.python")}</TabsTrigger>
          <TabsTrigger value="curl">{t("languages.curl")}</TabsTrigger>
        </TabsList>

        <Link
          href="https://docs.helicone.ai/getting-started/quick-start"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
        >
          <span>{t("integration.usingAnotherSdk")}</span>
          <MoveUpRight size={10} />
        </Link>
      </div>

      <TabsContent value="javascript" className="mt-2">
        <CodeHighlighter
          code={getRouterCode("javascript", apiKey)}
          language="typescript"
          theme={theme}
        />
      </TabsContent>

      <TabsContent value="python" className="mt-2">
        <CodeHighlighter
          code={getRouterCode("python", apiKey)}
          language="python"
          theme={theme}
        />
      </TabsContent>

      <TabsContent value="curl" className="mt-2">
        <CodeHighlighter
          code={getRouterCode("curl", apiKey)}
          language="bash"
          theme={theme}
        />
      </TabsContent>
    </Tabs>
  );
}

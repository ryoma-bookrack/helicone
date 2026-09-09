import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Bot, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiOpenai,
  SiAnthropic,
  SiGooglegemini,
  SiGoogle,
  SiVercel,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";

interface HelixIntegrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

type IntegrationMethod =
  | "ai-gateway"
  | "openai-sdk"
  | "anthropic-sdk"
  | "azure"
  | "bedrock"
  | "gemini"
  | "vertex"
  | "vercel-ai"
  | "other";

type Framework = "python" | "typescript" | "javascript" | "other";

interface IntegrationData {
  method: IntegrationMethod;
  customMethod: string;
  framework: Framework;
  customFramework: string;
  currentCode: string;
  additionalInstructions: string;
}

const HelixIntegrationDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: HelixIntegrationDialogProps) => {
  const { t } = useTranslation("onboarding");
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IntegrationData>({
    method: "ai-gateway",
    customMethod: "",
    framework: "python",
    customFramework: "",
    currentCode: "",
    additionalInstructions: "",
  });

  const totalSteps = 3;

  const integrationMethods = useMemo(
    () => [
      {
        value: "ai-gateway" as const,
        label: t("helixDialog.methods.aiGateway"),
        icon: SiOpenai,
      },
      {
        value: "anthropic-sdk" as const,
        label: t("helixDialog.methods.anthropicSdk"),
        icon: SiAnthropic,
      },
      {
        value: "azure" as const,
        label: t("helixDialog.methods.azure"),
        icon: VscAzure,
      },
      {
        value: "vertex" as const,
        label: t("helixDialog.methods.vertex"),
        icon: SiGoogle,
      },
      {
        value: "gemini" as const,
        label: t("helixDialog.methods.gemini"),
        icon: SiGooglegemini,
      },
      {
        value: "bedrock" as const,
        label: t("helixDialog.methods.bedrock"),
        icon: FaAws,
      },
      {
        value: "vercel-ai" as const,
        label: t("helixDialog.methods.vercelAi"),
        icon: SiVercel,
      },
      {
        value: "other" as const,
        label: t("helixDialog.methods.other"),
        icon: FileText,
      },
    ],
    [t],
  );

  const languages = useMemo(
    () => [
      {
        value: "python" as const,
        label: t("helixDialog.languages.python"),
        icon: SiPython,
        color: "text-blue-500",
      },
      {
        value: "typescript" as const,
        label: t("helixDialog.languages.typescript"),
        icon: SiTypescript,
        color: "text-blue-500",
      },
      {
        value: "javascript" as const,
        label: t("helixDialog.languages.javascript"),
        icon: SiJavascript,
        color: "text-yellow-500",
      },
      {
        value: "other" as const,
        label: t("helixDialog.languages.other"),
        icon: FileText,
        color: "text-gray-500",
      },
    ],
    [t],
  );

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const formatMessage = () => {
    const methodNames = {
      "ai-gateway": t("helixDialog.methodNames.aiGateway"),
      "openai-sdk": t("helixDialog.methodNames.openaiSdk"),
      "anthropic-sdk": t("helixDialog.methodNames.anthropicSdk"),
      azure: t("helixDialog.methodNames.azure"),
      bedrock: t("helixDialog.methodNames.bedrock"),
      gemini: t("helixDialog.methodNames.gemini"),
      vertex: t("helixDialog.methodNames.vertex"),
      "vercel-ai": t("helixDialog.methodNames.vercelAi"),
      other: data.customMethod || t("helixDialog.messageTemplate.otherMethod"),
    };

    const frameworkNames = {
      python: t("helixDialog.languages.python"),
      typescript: t("helixDialog.languages.typescript"),
      javascript: t("helixDialog.languages.javascript"),
      other: data.customFramework || t("helixDialog.languages.other"),
    };

    let message = t("helixDialog.messageTemplate.intro");
    message += t("helixDialog.messageTemplate.integrationMethod", {
      method:
        data.method === "other"
          ? data.customMethod
          : methodNames[data.method],
    });
    message += t("helixDialog.messageTemplate.framework", {
      framework:
        data.framework === "other"
          ? data.customFramework
          : frameworkNames[data.framework],
    });

    if (data.currentCode.trim()) {
      const languageMap: Record<string, string> = {
        python: "python",
        typescript: "typescript",
        javascript: "javascript",
        other: "text",
      };
      const lang = languageMap[data.framework] || "text";
      message += t("helixDialog.messageTemplate.currentCode", {
        lang,
        code: data.currentCode,
      });
    }

    if (data.additionalInstructions.trim()) {
      message += t("helixDialog.messageTemplate.additionalInstructions", {
        instructions: data.additionalInstructions,
      });
    }

    message += t("helixDialog.messageTemplate.closing");

    return message;
  };

  const handleSubmit = () => {
    const message = formatMessage();
    onSubmit(message);
    onClose();
    setStep(1);
    setData({
      method: "ai-gateway",
      customMethod: "",
      framework: "python",
      customFramework: "",
      currentCode: "",
      additionalInstructions: "",
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {t("helixDialog.step1Question")}
            </Label>
            <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-md border border-border p-2">
              <RadioGroup
                value={data.method}
                onValueChange={(value) =>
                  setData({ ...data, method: value as IntegrationMethod })
                }
              >
                {integrationMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.value}
                      htmlFor={method.value}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
                    >
                      <RadioGroupItem value={method.value} id={method.value} />
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{method.label}</span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            {data.method === "other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-method" className="text-sm">
                  {t("helixDialog.customMethodLabel")}
                </Label>
                <Input
                  id="custom-method"
                  placeholder={t("helixDialog.customMethodPlaceholder")}
                  value={data.customMethod}
                  onChange={(e) =>
                    setData({ ...data, customMethod: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {t("helixDialog.step2Question")}
            </Label>
            <RadioGroup
              value={data.framework}
              onValueChange={(value) =>
                setData({ ...data, framework: value as Framework })
              }
            >
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => {
                  const Icon = lang.icon;
                  return (
                    <label
                      key={lang.value}
                      htmlFor={lang.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 hover:bg-muted/50"
                    >
                      <RadioGroupItem value={lang.value} id={lang.value} />
                      <Icon className={`h-4 w-4 ${lang.color}`} />
                      <span>{lang.label}</span>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>

            {data.framework === "other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-framework" className="text-sm">
                  {t("helixDialog.customFrameworkLabel")}
                </Label>
                <Input
                  id="custom-framework"
                  placeholder={t("helixDialog.customFrameworkPlaceholder")}
                  value={data.customFramework}
                  onChange={(e) =>
                    setData({ ...data, customFramework: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                {t("helixDialog.step3Question")}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-code" className="text-sm font-medium">
                {t("helixDialog.currentCodeLabel")}
              </Label>
              <Textarea
                id="current-code"
                placeholder={t("helixDialog.currentCodePlaceholder")}
                className="font-mono min-h-[150px] text-sm"
                value={data.currentCode}
                onChange={(e) =>
                  setData({ ...data, currentCode: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="additional-instructions"
                className="text-sm font-medium"
              >
                {t("helixDialog.additionalInstructionsLabel")}
              </Label>
              <Textarea
                id="additional-instructions"
                placeholder={t("helixDialog.additionalInstructionsPlaceholder")}
                className="min-h-[100px]"
                value={data.additionalInstructions}
                onChange={(e) =>
                  setData({ ...data, additionalInstructions: e.target.value })
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {t("helixDialog.title")}
          </DialogTitle>
          <DialogDescription>{t("helixDialog.description")}</DialogDescription>
        </DialogHeader>

        <div>
          <div className="my-2 flex justify-end text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>
                {t("helixDialog.stepOf", { current: step, total: totalSteps })}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-12 rounded-full transition-colors ${
                      i < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {renderStep()}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("helixDialog.back")}
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext} className="flex items-center gap-1">
              {t("helixDialog.next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-1 bg-primary"
            >
              <Bot className="h-4 w-4" />
              {t("helixDialog.askHelix")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelixIntegrationDialog;

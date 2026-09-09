import useNotification from "@/components/shared/notification/useNotification";
import { useKeys } from "@/components/templates/keys/useKeys";
import { useLocalStorage } from "@/services/hooks/localStorage";
import {
  ArrowRight,
  BarChart,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  Copy,
  ListTreeIcon,
  Loader,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  OnboardingState,
  useOrgOnboarding,
} from "../../../services/hooks/useOrgOnboarding";
import { useOrg } from "../../layout/org/organizationContext";
import { QuickstartStepCard } from "../../onboarding/QuickstartStep";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { H2, H3, P } from "../../ui/typography";
import { useHeliconeAgent } from "../agent/HeliconeAgentContext";
import HelixIntegrationDialog from "./HelixIntegrationDialog";
import IntegrationGuide from "./integrationGuide";

const QuickstartPage = () => {
  const { t } = useTranslation("onboarding");
  const org = useOrg();
  const { setNotification } = useNotification();
  const { addKey } = useKeys();
  const [quickstartKey, setQuickstartKey] = useLocalStorage<string | undefined>(
    "quickstartKey",
    undefined,
  );
  const [isHelixDialogOpen, setIsHelixDialogOpen] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const { hasKeys, updateOnboardingStatus } = useOrgOnboarding(
    org?.currentOrg?.id ?? "",
  );

  const {
    setAgentChatOpen,
    setAgentState,
    setToolHandler,
    updateCurrentSessionMessages,
    messages,
  } = useHeliconeAgent();

  useEffect(() => {
    if (hasKeys === false) {
      setQuickstartKey(undefined);
    }
  }, [hasKeys, setQuickstartKey]);

  useEffect(() => {
    setToolHandler("quickstart-open-integration-guide", async () => {
      setIsHelixDialogOpen(true);
      return {
        success: true,
        message: t("quickstart.integrationGuideOpened"),
      };
    });
  }, [setToolHandler, t]);

  const handleCreateKey = useCallback(async () => {
    try {
      addKey.mutateAsync(
        {
          permission: "rw",
          keyName: "Quickstart",
          isEu: false,
        },
        {
          onSuccess: (key) => {
            setQuickstartKey(key.apiKey);
          },
        },
      );
    } catch (error) {
      console.error("Failed to create API key:", error);
    }
  }, [addKey, setQuickstartKey]);

  const handleHelixSubmit = (message: string) => {
    const helpMessage = {
      role: "user" as const,
      content: message,
    };
    updateCurrentSessionMessages([...messages, helpMessage], true);
    setAgentChatOpen(true);

    setTimeout(() => {
      setAgentState((prev) => ({
        ...prev,
        needsAssistantResponse: true,
        isProcessing: true,
      }));
    }, 100);
  };

  const handleFinishQuickstart = async () => {
    setIsSkipping(true);
    try {
      await updateOnboardingStatus({
        hasOnboarded: true,
        hasIntegrated: true,
        hasCompletedQuickstart: true,
        currentStep: "REQUEST",
      } as OnboardingState);
      org?.refetchOrgs();
      setNotification(t("quickstart.completed"), "success");
    } catch (error) {
      console.error("Failed to finish quickstart:", error);
      setNotification(t("quickstart.failedToFinish"), "error");
    } finally {
      setIsSkipping(false);
    }
  };

  const steps = useMemo(
    () => [
      {
        title: t("quickstart.steps.createKey.title"),
        description: t("quickstart.steps.createKey.description"),
        link: "/settings/api-keys",
      },
      {
        title: t("quickstart.steps.integrate.title"),
        description: t("quickstart.steps.integrate.description"),
        link: "",
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-screen flex-col gap-8 p-6">
      <div className="mx-auto mt-4 w-full max-w-4xl items-start">
        <H2>{t("quickstart.title")}</H2>
        <P className="mt-2 text-sm text-muted-foreground">
          {t("quickstart.subtitle")}
        </P>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {steps.map((step, index) => {
          const isCompleted =
            (index === 0 && hasKeys) ||
            (index === 1 && org?.currentOrg?.has_integrated);

          return (
            <QuickstartStepCard
              key={index}
              stepNumber={index + 1}
              title={step.title}
              isCompleted={isCompleted ?? false}
              link={step.link}
              rightContent={step.description}
              disabled={false}
            >
              {index === 0 && (
                <div className="mt-4">
                  {quickstartKey ? (
                    <div className="rounded-sm border border-border bg-muted/30 p-2">
                      <div className="flex items-center gap-2">
                        <code className="font-mono flex-1 break-all rounded-sm px-2 py-1 text-sm">
                          {quickstartKey}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(quickstartKey);
                            setNotification(t("quickstart.copiedToClipboard"), "success");
                          }}
                          className="h-auto p-1"
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleCreateKey}
                      disabled={addKey.isPending}
                      className="w-fit"
                      variant="outline"
                    >
                      {addKey.isPending
                        ? t("quickstart.creating")
                        : t("quickstart.createApiKey")}
                    </Button>
                  )}
                </div>
              )}
              {index === 1 && (
                <div className="mt-1">
                  <IntegrationGuide apiKey={quickstartKey} />

                  <div className="mx-4 mb-2 flex flex-col gap-2">
                    <div
                      className={`rounded-sm border border-border p-3 ${org?.currentOrg?.has_integrated ? "bg-confirmative/10" : "bg-muted/30"}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          {org?.currentOrg?.has_integrated ? (
                            <Check size={16} className="text-confirmative" />
                          ) : (
                            <Loader
                              size={16}
                              className="animate-spin text-muted-foreground"
                            />
                          )}
                          <span
                            className={`text-sm ${org?.currentOrg?.has_integrated ? "text-confirmative" : "text-muted-foreground"}`}
                          >
                            {org?.currentOrg?.has_integrated
                              ? t("quickstart.requestsDetected")
                              : t("quickstart.waitingForRequests")}
                          </span>
                        </div>
                        {!org?.currentOrg?.has_integrated ? (
                          <Button
                            size="sm"
                            variant="action"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleFinishQuickstart();
                            }}
                            disabled={isSkipping}
                          >
                            {isSkipping
                              ? t("quickstart.saving")
                              : t("quickstart.finishQuickstart")}
                          </Button>
                        ) : null}
                      </div>
                      {!org?.currentOrg?.has_integrated ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {t("quickstart.proxyHint")}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mx-4 mt-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="link" className="group w-fit p-0">
                          {t("quickstart.needHelp")}
                          <ChevronDown
                            size={16}
                            className="ml-2 transition-transform group-data-[state=open]:rotate-180"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <button
                            onClick={() => setAgentChatOpen(true)}
                            className="flex w-full items-center"
                          >
                            <Bot size={16} className="mr-2" />
                            {t("quickstart.askHelix")}
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="https://docs.helicone.ai"
                            target="_blank"
                            className="flex items-center"
                          >
                            <BookOpen size={16} className="mr-2" />
                            {t("quickstart.documentation")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="https://discord.com/invite/2TkeWdXNPQ"
                            target="_blank"
                            className="flex items-center"
                          >
                            <MessageSquare size={16} className="mr-2" />
                            {t("quickstart.askOnDiscord")}
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </QuickstartStepCard>
          );
        })}

        {hasKeys && (
          <div className="mt-8 flex flex-col gap-4">
            <H3>{t("quickstart.nextSteps")}</H3>
            <P className="text-sm text-muted-foreground">
              {t("quickstart.nextStepsDescription")}
            </P>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link href="/dashboard">
                <div className="group cursor-pointer rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:shadow-md">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BarChart size={20} className="text-primary" />
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-muted-foreground transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {t("quickstart.viewDashboard.title")}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("quickstart.viewDashboard.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/sessions">
                <div className="group cursor-pointer rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:shadow-md">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ListTreeIcon size={20} className="text-primary" />
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-muted-foreground transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {t("quickstart.setupSessions.title")}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("quickstart.setupSessions.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/settings/members">
                <div className="group cursor-pointer rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:shadow-md">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <UserPlus size={20} className="text-primary" />
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-muted-foreground transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {t("quickstart.inviteMembers.title")}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("quickstart.inviteMembers.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      <HelixIntegrationDialog
        isOpen={isHelixDialogOpen}
        onClose={() => setIsHelixDialogOpen(false)}
        onSubmit={handleHelixSubmit}
      />
    </div>
  );
};

export default QuickstartPage;

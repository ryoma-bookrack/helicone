import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useStripeKey } from "@/services/hooks/useStripeKey";
import { useIntegration } from "@/services/hooks/useIntegrations";

import useNotification from "@/components/shared/notification/useNotification";
import { $JAWN_API } from "@/lib/clients/jawn";
import { Trans, useTranslation } from "react-i18next";

interface StripeConfigProps {
  onClose: () => void;
}

const StripeConfig: React.FC<StripeConfigProps> = ({ onClose }) => {
  const { t } = useTranslation(["connections", "common"]);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [eventName, setEventName] = useState("token-billing-tokens");
  const [testCustomerId, setTestCustomerId] = useState("");
  const [testResult, setTestResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { setNotification } = useNotification();
  const { existingKey, isLoadingVault, saveKey, isSavingKey } = useStripeKey();
  const {
    integration,
    isLoadingIntegration,
    updateIntegration,
    isUpdatingIntegration,
  } = useIntegration("stripe");

  const testMeterEvent = $JAWN_API.useMutation(
    "post",
    "/v1/integration/{integrationId}/stripe/test-meter-event",
    {
      onSuccess: (data) => {
        const message =
          typeof data.data === "string"
            ? data.data
            : t("connections:stripe.testSuccessMessage");
        setTestResult({ type: "success", message });
        setNotification(t("connections:stripe.testSuccessMessage"), "success");
      },
      onError: (error: any) => {
        let errorMessage = t("connections:stripe.unknownError");

        if (typeof error === "string") {
          errorMessage = error;
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.data?.error) {
          errorMessage = error.data.error;
        } else {
          errorMessage = JSON.stringify(error);
        }

        setTestResult({ type: "error", message: errorMessage });
        setNotification(
          t("connections:stripe.testFailedNotification", { error: errorMessage }),
          "error",
        );
      },
    },
  );

  useEffect(() => {
    if (existingKey?.provider_key) setApiKey(existingKey.provider_key);
    if (
      integration?.settings?.event_name &&
      typeof integration.settings.event_name === "string"
    ) {
      setEventName(integration.settings.event_name);
    }
  }, [existingKey, integration]);

  const isSaving = isSavingKey || isUpdatingIntegration;
  const isLoading = isLoadingVault || isLoadingIntegration;

  const handleSave = async () => {
    try {
      await saveKey(apiKey);

      // Update integration settings with event_name and enable if not already active
      updateIntegration({
        autoDatasetSync: false,
        active: true,
        event_name: eventName,
      });

      onClose();
    } catch (error) {
      // Error notifications are already handled in the hooks
      console.error("Failed to save Stripe configuration:", error);
    }
  };

  const handleTestMeterEvent = () => {
    if (!eventName || !testCustomerId) return;

    // Clear previous test result
    setTestResult(null);

    // Create or use existing integration for testing
    if (integration?.id) {
      testMeterEvent.mutate({
        params: { path: { integrationId: integration.id } },
        body: {
          event_name: eventName,
          customer_id: testCustomerId,
        },
      });
    } else {
      const errorMessage = t("connections:stripe.saveFirstToTest");
      setTestResult({ type: "error", message: errorMessage });
      setNotification(errorMessage, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{t("connections:stripe.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("connections:stripe.description")}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="stripeIntegration"
          checked={integration?.active ?? false}
          onCheckedChange={() =>
            updateIntegration({
              autoDatasetSync: false,
              active: !integration?.active,
              event_name: eventName,
              showNotification: false,
            })
          }
          disabled={isLoading}
          className="data-[state=checked]:bg-green-500"
        />
        <Label htmlFor="stripeIntegration">{t("connections:stripe.enable")}</Label>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="text-sm font-medium">{t("connections:stripe.howToTitle")}</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <ol className="list-inside list-decimal space-y-2">
            <li>
              <Trans
                i18nKey="stripe.step1"
                ns="connections"
                components={{ strong: <span className="font-medium text-foreground" /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey="stripe.step2"
                ns="connections"
                components={{ strong: <span className="font-medium text-foreground" /> }}
              />
            </li>
            <li>{t("connections:stripe.step3")}</li>
            <li>
              {t("connections:stripe.step4Intro")}
              <ul className="ml-6 mt-1 list-inside list-disc space-y-1">
                <li>
                  <Trans
                    i18nKey="stripe.billingPermission"
                    ns="connections"
                    components={{ strong: <span className="font-medium text-foreground" /> }}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey="stripe.meterEventsPermission"
                    ns="connections"
                    components={{ strong: <span className="font-medium text-foreground" /> }}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey="stripe.customersPermission"
                    ns="connections"
                    components={{ strong: <span className="font-medium text-foreground" /> }}
                  />
                </li>
              </ul>
            </li>
            <li>
              <Trans
                i18nKey="stripe.step5"
                ns="connections"
                components={{ strong: <span className="font-medium text-foreground" /> }}
              />
            </li>
            <li>{t("connections:stripe.step6")}</li>
          </ol>
          <p className="mt-3 text-xs">
            <Trans
              i18nKey="stripe.note"
              ns="connections"
              components={{ strong: <span className="font-medium text-foreground" /> }}
            />
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium">{t("connections:stripe.meterSettings")}</h3>

        <div className="space-y-2">
          <Label htmlFor="eventName">{t("connections:stripe.eventName")}</Label>
          <Input
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="token-billing-tokens"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            {t("connections:stripe.eventNameHint")}
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-dashed border-muted-foreground/50 bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">{t("connections:stripe.testMeterEvents")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("connections:stripe.testMeterEventsHint")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testCustomerId">{t("connections:stripe.stripeCustomerId")}</Label>
          <div className="flex gap-2">
            <Input
              id="testCustomerId"
              type="text"
              value={testCustomerId}
              onChange={(e) => setTestCustomerId(e.target.value)}
              placeholder="cus_12345678"
              disabled={isLoading}
            />
            <Button
              variant="outline"
              onClick={handleTestMeterEvent}
              disabled={
                isLoading ||
                !eventName ||
                !testCustomerId ||
                testMeterEvent.isPending
              }
            >
              {testMeterEvent.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("connections:stripe.testEvent")}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("connections:stripe.testEventHint")}
          </p>
        </div>

        {testResult && (
          <div
            className={`rounded-md border p-3 text-sm ${
              testResult.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
            }`}
          >
            <div className="flex items-start gap-2">
              <div
                className={`mt-0.5 h-2 w-2 rounded-full ${
                  testResult.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <div className="flex-1">
                <p className="font-medium">
                  {testResult.type === "success"
                    ? t("connections:stripe.testSuccessful")
                    : t("connections:stripe.testFailed")}
                </p>
                <p className="mt-1 text-xs opacity-90">{testResult.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium">{t("connections:stripe.nextSteps")}</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>{t("connections:stripe.nextStepsIntro")}</p>
          <div className="font-mono rounded-md bg-muted p-3 text-xs">
            <code>x-stripe-customer-id: cus_12345678</code>
          </div>
          <p>
            <Trans
              i18nKey="stripe.nextStepsReplace"
              ns="connections"
              components={{ code: <code className="rounded bg-muted px-1" /> }}
            />
          </p>
          <p className="text-xs">
            <Trans
              i18nKey="stripe.learnMore"
              ns="connections"
              components={{
                strong: <span className="font-medium text-foreground" />,
                link: (
                  <a
                    href="https://docs.helicone.ai/getting-started/integration-method/gateway-headers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  />
                ),
              }}
            />
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stripeKey">{t("connections:stripe.rakLabel")}</Label>
        <div className="relative">
          <Input
            id="stripeKey"
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="rk_live_..."
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowApiKey(!showApiKey)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : showApiKey ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("connections:stripe.rakHint")}
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          {t("common:actions.cancel")}
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading || !apiKey}
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t("connections:stripe.saveConfiguration")}
        </Button>
      </div>
    </div>
  );
};

export default StripeConfig;

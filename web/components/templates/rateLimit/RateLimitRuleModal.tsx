"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { $JAWN_API } from "@/lib/clients/jawn";
import { logger } from "@/lib/telemetry/logger";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrg } from "@/components/layout/org/organizationContext"; // Import useOrg
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { P } from "@/components/ui/typography";
import { components } from "@/lib/clients/jawnTypes/private"; // Import generated types
import { Result } from "@/packages/common/result"; // <-- Add Result import

// Use generated types instead of manual definitions
type CreateRateLimitPayload =
  components["schemas"]["CreateRateLimitRuleParams"];
type UpdateRateLimitPayload =
  components["schemas"]["UpdateRateLimitRuleParams"];
type RateLimitRuleView = components["schemas"]["RateLimitRuleView"];

// Zod schema factory for client-side validation (mirrors backend, suitable for both)
const createRateLimitRuleClientSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("modal.validation.nameRequired")),
    quota: z.number().nonnegative(t("modal.validation.quotaNonNegative")),
    window_seconds: z
      .number()
      .nonnegative(t("modal.validation.windowNonNegative")),
    unit: z.enum(["request", "cents"]),
    segment: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val === "user" ||
          /^[a-zA-Z0-9_-]+$/.test(val || ""),
        {
          message: t("modal.validation.segmentInvalid"),
        },
      ),
  });

interface RateLimitRuleModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: (rule: RateLimitRuleView) => void;
  rule?: RateLimitRuleView; // <-- Make rule prop optional
}

const RateLimitRuleModal = ({
  open,
  onOpenChange,
  onSuccess,
  rule, // <-- Destructure optional rule
}: RateLimitRuleModalProps) => {
  const { t } = useTranslation("rateLimits");
  const { t: tCommon } = useTranslation("common");
  const rateLimitRuleClientSchema = useMemo(
    () => createRateLimitRuleClientSchema(t),
    [t],
  );

  const queryClient = useQueryClient();
  const org = useOrg();
  const isEditMode = !!rule; // Determine mode based on rule prop

  // State variables (from original Create modal)
  const [name, setName] = useState("");
  const [quota, setQuota] = useState("");
  const [unit, setUnit] = useState<"request" | "cents">("request");
  const [windowSeconds, setWindowSeconds] = useState("");
  const [segmentType, setSegmentType] = useState<
    "global" | "user" | "property"
  >("global");
  const [customPropertyKey, setCustomPropertyKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Effect to initialize/reset state based on mode
  useEffect(() => {
    if (open) {
      if (isEditMode && rule) {
        // Initialize state for Edit mode
        setName(rule.name);
        setQuota(String(rule.quota));
        setUnit(rule.unit);
        setWindowSeconds(String(rule.window_seconds));

        if (rule.segment === "user") {
          setSegmentType("user");
          setCustomPropertyKey("");
        } else if (rule.segment) {
          setSegmentType("property");
          setCustomPropertyKey(rule.segment);
        } else {
          setSegmentType("global");
          setCustomPropertyKey("");
        }
        setError(null);
      } else {
        setName("");
        setQuota("");
        setUnit("request");
        setWindowSeconds("");
        setSegmentType("global");
        setCustomPropertyKey("");
        setError(null);
      }
    }
  }, [open, rule, isEditMode]);

  const mutation = useMutation<
    Result<RateLimitRuleView | null, string>, // Return type matches Jawn PUT/POST
    Error,
    CreateRateLimitPayload | UpdateRateLimitPayload // Input type depends on mode
  >({
    mutationFn: async (
      data: CreateRateLimitPayload | UpdateRateLimitPayload,
    ): Promise<Result<RateLimitRuleView | null, string>> => {
      let resp;
      if (isEditMode && rule) {
        // Edit Mode - Use PUT
        resp = await $JAWN_API.PUT("/v1/rate-limits/{ruleId}", {
          params: { path: { ruleId: rule.id } },
          body: data as UpdateRateLimitPayload, // Cast to Update type
        });
      } else {
        // Create Mode - Use POST
        resp = await $JAWN_API.POST("/v1/rate-limits", {
          body: data as CreateRateLimitPayload, // Cast to Create type
        });
      }

      if (resp.error || !resp.data?.data) {
        logger.error(
          {
            error: resp.error,
          },
          "Failed to save rate limit rule",
        );
        throw new Error(resp.error || t("modal.saveError"));
      }

      // Ensure return type matches expected Result structure
      return resp.data as Result<RateLimitRuleView | null, string>;
    },
    onSuccess: (resultData) => {
      // Check if data exists in the result (should for success)
      if (resultData?.data) {
        queryClient.invalidateQueries({
          queryKey: ["rateLimits", org?.currentOrg?.id],
        });
        onSuccess(resultData.data); // Pass the created/updated rule data
        onOpenChange(false); // Close modal on success
      } else {
        // Handle unexpected success case where data might be null/undefined
        logger.warn("Rate limit rule saved, but no data returned.");
        setError(t("modal.savedNoData"));
        onOpenChange(false); // Still close modal
      }
    },
    onError: (error: Error) => {
      setError(error.message ?? t("modal.unknownError"));
    },
  });

  const handleSubmit = () => {
    setError(null);

    const parsedQuota = parseInt(quota, 10);
    const parsedWindowSeconds = parseInt(windowSeconds, 10);

    let segment: string | undefined;
    if (segmentType === "user") {
      segment = "user";
    } else if (segmentType === "property") {
      if (!customPropertyKey.trim()) {
        setError(t("modal.propertyKeyEmpty"));
        return;
      }
      segment = customPropertyKey.trim();
    }

    // Prepare data using the schema structure expected by the API
    const formData = {
      name: name.trim(),
      quota: isNaN(parsedQuota) ? undefined : parsedQuota, // Use undefined if NaN for Zod
      window_seconds: isNaN(parsedWindowSeconds)
        ? undefined
        : parsedWindowSeconds, // Use undefined if NaN
      unit: unit,
      segment: segment,
    };

    // Validate using Zod
    const validationResult = rateLimitRuleClientSchema.safeParse(formData);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.errors
        .map((e) => `${e.path.join(".")} (${e.code}): ${e.message}`) // More detailed error
        .join("\n");
      setError(formattedErrors);
      return;
    }

    mutation.mutate(validationResult.data);
  };

  // Use the passed-in handler, but clear errors when closing
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setError(null); // Clear errors when closing
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          {/* Conditional Title/Description */}
          <DialogTitle>
            {isEditMode ? t("modal.editTitle") : t("modal.createTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t("modal.editDescription")
              : t("modal.createDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t("modal.ruleName")}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder={t("modal.ruleNamePlaceholder")}
              disabled={mutation.isPending}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quota" className="text-right">
              {t("modal.quota")}
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <Input
                id="quota"
                type="number"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                placeholder={t("modal.quotaPlaceholder")}
                min="0"
                disabled={mutation.isPending}
              />
              <Select
                value={unit}
                onValueChange={(value: "request" | "cents") => setUnit(value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("modal.selectUnit")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="request">{t("rules.units.request")}</SelectItem>
                  <SelectItem value="cents">{t("rules.units.cents")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="windowSeconds" className="pt-2 text-right">
              {t("modal.timeWindowSec")}
            </Label>
            <Input
              id="windowSeconds"
              type="number"
              className="col-span-3"
              value={windowSeconds}
              onChange={(e) => setWindowSeconds(e.target.value)}
              placeholder={t("modal.timeWindowPlaceholder")}
              min="0"
              disabled={mutation.isPending}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="segmentType" className="text-right">
              {t("modal.applyTo")}
            </Label>
            <div className="col-span-3">
              <Select
                value={segmentType}
                onValueChange={(value: "global" | "user" | "property") => {
                  setSegmentType(value);
                  if (value !== "property") {
                    setCustomPropertyKey(""); // Reset custom key if not property type
                  }
                }}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("modal.selectScope")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">{t("modal.scopeGlobal")}</SelectItem>
                  <SelectItem value="user">{t("modal.scopeUser")}</SelectItem>
                  <SelectItem value="property">{t("modal.scopeProperty")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {segmentType === "property" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customPropertyKey" className="text-right">
                {t("modal.propertyKey")}
              </Label>
              <Input
                id="customPropertyKey"
                value={customPropertyKey}
                onChange={(e) => setCustomPropertyKey(e.target.value)}
                className="col-span-3"
                placeholder={t("modal.propertyKeyPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          )}
        </div>
        {error && (
          <div className="px-4 pb-2 text-sm text-destructive">
            {" "}
            {/* Adjusted padding */}
            <P className="mb-1 font-semibold">{t("modal.error")}</P>
            <pre className="font-sans whitespace-pre-wrap">{error}</pre>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={mutation.isPending}
          >
            {tCommon("actions.cancel")}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={mutation.isPending || !name || !quota || !windowSeconds} // Ensuring this line is correct
          >
            {/* Conditional Button Text */}
            {mutation.isPending
              ? isEditMode
                ? t("modal.saving")
                : t("modal.creating")
              : isEditMode
                ? t("modal.saveChanges")
                : t("rules.createRule")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RateLimitRuleModal; // <-- Renamed export

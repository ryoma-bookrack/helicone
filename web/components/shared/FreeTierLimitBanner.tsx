import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeTierLimitWrapper } from "@/components/shared/FreeTierLimitWrapper";
import { FeatureId, SubfeatureId } from "@/lib/features";
import { useTranslation } from "react-i18next";

interface FreeTierLimitBannerProps {
  feature: FeatureId;
  subfeature?: SubfeatureId;
  itemCount: number;
  freeLimit: number;
  message?: string;
  rounded?: boolean;
  className?: string;
  buttonText?: string;
  buttonSize?: "xs" | "sm" | "default" | "lg";
}

export function FreeTierLimitBanner({
  feature,
  subfeature,
  itemCount,
  freeLimit,
  message,
  rounded = false,
  className = "",
  buttonText,
  buttonSize = "sm",
}: FreeTierLimitBannerProps) {
  const { t } = useTranslation("common");
  const featureLabel = `${feature}${subfeature ? ` ${subfeature}` : ""}`;
  const defaultMessage = t("freeTier.defaultMessage", {
    itemCount,
    freeLimit,
    feature: featureLabel,
  });
  const resolvedButtonText = buttonText ?? t("actions.upgrade");

  return (
    <div
      className={`border-y border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 ${
        rounded ? "rounded-md" : ""
      } ${className}`}
    >
      <div className="mx-auto flex flex-col gap-2 px-4 py-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {message || defaultMessage}
          </span>
        </div>
        <div className="ml-6 sm:ml-0">
          {subfeature ? (
            <FreeTierLimitWrapper
              feature={feature}
              subfeature={subfeature}
              itemCount={itemCount}
            >
              <Button
                variant="action"
                size={buttonSize}
                className="bg-yellow-700 text-white hover:bg-yellow-800"
              >
                {resolvedButtonText}
              </Button>
            </FreeTierLimitWrapper>
          ) : (
            <FreeTierLimitWrapper feature={feature} itemCount={itemCount}>
              <Button
                variant="action"
                size={buttonSize}
                className="bg-yellow-700 text-white hover:bg-yellow-800"
              >
                {resolvedButtonText}
              </Button>
            </FreeTierLimitWrapper>
          )}
        </div>
      </div>
    </div>
  );
}

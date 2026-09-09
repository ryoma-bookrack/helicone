import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { useDraftOnboardingStore } from "@/services/hooks/useOrgOnboarding";
import { useOrg } from "@/components/layout/org/organizationContext";
import { cn } from "@/lib/utils";

export const OrganizationStep = () => {
  const { t } = useTranslation("onboarding");
  const orgId = useOrg()?.currentOrg?.id ?? "";
  const { draftName, setDraftName } = useDraftOnboardingStore(orgId)();
  const [error, setError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setDraftName(newName);

    if (!newName) {
      setError(t("organization.nameRequired"));
    } else {
      setError("");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[hsl(var(--foreground))]">
          {t("organization.title")}
        </h2>
        <Input
          type="text"
          value={draftName}
          onChange={handleNameChange}
          placeholder={t("organization.placeholder")}
          className={cn(
            "text-sm placeholder:text-[hsl(var(--muted-foreground))]",
            error &&
              "border-[hsl(var(--destructive))] text-[hsl(var(--destructive))]",
          )}
        />
        {error ? (
          <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
        ) : draftName ? (
          <p className="text-sm font-light text-[hsl(var(--muted-foreground))]">
            {t("organization.renameHint")}
          </p>
        ) : null}
      </div>
    </div>
  );
};

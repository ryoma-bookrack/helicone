"use client";
import { useOrg } from "@/components/layout/org/organizationContext";

import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OrganizationStep } from "@/components/onboarding/Steps/OrganizationStep";
import { MembersStep } from "@/components/onboarding/Steps/MembersStep";
import useNotification from "@/components/shared/notification/useNotification";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";
import { useOrgOnboarding } from "@/services/hooks/useOrgOnboarding";
import { useAddOrgMemberMutation } from "@/services/hooks/organizations";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const { t } = useTranslation("onboarding");
  const router = useRouter();
  const org = useOrg();
  const { setNotification } = useNotification();
  const {
    onboardingState,
    isLoading,
    draftName,
    draftMembers,
    setDraftMembers,
    updateCurrentStep,
    saveOrganizationName,
  } = useOrgOnboarding(org?.currentOrg?.id ?? "");

  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [hasCreatedOrg, setHasCreatedOrg] = useState(false);
  const addMemberMutation = useAddOrgMemberMutation();

  useEffect(() => {
    updateCurrentStep("ORGANIZATION");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMemberInvitations = async () => {
    if (draftMembers.length === 0)
      return { success: true, errors: [], successCount: 0, totalCount: 0 };

    setIsSendingInvites(true);
    const errors: string[] = [];
    const orgId = org?.currentOrg?.id ?? "";

    try {
      const invitationPromises = draftMembers.map(async (member) => {
        try {
          await addMemberMutation.mutateAsync({
            params: {
              path: {
                organizationId: orgId,
              },
            },
            body: {
              email: member.email,
            },
          });
          return { success: true, email: member.email };
        } catch (error: any) {
          const errorMessage = error.error || t("index.inviteMemberFailed");
          errors.push(
            t("index.inviteMemberFailedWithEmail", {
              email: member.email,
              error: errorMessage,
            }),
          );
          return { success: false, email: member.email, error: errorMessage };
        }
      });

      const results = await Promise.all(invitationPromises);
      const successCount = results.filter((r) => r.success).length;

      return {
        success: errors.length === 0,
        errors,
        successCount,
        totalCount: draftMembers.length,
      };
    } catch (error) {
      console.error("Error sending invitations:", error);
      errors.push(t("index.unexpectedInviteError"));
      return {
        success: false,
        errors,
        successCount: 0,
        totalCount: draftMembers.length,
      };
    } finally {
      setIsSendingInvites(false);
    }
  };

  const handleCreateOrganization = async () => {
    if (!draftName) return;

    await saveOrganizationName();

    setNotification(
      onboardingState?.name && onboardingState.name !== "My Organization"
        ? t("index.organizationUpdated")
        : t("index.organizationCreated"),
      "success",
    );

    setHasCreatedOrg(true);
  };

  const handleContinue = async () => {
    if (draftMembers.length > 0) {
      const result = await sendMemberInvitations();

      if (result.success) {
        setNotification(
          t("index.inviteSuccess", { count: result.successCount ?? 0 }),
          "success",
        );
        setDraftMembers([]);
      } else if ((result.successCount ?? 0) > 0) {
        setNotification(
          t("index.invitePartial", {
            success: result.successCount ?? 0,
            total: result.totalCount ?? 0,
          }),
          "error",
        );
        result.errors.forEach((error) => console.error(error));
      } else {
        setNotification(t("index.inviteFailed"), "error");
        result.errors.forEach((error) => console.error(error));
        return;
      }
    }

    router.push("/quickstart");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center">
        <OnboardingHeader />
        <div className="mx-auto mt-12 w-full max-w-2xl px-4">
          <div className="flex flex-col gap-4">
            <div className="animate-pulse">{t("loading")}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <OnboardingHeader>
      <div className="mx-auto mt-12 w-full max-w-2xl px-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <H1>{t("index.title")}</H1>
            <Muted>{t("index.subtitle")}</Muted>
          </div>

          <OrganizationStep />

          {hasCreatedOrg && (
            <>
              <div className="flex flex-col gap-2 pt-4">
                <h3 className="text-sm font-medium">
                  {t("index.inviteTitle")}
                </h3>
                <Muted className="text-xs">
                  {t("index.inviteDescription")}
                </Muted>
              </div>

              <MembersStep />
            </>
          )}

          <div className="flex justify-end">
            {!hasCreatedOrg ? (
              <Button
                variant="action"
                className="w-full"
                onClick={handleCreateOrganization}
                disabled={!draftName}
              >
                {onboardingState?.name &&
                onboardingState.name !== "My Organization"
                  ? t("index.updateOrganization")
                  : t("index.createOrganization")}
              </Button>
            ) : (
              <Button
                variant="action"
                className="w-full"
                onClick={handleContinue}
                disabled={isSendingInvites}
              >
                {isSendingInvites && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSendingInvites
                  ? t("index.sendingInvitations")
                  : draftMembers.length > 0
                    ? t("index.continueWithMembers", {
                        count: draftMembers.length,
                      })
                    : t("index.continue")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </OnboardingHeader>
  );
}

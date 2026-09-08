import { useOrg } from "@/components/layout/org/organizationContext";

/** Self-hosted: no Stripe subscription or trial gating. */
export const useFeatureTrial = (
  _productType: "prompts" | "experiments" | "evals",
  _featureName: string,
) => {
  return {
    handleConfirmTrial: async () => ({ success: true }),
    proRequired: false,
  };
};

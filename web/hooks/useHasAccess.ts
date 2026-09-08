import { FeatureId } from "@/lib/features";

/** Self-hosted: no free-tier or Pro plan gating. */
export const useHasAccess = (_feature: FeatureId) => true;

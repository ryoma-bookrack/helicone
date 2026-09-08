import { useMemo } from "react";

export const descriptions = {
  pro: "",
  Datasets: "",
  Alerts: "",
  time_filter: "",
  invite: "",
  RateLimit: "",
  Properties: "",
  Prompts: "",
  cache: "",
  Evaluators: "",
  Playground: "",
  Sessions: "",
  Vault: "",
  Webhooks: "",
  Users: "",
};

export type FeatureName = keyof typeof descriptions;

export const titles: Record<FeatureName, string> = {
  pro: "",
  Datasets: "",
  Alerts: "",
  time_filter: "",
  invite: "",
  RateLimit: "",
  Properties: "",
  Prompts: "",
  cache: "",
  Evaluators: "",
  Playground: "",
  Sessions: "",
  Vault: "",
  Webhooks: "",
  Users: "",
};

export function useProFeature(featureName: FeatureName, enabled = true) {
  return useMemo(
    () => ({
      hasAccess: enabled,
      customDescription: descriptions[featureName],
      title: titles[featureName],
      isPro: true,
    }),
    [featureName, enabled],
  );
}

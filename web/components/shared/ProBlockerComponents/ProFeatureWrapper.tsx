import React, { ReactElement, forwardRef } from "react";
import { FeatureName } from "@/hooks/useProFeature";

interface ProFeatureWrapperProps {
  children: React.ReactElement;
  featureName: FeatureName;
  enabled?: boolean;
  limitMessage?: string;
}

/** Self-hosted: render children without Pro plan blocking. */
export const ProFeatureWrapper = forwardRef<
  HTMLElement,
  ProFeatureWrapperProps
>(({ children }, ref) => {
  return React.cloneElement(children, { ref });
});

ProFeatureWrapper.displayName = "ProFeatureWrapper";

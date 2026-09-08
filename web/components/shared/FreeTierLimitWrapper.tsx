import { ReactElement } from "react";
import { FeatureId, SubfeatureId } from "@/lib/features";

interface FreeTierLimitWrapperProps {
  feature: FeatureId;
  itemCount: number;
  subfeature?: SubfeatureId;
  children: ReactElement;
}

/** Self-hosted: no free-tier limits. */
export function FreeTierLimitWrapper({ children }: FreeTierLimitWrapperProps) {
  return <>{children}</>;
}

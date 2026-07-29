/* eslint-disable @typescript-eslint/no-explicit-any */

import { PostHog } from "posthog-node";

/** Self-host: never create Helicone-cloud PostHog client for operator telemetry. */
export function newPostHogClient(): PostHog | null {
  return null;
}

export const postHogClient: PostHog | null = null;

import { logger } from "@/lib/telemetry/logger";

/** Self-host: never send operator analytics to Helicone PostHog. */
export class PosthogClient {
  private static instance: PosthogClient;

  static getInstance(): PosthogClient {
    if (!PosthogClient.instance) {
      PosthogClient.instance = new PosthogClient();
    }
    return PosthogClient.instance;
  }

  public async captureEvent(
    eventName: string,
    properties: Record<string, any> = {},
    userId?: string,
    organizationId?: string,
  ): Promise<boolean> {
    logger.debug(
      { eventName, userId, organizationId, properties },
      "[PostHog stripped] operator analytics disabled",
    );
    return false;
  }
}

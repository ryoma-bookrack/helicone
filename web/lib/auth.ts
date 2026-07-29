import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { getUser } from "@/packages/common/toImplement/server/useBetterAuthClient";
import { Pool } from "pg";
import { logger } from "@/lib/telemetry/logger";

/** Self-host: skip email verification; sign users in immediately after signup. */
export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3008"],
  plugins: [
    customSession(async ({ user, session }) => {
      const dbUser = await getUser(user.id);
      if (dbUser.error || !dbUser.data) {
        logger.warn("could not fetch authUserId from db");
        return {
          user,
          session,
        };
      }

      return {
        user: {
          authUserId: dbUser.data.id,
          ...user,
        },
        session,
      };
    }),
  ],
});

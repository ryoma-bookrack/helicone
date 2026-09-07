import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { getUser } from "@/packages/common/toImplement/server/useBetterAuthClient";
import { Pool } from "pg";
import { logger } from "@/lib/telemetry/logger";

/** Allow LAN APP_URL plus localhost/127.0.0.1 on the same port (self-host browsers often mix them). */
function buildTrustedOrigins(): string[] {
  const primary =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    process.env.SITE_URL ??
    "http://localhost:3008";
  const origins = new Set<string>([primary]);
  for (const raw of (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "").split(",")) {
    const o = raw.trim();
    if (o) origins.add(o);
  }
  try {
    const u = new URL(primary);
    const port = u.port ? `:${u.port}` : "";
    origins.add(`${u.protocol}//localhost${port}`);
    origins.add(`${u.protocol}//127.0.0.1${port}`);
  } catch {
    // ignore invalid primary URL
  }
  return Array.from(origins);
}

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
  trustedOrigins: buildTrustedOrigins(),
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

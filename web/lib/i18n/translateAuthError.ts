import { TFunction } from "i18next";

const AUTH_ERROR_KEY_MAP: Record<string, string> = {
  "Org not found": "errors.orgNotFound",
  "User not found": "errors.userNotFound",
  "Supabase client not found": "errors.clientNotConfigured",
  "Invalid SSO redirect URL": "errors.invalidSsoRedirect",
};

export function translateAuthError(
  message: string | undefined,
  t: TFunction<"auth">,
): string {
  if (!message) {
    return t("errors.generic");
  }
  const key = AUTH_ERROR_KEY_MAP[message];
  return key ? t(key) : message;
}

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CustomerPortalContent = {
  domain: string;
  logo: string;
};

interface AuthFormProps {
  handleEmailSubmit: (email: string, password: string) => void;
  authFormType: "signin" | "signup" | "reset" | "reset-password";
  customerPortalContent?: CustomerPortalContent;
}

const AuthForm = ({
  handleEmailSubmit,
  authFormType,
  customerPortalContent,
}: AuthFormProps) => {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (router.query.url && router.asPath) {
      const fullUrl = window.location.href;
      const startIndex = fullUrl.indexOf("url=");
      const urlParam = fullUrl.substring(startIndex + 4);
      const decodedUrl = decodeURIComponent(urlParam);

      try {
        const redirectUrl = new URL(decodedUrl, window.location.origin);
        if (redirectUrl.origin === window.location.origin) {
          window.location.href = redirectUrl.href;
        }
      } catch {
        // Invalid URL, ignore redirect
      }
    }
  }, [router.query, router.asPath]);

  const handleEmailSubmitHandler = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    await handleEmailSubmit(email, password);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-6 md:p-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/signin" className="flex">
            <Image
              src="/static/logo.svg"
              alt={t("form.logoAlt")}
              height={80}
              width={80}
              priority
            />
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {authFormType === "signin"
              ? t("form.signInTitle")
              : authFormType === "signup"
                ? t("form.signUpTitle")
                : t("form.resetTitle")}
          </h2>
          {authFormType === "signup" ? (
            <p className="mt-2 text-sm text-gray-600">
              {t("form.alreadyHaveAccount")}{" "}
              <Link href="/signin" className="text-sky-500 hover:text-sky-700">
                {t("form.signInLink")}
              </Link>
            </p>
          ) : null}
          {authFormType === "signin" ? (
            <p className="mt-2 text-sm text-gray-600">
              {t("form.dontHaveAccount")}{" "}
              <Link
                href="/secret-signup"
                className="text-sky-500 hover:text-sky-700"
              >
                {t("form.createAccount")}
              </Link>
            </p>
          ) : null}
        </div>

        <form
          action="#"
          method="POST"
          className="space-y-5"
          onSubmit={handleEmailSubmitHandler}
        >
          {authFormType !== "reset-password" && (
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("form.email")}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("form.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {authFormType !== "reset" && (
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t("form.password")}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder={t("form.passwordPlaceholder")}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {authFormType === "signin" && (
            <div className="flex justify-end">
              <Link
                href="/reset"
                className="text-sm text-sky-500 hover:text-sky-700"
              >
                {t("form.forgotPassword")}
              </Link>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-500 py-2 text-white"
          >
            {authFormType === "signin"
              ? t("form.signInWithEmail")
              : authFormType === "signup"
                ? t("form.createAccountButton")
                : authFormType === "reset"
                  ? t("form.resetPasswordButton")
                  : t("form.updatePasswordButton")}
          </Button>
        </form>

        {customerPortalContent && (
          <div className="mt-8 text-center text-xs italic text-gray-500">
            {t("form.poweredByHelicone")}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;

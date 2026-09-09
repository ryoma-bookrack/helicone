import { useHeliconeAuthClient } from "@/packages/common/auth/client/AuthClientFactory";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsGoogle } from "react-icons/bs";

interface LoginProps {
  formState: "login" | "reset" | "signup";
}

const Login = (props: LoginProps) => {
  const { t } = useTranslation("auth");
  const { formState: defaultFormState } = props;
  const [formState, setFormState] = useState<"login" | "reset" | "signup">(
    defaultFormState,
  );
  const [authError, setAuthError] = useState<string>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const heliconeAuthClient = useHeliconeAuthClient();
  const router = useRouter();

  const signUpHandler = async (email: string, password: string) => {
    if (email === "") {
      setAuthError(t("login.emailRequired"));
      return;
    }
    if (password === "") {
      setAuthError(t("login.passwordRequired"));
      return;
    }

    setLoading(true);

    const { error: authError } = await heliconeAuthClient.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `https://${origin}/welcome`,
      },
    });

    if (authError) {
      setAuthError(authError);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/welcome");
  };

  const googleButtonLabel =
    formState === "signup"
      ? t("login.signUpWithGoogle")
      : t("login.signInWithGoogle");

  return (
    <div className="flex w-full min-w-[300px] flex-col space-y-0 sm:min-w-[450px] sm:max-w-2xl">
      <div className="flex w-full flex-row items-center justify-between border-b border-gray-300 pb-2">
        <p className="w-full text-lg font-medium">
          {formState === "login"
            ? t("login.titleLogin")
            : formState === "reset"
              ? t("login.titleReset")
              : t("login.titleSignup")}
        </p>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex h-full w-full flex-col pt-2">
          <div className="w-full flex-auto pt-2">
            <div className="flex min-h-full items-center justify-center">
              {formState === "reset" ? (
                <div className="w-full max-w-md space-y-8">
                  <form className="space-y-4" action="#" method="POST">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                      <div>
                        <label htmlFor="email-address" className="sr-only">
                          {t("login.emailAddress")}
                        </label>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          autoComplete="email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="text-md relative block w-full appearance-none rounded-md border border-gray-300 p-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:p-4 sm:text-lg"
                          placeholder={t("login.emailAddress")}
                        />
                      </div>
                    </div>
                    {authError && (
                      <div className="mt-4 w-full text-sm text-red-600">
                        <p>{authError}</p>
                      </div>
                    )}
                  </form>
                  <button
                    onClick={() => {
                      if (email === "") {
                        setAuthError(t("login.emailRequired"));
                        return;
                      }
                      setLoading(true);
                      heliconeAuthClient
                        .resetPassword({
                          email,
                          options: {
                            emailRedirectTo: `${window.location.origin}/reset`,
                          },
                        })
                        .then((res) => {
                          if (res.error) {
                            setAuthError(res.error);
                          } else {
                            setAuthError(
                              t("login.resetEmailSent", { email }),
                            );
                          }
                          setLoading(false);
                        });
                    }}
                    type="submit"
                    className="text-md flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-sky-600 to-indigo-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {loading ? (
                      <div className="flex flex-row items-center">
                        <ArrowPathIcon className="mr-1.5 h-4 w-4 animate-spin" />
                        {t("login.resetting")}
                      </div>
                    ) : (
                      <div className="flex flex-row items-center">
                        {t("login.resetEmail")}
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-md space-y-8">
                  <div className="space-y-4">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                      <div>
                        <label htmlFor="email-address" className="sr-only">
                          {t("login.emailAddress")}
                        </label>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          autoComplete="email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="text-md relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 p-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:p-4 sm:text-lg"
                          placeholder={t("login.emailAddress")}
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="sr-only">
                          {t("login.password")}
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="text-md relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 p-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:p-4 sm:text-lg"
                          placeholder={t("login.password")}
                        />
                      </div>
                    </div>
                    {formState === "login" && (
                      <div className="flex items-center justify-end">
                        <div className="text-sm">
                          <button
                            type="button"
                            onClick={() => setFormState("reset")}
                            className="font-medium text-sky-600 hover:text-sky-500"
                          >
                            {t("login.forgotPassword")}
                          </button>
                        </div>
                      </div>
                    )}
                    {authError && (
                      <div className="mt-4 w-full text-sm text-red-600">
                        <p>{authError}</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        if (formState === "login") {
                          if (email === "") {
                            return;
                          }
                          if (password === "") {
                            return;
                          }
                          setLoading(true);

                          heliconeAuthClient
                            .signInWithPassword({
                              email,
                              password,
                            })
                            .then((res) => {
                              if (res.error) {
                                setAuthError(res.error);
                              } else {
                                router.push("/dashboard");
                              }
                              setLoading(false);
                            });
                        } else if (formState === "signup") {
                          signUpHandler(email, password);
                        }
                      }}
                      type="button"
                      className="text-md flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-sky-600 to-indigo-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {loading ? (
                        <div className="flex flex-row items-center">
                          <ArrowPathIcon className="mr-1.5 h-4 w-4 animate-spin" />
                          {t("login.loggingIn")}
                        </div>
                      ) : (
                        <div className="flex flex-row items-center">
                          {formState === "signup"
                            ? t("login.signUp")
                            : t("login.signIn")}
                        </div>
                      )}
                    </button>
                    <button
                      onClick={async () => {
                        setLoading(true);
                        const { error } =
                          await heliconeAuthClient.signInWithOAuth({
                            provider: "google",
                          });
                        if (error) {
                          setAuthError(error);
                        }

                        setLoading(false);
                      }}
                      type="button"
                      className="text-md flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <div className="flex flex-row items-center">
                        <BsGoogle className="mr-2 h-5 w-5" />
                        {googleButtonLabel}
                      </div>
                    </button>
                    {formState === "signup" ? (
                      <div>
                        {t("login.alreadyHaveAccount")}{" "}
                        <a
                          className="text-indigo-600 hover:cursor-pointer hover:text-indigo-500"
                          onClick={() => setFormState("login")}
                        >
                          {t("login.loginLink")}
                        </a>
                      </div>
                    ) : (
                      <div>
                        {t("login.dontHaveAccount")}{" "}
                        <a
                          onClick={() => setFormState("signup")}
                          className="text-indigo-600 hover:cursor-pointer hover:text-indigo-500"
                        >
                          {t("login.signUp")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

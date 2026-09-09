import React, { Component, ErrorInfo, ReactNode, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { logger } from "@/lib/telemetry/logger";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function CopyButton({
  text,
  label,
}: {
  text: string | null | undefined;
  label?: string;
}) {
  const { t } = useTranslation("common");
  const [copied, setCopied] = useState(false);
  const buttonLabel = label ?? t("actions.copy");

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200"
      aria-label={t("aria.copyToClipboard", { label: buttonLabel })}
      disabled={!text}
    >
      {copied ? t("actions.copied") : buttonLabel}
    </button>
  );
}

function ErrorFallbackUI({
  error,
  errorInfo,
}: {
  error: Error | null;
  errorInfo?: ErrorInfo | null;
}) {
  const { t } = useTranslation("common");

  const errorReport = `
Error: ${error?.name || ""}
Message: ${error?.message || ""}
Environment: ${process.env.NODE_ENV || "unknown"}
Stack Trace: ${error?.stack || ""}
Component Stack: ${errorInfo?.componentStack || ""}
Time: ${new Date().toISOString()}
  `.trim();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-center">
            <XCircleIcon className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("errors.boundary.title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("errors.boundary.description")}
          </p>
          {error && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t("errors.boundary.detailsHeading")}
                </h3>
                <CopyButton
                  text={errorReport}
                  label={t("errors.boundary.copyFullReport")}
                />
              </div>
              <div className="mt-2 overflow-hidden rounded-md border border-red-200 bg-red-50 text-sm">
                <div className="flex items-center justify-between bg-red-100 px-4 py-2 font-medium text-red-800">
                  <span>{error.name}</span>
                  <span className="rounded-full bg-red-200 px-2 py-1 text-xs">
                    {process.env.NODE_ENV}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-medium text-red-700">{error.message}</p>
                  {error.stack && (
                    <div className="relative mt-2">
                      <div className="absolute right-2 top-2 z-10">
                        <CopyButton
                          text={error.stack || ""}
                          label={t("errors.boundary.copyStack")}
                        />
                      </div>
                      <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded border border-red-100 bg-red-50 p-2 text-xs text-red-600">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              {errorInfo && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-gray-900">
                      {t("errors.boundary.componentStackHeading")}
                    </h4>
                    <CopyButton
                      text={errorInfo.componentStack}
                      label={t("errors.boundary.copyComponentStack")}
                    />
                  </div>
                  <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-2 text-xs text-gray-600">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {t("errors.boundary.reloadPage")}
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {t("actions.back")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    logger.error(
      {
        error,
      },
      "getDerivedStateFromError",
    );
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo, hasError: true, error });
    logger.error(
      {
        error,
        errorInfo,
      },
      "Uncaught error",
    );
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundaryWithHandler({
  children,
}: {
  children: ReactNode;
}) {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    // Self-host: do not send UI errors to Helicone PostHog
  }, [error]);

  if (error) {
    return <ErrorFallbackUI error={error} />;
  }

  return children;
}

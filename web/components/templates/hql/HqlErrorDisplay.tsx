import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";
import { HqlErrorCode, parseHqlError } from "@/lib/api/hql/errorTypes";

interface HqlErrorDisplayProps {
  error: string | null;
  className?: string;
}

interface ErrorDisplay {
  title: string;
  description: string;
  severity: "error" | "warning" | "info";
  icon: React.ComponentType<{ className?: string }>;
  suggestions?: string[];
}

const ERROR_CODE_TO_KEY: Record<HqlErrorCode, string> = {
  [HqlErrorCode.INVALID_STATEMENT]: "invalidStatement",
  [HqlErrorCode.INVALID_TABLE]: "invalidTable",
  [HqlErrorCode.SYNTAX_ERROR]: "syntaxError",
  [HqlErrorCode.SQL_INJECTION_ATTEMPT]: "sqlInjectionAttempt",
  [HqlErrorCode.QUERY_TIMEOUT]: "queryTimeout",
  [HqlErrorCode.MEMORY_LIMIT_EXCEEDED]: "memoryLimitExceeded",
  [HqlErrorCode.ROW_LIMIT_EXCEEDED]: "rowLimitExceeded",
  [HqlErrorCode.RESULT_LIMIT_EXCEEDED]: "resultLimitExceeded",
  [HqlErrorCode.UNKNOWN_COLUMN]: "unknownColumn",
  [HqlErrorCode.EXECUTION_FAILED]: "executionFailed",
  [HqlErrorCode.NO_DATA_RETURNED]: "noDataReturned",
  [HqlErrorCode.SCHEMA_FETCH_FAILED]: "schemaFetchFailed",
  [HqlErrorCode.QUERY_NOT_FOUND]: "queryNotFound",
  [HqlErrorCode.QUERY_NAME_EXISTS]: "queryNameExists",
  [HqlErrorCode.QUERY_ACCESS_DENIED]: "queryAccessDenied",
  [HqlErrorCode.MISSING_QUERY_ID]: "missingQueryId",
  [HqlErrorCode.MISSING_QUERY_NAME]: "missingQueryName",
  [HqlErrorCode.MISSING_QUERY_SQL]: "missingQuerySql",
  [HqlErrorCode.QUERY_NAME_TOO_LONG]: "queryNameTooLong",
  [HqlErrorCode.CSV_UPLOAD_FAILED]: "csvUploadFailed",
  [HqlErrorCode.CSV_URL_NOT_RETURNED]: "csvUrlNotReturned",
  [HqlErrorCode.FEATURE_NOT_ENABLED]: "featureNotEnabled",
  [HqlErrorCode.UNEXPECTED_ERROR]: "unexpectedError",
};

const ERROR_SEVERITY: Record<
  HqlErrorCode,
  Omit<ErrorDisplay, "description" | "title" | "suggestions">
> = {
  [HqlErrorCode.INVALID_STATEMENT]: { severity: "error", icon: XCircle },
  [HqlErrorCode.INVALID_TABLE]: { severity: "error", icon: XCircle },
  [HqlErrorCode.SYNTAX_ERROR]: { severity: "warning", icon: AlertTriangle },
  [HqlErrorCode.SQL_INJECTION_ATTEMPT]: { severity: "error", icon: XCircle },
  [HqlErrorCode.QUERY_TIMEOUT]: { severity: "warning", icon: AlertTriangle },
  [HqlErrorCode.MEMORY_LIMIT_EXCEEDED]: {
    severity: "warning",
    icon: AlertTriangle,
  },
  [HqlErrorCode.ROW_LIMIT_EXCEEDED]: { severity: "warning", icon: AlertTriangle },
  [HqlErrorCode.RESULT_LIMIT_EXCEEDED]: {
    severity: "warning",
    icon: AlertTriangle,
  },
  [HqlErrorCode.UNKNOWN_COLUMN]: { severity: "error", icon: XCircle },
  [HqlErrorCode.EXECUTION_FAILED]: { severity: "error", icon: XCircle },
  [HqlErrorCode.NO_DATA_RETURNED]: { severity: "info", icon: AlertCircle },
  [HqlErrorCode.SCHEMA_FETCH_FAILED]: { severity: "error", icon: XCircle },
  [HqlErrorCode.QUERY_NOT_FOUND]: { severity: "warning", icon: AlertTriangle },
  [HqlErrorCode.QUERY_NAME_EXISTS]: { severity: "warning", icon: AlertTriangle },
  [HqlErrorCode.QUERY_ACCESS_DENIED]: { severity: "error", icon: XCircle },
  [HqlErrorCode.MISSING_QUERY_ID]: { severity: "error", icon: XCircle },
  [HqlErrorCode.MISSING_QUERY_NAME]: { severity: "warning", icon: AlertTriangle },
  [HqlErrorCode.MISSING_QUERY_SQL]: { severity: "warning", icon: AlertTriangle },
  [HqlErrorCode.QUERY_NAME_TOO_LONG]: {
    severity: "warning",
    icon: AlertTriangle,
  },
  [HqlErrorCode.CSV_UPLOAD_FAILED]: { severity: "error", icon: XCircle },
  [HqlErrorCode.CSV_URL_NOT_RETURNED]: { severity: "error", icon: XCircle },
  [HqlErrorCode.FEATURE_NOT_ENABLED]: { severity: "error", icon: XCircle },
  [HqlErrorCode.UNEXPECTED_ERROR]: { severity: "error", icon: XCircle },
};

export function HqlErrorDisplay({ error, className }: HqlErrorDisplayProps) {
  const { t } = useTranslation("hql");

  if (!error) return null;

  const hqlError = parseHqlError(error);

  const getErrorDetails = (): ErrorDisplay => {
    if (hqlError.code && ERROR_CODE_TO_KEY[hqlError.code]) {
      const key = ERROR_CODE_TO_KEY[hqlError.code];
      const meta = ERROR_SEVERITY[hqlError.code];
      const suggestions = t(`errors.${key}.suggestions`, {
        returnObjects: true,
        defaultValue: [],
      }) as string[];

      return {
        ...meta,
        title: t(`errors.${key}.title`),
        description: hqlError.details || hqlError.message,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      };
    }

    return {
      title: t("errors.fallbackTitle"),
      description: hqlError.message,
      severity: "error",
      icon: XCircle,
    };
  };

  const {
    title,
    description,
    severity,
    icon: Icon,
    suggestions,
  } = getErrorDetails();

  return (
    <Alert
      variant={
        severity === "error"
          ? "destructive"
          : severity === "info"
            ? "default"
            : "default"
      }
      className={className}
    >
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>{description}</p>
        {suggestions && suggestions.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-sm font-medium">{t("errors.suggestionsLabel")}</p>
            <ul className="list-inside list-disc space-y-1 text-sm opacity-90">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

export default HqlErrorDisplay;

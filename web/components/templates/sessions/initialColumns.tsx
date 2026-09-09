import { formatStandardDateTime } from "@/lib/i18n/format";
import { TFunction } from "i18next";

const DATE_COLUMNS = new Set(["created_at", "latest_request_created_at"]);

const COLUMN_KEYS = [
  "sessionName",
  "sessionId",
  "createdAt",
  "latestRequest",
  "totalCost",
  "promptTokens",
  "completionTokens",
  "totalTokens",
  "totalRequests",
  "avgLatency",
  "userIds",
] as const;

export const getColumns = (t: TFunction<"sessions">) => {
  const propertyMap: Record<string, string> = {
    session_name: "sessionName",
    session_id: "sessionId",
    created_at: "createdAt",
    latest_request_created_at: "latestRequest",
    total_cost: "totalCost",
    prompt_tokens: "promptTokens",
    completion_tokens: "completionTokens",
    total_tokens: "totalTokens",
    total_requests: "totalRequests",
    avg_latency: "avgLatency",
    user_ids: "userIds",
  };

  const columns = [
    "session_name",
    "session_id",
    "created_at",
    "latest_request_created_at",
    "total_cost",
    "prompt_tokens",
    "completion_tokens",
    "total_tokens",
    "total_requests",
    "avg_latency",
    "user_ids",
  ];

  return columns.map((property) => {
    const key = propertyMap[property];
    return {
      id: property,
      header: t(`columns.${key}`),
      accessorFn: (row: any) => {
        const value = row.metadata ? row.metadata[property] : "";
        return value;
      },
      cell: ({ row }: any) => {
        const value = row.original.metadata[property];
        if (Array.isArray(value)) {
          const filtered = value.filter((v: string) => v && v.trim() !== "");
          return filtered.length > 0 ? filtered.join(", ") : "-";
        }
        if (DATE_COLUMNS.has(property) && value) {
          const formatted = formatStandardDateTime(String(value));
          return formatted || value;
        }
        return value;
      },
    };
  });
};

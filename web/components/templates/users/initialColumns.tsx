import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { UserMetric } from "../../../lib/api/users/UserMetric";
import { getUSDateFromString } from "../../shared/utils/utils";

export function formatNumber(num: number, decimals: number = 4) {
  const numParts = num.toString().split(".");

  if (numParts.length > 1) {
    const decimalPlaces = numParts[1].length;
    if (decimalPlaces < 2) {
      return num.toFixed(2);
    } else if (decimalPlaces > decimals) {
      return num.toFixed(decimals);
    } else {
      return num;
    }
  } else {
    return num.toFixed(2);
  }
}

export const getInitialColumns = (
  t: TFunction<"users">,
): ColumnDef<UserMetric>[] => [
  {
    id: "user_id",
    accessorKey: "user_id",
    header: t("columns.userId"),
    cell: (info) => (
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {info.getValue() ? `${info.getValue()}` : t("columns.noUserId")}
      </span>
    ),
    minSize: 225,
  },
  {
    id: "cost",
    accessorKey: "cost",
    header: t("columns.totalCost"),
    cell: (info) => <span>${formatNumber(Number(info.getValue()), 6)}</span>,
    meta: {
      sortKey: "cost",
    },
  },
  {
    id: "active_for",
    accessorKey: "active_for",
    header: t("columns.activeFor"),
    cell: (info) =>
      t("columns.activeForDays", { count: info.getValue() as number }),
    meta: {
      sortKey: "active_for",
    },
  },
  {
    id: "first_active",
    accessorKey: "first_active",
    header: t("columns.firstActive"),
    cell: (info) => getUSDateFromString(info.getValue() as string),
    meta: {
      sortKey: "first_active",
    },
    minSize: 200,
  },
  {
    id: "last_active",
    accessorKey: "last_active",
    header: t("columns.lastActive"),
    cell: (info) => getUSDateFromString(info.getValue() as string),
    meta: {
      sortKey: "last_active",
    },
    minSize: 200,
  },
  {
    id: "total_requests",
    accessorKey: "total_requests",
    header: t("columns.requests"),
    cell: (info) => Number(info.getValue()).toLocaleString(),
    meta: {
      sortKey: "total_requests",
    },
  },
  {
    id: "average_requests_per_day_active",
    accessorKey: "average_requests_per_day_active",
    header: t("columns.avgReqsPerDay"),
    cell: (info) => <span>{Number(info.getValue()).toFixed(2)}</span>,
    meta: {
      sortKey: "average_requests_per_day_active",
    },
    minSize: 200,
  },
  {
    id: "average_tokens_per_request",
    accessorKey: "average_tokens_per_request",
    header: t("columns.avgTokensPerReq"),
    cell: (info) => <span>{Number(info.getValue()).toFixed(2)}</span>,
    meta: {
      sortKey: "average_tokens_per_request",
    },
    minSize: 200,
  },
  {
    id: "total_completion_tokens",
    accessorKey: "total_completion_tokens",
    header: t("columns.completionTokens"),
    cell: (info) => Number(info.getValue()).toLocaleString(),
    meta: {
      sortKey: "total_completion_tokens",
    },
    minSize: 200,
  },
  {
    id: "total_prompt_tokens",
    accessorKey: "total_prompt_tokens",
    header: t("columns.promptTokens"),
    cell: (info) => Number(info.getValue()).toLocaleString(),
    meta: {
      sortKey: "total_prompt_tokens",
    },
    minSize: 200,
  },
  {
    id: "rate_limited_count",
    accessorKey: "rate_limited_count",
    header: t("columns.rateLimitedCount"),
    cell: (info) => Number(info.getValue()).toLocaleString(),
    meta: {
      sortKey: "rate_limited_count",
    },
  },
];

/** @deprecated Use getInitialColumns(t) instead */
export const INITIAL_COLUMNS: ColumnDef<UserMetric>[] = [];

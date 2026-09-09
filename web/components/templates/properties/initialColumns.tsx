import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";

function formatNumber(num: number) {
  const numParts = num.toString().split(".");

  if (numParts.length > 1) {
    const decimalPlaces = numParts[1].length;
    if (decimalPlaces < 2) {
      return num.toFixed(2);
    } else if (decimalPlaces > 6) {
      return num.toFixed(6);
    } else {
      return num;
    }
  } else {
    return num.toFixed(2);
  }
}

export const getInitialColumns = (
  t: TFunction<"properties">,
): ColumnDef<{
  property_value: string;
  total_requests: number;
  active_since: string;
  avg_prompt_tokens_per_request: number;
  avg_completion_tokens_per_request: number;
  avg_latency_per_request: number;
  total_cost: number;
}>[] => [
  {
    accessorKey: "property_value",
    header: t("columns.value"),
    cell: (info) => info.getValue(),
    minSize: 300,
  },
  {
    accessorKey: "total_requests",
    header: t("columns.requests"),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "avg_prompt_tokens_per_request",
    header: t("columns.avgPromptTokensPerReq"),
    cell: (info) => `${formatNumber(Number(info.getValue()))}`,
    minSize: 250,
  },
  {
    accessorKey: "avg_completion_tokens_per_request",
    header: t("columns.avgCompletionTokensPerReq"),
    cell: (info) => `${formatNumber(Number(info.getValue()))}`,
    minSize: 250,
  },
  {
    accessorKey: "avg_latency_per_request",
    header: t("columns.avgLatencyPerReq"),
    cell: (info) => `${formatNumber(Number(info.getValue()))}s`,
  },
  {
    accessorKey: "average_cost_per_request",
    header: t("columns.avgCostPerReq"),
    cell: (info) => `$${formatNumber(Number(info.getValue()))}`,
  },
  {
    accessorKey: "total_cost",
    header: t("columns.totalCost"),
    cell: (info) => `$${info.getValue()}`,
  },
];

/** @deprecated Use getInitialColumns(t) instead */
export const INITIAL_COLUMNS: ColumnDef<{
  property_value: string;
  total_requests: number;
  active_since: string;
  avg_prompt_tokens_per_request: number;
  avg_completion_tokens_per_request: number;
  avg_latency_per_request: number;
  total_cost: number;
}>[] = [];

import { MappedLLMRequest } from "@helicone-package/llm-mapper/types";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { clsx } from "../../shared/clsx";
import {
  getStandardDateFromString,
  get24HourFromString,
} from "../../shared/utils/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CostPill from "./costPill";
import { COUTNRY_CODE_DIRECTORY } from "./countryCodeDirectory";
import ModelPill from "./modelPill";
import ProviderPill from "./providerPill";
import StatusBadge from "./statusBadge";
import { DEFAULT_UUID } from "@helicone-package/llm-mapper/types";

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
  t: TFunction<"requests">,
): ColumnDef<MappedLLMRequest>[] => [
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: t("columns.createdAt"),
    cell: (info) => {
      const value = info.row.original.heliconeMetadata.createdAt;
      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <span className="cursor-default font-medium text-gray-900 dark:text-gray-100">
                {getStandardDateFromString(value)}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{get24HourFromString(value)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    meta: {
      sortKey: "created_at",
    },
    minSize: 200,
  },
  {
    id: "status",
    accessorKey: "status",
    header: t("columns.status"),
    cell: (info) => {
      const status = info.row.original.heliconeMetadata.status;
      const isCached =
        info.row.original.heliconeMetadata.cacheReferenceId &&
        info.row.original.heliconeMetadata.cacheReferenceId !== DEFAULT_UUID;

      if (!status) {
        return <span>{JSON.stringify(status)}</span>;
      }

      const { code, statusType } = status;
      return (
        <StatusBadge
          statusType={isCached ? "cached" : statusType}
          errorCode={code}
        />
      );
    },
    size: 100,
  },
  {
    id: "provider",
    accessorKey: "provider",
    header: t("columns.provider"),
    cell: (info) => {
      return (
        <ProviderPill provider={info.row.original.heliconeMetadata.provider} />
      );
    },
  },
  {
    id: "requestText",
    accessorKey: "requestText",
    header: t("columns.request"),
    cell: (info) => info.row.original.preview.request,
    meta: {
      sortKey: "request_prompt",
    },
    minSize: 400,
  },
  {
    id: "responseText",
    accessorKey: "responseText",
    header: t("columns.response"),
    cell: (info) => info.row.original.preview.response,
    meta: {
      sortKey: "response_text",
    },
    minSize: 400,
  },
  {
    id: "model",
    accessorKey: "model",
    header: t("columns.model"),
    cell: (info) => (
      <ModelPill
        model={info.row.original.model}
        provider={info.row.original.heliconeMetadata.provider}
      />
    ),
    meta: {
      sortKey: "body_model",
    },
    minSize: 200,
  },
  {
    id: "totalTokens",
    accessorKey: "totalTokens",
    header: t("columns.totalTokens"),
    cell: (info) => {
      const tokens = Number(info.row.original.heliconeMetadata.totalTokens);
      return <span>{tokens >= 0 ? tokens : t("values.notFound")}</span>;
    },
    meta: {
      sortKey: "total_tokens",
    },
  },
  {
    id: "promptTokens",
    accessorKey: "promptTokens",
    header: t("columns.promptTokens"),
    cell: (info) => {
      const tokens = Number(info.row.original.heliconeMetadata.promptTokens);
      return <span>{tokens >= 0 ? tokens : t("values.notFound")}</span>;
    },
    meta: {
      sortKey: "prompt_tokens",
    },
  },
  {
    id: "completionTokens",
    accessorKey: "completionTokens",
    header: t("columns.completionTokens"),
    cell: (info) => {
      const tokens = Number(
        info.row.original.heliconeMetadata.completionTokens,
      );
      return <span>{tokens >= 0 ? tokens : t("values.notFound")}</span>;
    },
    meta: {
      sortKey: "completion_tokens",
    },
    size: 175,
  },
  {
    id: "reasoningTokens",
    accessorKey: "reasoningTokens",
    header: t("columns.reasoningTokens"),
    cell: (info) => {
      const tokens = Number(
        info.row.original.heliconeMetadata.reasoningTokens,
      );
      return <span>{tokens >= 0 ? tokens : t("values.notFound")}</span>;
    },
    meta: {
      sortKey: "reasoning_tokens",
    },
    size: 175,
  },
  {
    id: "latency",
    accessorKey: "latency",
    header: t("columns.latency"),
    cell: (info) => {
      const isCached =
        info.row.original.heliconeMetadata.cacheReferenceId !== DEFAULT_UUID;
      return (
        <span>
          {isCached
            ? 0
            : Number(info.row.original.heliconeMetadata.latency) / 1000}
          s
        </span>
      );
    },
    meta: {
      sortKey: "latency",
    },
  },
  {
    id: "tfft",
    accessorKey: "tfft",
    header: t("columns.tfft"),
    cell: (info) => {
      const isCached =
        info.row.original.heliconeMetadata.cacheReferenceId !== DEFAULT_UUID;
      return (
        <span>
          {isCached
            ? 0
            : Number(info.row.original.heliconeMetadata.timeToFirstToken) /
              1000}
          s
        </span>
      );
    },
    meta: {
      sortKey: "time_to_first_token",
    },
  },
  {
    id: "user",
    accessorKey: "user",
    header: t("columns.user"),
    cell: (info) => info.row.original.heliconeMetadata.user,
    meta: {
      sortKey: "user_id",
    },
  },
  {
    id: "cost",
    accessorKey: "cost",
    header: t("columns.cost"),
    cell: (info) => {
      const statusCode = info.row.original.heliconeMetadata.status.code;
      const num = Number(info.row.original.heliconeMetadata.cost);
      const isCached =
        info.row.original.heliconeMetadata.cacheReferenceId !== DEFAULT_UUID;

      if (Number(num) === 0 && !isCached && statusCode === 200) {
        return <CostPill />;
      }
      return <span>${formatNumber(num)}</span>;
    },
    meta: {
      sortKey: "cost",
    },
    size: 175,
  },
  {
    id: "feedback",
    accessorKey: "scores",
    header: t("columns.feedback"),
    cell: (info) => {
      const scores = info.row.original.heliconeMetadata.scores;
      const rating =
        scores && scores["helicone-score-feedback"]
          ? Number(scores["helicone-score-feedback"]) === 1
            ? true
            : false
          : null;
      if (rating === null) {
        return <span className="text-gray-500"></span>;
      }

      return (
        <span className={clsx(rating ? "text-green-500" : "text-red-500")}>
          {rating ? (
            <HandThumbUpIcon className="inline h-5 w-5" />
          ) : (
            <HandThumbDownIcon className="inline h-5 w-5" />
          )}
        </span>
      );
    },
  },
  {
    id: "promptId",
    accessorKey: "promptId",
    header: t("columns.promptId"),
    cell: (info) => {
      const promptId = info.row.original.heliconeMetadata.promptId;
      return <span>{promptId}</span>;
    },
  },
  {
    id: "country",
    accessorKey: "countryCode",
    header: t("columns.country"),
    cell: (info) => {
      const countryCode = info.row.original.heliconeMetadata.countryCode;
      const country = COUTNRY_CODE_DIRECTORY.find(
        (c) => c.isoCode === countryCode,
      );

      if (country === undefined) {
        return <span></span>;
      }

      return (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {country.emojiFlag} {country.country} ({country.isoCode})
        </span>
      );
    },
    minSize: 200,
  },
  {
    id: "promptCacheReadTokens",
    accessorKey: "promptCacheReadTokens",
    header: t("columns.promptCacheReadTokens"),
    cell: (info) => {
      const tokens = Number(
        info.row.original.heliconeMetadata.promptCacheReadTokens,
      );
      return <span>{tokens >= 0 ? tokens : t("values.notFound")}</span>;
    },
  },
  {
    id: "promptCacheWriteTokens",
    accessorKey: "promptCacheWriteTokens",
    header: t("columns.promptCacheWriteTokens"),
    cell: (info) => {
      const tokens = Number(
        info.row.original.heliconeMetadata.promptCacheWriteTokens,
      );
      return <span>{tokens >= 0 ? tokens : t("values.notFound")}</span>;
    },
  },
  {
    id: "cacheEnabled",
    accessorKey: "cacheEnabled",
    header: t("columns.cacheEnabled"),
    cell: (info) => {
      const cacheEnabled = info.row.original.heliconeMetadata.cacheEnabled;
      return cacheEnabled ? (
        <span>{t("values.yes")}</span>
      ) : (
        <span>{t("values.no")}</span>
      );
    },
    size: 100,
  },
];

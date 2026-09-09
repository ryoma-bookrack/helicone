import {
  BooleanOperators,
  FilterLeafRequestResponseRMT,
  NumberOperators,
  TablesAndViews,
  TextOperators,
  TimestampOperators,
} from "./filterDefs";

export type ColumnType =
  | "text"
  | "timestamp"
  | "number"
  | "text-with-suggestions"
  | "number-with-suggestions"
  | "bool";


export type InputParam = {
  key: string;
  param: string;
};
interface Operator<T> {
  value: T;
  label: string;
  labelKey?: string;
  type: ColumnType;
  inputParams?: InputParam[];
}

const textOperators: Operator<keyof TextOperators>[] = [
  {
    value: "equals",
    label: "equals",
    labelKey: "operators.equals",
    type: "text",
  },
  {
    value: "not-equals",
    label: "not equals",
    labelKey: "operators.notEquals",
    type: "text",
  },
  {
    value: "contains",
    label: "contains",
    labelKey: "operators.contains",
    type: "text",
  },
  {
    value: "not-contains",
    label: "not contains",
    labelKey: "operators.notContains",
    type: "text",
  },
  {
    value: "ilike",
    label: "ilike",
    labelKey: "operators.ilike",
    type: "text",
  },
  {
    value: "like",
    label: "like",
    labelKey: "operators.like",
    type: "text",
  },
];

const VectorOperators: Operator<keyof TextOperators>[] = [
  {
    value: "contains",
    label: "contains",
    type: "text",
  },
];

const numberOperators: Operator<keyof NumberOperators>[] = [
  {
    value: "equals",
    label: "equals",
    labelKey: "operators.equals",
    type: "number",
  },
  {
    value: "not-equals",
    label: "not equals",
    labelKey: "operators.notEquals",
    type: "number",
  },
  {
    value: "gte",
    label: "greater than or equal to",
    labelKey: "operators.gte",
    type: "number",
  },
  {
    value: "lte",
    label: "less than or equal to",
    labelKey: "operators.lte",
    type: "number",
  },
];

const booleanOperators: Operator<keyof BooleanOperators>[] = [
  {
    value: "equals",
    label: "equals",
    type: "bool",
  },
];

const booleanToTextOperators: Operator<string>[] = [
  {
    value: "equals",
    label: "equals",
    type: "text",
  },
  {
    value: "not-equals",
    label: "not equals",
    type: "text",
  },
];

const timestampOperators: Operator<keyof TimestampOperators>[] = [
  {
    value: "gte",
    label: "greater than or equal to",
    type: "timestamp",
  },
  {
    value: "lte",
    label: "less than or equal to",
    type: "timestamp",
  },
];

type KeyOfUnion<T> = T extends T ? keyof T : never;
export type SingleFilterDef<T extends keyof TablesAndViews> = {
  label: string;
  labelKey?: string;
  operators: Operator<string>[];
  table: T;
  column: KeyOfUnion<TablesAndViews[T]>;
  category: string;
  isCustomProperty?: boolean;
};

export function textWithSuggestions(
  inputParams: InputParam[]
): Operator<string>[] {
  return textOperators.map((o) => ({
    ...o,
    type: "text-with-suggestions",
    inputParams,
  }));
}

export function numberWithSuggestions(
  inputParams: InputParam[]
): Operator<string>[] {
  return numberOperators.map((o) => ({
    ...o,
    type: "number-with-suggestions",
    inputParams,
  }));
}

export function getPropertyFilters(
  properties: string[],
  inputParams: InputParam[]
): SingleFilterDef<"properties">[] {
  return properties.map((p) => ({
    label: p,
    operators: textWithSuggestions(inputParams),
    table: "properties",
    column: p,
    category: "properties",
  }));
}

export function getPropertyFiltersV2(
  properties: string[],
  inputParams: InputParam[]
): SingleFilterDef<"request_response_rmt">[] {
  return properties.map((p) => ({
    label: p,
    operators: textWithSuggestions(inputParams),
    table: "request_response_rmt",
    column: p as keyof FilterLeafRequestResponseRMT,
    category: "properties",
    isCustomProperty: true,
  }));
}

export function getValueFilters(
  properties: string[],
  inputParams: InputParam[]
): SingleFilterDef<"values">[] {
  return properties.map((p) => ({
    label: p,
    operators: textWithSuggestions(inputParams),
    table: "values",
    column: p,
    category: "prompt variables",
  }));
}


const STATUS_OPS = numberWithSuggestions([
  {
    key: "200",
    param: "200 (success)",
  },
  {
    key: "-4",
    param: "threat",
  },
  {
    key: "-3",
    param: "cancelled",
  },
  {
    key: "-2",
    param: "pending",
  },
  {
    key: "-1",
    param: "timeout",
  },
  {
    key: "400",
    param: "400 (bad request)",
  },
  {
    key: "429",
    param: "429 (rate-limit)",
  },
  {
    key: "500",
    param: "500 (internal server error)",
  },
  {
    key: "502",
    param: "502 (bad gateway)",
  },
  {
    key: "503",
    param: "503 (service unavailable)",
  },
  {
    key: "524",
    param: "524 (server timeout)",
  },
]);

export const DASHBOARD_PAGE_TABLE_FILTERS: [
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">
] = [
  {
    label: "Model",
    labelKey: "fields.model",
    operators: textOperators,
    category: "request",
    table: "request_response_rmt",
    column: "model",
  },
  {
    label: "Status",
    labelKey: "fields.status",
    operators: STATUS_OPS,
    category: "request",
    table: "request_response_rmt",
    column: "status",
  },
  {
    label: "Latency",
    labelKey: "fields.latency",
    operators: numberOperators,
    category: "request",
    table: "request_response_rmt",
    column: "latency",
  },
  {
    label: "User",
    labelKey: "fields.user",
    operators: textOperators,
    category: "request",
    table: "request_response_rmt",
    column: "user_id",
  },
];

export const REQUEST_TABLE_FILTERS: [
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">,
  SingleFilterDef<"request_response_rmt">
] = [
  {
    label: "Request",
    labelKey: "fields.request",
    operators: VectorOperators,
    table: "request_response_rmt",
    column: "request_body",
    category: "request",
  },
  {
    label: "Request-Id",
    labelKey: "fields.requestId",
    operators: booleanToTextOperators,
    table: "request_response_rmt",
    column: "request_id",
    category: "request",
  },
  {
    label: "Response",
    labelKey: "fields.response",
    operators: VectorOperators,
    table: "request_response_rmt",
    column: "response_body",
    category: "request",
  },
  {
    label: "Prompt Tokens",
    labelKey: "fields.promptTokens",
    operators: numberOperators,
    table: "request_response_rmt",
    column: "prompt_tokens",
    category: "request",
  },
  {
    label: "Completion Tokens",
    labelKey: "fields.completionTokens",
    operators: numberOperators,
    table: "request_response_rmt",
    column: "completion_tokens",
    category: "request",
  },
  {
    label: "Total Tokens",
    labelKey: "fields.totalTokens",
    operators: numberOperators,
    table: "request_response_rmt",
    column: "total_tokens",
    category: "request",
  },
  {
    label: "User",
    labelKey: "fields.user",
    operators: textOperators,
    table: "request_response_rmt",
    column: "user_id",
    category: "request",
  },
  {
    label: "Model",
    labelKey: "fields.model",
    operators: textOperators,
    table: "request_response_rmt",
    column: "model",
    category: "request",
  },
  {
    label: "Provider",
    labelKey: "fields.provider",
    operators: textOperators,
    table: "request_response_rmt",
    column: "provider",
    category: "request",
  },
  {
    label: "Status",
    labelKey: "fields.status",
    operators: STATUS_OPS,
    category: "response",
    table: "request_response_rmt",
    column: "status",
  },
  {
    label: "Path",
    labelKey: "fields.path",
    operators: textOperators,
    table: "request_response_rmt",
    column: "target_url",
    category: "request",
  },
  {
    label: "Feedback",
    labelKey: "fields.feedback",
    operators: booleanOperators,
    table: "request_response_rmt",
    column: "helicone-score-feedback",
    category: "feedback",
  },
  {
    label: "AI Gateway",
    labelKey: "fields.aiGateway",
    operators: booleanOperators,
    table: "request_response_rmt",
    column: "request_referrer",
    category: "request",
  },
];

import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { FilterOperator } from "@helicone-package/filters/types";
import {
  FilterUIDefinition,
  FilterValueOption,
} from "@/filterAST/filterUIDefinitions/types";

const OPERATOR_KEY_MAP: Record<FilterOperator, string> = {
  eq: "operators.equals",
  neq: "operators.notEquals",
  is: "operators.is",
  gt: "operators.gt",
  gte: "operators.gte",
  lt: "operators.lt",
  lte: "operators.lte",
  like: "operators.like",
  ilike: "operators.ilike",
  contains: "operators.contains",
  "not-contains": "operators.notContains",
  in: "operators.in",
};

export function useFilterLabels() {
  const { t } = useTranslation("filters");

  const translateFieldLabel = useCallback(
    (def: Pick<FilterUIDefinition, "label" | "labelKey">) => {
      if (def.labelKey) {
        return t(def.labelKey);
      }
      return def.label ?? "";
    },
    [t],
  );

  const translateOperatorLabel = useCallback(
    (operator: FilterOperator) => {
      const key = OPERATOR_KEY_MAP[operator];
      return key ? t(key) : operator;
    },
    [t],
  );

  const translateValueOptionLabel = useCallback(
    (option: FilterValueOption) => {
      if (option.labelKey) {
        return t(option.labelKey);
      }
      return option.label ?? String(option.value);
    },
    [t],
  );

  return { translateFieldLabel, translateOperatorLabel, translateValueOptionLabel };
}

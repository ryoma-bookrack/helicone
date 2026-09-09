import React from "react";
import { ConditionExpression, FilterOperator } from "@helicone-package/filters/types";
import { useFilterAST } from "../context/filterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Trash2, Loader2 } from "lucide-react";
import SearchableSelect, {
  SearchableSelectOption,
} from "./ui/SearchableSelect";
import SearchableInput, { SearchableInputOption } from "./ui/SearchableInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterUIDefinitions } from "../filterUIDefinitions/useFilterUIDefinitions";
import clsx from "clsx";
import { Small } from "@/components/ui/typography";
import DateTimeInput from "./ui/DateTimeInput";
import { logger } from "@/lib/telemetry/logger";
import { useTranslation } from "react-i18next";
import { useFilterLabels } from "@/lib/i18n/useFilterLabels";

const FILTER_OPERATOR_SYMBOLS: Record<FilterOperator, string> = {
  eq: "=",
  neq: "≠",
  is: "is",
  gt: ">",
  gte: "≥",
  lt: "<",
  lte: "≤",
  like: "~",
  ilike: "≈",
  contains: "⊃",
  "not-contains": "⊅",
  in: "∈",
};

const NumberInput: React.FC<{
  value: string | number;
  onValueChange: (value: number) => void;
  suggestions?: { label: string; value: number }[];
  disabled?: boolean;
  className?: string;
}> = ({
  value,
  onValueChange,
  suggestions = [],
  disabled = false,
  className = "",
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value.toString());
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue === "") {
      onValueChange(0);
      return;
    }

    const numericValue = Number(newValue);
    if (!isNaN(numericValue) && newValue !== "" && !newValue.endsWith(".")) {
      onValueChange(numericValue);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectOptions: SearchableSelectOption[] = suggestions.map((opt) => ({
    label: opt.label,
    value: String(opt.value),
  }));

  const toggleDropdown = () => {
    if (!disabled && selectOptions.length > 0) {
      setOpen(!open);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          className={`h-7 w-full text-[10px] ${className}`}
        />
        {selectOptions.length > 0 && (
          <ChevronDown
            className={clsx(
              "absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer transition-transform",
              open && "rotate-180",
            )}
            size={10}
            onClick={toggleDropdown}
          />
        )}
      </div>
      {open && selectOptions.length > 0 && (
        <div className="absolute left-0 top-8 z-10 max-h-[200px] w-full overflow-y-auto border border-border bg-white shadow-md dark:bg-slate-950">
          {selectOptions.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer px-2 py-1.5 text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => {
                onValueChange(Number(option.value));
                setOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface FilterConditionNodeProps {
  condition: ConditionExpression;
  path: number[];
  isFirst?: boolean;
  isLast?: boolean;
}

export const FilterConditionNode: React.FC<FilterConditionNodeProps> = ({
  condition,
  path,
  isFirst = false,
  isLast = false,
}) => {
  const { t } = useTranslation("filters");
  const { t: tc } = useTranslation("common");
  const { translateFieldLabel, translateOperatorLabel, translateValueOptionLabel } =
    useFilterLabels();
  const { store: filterStore } = useFilterAST();
  const { filterDefinitions: filterDefs, isLoading } = useFilterUIDefinitions();

  const handleFieldChange = (fieldId: string) => {
    const filterDef = filterDefs.find((def) => def.id === fieldId);
    if (!filterDef) return;

    const defaultOperator = filterDef.operators[0] || "eq";

    const defaultValue = (() => {
      switch (filterDef.type) {
        case "number":
          return 0;
        case "boolean":
          return true;
        default:
          return "";
      }
    })();

    const updated: ConditionExpression = {
      ...condition,
      field:
        filterDef.subType === "property"
          ? {
              column: "properties" as any,
              subtype: "property",
              valueMode: "value",
              key: fieldId,
              table: filterDef.table,
            }
          : {
              column: fieldId as any,
              subtype: filterDef.subType,
              table: filterDef.table,
            },
      operator: defaultOperator,
      value: defaultValue,
    };

    filterStore.updateFilterExpression(path, updated);
  };

  const handleOperatorChange = (operator: string) => {
    const updated = { ...condition, operator: operator as FilterOperator };
    filterStore.updateFilterExpression(path, updated);
  };

  const handleValueChange = (value: string | number | boolean) => {
    const updated = { ...condition, value };
    filterStore.updateFilterExpression(path, updated);
  };

  const handleRemove = () => {
    const parentPath = filterStore.getParentPath(path);
    const parentExpression = filterStore.getFilterExpression(parentPath);

    if (parentExpression?.type == "and" || parentExpression?.type == "or") {
      if (parentExpression.expressions.length === 1) {
        return filterStore.removeFilterExpression(parentPath);
      }
    }

    filterStore.removeFilterExpression(path);
  };

  const filterDef = filterDefs.find((def) =>
    condition.field.subtype === "property" && condition.field.key
      ? def.id === condition.field.key
      : def.id === condition.field.column,
  );

  const operators = filterDef?.operators || [];
  const valueOptions = filterDef?.valueOptions || [];

  const fieldOptions: SearchableSelectOption[] = filterDefs.map((def) => ({
    label: translateFieldLabel(def),
    value: def.id,
    subType: def.subType,
  }));

  const operatorOptions: SearchableSelectOption[] = operators.map((op) => ({
    label: translateOperatorLabel(op),
    value: op,
  }));

  const selectValueOptions: SearchableSelectOption[] = valueOptions.map(
    (opt) => ({
      label: translateValueOptionLabel(opt),
      value: String(opt.value),
    }),
  );

  const translatedValueSuggestions = valueOptions.map((opt) => ({
    label: translateValueOptionLabel(opt),
    value: typeof opt.value === "number" ? opt.value : Number(opt.value) || 0,
  }));

  const handleSearch = async (
    searchTerm: string,
  ): Promise<SearchableInputOption[]> => {
    if (!filterDef?.onSearch) return [];

    try {
      const results = await filterDef.onSearch(searchTerm);

      return results.map((result) => ({
        label: result.label,
        value: String(result.value),
      }));
    } catch (error) {
      logger.error({ error }, "Error searching");
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-accent p-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <Small className="text-muted-foreground">{t("loadingOptions")}</Small>
      </div>
    );
  }

  if (!filterDef) {
    return (
      <div className="flex items-center justify-between border border-amber-300 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
            {t("invalidField", {
              name: condition.field.key || condition.field.column || "empty",
            })}
          </span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">
            {t("invalidFieldHint")}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="h-6 w-6 border text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    );
  }

  const renderValueInput = () => {
    if (filterDef?.type === "number") {
      let numValue: number = 0;

      if (typeof condition.value === "boolean") {
        numValue = condition.value ? 1 : 0;
      } else if (typeof condition.value === "string") {
        numValue = parseFloat(condition.value) || 0;
      } else if (typeof condition.value === "number") {
        numValue = condition.value;
      }

      return (
        <NumberInput
          value={numValue}
          onValueChange={(val) => handleValueChange(val)}
          suggestions={translatedValueSuggestions}
          disabled={!condition.field.column || !condition.operator}
          className="w-full rounded-none border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      );
    }

    if (filterDef?.type === "datetime") {
      return (
        <DateTimeInput
          value={String(condition.value)}
          onValueChange={handleValueChange}
        />
      );
    }

    if (filterDef?.type === "searchable" && filterDef.onSearch) {
      return (
        <SearchableInput
          value={String(condition.value)}
          onValueChange={handleValueChange}
          onSearch={handleSearch}
          placeholder={t("search.typeToSearch")}
          emptyMessage={tc("empty.noResults")}
          disabled={!condition.field.column || !condition.operator}
          className="h-7 w-full rounded-none border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      );
    }

    if (filterDef?.type === "select" || valueOptions.length > 0) {
      return (
        <SearchableSelect
          options={selectValueOptions}
          value={String(condition.value)}
          onValueChange={handleValueChange}
          placeholder={t("selectValue")}
          searchPlaceholder={t("search.searchValue")}
          emptyMessage={t("search.noValueFound")}
          disabled={!condition.field.column || !condition.operator}
          className="h-7 w-full rounded-none text-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      );
    }

    return (
      <Input
        value={String(condition.value)}
        onChange={(e) => handleValueChange(e.target.value)}
        disabled={!condition.field.column || !condition.operator}
        placeholder={t("enterValue")}
        className="h-7 w-full rounded-none text-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    );
  };

  return (
    <div
      className={clsx(
        "flex flex-row items-center border bg-slate-100 dark:bg-slate-950",
        isFirst && "rounded-t-md",
        isLast && "rounded-b-md",
      )}
    >
      <SearchableSelect
        options={fieldOptions}
        value={
          condition.field.subtype === "property" && condition.field.key
            ? condition.field.key
            : condition.field.column
        }
        onValueChange={handleFieldChange}
        placeholder={t("selectField")}
        searchPlaceholder={t("search.searchField")}
        emptyMessage={t("search.noFieldFound")}
        width="200px"
        className={clsx(
          "h-7 flex-shrink-0 rounded-none border-none bg-transparent text-[10px] focus-visible:ring-0 focus-visible:ring-offset-0",
        )}
      />
      <Select
        value={condition.operator}
        onValueChange={handleOperatorChange}
        disabled={!condition.field.column}
      >
        <SelectTrigger className="h-7 w-[40px] flex-shrink-0 rounded-none rounded-l-none border-none bg-transparent px-1 text-center text-[10px] font-normal focus-visible:ring-0 focus-visible:ring-offset-0">
          <SelectValue placeholder={t("operatorShort")}>
            {condition.operator &&
              FILTER_OPERATOR_SYMBOLS[condition.operator as FilterOperator]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="focus-visible:ring-0 focus-visible:ring-offset-0">
          {operatorOptions.map((op) => (
            <SelectItem
              key={op.value}
              value={op.value}
              className="text-[10px] font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-grow">{renderValueInput()}</div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="h-6 flex-shrink-0 border-none px-1"
      >
        <Trash2 size={12} className="" />
      </Button>
    </div>
  );
};

export default FilterConditionNode;

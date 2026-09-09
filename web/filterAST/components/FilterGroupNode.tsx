import { Button } from "@/components/ui/button";
import { Small, XSmall } from "@/components/ui/typography";
import { ChevronsUpDown, Plus, Copy } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AndExpression,
  DEFAULT_FILTER_GROUP_EXPRESSION,
  FilterAST,
  OrExpression,
} from "@helicone-package/filters/types";
import { useFilterAST } from "../context/filterContext";
import FilterConditionNode from "./FilterConditionNode";
import { Row } from "@/components/layout/common/row";
import SaveFilterButton from "./SaveFilterButton";
import useNotification from "@/components/shared/notification/useNotification";
import { generateCurlCommand } from "../utils/generateCurl";

interface FilterGroupNodeProps {
  group: AndExpression | OrExpression;
  path: number[];
  isRoot?: boolean;
  showCurlButton?: boolean;
}

export const FilterGroupNode: React.FC<FilterGroupNodeProps> = ({
  group,
  path,
  isRoot = false,
  showCurlButton = false,
}) => {
  const { t } = useTranslation("filters");
  const { store: filterStore } = useFilterAST();
  const notification = useNotification();

  const handleAddCondition = () => {
    filterStore.addFilterExpression(path, {
      type: "condition",
      field: {
        column: "status",
        table: "request_response_rmt",
      },
      operator: "eq",
      value: 200,
    });
  };

  const hasGroupAlready = useMemo(() => {
    return group.expressions.find(
      (expr) => expr.type === "and" || expr.type === "or",
    );
  }, [group]);

  const handleAddGroup = () => {
    if (hasGroupAlready) {
      group.expressions.push(DEFAULT_FILTER_GROUP_EXPRESSION);
      filterStore.setFilter(group);
    } else {
      filterStore.setFilter(
        FilterAST.and(group, DEFAULT_FILTER_GROUP_EXPRESSION),
      );
    }
  };

  const handleToggleGroupOperator = () => {
    if (group.type === "and") {
      const updated: OrExpression = {
        type: "or",
        expressions: [...group.expressions],
      };
      filterStore.updateFilterExpression(path, updated);
    } else {
      const updated: AndExpression = {
        type: "and",
        expressions: [...group.expressions],
      };
      filterStore.updateFilterExpression(path, updated);
    }
  };

  const handleCopyCurl = () => {
    try {
      const curlCommand = generateCurlCommand(filterStore.filter);
      navigator.clipboard.writeText(curlCommand);
      notification.setNotification(t("notifications.curlCopied"), "success");
    } catch {
      notification.setNotification(t("notifications.curlCopyFailed"), "error");
    }
  };

  return (
    <div className={`rounded-md bg-transparent ${isRoot ? "" : "border p-4"}`}>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <XSmall className="font-normal">{t("match")}</XSmall>

          <Button
            type="button"
            size="sm_sleek"
            onClick={handleToggleGroupOperator}
            variant={"secondary"}
            className="gap-1 border px-3"
          >
            <XSmall className="font-normal">
              {group.type === "and" ? t("matchAll") : t("matchAny")}
            </XSmall>
            <ChevronsUpDown className="opacity-50" size={12} />
          </Button>
          <XSmall className="font-normal">
            {isRoot ? t("groupsLabel") : t("conditionsInGroupLabel")}
          </XSmall>
        </div>
      </div>

      <div className={`flex flex-col gap-2 ${isRoot ? "" : ""}`}>
        <div className="flex flex-col gap-0">
          {group.expressions.length === 0 ? (
            <Small className="block py-1.5 text-muted-foreground">
              {t("noConditions")}
            </Small>
          ) : (
            group.expressions.map((expr, index) => {
              const newPath = [...path, index];
              if (expr.type === "and" || expr.type === "or") {
                const isLast = index === group.expressions.length - 1;
                return (
                  <div key={`group-${index}`} className="mt-1.5">
                    <FilterGroupNode
                      group={expr as AndExpression | OrExpression}
                      path={newPath}
                    />
                    {!isLast && (
                      <XSmall className="font-normal text-slate-400">
                        {group.type === "and" ? t("and") : t("or")}
                      </XSmall>
                    )}
                  </div>
                );
              } else if (expr.type === "condition") {
                return (
                  <div key={`condition-${index}`}>
                    <FilterConditionNode
                      condition={expr}
                      path={newPath}
                      isFirst={index === 0}
                      isLast={index === group.expressions.length - 1}
                    />
                  </div>
                );
              }
              return null;
            })
          )}
        </div>

        {(!isRoot || !hasGroupAlready) && (
          <div className="flex justify-start">
            <Button
              type="button"
              variant="ghost"
              onClick={handleAddCondition}
              size="sm_sleek"
              className="flex gap-1 px-0"
            >
              <Plus size={10} />
              <span className="text-[10px] font-normal">
                {t("addCondition")}
              </span>
            </Button>
          </div>
        )}

        {isRoot && (
          <Row className="w-full justify-between">
            <Button
              type="button"
              variant="glass"
              size="xs"
              className="flex w-fit items-center gap-1"
              onClick={() => handleAddGroup()}
            >
              <Plus size={12} />
              <span className="text-[10px] font-normal">
                {t("addConditionGroup")}
              </span>
            </Button>
            <Row className="gap-2">
              {showCurlButton && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm_sleek"
                  onClick={handleCopyCurl}
                  className="flex items-center gap-1 text-[10px] font-normal"
                >
                  <Copy size={12} />
                  <span>{t("copyCurl")}</span>
                </Button>
              )}
              <SaveFilterButton />
            </Row>
          </Row>
        )}
      </div>
    </div>
  );
};

export default FilterGroupNode;

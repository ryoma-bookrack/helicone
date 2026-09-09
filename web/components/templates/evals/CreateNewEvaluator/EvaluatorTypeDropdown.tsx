import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COMPOSITE_OPTIONS, LLM_AS_A_JUDGE_OPTIONS } from "../testing/examples";
import { EvaluatorType } from "@/components/templates/evals/testing/types";

export const EvaluatorTypeDropdown: React.FC<{
  selectedOption: string;
  onOptionSelect: (option: EvaluatorType) => void;
}> = ({ selectedOption, onOptionSelect }) => {
  const { t } = useTranslation("evals");
  return (
    <>
      <div className="pb-8">
        Presets:{" "}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm_sleek">
              {selectedOption}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("ui.llmAsAJudge")}</DropdownMenuLabel>
              {LLM_AS_A_JUDGE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.name}
                  onClick={() => onOptionSelect(option)}
                >
                  {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("ui.composite")}</DropdownMenuLabel>
              {COMPOSITE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.name}
                  onClick={() => onOptionSelect(option)}
                >
                  {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("ui.rag")}<span className="text-xs text-gray-500">{t("ui.soon")}</span>
              </DropdownMenuLabel>
              <DropdownMenuItem
                // onClick={() => onOptionSelect("ContextRecall")}
                disabled
              >{t("ui.contextrecall")}</DropdownMenuItem>
              <DropdownMenuItem
                // onClick={() => onOptionSelect("AnswerSimilarity")}
                disabled
              >{t("ui.answersimilarity")}</DropdownMenuItem>
              <DropdownMenuItem
                // onClick={() => onOptionSelect("SourceProperly")}
                disabled
              >{t("ui.sourceproperly")}</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TabsList>
        <TabsTrigger value="llm-as-a-judge">{t("ui.llmAsAJudge2")}</TabsTrigger>
        <TabsTrigger value="python">{t("ui.python")}<span className="px-3 text-xs text-gray-500"></span>
        </TabsTrigger>
        <TabsTrigger value="typescript">{t("ui.lastmileAutoeval")}</TabsTrigger>
        <TabsTrigger value="typescript" disabled>{t("ui.typescript")}<span className="px-3 text-xs text-gray-500">{t("ui.soon")}</span>
        </TabsTrigger>
      </TabsList>
    </>
  );
};

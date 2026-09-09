import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterASTEditor } from "./FilterASTEditor";
import { useFilterAST } from "./context/filterContext";
import { Badge } from "@/components/ui/badge";
import { Row } from "@/components/layout/common";
import SavedFiltersDropdown from "./components/SavedFiltersDropdown";

interface FilterASTButtonProps {
  showCurlButton?: boolean;
}

export const FilterASTButton: React.FC<FilterASTButtonProps> = ({
  showCurlButton = false,
}) => {
  const { t } = useTranslation("filters");
  const { t: tc } = useTranslation("common");
  const { store } = useFilterAST();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <Button variant="outline" size="sm" className="gap-2">
        <Filter className="h-4 w-4" />
        {tc("actions.filter")}
      </Button>
    );
  }

  const numFilters = store.getFilterNodeCount();

  return (
    <Row className="mr-4 space-x-2">
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={numFilters > 0 ? "default" : "outline"}
            className="gap-2"
            size="sm"
          >
            <Filter size={14} />
            {numFilters > 0 ? (
              <>
                {t("filtersLabel")}
                <Badge className="flex h-5 w-5 items-center justify-center rounded-full bg-white p-0 text-xs font-semibold text-slate-900 hover:bg-white/90">
                  {numFilters}
                </Badge>
              </>
            ) : (
              tc("actions.filter")
            )}
            {!isOpen && store.activeFilterId && (
              <Badge variant="outline" className="text-xs">
                {store.activeFilterName}
              </Badge>
            )}
            {numFilters > 0 && (
              <X
                size={14}
                className="ml-1 transition-opacity hover:opacity-70"
                onClick={(e) => {
                  e.stopPropagation();
                  store.clearActiveFilter();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-[800px] max-w-[90vw] p-0">
          <FilterASTEditor showCurlButton={showCurlButton} />
        </PopoverContent>
      </Popover>
      <SavedFiltersDropdown />
    </Row>
  );
};

export default FilterASTButton;

import { formatStandardDateTime } from "@/lib/i18n/format";
import React from "react";
import { useFilterStore } from "../store/filterStore";
import { Button } from "@/components/ui/button";
import { P, Small } from "@/components/ui/typography";
import { Trash2 } from "lucide-react";
import { useFilterAST } from "@/filterAST/context/filterContext";
import { useTranslation } from "react-i18next";

interface SavedFiltersListProps {
  onClose?: () => void;
}

export const SavedFiltersList: React.FC<SavedFiltersListProps> = () => {
  const { t } = useTranslation("filters");
  const { t: tc } = useTranslation("common");
  const filterStore = useFilterStore();
  const { crud, helpers } = useFilterAST();

  if (crud.isLoading) {
    return (
      <P className="py-4 text-center">{t("loadingSavedFilters")}</P>
    );
  }

  if (crud.savedFilters.length === 0) {
    return (
      <P className="py-4 text-center text-muted-foreground">
        {t("noSavedFiltersYet")}
      </P>
    );
  }

  return (
    <div className="max-h-[300px] space-y-2 overflow-y-auto">
      {crud.savedFilters.map((filter) => (
        <div
          key={filter.id}
          className="flex cursor-pointer items-center justify-between rounded-md border p-2 hover:bg-accent"
          onClick={() => helpers.loadFilterById(filter.id || "")}
        >
          <div>
            <P className="font-medium">{filter.name}</P>
            <Small className="text-muted-foreground">
              {filter.createdAt
                ? formatStandardDateTime(filter.createdAt)
                : tc("date.unknownDate")}
            </Small>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => helpers.deleteFilter(filter.id || "")}
            disabled={crud.isDeleting}
            className="opacity-50 hover:opacity-100"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SavedFiltersList;

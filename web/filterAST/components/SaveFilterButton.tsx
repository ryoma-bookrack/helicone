import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useFilterAST } from "../context/filterContext";
import useNotification from "@/components/shared/notification/useNotification";
import { Row } from "@/components/layout/common/row";

interface SaveFilterButtonProps {}

const SaveFilterButton: React.FC<SaveFilterButtonProps> = () => {
  const { t } = useTranslation("filters");
  const { t: tc } = useTranslation("common");
  const { crud, store: filterStore, helpers } = useFilterAST();
  const notification = useNotification();

  if (crud.isRefetching || crud.isSaving) {
    return (
      <Row className="gap-2">
        <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900">
          {t("saving")}
        </div>
        <Button
          variant="outline"
          size="sm_sleek"
          onClick={() => {
            helpers.saveFilter();
          }}
          className="text-[10px] font-normal"
        >
          {t("saveNew")}
        </Button>
      </Row>
    );
  }

  if (!filterStore.activeFilterId) {
    return (
      <Button
        variant="outline"
        size="sm_sleek"
        onClick={() => {
          helpers.saveFilter();
        }}
        className="text-[10px] font-normal"
      >
        {t("saveNew")}
      </Button>
    );
  }

  if (filterStore.hasUnsavedChanges) {
    return (
      <Row className="gap-2">
        <Button
          variant="default"
          size="sm_sleek"
          onClick={() => {
            if (filterStore.activeFilterId) {
              helpers.updateFilterById(filterStore.activeFilterId, {
                filter: filterStore.filter,
                name: filterStore.activeFilterName || t("untitledFilter"),
              });
            }
          }}
          className="text-[10px] font-normal"
        >
          {tc("actions.save")}
        </Button>
        <Button
          variant="outline"
          size="sm_sleek"
          onClick={() => {
            helpers.saveFilter();
          }}
          className="text-[10px] font-normal"
        >
          {t("saveNew")}
        </Button>
      </Row>
    );
  }

  return (
    <Row className="gap-2">
      <Button
        variant="ghost"
        size="square_icon"
        onClick={() => {
          const url = helpers.getShareableUrl();
          if (url) {
            navigator.clipboard.writeText(url);
            notification.setNotification(t("notifications.urlCopied"), "success");
          }
        }}
      >
        <Link size={12} className="text-primary" />
      </Button>
      <Button
        variant="outline"
        size="sm_sleek"
        onClick={() => {
          helpers.saveFilter();
        }}
        className="text-[10px] font-normal"
      >
        {t("saveNew")}
      </Button>
    </Row>
  );
};

export default SaveFilterButton;

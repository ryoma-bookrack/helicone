import { useTranslation } from "react-i18next";
import {
  FolderIcon,
  PencilIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../../../../ui/button";
import { Dices, UploadIcon } from "lucide-react";

interface AddRowPopoverProps {
  setPopoverOpen: (open: boolean) => void;
  setShowAddManualRow: () => void;
  setShowExperimentInputSelector: (open: boolean) => void;
  setShowRandomInputSelector: (open: boolean) => void;
  setShowExperimentDatasetSelector: (open: boolean) => void;
  setShowImportCsvModal: (open: boolean) => void;
}

export const AddRowPopover: React.FC<AddRowPopoverProps> = ({
  setPopoverOpen,
  setShowAddManualRow,
  setShowExperimentInputSelector,
  setShowRandomInputSelector,
  setShowExperimentDatasetSelector,
  setShowImportCsvModal,
}) => {
  const { t } = useTranslation("prompts");
  const { t: tCommon } = useTranslation("common");

  return (
    <div>
      <Button
        onClick={() => {
          setPopoverOpen(false);
          setShowAddManualRow();
        }}
        className="flex h-8 w-full items-center justify-start"
        variant="ghost"
      >
        <PencilIcon className="mr-2 inline h-4 w-4" />{t("ui.manualInput")}</Button>
      <Button
        onClick={() => {
          setPopoverOpen(false);
          setShowExperimentInputSelector(true);
        }}
        className="flex h-8 w-full items-center justify-start"
        variant="ghost"
      >
        <TableCellsIcon className="mr-2 inline h-4 w-4" />{t("ui.selectAnInputSet")}</Button>
      <Button
        onClick={() => {
          setPopoverOpen(false);
          setShowRandomInputSelector(true);
        }}
        className="flex h-8 w-full items-center justify-start"
        variant="ghost"
      >
        <Dices className="mr-2 inline h-4 w-4" />{t("ui.randomProd")}</Button>
      <Button
        onClick={() => {
          setPopoverOpen(false);
          setShowExperimentDatasetSelector(true);
        }}
        className="flex h-8 w-full items-center justify-start"
        variant="ghost"
      >
        <FolderIcon className="mr-2 inline h-4 w-4" />{t("ui.selectADataset")}</Button>
      <Button
        onClick={() => {
          setPopoverOpen(false);
          setShowImportCsvModal(true);
        }}
        className="flex h-8 w-full items-center justify-start"
        variant="ghost"
      >
        <UploadIcon className="mr-2 h-4 w-4" />{t("ui.importFromCsv")}</Button>
    </div>
  );
};

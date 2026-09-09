import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const TrialConfirmationDialog = ({
  featureName,
  isOpen,
  onOpenChange,
  onConfirm,
  isUpgrade = false,
}: {
  featureName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isUpgrade?: boolean;
}) => {
  const { t } = useTranslation("common");
  const actionText = isUpgrade ? t("trial.upgrade") : t("trial.startTrial");
  const titleText = isUpgrade
    ? t("trial.enableTitle", { featureName })
    : t("trial.startTitle", { featureName });
  const descriptionText = isUpgrade
    ? t("trial.confirmEnableDescription", { featureName })
    : t("trial.confirmStartDescription", { featureName });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("actions.cancel")}
          </Button>
          <Button onClick={onConfirm}>{actionText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

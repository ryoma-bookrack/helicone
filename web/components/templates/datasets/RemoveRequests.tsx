import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

interface RemoveRequestsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  requestCount: number;
  onConfirm: () => void;
}

const RemoveRequestsModal: React.FC<RemoveRequestsModalProps> = ({
  open,
  setOpen,
  requestCount,
  onConfirm,
}) => {
  const { t } = useTranslation("datasets");
  const { t: tCommon } = useTranslation("common");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4 px-6 py-8 sm:max-w-[425px]">
        <DialogHeader className="space-y-8">
          <DialogTitle>
            {t("removeModal.title", { count: requestCount })}
          </DialogTitle>
          <DialogDescription>
            {t("removeModal.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full flex-row justify-between gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {tCommon("actions.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {t("removeModal.confirmRemove")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveRequestsModal;

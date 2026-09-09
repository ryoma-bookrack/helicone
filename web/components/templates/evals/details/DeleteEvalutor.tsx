import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useEvaluators } from "../EvaluatorHook";
import { useEvaluatorDetails } from "./hooks";
import { Evaluator } from "./types";

export const DeleteEvaluator = ({
  evaluator,
  setSelectedEvaluator,
  showDeleteModal,
  setShowDeleteModal,
  deleteEvaluator,
}: {
  evaluator: Evaluator;
  setSelectedEvaluator: (evaluator: Evaluator | null) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (showDeleteModal: boolean) => void;
  deleteEvaluator: ReturnType<typeof useEvaluators>["deleteEvaluator"];
}) => {
  const { t } = useTranslation("evals");
  const { t: tCommon } = useTranslation("common");
  const { experiments } = useEvaluatorDetails(evaluator, () => {});

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  return (
    <>
      <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>{tCommon("actions.delete")}</Button>

      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("ui.areYouSureYouWantToDeleteThisEvaluator")}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please type the name of the
              evaluator to confirm:
              <br />
              <span className="text-red-500">{evaluator.name}</span>
              <Input
                className="mt-2"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={evaluator.name}
              />
              <i>
                This will remove the evaluator from all{" "}
                {experiments.data?.data?.data?.length ?? 0} experiments. Your
                scores will still be saved, but you will not be able to use this
                evaluator in new experiments.
              </i>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmation === evaluator.name) {
                  deleteEvaluator.mutate(evaluator.id);
                  setShowDeleteModal(false);
                  setSelectedEvaluator(null);
                }
              }}
              disabled={deleteConfirmation !== evaluator.name}
            >{tCommon("actions.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

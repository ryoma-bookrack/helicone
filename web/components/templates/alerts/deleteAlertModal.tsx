import { useTranslation } from "react-i18next";
import { useJawnClient } from "../../../lib/clients/jawnHook";
import { useOrg } from "../../layout/org/organizationContext";
import { clsx } from "../../shared/clsx";
import useNotification from "../../shared/notification/useNotification";
import ThemedModal from "../../shared/themed/themedModal";

interface DeleteAlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
  alertId: string;
}

const DeleteAlertModal = (props: DeleteAlertModalProps) => {
  const { open, setOpen, onSuccess, alertId } = props;
  const { t } = useTranslation("alerts");
  const { t: tCommon } = useTranslation("common");

  const orgContext = useOrg();
  const jawn = useJawnClient();
  const { setNotification } = useNotification();

  const handleDeleteAlert = async (id: string) => {
    if (orgContext?.currentOrg?.id === undefined) {
      setNotification(t("notifications.deleteOrgNotFound"), "error");
      return;
    }
    try {
      const { error: deleteError } = await jawn.DELETE("/v1/alert/{alertId}", {
        params: {
          path: {
            alertId: id,
          },
        },
      });

      if (deleteError) {
        setNotification(t("notifications.deleteError"), "error");
      }

      onSuccess();
      setOpen(false);
      setNotification(t("notifications.deleteSuccess"), "success");
    } catch (error) {
      setNotification(
        t("notifications.error", { message: String(error) }),
        "error",
      );
    }
  };

  return (
    <ThemedModal open={open} setOpen={setOpen}>
      <div className="flex w-full flex-col gap-4">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t("deleteModal.title")}
        </p>
        <p className="w-[400px] whitespace-pre-wrap text-sm text-gray-500">
          {t("deleteModal.description")}
        </p>
        <div className="mt-4 flex w-full justify-end gap-4">
          <button
            onClick={() => {
              setOpen(false);
            }}
            className="flex flex-row items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:border-gray-700 dark:bg-black dark:text-gray-100 dark:hover:bg-gray-900 dark:hover:text-gray-300"
          >
            {tCommon("actions.cancel")}
          </button>
          <button
            onClick={() => {
              handleDeleteAlert(alertId);
            }}
            className={clsx(
              "relative inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700",
            )}
          >
            {tCommon("actions.delete")}
          </button>
        </div>
      </div>
    </ThemedModal>
  );
};

export default DeleteAlertModal;

import { useTranslation } from "react-i18next";
import { useJawnClient } from "../../../lib/clients/jawnHook";
import { getHeliconeCookie } from "../../../lib/cookies";
import useNotification from "../../shared/notification/useNotification";
import ThemedModal from "../../shared/themed/themedModal";
import AlertForm, { AlertRequest } from "./alertForm";

import { Database } from "../../../db/database.types";

interface EditAlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
  currentAlert?: Database["public"]["Tables"]["alert"]["Row"];
}

export const EditAlertModal = (props: EditAlertModalProps) => {
  const { open, setOpen, onSuccess, currentAlert } = props;
  const { t } = useTranslation("alerts");

  const { setNotification } = useNotification();
  const jawn = useJawnClient();

  const handleEditAlert = async (req: AlertRequest) => {
    const { error } = await jawn.POST("/v1/alert/create", {
      body: {
        name: req.name,
        metric: req.metric,
        threshold: req.threshold,
        aggregation: req.aggregation,
        percentile: req.percentile,
        grouping: req.grouping,
        grouping_is_property: req.grouping_is_property,
        time_window: req.time_window,
        emails: req.emails,
        slack_channels: req.slack_channels,
        minimum_request_count: req.minimum_request_count,
        filter: req.filter,
      },
    });

    if (error) {
      setNotification(
        t("notifications.editFailed", { error: String(error) }),
        "error",
      );
      return;
    }

    const { error: deleteError } = await jawn.DELETE("/v1/alert/{alertId}", {
      params: {
        path: {
          alertId: currentAlert?.id || "",
        },
      },
    });

    if (deleteError) {
      setNotification(t("notifications.editError"), "error");
      return;
    }

    onSuccess();
    setOpen(false);
    setNotification(t("notifications.editSuccess"), "success");
  };

  return (
    <ThemedModal
      open={open}
      setOpen={setOpen}
      className="max-h-[90vh] w-fit max-w-[90vw] overflow-visible"
    >
      <AlertForm
        handleSubmit={(alertReq) => handleEditAlert(alertReq)}
        onCancel={() => setOpen(false)}
        initialValues={currentAlert}
      />
    </ThemedModal>
  );
};
interface CreateAlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateAlertModal = (props: CreateAlertModalProps) => {
  const { open, setOpen, onSuccess } = props;
  const { t } = useTranslation("alerts");

  const jawn = useJawnClient();
  const { setNotification } = useNotification();

  const handleCreateAlert = async (req: AlertRequest) => {
    const authFromCookie = getHeliconeCookie();
    if (authFromCookie.error || !authFromCookie.data) {
      setNotification(t("notifications.loginRequired"), "error");
      return;
    }

    const { error } = await jawn.POST("/v1/alert/create", {
      body: {
        name: req.name,
        metric: req.metric,
        threshold: req.threshold,
        aggregation: req.aggregation,
        percentile: req.percentile,
        grouping: req.grouping,
        grouping_is_property: req.grouping_is_property,
        time_window: req.time_window,
        emails: req.emails,
        slack_channels: req.slack_channels,
        minimum_request_count: req.minimum_request_count,
        filter: req.filter,
      },
    });

    if (error) {
      setNotification(
        t("notifications.createFailed", { error: String(error) }),
        "error",
      );
      return;
    }

    setNotification(t("notifications.createSuccess"), "success");
    setOpen(false);
    onSuccess();
  };

  return (
    <ThemedModal
      open={open}
      setOpen={setOpen}
      className="max-h-[90vh] w-fit max-w-[90vw] overflow-visible"
    >
      <AlertForm
        handleSubmit={(alertReq) => handleCreateAlert(alertReq)}
        onCancel={() => setOpen(false)}
      />
    </ThemedModal>
  );
};

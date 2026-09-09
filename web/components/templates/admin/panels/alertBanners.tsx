import { TextInput } from "@tremor/react";
import { SimpleTable } from "../../../shared/table/simpleTable";
import { ThemedSwitch } from "../../../shared/themed/themedSwitch";
import { getStandardDateFromString } from "../../../shared/utils/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import useNotification from "../../../shared/notification/useNotification";
import { Button } from "@/components/ui/button";
import {
  useCreateAlertBanner,
  useUpdateAlertBanner,
} from "@/services/hooks/admin";
import { $JAWN_API } from "@/lib/clients/jawn";

interface AlertBannersProps {}

const AlertBanners = (props: AlertBannersProps) => {
  const {} = props;
  const { t } = useTranslation("admin");
  const { setNotification } = useNotification();

  const { data: alertBanners, refetch } = $JAWN_API.useQuery(
    "get",
    "/v1/alert-banner",
    {},
  );

  const { createBanner, isCreatingBanner } = useCreateAlertBanner(() => {
    refetch();
    setTitle("");
    setMessage("");
    setNotification(t("panels.alertBanners.createdSuccess"), "success");
  });

  const { updateBanner } = useUpdateAlertBanner(() => {
    refetch();
    setNotification(t("panels.alertBanners.updatedSuccess"), "success");
  });

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <h2 className="text-lg font-semibold text-white">
        {t("panels.alertBanners.title")}
      </h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <TextInput
            placeholder={t("panels.alertBanners.titlePlaceholder")}
            value={title}
            onValueChange={setTitle}
          />
        </div>
        <div className="col-span-2">
          <TextInput
            placeholder={t("panels.alertBanners.messagePlaceholder")}
            value={message}
            onValueChange={setMessage}
          />
        </div>
        <div className="col-span-1">
          <Button
            size={"xs"}
            onClick={async () => {
              if (!title || !message) {
                setNotification(
                  t("panels.alertBanners.titleMessageRequired"),
                  "error",
                );
                return;
              }
              createBanner({ title, message });
            }}
            disabled={isCreatingBanner}
          >
            {t("panels.alertBanners.createNewAlert")}
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 text-black">
        <SimpleTable
          data={alertBanners?.data || []}
          columns={[
            {
              key: "title",
              header: t("common.title"),
              render: (row) => (
                <div className="font-semibold text-black">{row.title}</div>
              ),
            },
            {
              key: "message",
              header: t("common.message"),
              render: (row) => <div className="text-wrap">{row.message}</div>,
            },
            {
              key: "created_at",
              header: t("common.createdAt"),
              render: (row) => (
                <div className="">{getStandardDateFromString(row.created_at)}</div>
              ),
            },
            {
              key: "updated_at",
              header: t("common.lastUpdated"),
              render: (row) => (
                <div className="">{getStandardDateFromString(row.updated_at)}</div>
              ),
            },
            {
              key: "active",
              header: t("common.active"),
              render: (row) => (
                <ThemedSwitch
                  checked={row.active}
                  onChange={function (checked: boolean): void {
                    updateBanner({ id: row.id, active: checked });
                  }}
                />
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default AlertBanners;

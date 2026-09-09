import { KeyIcon } from "@heroicons/react/24/outline";

import LoadingAnimation from "@/components/shared/loadingAnimation";
import ThemedTable from "../../../shared/themed/themedTable";
import { useKeys } from "../useKeys";
import "@/styles/settings-tables.css";
import { formatStandardDateTime } from "@/lib/i18n/format";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

interface HeliconeKeyTableProps {
  onAddKey: () => void;
  onEdit: (keyId: string) => void;
  onDelete: (keyId: string) => void;
}

const HeliconeKeyTable = ({
  onAddKey,
  onEdit,
  onDelete,
}: HeliconeKeyTableProps) => {
  const { t } = useTranslation("keys");
  const { keys } = useKeys();

  const keyPermissions = useMemo(
    () =>
      new Map([
        ["r", t("table.permissions.read")],
        ["w", t("table.permissions.write")],
        ["rw", t("table.permissions.readWrite")],
      ]),
    [t],
  );

  if (keys?.isLoading) {
    return <LoadingAnimation title={t("table.loading")} />;
  }

  if ((keys?.data?.data?.data?.length ?? 0) < 1) {
    return (
      <button
        onClick={onAddKey}
        className="relative m-4 block w-full border-2 border-dashed border-border bg-muted p-8 text-center hover:cursor-pointer hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div className="w-full items-center justify-center align-middle">
          <KeyIcon className="mx-auto h-8 w-8 text-muted-foreground" />
        </div>
        <span className="mt-2 block text-xs font-medium">
          {t("table.emptyAction")}
        </span>
      </button>
    );
  }

  return (
    <div className="settings-table border-t border-border">
      <ThemedTable
        columns={[
          { name: t("table.columns.name"), key: "key_name", hidden: false },
          { name: t("table.columns.created"), key: "created_at", hidden: false },
          {
            name: t("table.columns.permissions"),
            key: "permissions",
            hidden: false,
          },
        ]}
        rows={keys?.data?.data?.data?.map((key) => ({
          ...key,
          id: key.id.toString(),
          key_name: <p className="text-xs font-semibold">{key.api_key_name}</p>,
          created_at: (
            <p className="text-xs text-muted-foreground">
              {formatStandardDateTime(key.created_at)}
            </p>
          ),
          permissions: (
            <p className="text-xs text-muted-foreground">
              {keyPermissions.get(key.key_permissions ?? "rw") ??
                t("table.permissions.readWrite")}
            </p>
          ),
        }))}
        editHandler={(key) => onEdit(key.id)}
        deleteHandler={(key) => onDelete(key.id)}
      />
    </div>
  );
};

export default HeliconeKeyTable;

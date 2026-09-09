import { useState } from "react";
import AddKeyModal from "./components/addKeyModal";
import DeleteKeyModal from "./components/DeleteKeyModal";
import EditKeyModal from "./components/EditKeyModal";
import HeliconeKeyTable from "./components/HeliconeKeyTable";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const KeyPage = () => {
  const { t } = useTranslation("keys");
  const [editOpen, setEditOpen] = useState(false);
  const [addKeyOpen, setAddKeyOpen] = useState(false);
  const [deleteHeliconeOpen, setDeleteHeliconeOpen] = useState(false);
  const [selectedHeliconeKey, setSelectedHeliconeKey] = useState<string>();

  const onEditHandler = (keyId: string) => {
    setSelectedHeliconeKey(keyId);
    setEditOpen(true);
  };

  const onDeleteHeliconeHandler = (keyId: string) => {
    setSelectedHeliconeKey(keyId);
    setDeleteHeliconeOpen(true);
  };

  return (
    <>
      <div className="flex w-full max-w-6xl flex-col border-y border-border">
        <div className="border-b border-border p-4">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold">{t("page.title")}</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("page.description")}
              </p>
            </div>
            <Button
              onClick={() => setAddKeyOpen(true)}
              size="sm"
              className="text-xs"
            >
              {t("page.generateNewKey")}
            </Button>
          </div>
        </div>

        <div>
          <HeliconeKeyTable
            onAddKey={() => setAddKeyOpen(true)}
            onEdit={onEditHandler}
            onDelete={onDeleteHeliconeHandler}
          />
        </div>
      </div>

      <AddKeyModal open={addKeyOpen} setOpen={setAddKeyOpen} />

      <EditKeyModal
        open={editOpen}
        setOpen={setEditOpen}
        selectedKey={selectedHeliconeKey}
      />
      <DeleteKeyModal
        open={deleteHeliconeOpen}
        setOpen={setDeleteHeliconeOpen}
        selectedKey={selectedHeliconeKey}
      />
    </>
  );
};

export default KeyPage;

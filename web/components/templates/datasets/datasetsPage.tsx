import { formatStandardDateTime } from "@/lib/i18n/format";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useGetHeliconeDatasets } from "../../../services/hooks/dataset/heliconeDataset";
import AuthHeader from "../../shared/authHeader";
import { SimpleTable } from "../../shared/table/simpleTable";
import { EmptyStateCard } from "@/components/shared/helicone/EmptyStateCard";
import React, { useState } from "react";
import { SortDirection } from "@/services/lib/sorts/requests/sorts";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useJawnClient } from "../../../lib/clients/jawnHook";
import useNotification from "../../shared/notification/useNotification";
import { Button } from "@/components/ui/button";
import LoadingAnimation from "@/components/shared/loadingAnimation";

// Type for the dataset row
type DatasetTableRow = {
  id: string;
  name: string | null;
  created_at: string | null;
  dataset_type: string;
  requests_count: number;
  organization: string;
  meta: any;
  promptVersionId?: any;
};

interface DatasetsPageProps {
  currentPage: number;
  pageSize: number;
  sort: {
    sortKey: string | null;
    sortDirection: SortDirection | null;
    isCustomProperty: boolean;
  };
  defaultIndex: number;
}

const DatasetsPage = (props: DatasetsPageProps) => {
  const { t } = useTranslation("datasets");
  const { t: tCommon } = useTranslation("common");
  const { currentPage, pageSize, sort, defaultIndex } = props;

  const { datasets, isLoading, refetch, isRefetching, isFetched, status } =
    useGetHeliconeDatasets();

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] =
    useState<DatasetTableRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // For delete functionality
  const jawnClient = useJawnClient();
  const { setNotification } = useNotification();

  const router = useRouter();

  // Open delete modal
  const handleDeleteClick = (dataset: DatasetTableRow) => {
    setDatasetToDelete(dataset);
    setDeleteModalOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteModalOpen(false);
    setDatasetToDelete(null);
  };

  // Delete the dataset
  const handleDeleteConfirm = () => {
    if (!datasetToDelete) return;

    setIsDeleting(true);
    jawnClient
      .POST(`/v1/helicone-dataset/{datasetId}/delete`, {
        params: {
          path: {
            datasetId: datasetToDelete.id,
          },
        },
      })
      .then((res) => {
        if (res.error) {
          setNotification(t("notifications.deleteError"), "error");
        } else {
          setNotification(t("notifications.deleteSuccess"), "success");
          refetch();
          handleCloseDialog();
        }
      })
      .catch((err) => {
        setNotification(t("notifications.deleteError"), "error");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const columns = [
    {
      key: "name" as keyof DatasetTableRow,
      header: t("table.name"),
      render: (row: DatasetTableRow) => row.name || t("page.untitled"),
    },
    {
      key: "created_at" as keyof DatasetTableRow,
      header: t("table.createdAt"),
      render: (row: DatasetTableRow) =>
        formatStandardDateTime(row.created_at ?? 0),
    },
    {
      key: "dataset_type" as keyof DatasetTableRow,
      header: t("table.datasetType"),
      render: (row: DatasetTableRow) => {
        return row.dataset_type === "helicone" ? (
          <span className="-my-1 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900 dark:text-blue-300">
            {t("types.helicone")}
          </span>
        ) : row.dataset_type === "experiment" ? (
          <span className="-my-1 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900 dark:text-green-300">
            {t("types.experiment")}
          </span>
        ) : (
          t("types.unknown")
        );
      },
    },
    {
      key: "requests_count" as keyof DatasetTableRow,
      header: t("table.rows"),
      render: (row: DatasetTableRow) => row.requests_count,
    },
    {
      key: undefined,
      header: "",
      render: (row: DatasetTableRow) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleDeleteClick(row);
            return false;
          }}
          className="text-destructive"
        >
          <Trash size={16} />
        </Button>
      ),
    },
  ];

  // Show skeleton during loading or when data hasn't been fetched yet
  if (isLoading || isRefetching || !isFetched) {
    return (
      <div className="flex w-full flex-col items-center space-y-2">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <>
      {datasets.length === 0 ? (
        <div className="flex min-h-screen w-full flex-col items-center bg-slate-50">
          <EmptyStateCard feature="datasets" />
        </div>
      ) : (
        <>
          <AuthHeader title={t("page.title")} />

          <SimpleTable
            data={datasets || []}
            columns={columns}
            onSelect={(row) => {
              router.push({
                pathname: `/datasets/${row.id}`,
                query: { name: row.name || t("page.untitled") },
              });
            }}
          />

          {/* Delete Modal - Rendered at the page level, outside of the table */}
          <Dialog open={deleteModalOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("delete.title")}</DialogTitle>
                <DialogDescription>
                  {t("delete.description", {
                    name: datasetToDelete?.name || t("page.untitled"),
                  })}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-row justify-end gap-2">
                <Button variant="outline" onClick={handleCloseDialog}>
                  {tCommon("actions.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting
                    ? t("delete.deleting")
                    : tCommon("actions.delete")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default DatasetsPage;

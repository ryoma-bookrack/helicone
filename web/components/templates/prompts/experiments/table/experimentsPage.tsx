import { formatStandardDateTime } from "@/lib/i18n/format";
import { useTranslation } from "react-i18next";
import { FreeTierLimitBanner } from "@/components/shared/FreeTierLimitBanner";
import { FreeTierLimitWrapper } from "@/components/shared/FreeTierLimitWrapper";
import GenericEmptyState from "@/components/shared/helicone/GenericEmptyState";
import LoadingAnimation from "@/components/shared/loadingAnimation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFeatureLimit } from "@/hooks/useFreeTierLimit";
import {
  ChevronDownIcon,
  FlaskConical,
  Plus,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useJawnClient } from "../../../../../lib/clients/jawnHook";
import { useExperimentTables } from "../../../../../services/hooks/prompts/experiments";
import { usePrompts } from "../../../../../services/hooks/prompts/prompts";
import AuthHeader from "../../../../shared/authHeader";
import useNotification from "../../../../shared/notification/useNotification";
import ThemedTable from "../../../../shared/themed/table/themedTableOld";
import { StartFromPromptDialog } from "./components/startFromPromptDialog";

const ExperimentsPage = () => {
  const { t } = useTranslation("prompts");
  const { t: tCommon } = useTranslation("common");

  const jawn = useJawnClient();
  const notification = useNotification();
  const { prompts } = usePrompts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experimentToDelete, setExperimentToDelete] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { experiments, isLoading, deleteExperiment } = useExperimentTables();
  const { setNotification } = useNotification();
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [emptyStateDropdownOpen, setEmptyStateDropdownOpen] = useState(false);
  const experimentCount = experiments?.length || 0;
  const hasExperiments = !isLoading && experimentCount > 0;
  const { canCreate: canCreateExperiment, freeLimit: MAX_EXPERIMENTS } =
    useFeatureLimit("experiments", experimentCount);

  if (isLoading) {
    return <LoadingAnimation title={t("ui.loadingExperiments")} />;
  }

  const handleDeleteExperiment = async () => {
    if (!experimentToDelete) return;

    try {
      await deleteExperiment.mutateAsync(experimentToDelete);
      setNotification(t("ui.experimentDeletedSuccessfully"), "success");
    } catch (error) {
      setNotification(t("ui.failedToDeleteExperiment"), "error");
    } finally {
      setDeleteDialogOpen(false);
      setExperimentToDelete(null);
    }
  };

  const handleStartFromScratch = async () => {
    setNotification(t("ui.creatingExperiment"), "info");
    const res = await jawn.POST("/v2/experiment/create/empty");
    if (res.error) {
      notification.setNotification(t("ui.failedToCreateExperiment"), "error");
    } else {
      router.push(`/experiments/${res.data?.data?.experimentId}`);
    }
  };

  if (!hasExperiments && !isLoading) {
    return (
      <div className="flex h-screen w-full flex-col bg-background dark:bg-sidebar-background">
        <div className="flex h-full flex-1">
          <GenericEmptyState
            title={t("ui.startYourFirstExperiment")}
            description={t("ui.createAnExperimentToComparePromptAndMode")}
            icon={<FlaskConical size={28} className="text-accent-foreground" />}
            className="w-full"
            actions={
              <>
                <DropdownMenu
                  open={emptyStateDropdownOpen}
                  onOpenChange={setEmptyStateDropdownOpen}
                  modal={false}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="default"
                      disabled={!canCreateExperiment}
                    >{t("ui.newExperiment")}<Plus className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[200px]">
                    <DropdownMenuItem onSelect={handleStartFromScratch}>{t("ui.startFromScratch")}</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDialogOpen(true)}>{t("ui.startFromPrompt")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  href="https://docs.helicone.ai/features/experiments"
                  target="_blank"
                >
                  <Button variant="outline" className="gap-2">{t("ui.viewDocs")}<SquareArrowOutUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            }
          >
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <StartFromPromptDialog
                prompts={prompts as any}
                onDialogClose={() => setDialogOpen(false)}
              />
            </Dialog>
          </GenericEmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <AuthHeader
        title={t("ui.experiments")}
        actions={
          !canCreateExperiment ? (
            <FreeTierLimitWrapper
              feature="experiments"
              itemCount={experimentCount}
            >
              <Button variant="action">{t("ui.startNewExperiment")}<ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </FreeTierLimitWrapper>
          ) : (
            <DropdownMenu
              open={headerDropdownOpen}
              onOpenChange={setHeaderDropdownOpen}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="action">{t("ui.startNewExperiment")}<ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[200px]">
                <DropdownMenuItem onSelect={handleStartFromScratch}>{t("ui.startFromScratch")}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDialogOpen(true)}>{t("ui.startFromPrompt")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      />

      {/* Experiment limit warning banner */}
      {!canCreateExperiment && (
        <FreeTierLimitBanner
          feature="experiments"
          itemCount={experimentCount}
          freeLimit={MAX_EXPERIMENTS}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <StartFromPromptDialog
          prompts={prompts as any}
          onDialogClose={() => setDialogOpen(false)}
        />
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("ui.deleteExperiment")}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{t("ui.onceDeletedThisExperimentCannotBeRecover")}</DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >{tCommon("actions.cancel")}</Button>
            <Button
              onClick={handleDeleteExperiment}
              disabled={deleteExperiment.isPending}
            >
              {deleteExperiment.isPending
                ? t("ui.deleting")
                : t("ui.yesDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ThemedTable
        defaultColumns={[
          {
            header: t("ui.name"),
            accessorFn: (row) => {
              return row.name;
            },
          },
          {
            header: t("ui.createdAt"),
            accessorKey: "created_at",
            minSize: 100,
            accessorFn: (row) => {
              return formatStandardDateTime(row.created_at ?? 0);
            },
          },
          {
            header: "",
            accessorKey: "actions",
            cell: ({ row }) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setExperimentToDelete(row.original.id);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            ),
            enableSorting: false,
            size: 10,
          },
        ]}
        defaultData={experiments}
        dataLoading={isLoading}
        id="experiments"
        skeletonLoading={false}
        onRowSelect={(row) => {
          const promptId = row.original_prompt_version;
          if (promptId) {
            router.push(`/experiments/${row.id}`);
          }
        }}
        fullWidth={true}
      />
    </div>
  );
};

export default ExperimentsPage;

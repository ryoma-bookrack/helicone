import { formatStandardDate } from "@/lib/i18n/format";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Loader2, Download } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useNotification from "../../shared/notification/useNotification";
import { logger } from "@/lib/telemetry/logger";
import {
  DashboardExportData,
  exportDashboardToExcel,
} from "@/lib/exportDashboardData";

interface DashboardExportButtonProps {
  data: DashboardExportData;
  timeFilter: {
    start: Date;
    end: Date;
  };
  disabled?: boolean;
}

export default function DashboardExportButton({
  data,
  timeFilter,
  disabled = false,
}: DashboardExportButtonProps) {
  const { t } = useTranslation("dashboard");
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { setNotification } = useNotification();

  const handleExport = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent dialog from closing
    setExporting(true);
    try {
      const excelBlob = await exportDashboardToExcel(data, timeFilter);

      // Create download link
      const objectUrl = URL.createObjectURL(excelBlob);
      const link = document.createElement("a");
      link.href = objectUrl;

      // Format filename with date range
      const startDate = timeFilter.start.toISOString().split("T")[0];
      const endDate = timeFilter.end.toISOString().split("T")[0];
      link.download = `helicone-dashboard-${startDate}-to-${endDate}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL to prevent memory leak
      URL.revokeObjectURL(objectUrl);

      setNotification(t("export.success"), "success");
      setOpen(false);
    } catch (error) {
      logger.error({ error }, "Error exporting dashboard data");
      setNotification(t("export.error"), "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            disabled={disabled}
          >
            <Download size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("export.tooltip")}</TooltipContent>
      </Tooltip>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("export.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {formatStandardDate(timeFilter.start)} -{" "}
              {formatStandardDate(timeFilter.end)}
            </AlertDialogDescription>
            <AlertDialogDescription>
              {t("export.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={exporting}>{t("export.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleExport} disabled={exporting}>
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("export.exporting")}
                </>
              ) : (
                t("export.export")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}

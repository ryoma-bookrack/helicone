import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BeakerIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { DownloadIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DatasetVisualProps {
  numRows?: number;
  hideButtons?: boolean;
}

export const DatasetVisual = ({
  numRows = 6,
  hideButtons = false,
}: DatasetVisualProps) => {
  const { t } = useTranslation("common");

  const defaultTableData = useMemo(
    () => [
      {
        name: t("visuals.datasets.fineTuning"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "1,000",
      },
      {
        name: t("visuals.datasets.evaluation"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "25",
      },
      {
        name: t("visuals.datasets.experiments"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "25",
      },
      {
        name: t("visuals.datasets.badData"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "16",
      },
      {
        name: t("visuals.datasets.paidUser"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "200",
      },
      {
        name: t("visuals.datasets.production"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "500",
      },
      {
        name: t("visuals.datasets.test"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "50",
      },
      {
        name: t("visuals.datasets.customerFeedback"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "150",
      },
      {
        name: t("visuals.datasets.supportQueries"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "300",
      },
      {
        name: t("visuals.datasets.trainingExamples"),
        createdAt: "8/28/2024, 2:36:44 PM",
        rows: "750",
      },
    ],
    [t],
  );

  let displayData = defaultTableData.slice(0, numRows);

  if (hideButtons == false) {
    displayData.push({
      name: "",
      createdAt: "",
      rows: "",
    });
  }

  return (
    <div className="flex w-full flex-col rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="p-2">
        <div className="overflow-hidden rounded-lg border border-[hsl(var(--border))]">
          <Table className="table-auto border-collapse [&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg [&_tr:last-child_td]:border-b-0">
            <TableHeader>
              <TableRow>
                <TableHead className="text-md h-8 border-b border-r border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2 font-semibold text-[hsl(var(--foreground))]">
                  {t("visuals.datasets.name")}
                </TableHead>
                <TableHead className="text-md h-8 border-b border-r border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2 font-semibold text-[hsl(var(--foreground))]">
                  {t("visuals.datasets.createdAt")}
                </TableHead>
                <TableHead className="text-md h-8 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2 font-semibold text-[hsl(var(--foreground))]">
                  {t("visuals.datasets.rows")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="text-md h-8 border-r border-[hsl(var(--border))] p-2 px-4 font-light text-[hsl(var(--muted-foreground))]">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-md h-8 border-r border-[hsl(var(--border))] p-2 px-4 font-light text-[hsl(var(--muted-foreground))]">
                    {row.createdAt}
                  </TableCell>
                  <TableCell className="text-md h-8 p-2 px-4 font-light text-[hsl(var(--muted-foreground))]">
                    {row.rows}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[hsl(var(--background))] to-transparent" />
      </div>

      {!hideButtons && (
        <div className="z-10 -mt-6 h-full w-full px-2 pb-2">
          <div className="h-full w-full rounded-2xl bg-[hsl(var(--primary))] px-2 py-2">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="ghost"
                size="lg"
                className="pointer-events-none flex-1 basis-0 rounded-xl bg-[hsl(var(--primary))]/80 p-6 text-sm font-semibold text-[hsl(var(--primary-foreground))] md:text-lg"
              >
                <BeakerIcon className="mr-2 h-5 w-5 shrink-0" />
                {t("visuals.datasets.experiment")}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="pointer-events-none flex-1 basis-0 rounded-xl bg-[hsl(var(--primary))]/80 p-6 text-sm font-semibold text-[hsl(var(--primary-foreground))] md:text-lg"
              >
                <SparklesIcon className="mr-2 h-5 w-5 shrink-0" />
                {t("visuals.datasets.fineTune")}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="pointer-events-none flex-1 basis-0 rounded-xl bg-[hsl(var(--background))] p-6 text-sm font-semibold text-[hsl(var(--primary))] md:text-lg"
              >
                <DownloadIcon className="mr-2 h-5 w-5 shrink-0" />
                {t("export.export")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

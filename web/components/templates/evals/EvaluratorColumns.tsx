import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { AverageScoreChart } from "./charts/AverageScoreChart";
import { ScoreDistributionChart } from "./charts/ScoreDistributionChart";
import { ScoreDistributionChartPie } from "./charts/ScoreDistributionChartPie";
import { TracesChart } from "./charts/TracesChart";

export type EvalMetric = {
  name: string;
  type: string;
  valueType: string;
  averageScore: number;
  minScore: number;
  maxScore: number;
  count: number;
  overTime: { date: string; count: number }[];
  scoreDistribution: { lower: number; upper: number; value: number }[];
  averageOverTime: { date: string; value: number }[];
  id?: string;
};

export const getEvalColumns = (t: TFunction): ColumnDef<EvalMetric>[] => [
  {
    accessorKey: "name",
    header: t("ui.name"),
    cell: (info) => (
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {info.getValue()
          ? `${info.getValue()}`.replaceAll("-hcone-bool", " ")
          : t("ui.noEvalName")}
      </span>
    ),
    minSize: 50,
  },
  {
    accessorKey: "type",
    header: t("ui.type"),
    cell: (info) => (
      <Badge variant={"outline"}>{info.getValue() as string}</Badge>
    ),
    minSize: 50,
  },
  {
    accessorKey: "valueType",
    header: t("ui.value"),
    cell: (info) => (
      <Badge variant={"outline"}>{info.getValue() as string}</Badge>
    ),
    minSize: 100,
    size: 100,
  },
  {
    accessorKey: "overTime",
    header: t("ui.traces"),
    cell: (info) => (
      <TracesChart
        overTime={info.getValue() as { date: string; count: number }[]}
      />
    ),
    minSize: 200,
  },
  {
    accessorKey: "averageOverTime",
    header: t("ui.averageScore"),
    cell: (info) => (
      <AverageScoreChart
        averageOverTime={info.getValue() as { date: string; value: number }[]}
      />
    ),
    minSize: 200,
  },
  {
    accessorKey: "scoreDistribution",
    header: t("ui.scoreDistribution"),
    cell: (info) =>
      info.row.original.valueType !== "Boolean" ? (
        <ScoreDistributionChart
          distribution={
            info.getValue() as { lower: number; upper: number; value: number }[]
          }
        />
      ) : (
        <ScoreDistributionChartPie
          distribution={
            info.getValue() as { lower: number; upper: number; value: number }[]
          }
        />
      ),
    minSize: 100,
  },
  {
    accessorKey: "count",
    header: t("ui.count"),
    cell: (info) => <span>{Number(info.getValue()).toLocaleString()}</span>,
    meta: {
      sortKey: "count",
    },
  },
  {
    accessorKey: "averageScore",
    header: t("ui.averageScore"),
    cell: (info) => <span>{Number(info.getValue()).toFixed(2)}</span>,
    meta: {
      sortKey: "averageScore",
    },
  },
  {
    accessorKey: "minScore",
    header: t("ui.minScore"),
    cell: (info) => Number(info.getValue()).toLocaleString(),
    meta: {
      sortKey: "minScore",
    },
  },
  {
    accessorKey: "maxScore",
    header: t("ui.maxScore"),
    cell: (info) => Number(info.getValue()).toLocaleString(),
    meta: {
      sortKey: "maxScore",
    },
    minSize: 200,
  },
];

/** @deprecated Use getEvalColumns(t) instead */
export const INITIAL_COLUMNS: ColumnDef<EvalMetric>[] = [];

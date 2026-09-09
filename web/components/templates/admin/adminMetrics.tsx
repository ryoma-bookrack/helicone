import { useQuery } from "@tanstack/react-query";
import { BarChart } from "@tremor/react";
import { useTranslation } from "react-i18next";
import { getJawnClient } from "../../../lib/clients/jawn";
import { useLocalStorage } from "../../../services/hooks/localStorage";
import { useOrg } from "../../layout/org/organizationContext";
import { H1, H2 } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AdminStatsProps {}

const AdminMetrics = (props: AdminStatsProps) => {
  const {} = props;
  const { t } = useTranslation("admin");
  const org = useOrg();
  const timeFilters = [
    "1 days",
    "7 days",
    "1 month",
    "3 months",
    "6 months",
    "12 months",
    "24 months",
  ] as const;
  const groupBys = ["hour", "day", "week", "month"] as const;

  const [timeFilter, setTimeFilter] = useLocalStorage<
    (typeof timeFilters)[number]
  >("admin-metrics-time-filter", "24 months");
  const [groupBy, setGroupBy] = useLocalStorage<(typeof groupBys)[number]>(
    "admin-metrics-group-by",
    "month",
  );

  const timeFilterLabels = {
    "1days": t("metrics.timeFilters.1days"),
    "7days": t("metrics.timeFilters.7days"),
    "1month": t("metrics.timeFilters.1month"),
    "3months": t("metrics.timeFilters.3months"),
    "6months": t("metrics.timeFilters.6months"),
    "12months": t("metrics.timeFilters.12months"),
    "24months": t("metrics.timeFilters.24months"),
  };

  const metricsOverTime = useQuery({
    queryKey: ["newOrgsOverTime", org?.currentOrg?.id, timeFilter, groupBy],
    queryFn: async (query) => {
      const jawn = getJawnClient(query.queryKey[1]);
      const timeFilter = query.queryKey[2];
      const groupBy = query.queryKey[3];
      const { data } = await jawn.POST(`/v1/admin/orgs/over-time/query`, {
        method: "POST",
        body: {
          timeFilter: timeFilter as any,
          groupBy: groupBy as any,
        },
      });
      return data;
    },
  });
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <H1>{t("metrics.title")}</H1>

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex flex-1 flex-col gap-2 md:max-w-xs">
          <Label className="font-semibold">{t("common.timeFilter")}</Label>
          <Select
            value={timeFilter}
            onValueChange={(value) => setTimeFilter(value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeFilters.map((filter) => (
                <SelectItem value={filter} key={filter}>
                  {timeFilterLabels[
                    filter.replace(" ", "") as keyof typeof timeFilterLabels
                  ] ?? filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-1 flex-col gap-2 md:max-w-xs">
          <Label className="font-semibold">{t("common.groupBy")}</Label>
          <Select
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groupBys.map((group) => (
                <SelectItem value={group} key={group}>
                  {t(`metrics.groupByOptions.${group}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex max-w-6xl flex-col gap-6">
        <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <H2>{t("metrics.orgsOverTime")}</H2>
          <BarChart
            data={
              metricsOverTime.data?.newOrgsOvertime.map((ot) => ({
                day: ot.day,
                count: +ot.count,
              })) ?? []
            }
            categories={["count"]}
            index={"day"}
            showYAxis={true}
          />
        </div>

        <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <H2>
            {t("common.newUsersPerGroup", { groupBy, timeFilter })}
          </H2>
          <BarChart
            data={
              metricsOverTime.data?.newUsersOvertime.map((ot) => ({
                day: ot.day,
                count: +ot.count,
              })) ?? []
            }
            categories={["count"]}
            index={"day"}
            showYAxis={true}
          />
        </div>

        <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <H2>{t("metrics.usersOverTime")}</H2>
          <BarChart
            data={
              metricsOverTime.data?.usersOverTime.map((ot) => ({
                day: ot.day,
                count: +ot.count,
              })) ?? []
            }
            categories={["count"]}
            index={"day"}
            showYAxis={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMetrics;

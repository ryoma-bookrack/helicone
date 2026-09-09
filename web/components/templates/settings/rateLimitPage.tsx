import { useState } from "react";
import { useOrgPlanPage } from "@/services/hooks/useOrgPlanPage";
import {
  addMonths,
  endOfMonth,
  formatISO,
  isAfter,
  startOfMonth,
  subMonths,
} from "date-fns";
import { BarChart } from "@tremor/react";
import { getTimeMap } from "../../../lib/timeCalculations/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useNotification from "../../shared/notification/useNotification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trans, useTranslation } from "react-i18next";
import { useLocaleFormat } from "@/hooks/useLocaleFormat";

const RateLimitPage = () => {
  const { t } = useTranslation("settings");
  const { formatDate } = useLocaleFormat();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const timeIncrement = "day";

  const startOfMonthFormatted = formatISO(currentMonth, {
    representation: "date",
  });

  const {
    overTimeData,
    metrics,
    refetch: refetchData,
    isLoading,
  } = useOrgPlanPage({
    timeFilter: {
      start: currentMonth,
      end: endOfMonth(currentMonth),
    },
    timeZoneDifference: 0,
    dbIncrement: timeIncrement,
  });

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => startOfMonth(addMonths(prevMonth, 1)));
  };

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => startOfMonth(subMonths(prevMonth, 1)));
  };

  const isNextMonthDisabled = isAfter(addMonths(currentMonth, 1), new Date());
  const { setNotification } = useNotification();

  return (
    <div className="container mx-auto space-y-8 py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-3xl font-bold">
              {formatDate(currentMonth, { month: "long" })}
            </CardTitle>
            {!isNextMonthDisabled && (
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-semibold">{t("rateLimits.neverDropped")}</p>
          <p className="text-muted-foreground">
            <Trans
              i18nKey="rateLimits.summary"
              ns="settings"
              components={{ strong: <span className="font-semibold" /> }}
            />{" "}
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={() => {
                navigator.clipboard.writeText("sales@helicone.ai");
                setNotification(t("rateLimits.emailCopied"), "success");
              }}
            >
              sales@helicone.ai
            </Button>
            .
          </p>
        </CardContent>
      </Card>

      {!isLoading && metrics.totalRateLimits.data && (
        <Card>
          <CardHeader>
            <CardTitle>{t("rateLimits.chartTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-[14rem]"
              data={
                overTimeData.rateLimits.data?.data?.map((r) => ({
                  date: getTimeMap(timeIncrement)(r.time),
                  [t("rateLimits.chartCategory")]: r.count,
                })) ?? []
              }
              index="date"
              categories={[t("rateLimits.chartCategory")]}
              colors={["cyan"]}
              showYAxis={false}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("rateLimits.tiersTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("rateLimits.tierColumn")}</TableHead>
                <TableHead>{t("rateLimits.rateLimitsColumn")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{t("rateLimits.freeTier")}</TableCell>
                <TableCell>{t("rateLimits.freeLimit")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("rateLimits.proTier")}</TableCell>
                <TableCell>{t("rateLimits.proLimit")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("rateLimits.enterpriseTier")}</TableCell>
                <TableCell>{t("rateLimits.enterpriseLimit")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateLimitPage;

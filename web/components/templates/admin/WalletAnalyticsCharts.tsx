import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { H3, Muted, Small } from "@/components/ui/typography";
import { formatCurrency as remoteFormatCurrency } from "@/lib/uiUtils";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "$0.00";
  return remoteFormatCurrency(amount, "USD", 2);
};

interface TimeSeriesDataPoint {
  timestamp: string;
  amount: number;
}

interface WalletAnalyticsChartsProps {
  deposits: TimeSeriesDataPoint[];
  spend: TimeSeriesDataPoint[];
  isLoading?: boolean;
  error?: string | null;
}

export function WalletAnalyticsCharts({
  deposits,
  spend,
  isLoading = false,
  error = null,
}: WalletAnalyticsChartsProps) {
  const { t } = useTranslation("admin");

  const depositsChartConfig = {
    amount: {
      label: t("walletAnalytics.depositsLabel"),
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const spendChartConfig = {
    amount: {
      label: t("walletAnalytics.spendLabel"),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const depositsData = deposits.map((d) => ({
    date: new Date(d.timestamp).getTime(),
    dateLabel: format(new Date(d.timestamp), "MMM d, ha"),
    amount: d.amount,
  }));

  const spendData = spend.map((d) => ({
    date: new Date(d.timestamp).getTime(),
    dateLabel: format(new Date(d.timestamp), "MMM d, ha"),
    amount: d.amount,
  }));

  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
  const totalSpend = spend.reduce((sum, d) => sum + d.amount, 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <H3>{t("walletAnalytics.depositsOverTime")}</H3>
          </CardHeader>
          <CardContent>
            <div className="flex h-[220px] items-center justify-center">
              <Loader2
                size={24}
                className="animate-spin text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <H3>{t("walletAnalytics.spendOverTime")}</H3>
          </CardHeader>
          <CardContent>
            <div className="flex h-[220px] items-center justify-center">
              <Loader2
                size={24}
                className="animate-spin text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <H3>{t("walletAnalytics.depositsOverTime")}</H3>
          </CardHeader>
          <CardContent>
            <div className="flex h-[220px] items-center justify-center">
              <Small className="text-red-600">{error}</Small>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <H3>{t("walletAnalytics.spendOverTime")}</H3>
          </CardHeader>
          <CardContent>
            <div className="flex h-[220px] items-center justify-center">
              <Small className="text-red-600">{error}</Small>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <H3>{t("walletAnalytics.depositsOverTime")}</H3>
            <div className="flex flex-col items-end">
              <Muted>{t("common.total")}</Muted>
              <span className="text-lg font-semibold">
                {formatCurrency(totalDeposits)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {depositsData.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center">
              <Small className="text-muted-foreground">
                {t("walletAnalytics.noDepositData")}
              </Small>
            </div>
          ) : (
            <ChartContainer
              config={depositsChartConfig}
              className="h-[220px] w-full"
            >
              <LineChart
                data={depositsData}
                margin={{ top: 5, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(timestamp) =>
                    format(new Date(timestamp), "MMM d")
                  }
                  scale="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={50}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.dateLabel || ""
                      }
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <H3>{t("walletAnalytics.spendOverTimeClickhouse")}</H3>
            <div className="flex flex-col items-end">
              <Muted>{t("common.total")}</Muted>
              <span className="text-lg font-semibold">
                {formatCurrency(totalSpend)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {spendData.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center">
              <Small className="text-muted-foreground">
                {t("walletAnalytics.noSpendData")}
              </Small>
            </div>
          ) : (
            <ChartContainer
              config={spendChartConfig}
              className="h-[220px] w-full"
            >
              <LineChart
                data={spendData}
                margin={{ top: 5, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(timestamp) =>
                    format(new Date(timestamp), "MMM d")
                  }
                  scale="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={50}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.dateLabel || ""
                      }
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

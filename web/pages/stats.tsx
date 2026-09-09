import { useQuery } from "@tanstack/react-query";
import BasePageV2 from "../components/layout/basePageV2";
import MetaData from "../components/layout/public/authMetaData";
import { BarChart } from "@tremor/react";
import { Result } from "@/packages/common/result";
import { HeliconeStats } from "./api/stats";
import { getTimeMap } from "../lib/timeCalculations/constants";
import { useTranslation } from "react-i18next";

interface HomeProps {}

const Home = (props: HomeProps) => {
  const {} = props;
  const { t } = useTranslation(["marketing", "common"]);
  const { isLoading, data } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const response = await fetch("/api/stats", {
        next: { revalidate: 1000 },
      });
      return (await response.json()) as Result<HeliconeStats, string>;
    },
  });

  const activeOrgMonth =
    data?.data?.monthlyActiveUsers
      .map((v) => ({
        time_step: new Date(v.time_step),
        user_count_step: +v.user_count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.user_count_step,
      })) ?? [];

  const activeOrgWeek =
    data?.data?.weeklyActiveUsers
      .map((v) => ({
        time_step: new Date(v.time_step),
        user_count_step: +v.user_count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.user_count_step,
      })) ?? [];

  const activeOrgDay =
    data?.data?.dailyActiveUsers
      .map((v) => ({
        time_step: new Date(v.time_step),
        user_count_step: +v.user_count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.user_count_step,
      })) ?? [];

  const totalUsers =
    data?.data?.integratedUsers
      .map((v) => ({
        time_step: new Date(v.time_step),
        count_step: +v.count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.count_step,
      })) ?? [];

  const userGrowthPerMonth =
    data?.data?.growthPerMonth
      .map((v) => ({
        time_step: new Date(v.time_step),
        count_step: +v.count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(
          new Date(
            v.time_step.getTime() +
              new Date(v.time_step).getDate() * 24 * 60 * 60 * 1000,
          ),
        ),
        value: v.count_step,
      })) ?? [];

  const userGrowthPerWeek =
    data?.data?.growthPerWeek
      .map((v) => ({
        time_step: new Date(v.time_step),
        count_step: +v.count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.count_step,
      })) ?? [];

  const userGrowthPerDay =
    data?.data?.growthOverTime
      .map((v) => ({
        time_step: new Date(v.time_step),
        count_step: +v.count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.count_step,
      })) ?? [];

  const weeklyActiveUsers =
    data?.data?.weeklyActiveUsers
      .map((v) => ({
        time_step: new Date(v.time_step),
        request_count_step: +v.request_count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.request_count_step,
      })) ?? [];

  const dailyActiveUsers =
    data?.data?.dailyActiveUsers
      .map((v) => ({
        time_step: new Date(v.time_step),
        request_count_step: +v.request_count_step,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.request_count_step,
      })) ?? [];

  const monthlyRetentionRate =
    data?.data?.monthlyRetentionRate
      .map((v) => ({
        time_step: new Date(v.time_step),
        rate: +v.rate,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(
          new Date(
            v.time_step.getTime() +
              new Date(v.time_step).getDate() * 24 * 60 * 60 * 1000,
          ),
        ),
        value: v.rate,
      })) ?? [];

  const weeklyRetentionRate =
    data?.data?.weeklyRetentionRate
      .map((v) => ({
        time_step: new Date(v.time_step),
        rate: +v.rate,
      }))
      .sort((a, b) => a.time_step.getTime() - b.time_step.getTime())
      .map((v) => ({
        time: getTimeMap("day")(new Date(v.time_step)),
        value: v.rate,
      })) ?? [];

  return (
    <MetaData title={t("marketing:stats.metaTitle")}>
      <BasePageV2>
        {isLoading ? (
          <div>{t("common:actions.loading")}</div>
        ) : (
          <div className="mx-auto w-full max-w-3xl">
            <h1 className="text-center text-3xl font-bold">
              {t("marketing:stats.activeOrgsMonth")}
            </h1>
            <div className="h-96">
              <BarChart
                data={activeOrgMonth}
                categories={["value"]}
                index={"time"}
              />
            </div>
            <h1 className="text-center text-3xl font-bold">
              {t("marketing:stats.activeOrgsWeek")}
            </h1>
            <div className="h-96">
              <BarChart
                data={activeOrgWeek}
                categories={["value"]}
                index={"time"}
              />
            </div>
            <h1 className="text-center text-3xl font-bold">
              {t("marketing:stats.activeOrgsDay")}
            </h1>
            <div className="h-96">
              <BarChart
                data={activeOrgDay}
                categories={["value"]}
                index={"time"}
              />
            </div>
            <h1 className="text-center text-3xl font-bold">
              {t("marketing:stats.totalUsers")}
            </h1>
            <div className="h-96">
              <BarChart
                data={totalUsers}
                categories={["value"]}
                index={"time"}
              />
            </div>
            <h1 className="text-center text-3xl font-bold">
              {t("marketing:stats.userGrowthMonth")}
            </h1>
            <div className="h-96">
              <BarChart
                data={userGrowthPerMonth}
                categories={["value"]}
                index={"time"}
              />
              <h1 className="text-center text-3xl font-bold">
                {t("marketing:stats.userGrowthWeek")}
              </h1>
              <div className="h-96">
                <BarChart
                  data={userGrowthPerWeek}
                  categories={["value"]}
                  index={"time"}
                />
              </div>

              <h1 className="text-center text-3xl font-bold">
                {t("marketing:stats.userGrowthDay")}
              </h1>
              <div className="h-96">
                <BarChart
                  data={userGrowthPerDay}
                  categories={["value"]}
                  index={"time"}
                />
              </div>

              <h1 className="text-center text-3xl font-bold">
                {t("marketing:stats.requestsWeekOverWeek")}
              </h1>
              <div className="h-96">
                <BarChart
                  data={weeklyActiveUsers}
                  categories={["value"]}
                  index={"time"}
                />
              </div>
              <h1 className="text-center text-3xl font-bold">
                {t("marketing:stats.requestsDayByDay")}
              </h1>
              <div className="h-96">
                <BarChart
                  data={dailyActiveUsers}
                  categories={["value"]}
                  index={"time"}
                />
              </div>
              <h1 className="text-center text-3xl font-bold">
                {t("marketing:stats.monthlyRetentionRate")}
              </h1>
              <div className="h-96">
                <BarChart
                  data={monthlyRetentionRate}
                  categories={["value"]}
                  index={"time"}
                />
              </div>

              <h1 className="text-center text-3xl font-bold">
                {t("marketing:stats.weeklyRetentionRate")}
              </h1>
              <div className="h-96">
                <BarChart
                  data={weeklyRetentionRate}
                  categories={["value"]}
                  index={"time"}
                />
              </div>
            </div>
          </div>
        )}
      </BasePageV2>
    </MetaData>
  );
};

export default Home;

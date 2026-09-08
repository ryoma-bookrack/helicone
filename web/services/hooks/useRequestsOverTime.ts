import { useQuery } from "@tanstack/react-query";
import { getTimeInterval } from "@/lib/timeCalculations/time";
import { filterListToTree } from "@helicone-package/filters/helpers";
import { $JAWN_API } from "@/lib/clients/jawn";

export const useRequestsOverTime = (props: {
  timeFilter: {
    start: Date;
    end: Date;
  };
  organizationId?: string;
}) => {
  const { timeFilter } = props;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["requestOverTime", props.organizationId, timeFilter],
    queryFn: async (query) => {
      const timeFilter = query.queryKey[2] as {
        start: Date;
        end: Date;
      };

      const timeIncrement = getTimeInterval(timeFilter);

      const response = await $JAWN_API.POST("/v1/metrics/requestOverTime", {
        body: {
          timeFilter: {
            start: timeFilter.start.toISOString(),
            end: timeFilter.end.toISOString(),
          },
          filter: filterListToTree([], "and") as any,
          dbIncrement: timeIncrement,
          timeZoneDifference: new Date().getTimezoneOffset(),
        },
      });

      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60_000,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};

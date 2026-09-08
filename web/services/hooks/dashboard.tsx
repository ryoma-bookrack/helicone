import { useOrg } from "@/components/layout/org/organizationContext";
import { getJawnClient } from "@/lib/clients/jawn";
import { useQuery } from "@tanstack/react-query";

/** Self-hosted: no monthly request tier limits. */
const useGetUnauthorized = (_userId: string) => {
  const org = useOrg();

  return {
    unauthorized: false,
    isLoading: false,
    currentTier: org?.currentOrg?.tier,
  };
};

const useGetReport = () => {
  return useQuery({
    queryKey: [`reports`],
    queryFn: async () => {
      const jawnClient = getJawnClient();
      const response = await jawnClient.GET("/v1/integration/type/{type}", {
        params: {
          path: {
            type: "report",
          },
        },
      });
      return response.data?.data;
    },
  });
};

export { useGetReport, useGetUnauthorized };

import { FilterExpression } from "@helicone-package/filters/types";
import { toFilterNode } from "@helicone-package/filters/toFilterNode";
import { FilterNode } from "@helicone-package/filters/filterDefs";
import { getJawnServiceUrl } from "@/lib/jawnUrl";

function getApiBaseUrl(): string {
  return getJawnServiceUrl();
}

/**
 * Generates a cURL command for the current filter configuration
 */
export function generateCurlCommand(
  filter: FilterExpression | null,
  timeFilter?: FilterNode,
): string {
  const baseUrl = getApiBaseUrl();

  let filterNode: FilterNode = {} as FilterNode;

  if (filter) {
    filterNode = toFilterNode(filter);
  }

  let combinedFilter: FilterNode = filterNode;
  if (timeFilter && Object.keys(timeFilter).length > 0) {
    if (Object.keys(filterNode).length > 0) {
      combinedFilter = {
        left: timeFilter,
        operator: "and",
        right: filterNode,
      };
    } else {
      combinedFilter = timeFilter;
    }
  }

  const requestBody = {
    filter: combinedFilter,
    limit: 100,
  };

  const curlCommand = `curl --request POST \\
  --url ${baseUrl}/v1/request/query-clickhouse \\
  --header "Content-Type: application/json" \\
  --header "authorization: Bearer $HELICONE_API_KEY" \\
  --data '${JSON.stringify(requestBody, null, 2)}'`;

  return curlCommand;
}

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  BuildingStorefrontIcon,
  ChartPieIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Database } from "../../../../db/database.types";
import usePortalPage from "../../../../services/hooks/enterprise/portal/usePortalPage";
import ThemedDrawer from "../../../shared/themed/themedDrawer";
import CreateOrgForm from "../../organization/createOrgForm";
import CustomerRow from "./customerRow";

interface PortalPageProps {}

type OrgRow = Database["public"]["Tables"]["organization"]["Row"];

const PortalPage = (props: PortalPageProps) => {
  const {} = props;
  const { t } = useTranslation("enterprise");

  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);

  const { data, isLoading, refetch } = usePortalPage();

  const orgs = ((data?.data as { data?: OrgRow[] } | undefined)?.data ??
    []) as OrgRow[];

  const filteredData = orgs.filter((org) => {
    if (currentSearch === null) {
      return true;
    }

    return org.name.toLowerCase().includes(currentSearch.toLowerCase());
  });

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            {t("portal.title")}
          </h1>
        </div>
        <Tabs defaultValue="customers">
          <TabsList>
            <TabsTrigger value="customers">{t("portal.tabs.customers")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("portal.tabs.analytics")}</TabsTrigger>
            <TabsTrigger value="branding">{t("portal.tabs.branding")}</TabsTrigger>
          </TabsList>
          <TabsContent value="customers">
            <div className="mt-8 flex flex-col">
              <div className="mb-4 flex flex-row items-center justify-between">
                <div className="max-w-sm">
                  <Input
                    type="search"
                    placeholder={t("portal.searchPlaceholder")}
                    onChange={(e) => {
                      const search = e.target.value as string;
                      setCurrentSearch(search);
                      refetch();
                    }}
                  />
                </div>
                <div className="flex flex-row items-center space-x-2">
                  <button
                    onClick={() => {
                      setAddCustomerModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-black px-2.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    <PlusIcon className="h-4 w-4" />
                    {t("portal.addCustomer")}
                  </button>
                </div>
              </div>
              {orgs.length === 0 ? (
                <div className="flex h-96 w-full flex-col items-center justify-center">
                  <div className="flex w-2/5 flex-col">
                    <UserGroupIcon className="h-12 w-12 rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-700 dark:bg-black dark:text-gray-100" />
                    <p className="mt-8 text-xl font-semibold text-black dark:text-white">
                      {t("portal.empty.title")}
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                      {t("portal.empty.description")}
                    </p>
                    <div className="mt-2 flex flex-row items-center justify-between">
                      <a
                        href="mailto:engineering@helicone.ai"
                        className="flex items-center space-x-1 text-xs font-semibold text-blue-500 underline"
                      >
                        {t("portal.empty.contactSupport")}
                        <ArrowRightIcon className="inline h-3 w-3" />
                      </a>
                    </div>
                    <div className="mt-8 flex flex-row items-center justify-between">
                      <button
                        onClick={() => {
                          setAddCustomerModalOpen(true);
                        }}
                        className="flex items-center rounded-md bg-black px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        <PlusIcon className="mr-2 h-5 w-5" />
                        {t("portal.addCustomer")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col space-y-4">
                  <Card>
                    <CardContent className="px-4 py-2">
                      <Table>
                        <TableHeader className="border-b border-gray-300 dark:border-gray-700">
                          <TableRow>
                            <TableHead className="w-8"></TableHead>
                            <TableHead>{t("portal.columns.name")}</TableHead>
                            <TableHead>{t("portal.columns.createdAt")}</TableHead>
                            <TableHead>{t("portal.columns.status")}</TableHead>
                            <TableHead>{t("portal.columns.members")}</TableHead>
                            <TableHead>{t("portal.columns.requests30Days")}</TableHead>
                            <TableHead />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData?.map((org, index) => (
                            <CustomerRow
                              org={org}
                              key={org.id}
                              refetchCustomerOrgs={refetch}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="flex h-96 w-full flex-col items-center justify-center">
              <div className="flex w-2/5 flex-col">
                <ChartPieIcon className="h-12 w-12 rounded-lg border border-gray-300 bg-white p-2 text-black dark:border-gray-700 dark:bg-black dark:text-white" />
                <p className="mt-8 text-xl font-semibold text-black dark:text-white">
                  {t("portal.analytics.title")}
                </p>
                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  {t("portal.analytics.description")}
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="branding">
            <div className="flex h-96 w-full flex-col items-center justify-center">
              <div className="flex w-2/5 flex-col">
                <BuildingStorefrontIcon className="h-12 w-12 rounded-lg border border-gray-300 bg-white p-2 text-black dark:border-gray-700 dark:bg-black dark:text-white" />
                <p className="mt-8 text-xl font-semibold text-black dark:text-white">
                  {t("portal.branding.title")}
                </p>
                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  {t("portal.branding.description")}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <ThemedDrawer
        open={addCustomerModalOpen}
        setOpen={setAddCustomerModalOpen}
      >
        <div className="flex flex-col space-y-4">
          <p className="border-b border-gray-300 py-4 text-2xl font-semibold text-black dark:border-gray-700 dark:text-white">
            {t("portal.addNewCustomer")}
          </p>
          <CreateOrgForm
            variant="reseller"
            onSuccess={() => {
              setAddCustomerModalOpen(false);
              refetch();
            }}
          />
        </div>
      </ThemedDrawer>
    </>
  );
};

export default PortalPage;

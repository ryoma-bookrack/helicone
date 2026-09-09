import { Button } from "@/components/ui/button";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TextInput } from "@tremor/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getJawnClient } from "../../../../lib/clients/jawn";
import useNotification from "../../../shared/notification/useNotification";

interface OrgMemberProps {}

const OrgMember = (props: OrgMemberProps) => {
  const {} = props;
  const { t } = useTranslation("admin");
  const { setNotification } = useNotification();

  const {
    mutate: findOrgs,
    isPending: isFindingOrgs,
    data: orgs,
  } = useMutation({
    mutationKey: ["searchOrgId"],
    mutationFn: async (orgName: string) => {
      const jawn = getJawnClient();
      const orgs = await jawn.POST("/v1/admin/orgs/query", {
        body: {
          orgName,
        },
      });

      return orgs;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const jawn = getJawnClient();
      return jawn.GET("/v1/admin/admins/query");
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: addAdminToOrg, isPending: isAddingAdminToOrg } = useMutation({
    mutationKey: ["addAdminToOrg"],
    mutationFn: async ({
      orgId,
      adminIds,
    }: {
      orgId: string;
      adminIds: string[];
    }) => {
      const jawn = getJawnClient();
      const { data, error } = await jawn.POST("/v1/admin/admins/org/query", {
        body: {
          orgId,
          adminIds,
        },
      });
      if (error) {
        setNotification(t("panels.orgMember.addAdminsFailed"), "error");
      } else {
        setNotification(t("panels.orgMember.addAdminsSuccess"), "success");
      }
    },
  });

  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [adminIds, setAdminIds] = useState<string[]>();

  return (
    <>
      <h2 className="text-lg font-semibold text-white">
        {t("panels.orgMember.title")}
      </h2>
      <div className="flex flex-col space-y-2">
        <p className="text-sm">{t("panels.orgMember.lookupByName")}</p>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <TextInput
              placeholder={t("common.organizationName")}
              value={orgName}
              onValueChange={setOrgName}
            />
          </div>
          <div className="col-span-1">
            <Button
              size={"xs"}
              onClick={async () => {
                if (!orgName) {
                  setNotification(
                    t("panels.orgMember.orgNameRequired"),
                    "error",
                  );
                  return;
                }
                findOrgs(orgName);
              }}
              disabled={isFindingOrgs}
            >
              {t("panels.orgMember.searchForOrgId")}
            </Button>
          </div>
        </div>
        <ul>
          {orgs?.data?.orgs.map((org) => (
            <li key={org.id} className="flex items-center space-x-1 py-1">
              <span className="text-sm font-semibold text-white">
                {org.name}
              </span>
              <span>-</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(org.id);
                  setNotification(t("common.copiedToClipboard"), "success");
                }}
                className="flex items-center text-sm text-white underline"
              >
                {org.id} <ClipboardIcon className="ml-1 h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col space-y-2 border-t-2 border-gray-300 pt-4">
        <p className="text-sm">{t("panels.orgMember.addAdminById")}</p>
        <div className="w-1/2">
          <TextInput
            placeholder={t("common.organizationId")}
            value={orgId}
            onValueChange={setOrgId}
          />
        </div>
        <ul className="pt-4">
          <p className="text-sm">{t("panels.orgMember.admins")}</p>
          {data?.data?.map((admin, index) => (
            <li key={index} className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                checked={adminIds?.includes(admin.user_id ?? "")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAdminIds((prev) => [
                      ...(prev ?? []),
                      admin.user_id ?? "",
                    ]);
                  } else {
                    setAdminIds((prev) =>
                      prev?.filter((id) => id !== admin.user_id),
                    );
                  }
                }}
              />
              <span>{admin.user_email}</span>
            </li>
          ))}
        </ul>

        <div className="">
          <Button
            size={"xs"}
            onClick={async () => {
              if (!orgId) {
                setNotification(t("panels.orgMember.orgIdRequired"), "error");
                return;
              }
              if (!adminIds) {
                setNotification(t("panels.orgMember.adminsRequired"), "error");
                return;
              }
              addAdminToOrg({ orgId, adminIds });
            }}
          >
            {t("panels.orgMember.addAdminsToOrg")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default OrgMember;

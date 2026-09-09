"use client";

import { useTranslation } from "react-i18next";

interface AdminPageProps {}

const AdminPage = (props: AdminPageProps) => {
  const {} = props;
  const { t } = useTranslation("admin");

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-semibold">{t("page.title")}</h1>
      <div className="flex max-w-4xl flex-col space-y-4">
        <p className="text-muted-foreground">{t("page.welcome")}</p>
      </div>
    </div>
  );
};

export default AdminPage;

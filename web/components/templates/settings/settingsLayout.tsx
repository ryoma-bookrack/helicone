import { useOrg } from "@/components/layout/org/organizationContext";
import { cn } from "@/lib/utils";
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  NoSymbolIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { KeyIcon, LinkIcon, Plug, Webhook, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import AuthHeader from "@/components/shared/authHeader";

const useOrganizationTabs = () => {
  const { t } = useTranslation("nav");
  return [
    {
      id: "general",
      title: t("settings.general"),
      icon: BuildingOfficeIcon,
      href: "/settings",
    },
    {
      id: "members",
      title: t("settings.members"),
      icon: UsersIcon,
      href: "/settings/members",
    },
    {
      id: "reports",
      title: t("settings.reports"),
      icon: DocumentTextIcon,
      href: "/settings/reports",
    },
    {
      id: "rate-limits",
      title: t("settings.rateLimits"),
      icon: NoSymbolIcon,
      href: "/settings/rate-limits",
    },
  ];
};

const useDeveloperTabs = () => {
  const { t } = useTranslation("nav");
  return [
    {
      id: "api-keys",
      title: t("settings.apiKeys"),
      icon: KeyIcon,
      href: "/settings/api-keys",
    },
    {
      id: "providers",
      title: t("settings.providers"),
      icon: Plug,
      href: "/settings/providers",
    },
    {
      id: "webhooks",
      title: t("settings.webhooks"),
      icon: Webhook,
      href: "/settings/webhooks",
    },
    {
      id: "connections",
      title: t("settings.connections"),
      icon: LinkIcon,
      href: "/settings/connections",
    },
  ];
};

const useAccountsTabs = () => {
  const { t } = useTranslation("nav");
  return [
    {
      id: "password",
      title: t("settings.password"),
      icon: Lock,
      href: "/settings/password",
    },
  ];
};

interface SettingsLayoutProps {
  children: ReactNode;
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const org = useOrg();
  const isBetterAuthEnabled = process.env.NEXT_PUBLIC_BETTER_AUTH === "true";
  const { t } = useTranslation("nav");

  const organizationTabs = useOrganizationTabs();
  const developerTabs = useDeveloperTabs();
  const accountsTabs = useAccountsTabs();

  const renderNavSection = (
    title: string,
    tabs: ReturnType<typeof useOrganizationTabs>,
  ) => (
    <div className="space-y-2">
      <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const isActive =
            currentPath === tab.href ||
            (tab.href === "/settings" && currentPath === "/settings");

          return (
            <Link key={tab.id} href={tab.href}>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
                  "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300",
                )}
              >
                <tab.icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-slate-500 dark:text-slate-400",
                  )}
                />
                <span className="flex items-center gap-1.5">{tab.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <AuthHeader isWithinIsland={true} title={""} />
      {org?.currentOrg?.tier !== "demo" && (
        <div className="-mt-6 flex h-full min-h-screen">
          {/* Settings Sidebar */}
          <div className="w-48 border-r border-slate-200 bg-slate-50/50 px-2 py-2 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="space-y-8">
              {renderNavSection(t("settings.organization"), organizationTabs)}
              {renderNavSection(t("settings.developer"), developerTabs)}
              {isBetterAuthEnabled &&
                renderNavSection(t("settings.accounts"), accountsTabs)}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      )}
    </>
  );
};

export default SettingsLayout;

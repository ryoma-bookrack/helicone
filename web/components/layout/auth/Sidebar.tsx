/* eslint-disable @next/next/no-img-element */
import {
  ArchiveIcon,
  DatabaseIcon,
  Home,
  ListTreeIcon,
  ScrollTextIcon,
  SheetIcon,
  ShieldCheckIcon,
  TagIcon,
  TestTube2,
  TriangleAlertIcon,
  UsersIcon,
  Code2Icon,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import DesktopSidebar from "./DesktopSidebar";
import { ChangelogItem, NavigationItem } from "./types";

interface SidebarProps {
  changelog: ChangelogItem[];
  sidebarRef: React.RefObject<HTMLDivElement>;
}

const Sidebar = ({ changelog, sidebarRef }: SidebarProps) => {
  const router = useRouter();
  const { pathname } = router;
  const { t } = useTranslation("nav");

  const NAVIGATION: NavigationItem[] = useMemo(
    () => [
      {
        name: t("dashboard"),
        href: "/dashboard",
        icon: Home,
        current: pathname.includes("/dashboard"),
      },
      {
        name: t("requests"),
        href: "/requests",
        icon: SheetIcon,
        current: pathname.includes("/requests"),
      },
      {
        name: t("segments"),
        href: "/segments",
        icon: null,
        current: false,
        subItems: [
          {
            name: t("sessions"),
            href: "/sessions",
            icon: ListTreeIcon,
            current: pathname.includes("/sessions"),
          },
          {
            name: t("properties"),
            href: "/properties",
            icon: TagIcon,
            current: pathname.includes("/properties"),
          },
          {
            name: t("users"),
            href: "/users",
            icon: UsersIcon,
            current: pathname.includes("/users"),
          },
          {
            name: t("cache"),
            href: "/cache",
            icon: ArchiveIcon,
            current: pathname.includes("/cache"),
          },
          {
            name: t("hql"),
            href: "/hql",
            icon: Code2Icon,
            current: pathname.includes("/hql"),
          },
        ],
      },
      {
        name: t("improve"),
        href: "/improve",
        icon: null,
        current: false,
        subItems: [
          {
            name: t("prompts"),
            href: "/prompts",
            icon: ScrollTextIcon,
            current: pathname.includes("/prompts"),
          },
          {
            name: t("datasets"),
            href: "/datasets",
            icon: DatabaseIcon,
            current: pathname.includes("/datasets"),
          },
          {
            name: t("playground"),
            href: "/playground",
            icon: TestTube2,
            current: pathname.includes("/playground"),
          },
        ],
      },
      {
        name: t("monitor"),
        href: "/monitor",
        icon: null,
        current: false,
        subItems: [
          {
            name: t("rateLimits"),
            href: "/rate-limit",
            icon: ShieldCheckIcon,
            current: pathname === "/rate-limit",
          },
          {
            name: t("alerts"),
            href: "/alerts",
            icon: TriangleAlertIcon,
            current: pathname.includes("/alerts"),
          },
        ],
      },
    ],
    [pathname, t],
  );

  return (
    <DesktopSidebar
      sidebarRef={sidebarRef}
      changelog={changelog}
      NAVIGATION={NAVIGATION}
    />
  );
};

export default Sidebar;

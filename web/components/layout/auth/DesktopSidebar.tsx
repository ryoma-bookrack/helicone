import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/services/hooks/localStorage";
import { OnboardingState } from "@/services/hooks/useOrgOnboarding";
import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Rocket, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOrg } from "../org/organizationContext";
import OrgDropdown from "../orgDropdown";
import NavItem from "./NavItem";
import { ChangelogItem } from "./types";
import SidebarQuickstepCard from "../SidebarQuickstartCard";

// Sidebar width constants
const SIDEBAR_WIDTH_COLLAPSED = "w-12"; // 48px
const SIDEBAR_WIDTH_EXPANDED = "w-52"; // 208px

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  current: boolean;
  featured?: boolean;
  subItems?: NavigationItem[];
}

interface SidebarProps {
  NAVIGATION: NavigationItem[];
  changelog: ChangelogItem[];
  sidebarRef: React.RefObject<HTMLDivElement>;
}

const DesktopSidebar = ({
  NAVIGATION,
  sidebarRef,
}: SidebarProps) => {
  const orgContext = useOrg();
  const router = useRouter();
  const onboardingStatus = orgContext?.currentOrg
    ?.onboarding_status as unknown as OnboardingState;

  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "isSideBarCollapsed",
    false,
  );

  const [expandedItems, setExpandedItems] = useLocalStorage<string[]>(
    "expandedItems",
    ["Developer", "Segments", "Improve", "Monitor"],
  );

  const toggleExpand = (name: string) => {
    const prev = expandedItems || [];
    setExpandedItems(
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };
  const largeWith = useMemo(
    () => cn(isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED),
    [isCollapsed],
  );

  const NAVIGATION_ITEMS = useMemo(() => {
    if (isCollapsed) {
      return NAVIGATION.flatMap((item) => {
        if (item.subItems && expandedItems.includes(item.name)) {
          return [
            item,
            ...item.subItems.filter((subItem) => subItem.icon !== null),
          ];
        }
        return [item];
      }).filter((item) => item.icon !== null);
    }

    return NAVIGATION.map((item) => {
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.map((subItem) => ({
            ...subItem,
            href: subItem.href,
          })),
        };
      }
      return item;
    });
  }, [NAVIGATION, isCollapsed, expandedItems]);

  const navItemsRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "b" &&
        event.metaKey &&
        orgContext?.currentOrg?.tier !== "demo"
      ) {
        event.preventDefault();
        setIsCollapsed(!isCollapsed);
      } else if (event.metaKey && event.shiftKey && event.key === "l") {
        event.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    const sidebarWidth = isCollapsed ? 48 : 208;
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidth}px`,
    );

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed, expandedItems, setIsCollapsed, setTheme, theme]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCollapseToggle = () => {
    if (window.innerWidth < 768) {
      // Mobile breakpoint
      setIsMobileMenuOpen(false);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Mobile hamburger menu */}
      <div className="dark:border-slate-70 sticky top-0 z-20 flex flex-shrink-0 border-b border-slate-300 bg-slate-100 px-2 py-3 dark:bg-black md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsCollapsed(false);
            setIsMobileMenuOpen(true);
          }}
          className="text-slate-500 hover:text-slate-600"
        >
          <Bars3Icon className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile drawer overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => {
            setIsCollapsed(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}

      {/* Sidebar container */}
      <div
        className={cn(
          "hidden md:block",
          largeWith,
          "transition-all duration-300",
        )}
      />

      {/* Sidebar content */}
      <div
        ref={sidebarRef}
        className={cn(
          "z-50 flex h-screen flex-col bg-sidebar-background transition-all duration-300",
          largeWith,
          "fixed left-0 top-0",
          "md:translate-x-0", // Always visible on desktop
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full w-full flex-col border-r border-slate-200 dark:border-slate-800">
          {/* Collapse button and OrgDropdown */}
          <div
            className={`flex h-16 flex-row items-center border-b border-slate-200 px-2 dark:border-slate-800 ${isCollapsed ? "justify-center" : "justify-between"}`}
          >
            {/* - OrgDropdown */}
            {!isCollapsed && <OrgDropdown />}

            {/* - Collapse button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCollapseToggle}
              className="flex h-8 w-8 shrink-0 items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeftIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Main content area */}
          <div className="flex min-h-0 flex-1 flex-col">
            <ScrollArea
              className="flex h-full flex-1 flex-col"
              width="thin"
              type="scroll"
            >
              {/* Navigation items */}
              <div className="flex flex-col">
                {onboardingStatus?.hasCompletedQuickstart === false &&
                  !isCollapsed && <SidebarQuickstepCard />}

                <div
                  ref={navItemsRef}
                  data-collapsed={isCollapsed}
                  className="group flex flex-col py-2 data-[collapsed=true]:py-2"
                >
                  <nav className="grid px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                    {NAVIGATION_ITEMS.map((link) => (
                      <NavItem
                        key={link.name}
                        link={link}
                        isCollapsed={isCollapsed}
                        expandedItems={expandedItems}
                        toggleExpand={toggleExpand}
                        onClick={() => {
                          setIsCollapsed(false);
                          setIsMobileMenuOpen(false);
                        }}
                        deep={0}
                      />
                    ))}

                    {orgContext?.currentOrg?.tier === "demo" && (
                      <Button
                        onClick={() => {
                          orgContext.allOrgs.forEach((org) => {
                            if (org.is_main_org === true) {
                              orgContext.setCurrentOrg(org.id);
                              router.push("/onboarding");
                            }
                          });
                        }}
                        className={cn(
                          "text-large mt-10 gap-1 bg-sky-500 font-medium leading-normal tracking-normal text-white transition-colors hover:bg-sky-600",
                          isCollapsed
                            ? "h-8 w-8 px-2"
                            : "h-[46px] w-full px-6 md:px-4",
                        )}
                        variant="action"
                      >
                        {!isCollapsed && (
                          <span className="text-white">Ready to integrate</span>
                        )}
                        <Rocket
                          className={
                            isCollapsed
                              ? "h-4 w-4 text-white"
                              : "h-6 w-6 text-white"
                          }
                        />
                      </Button>
                    )}
                  </nav>
                </div>
              </div>
            </ScrollArea>

            <div
              className={cn(
                "flex flex-col border-t border-slate-200 bg-slate-50 px-2 pb-2 pt-2 dark:border-slate-800 dark:bg-slate-900/50",
                isCollapsed && "items-center",
              )}
            >
              {orgContext?.currentOrg?.tier !== "demo" && (
                <Button
                    variant="ghost"
                    size="none"
                    onClick={() => router.push("/settings")}
                    className={cn(
                      "flex items-center text-xs hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800",
                      isCollapsed
                        ? "h-8 w-8 justify-center"
                        : "h-8 w-full justify-start gap-2 px-3",
                      router.pathname.startsWith("/settings")
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/50"
                        : "text-muted-foreground",
                    )}
                  >
                    <Settings
                      size={16}
                      className={cn(
                        router.pathname.startsWith("/settings")
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-muted-foreground",
                      )}
                    />
                    {!isCollapsed && <span>Configure</span>}
                  </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopSidebar;

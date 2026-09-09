import { Package, FlaskConical, ClipboardCheck } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const ADDONS = [] as const;

export const TIER_IDS = [
  "free",
  "pro",
  "team",
  "enterprise",
  "growth",
] as const;

export const LEGACY_ADDON_IDS = ["prompts", "experiments", "evals"] as const;

const TIER_VARIANTS: Record<string, string[]> = {
  pro: ["pro-20240913", "pro-20250202", "pro-20251210"],
  team: ["team-20250130", "team-20251210"],
};

const TIER_DISPLAY_CLASS_NAMES: Record<string, string> = {
  free: "text-xs text-sky-500 bg-sky-50 px-2 py-[2px] rounded-md font-semibold",
  pro: "text-xs text-purple-500 bg-purple-50 px-2 py-[2px] rounded-md font-semibold",
  team: "text-xs text-indigo-500 bg-indigo-50 px-2 py-[2px] rounded-md font-semibold",
  growth:
    "text-xs text-emerald-500 bg-emerald-50 px-2 py-[2px] rounded-md font-semibold",
  enterprise:
    "text-xs text-slate-500 bg-slate-100 px-2 py-[2px] rounded-md font-semibold",
};

export function usePricingConfigs() {
  const { t } = useTranslation("providers");

  const LEGACY_ADDONS = useMemo(
    () => [
      {
        id: "prompts" as const,
        name: t("pricing.legacyAddons.prompts.name"),
        description: t("pricing.legacyAddons.prompts.description"),
        price: 50,
        icon: <Package className="h-6 w-6 text-sky-500" />,
      },
      {
        id: "experiments" as const,
        name: t("pricing.legacyAddons.experiments.name"),
        description: t("pricing.legacyAddons.experiments.description"),
        price: 50,
        icon: <FlaskConical className="h-6 w-6 text-sky-500" />,
      },
      {
        id: "evals" as const,
        name: t("pricing.legacyAddons.evals.name"),
        description: t("pricing.legacyAddons.evals.description"),
        price: 100,
        icon: <ClipboardCheck className="h-6 w-6 text-sky-500" />,
      },
    ],
    [t],
  );

  const Tiers = useMemo(
    () =>
      TIER_IDS.map((id) => ({
        id,
        name: t(`pricing.tiers.${id}`),
      })),
    [t],
  );

  const TIER_DISPLAY_INFO = useMemo(
    () =>
      Object.fromEntries(
        TIER_IDS.map((id) => [
          id,
          {
            text: t(`pricing.tierDisplay.${id === "free" ? "upgrade" : id}`),
            className: TIER_DISPLAY_CLASS_NAMES[id],
            variants: TIER_VARIANTS[id],
          },
        ]),
      ),
    [t],
  );

  const getTierDisplayInfo = (tierId: string | undefined | null) => {
    if (!tierId) {
      return TIER_DISPLAY_INFO.free;
    }

    if (TIER_DISPLAY_INFO[tierId]) {
      return TIER_DISPLAY_INFO[tierId];
    }

    for (const [baseId, info] of Object.entries(TIER_DISPLAY_INFO)) {
      if (info.variants?.includes(tierId)) {
        return info;
      }
    }

    return TIER_DISPLAY_INFO.enterprise;
  };

  return {
    LEGACY_ADDONS,
    ADDONS,
    Tiers,
    TIER_DISPLAY_INFO,
    getTierDisplayInfo,
  };
}

// Backward-compatible static exports for non-React contexts
export const Tiers = TIER_IDS.map((id) => ({ id, name: id }));
export const LEGACY_ADDONS = LEGACY_ADDON_IDS.map((id) => ({
  id,
  name: id,
  description: "",
  price: id === "evals" ? 100 : 50,
  icon: null,
}));
export const TIER_DISPLAY_INFO = Object.fromEntries(
  TIER_IDS.map((id) => [
    id,
    {
      text: id,
      className: TIER_DISPLAY_CLASS_NAMES[id],
      variants: TIER_VARIANTS[id],
    },
  ]),
);

export function getTierDisplayInfo(tierId: string | undefined | null) {
  if (!tierId) {
    return TIER_DISPLAY_INFO.free;
  }

  if (TIER_DISPLAY_INFO[tierId]) {
    return TIER_DISPLAY_INFO[tierId];
  }

  for (const [baseId, info] of Object.entries(TIER_DISPLAY_INFO)) {
    if (info.variants?.includes(tierId)) {
      return info;
    }
  }

  return TIER_DISPLAY_INFO.enterprise;
}

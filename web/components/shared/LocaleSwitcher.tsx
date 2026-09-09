import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface LocaleSwitcherProps {
  variant?: "switch" | "menu";
}

export default function LocaleSwitcher({ variant = "switch" }: LocaleSwitcherProps) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const isEnglish = router.locale === "en";

  const toggleLocale = () => {
    const nextLocale = isEnglish ? "zh" : "en";
    router.push(router.asPath, router.asPath, { locale: nextLocale });
  };

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggleLocale}
        className="w-full px-2 py-1.5 text-left text-xs hover:bg-accent"
      >
        {isEnglish ? t("locale.switchToChinese") : t("locale.switchToEnglish")}
      </button>
    );
  }

  return (
    <div className="flex w-full items-center justify-between text-xs">
      <span>{t("locale.english")}</span>
      <Switch checked={isEnglish} onCheckedChange={toggleLocale} size="md" />
    </div>
  );
}

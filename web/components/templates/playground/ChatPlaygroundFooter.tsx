import { useTranslation } from "react-i18next";
import React from "react";
import { Button } from "@/components/ui/button";

interface ChatPlaygroundFooterProps {
  onBack: () => void;
  onContinue: () => void;
}

const ChatPlaygroundFooter: React.FC<ChatPlaygroundFooterProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation("playground");
  const { t: tCommon } = useTranslation("common");

  return (
    <div
      id="step-inc"
      className="sticky bottom-0 flex w-full justify-between border-t border-gray-300 bg-gray-100 py-4 dark:border-gray-700 dark:bg-[#17191d]"
    >
      <Button variant={"secondary"} size={"sm"} onClick={onBack}>{tCommon("actions.back")}</Button>
      <Button size={"sm"} onClick={onContinue}>{t("ui.continue")}</Button>
    </div>
  );
};

export default ChatPlaygroundFooter;

import { Message } from "@helicone-package/llm-mapper/types";
import { useTranslation } from "react-i18next";

interface ImageBoxProps {
  message: Message;
  disabled?: boolean;
}

export default function ImageBox({ message, disabled = false }: ImageBoxProps) {
  const { t } = useTranslation("common");

  if (!message.image_url) {
    return null;
  }

  return (
    <div
      className={`group relative grid h-full rounded-xl border border-slate-200 bg-white focus-within:border-transparent focus-within:ring-2 focus-within:ring-heliblue dark:border-slate-800 dark:bg-slate-900 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={message.image_url}
        alt={message.content || t("prompts.imageMessage")}
        className="h-[300px] w-full select-none object-contain p-4"
        draggable={false}
      />
    </div>
  );
}

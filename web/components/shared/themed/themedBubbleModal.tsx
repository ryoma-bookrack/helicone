import { XMarkIcon } from "@heroicons/react/24/outline";
import { Row } from "../../layout/common";
import { useTranslation } from "react-i18next";

interface ThemedBubbleModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRemoved: (removed: boolean) => void;
  removed: boolean;
  children: React.ReactNode;
  buttonText?: string;
  showButton?: boolean;
}

const ThemedBubbleModal: React.FC<ThemedBubbleModalProps> = ({
  open,
  setOpen,
  setRemoved,
  removed,
  children,
  buttonText,
  showButton = true,
}) => {
  const { t } = useTranslation("common");
  const resolvedButtonText = buttonText ?? t("demo.buttonText");

  if (removed) return null;

  return (
    <>
      {!open && (
        <Row className="fixed bottom-4 right-4 z-50 items-center gap-2">
          {showButton && (
            <>
              <button
                className="z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
                onClick={() => setRemoved(true)}
                aria-label={t("demo.removeDemo")}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              <button
                className="flex h-12 cursor-pointer items-center justify-center rounded-full bg-blue-500 px-5 font-light text-white shadow-lg transition-colors hover:bg-blue-600"
                onClick={() => setOpen(true)}
              >
                {resolvedButtonText}
              </button>
            </>
          )}
        </Row>
      )}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 origin-bottom-right">
          {children}
        </div>
      )}
    </>
  );
};

export default ThemedBubbleModal;

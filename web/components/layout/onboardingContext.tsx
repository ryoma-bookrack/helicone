// Inspired by https://github.com/uixmat/onborda

import { $JAWN_API } from "@/lib/clients/jawn";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  buildOnboardingSteps,
  ONBOARDING_STEP_METADATA,
  ONBOARDING_STEPS,
} from "./buildOnboardingSteps";
export {
  buildOnboardingSteps,
  ONBOARDING_STEP_METADATA,
  ONBOARDING_STEPS,
} from "./buildOnboardingSteps";
export {
  ONBOARDING_STEP_LABELS,
  type OnboardingStep,
  type OnboardingStepLabel,
} from "./onboardingContextTypes";
import { ONBOARDING_STEP_LABELS } from "./onboardingContextTypes";

export type OnboardingContextType = {
  currentStep: number;
  setCurrentStep: (step: number, delay?: number) => void;
  closeOnboarding: () => void;
  startOnboarding: () => void;
  elementPointerPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  onClickElement: () => void;
  setOnClickElement: (onClickElement: () => void) => void;
  isOnboardingVisible: boolean;
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: (isOnboardingComplete: boolean) => void;
  endOnboarding: () => void;
  updatePointerPosition: () => void;
  onboardingSteps: ReturnType<typeof buildOnboardingSteps>;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingProvider",
    );
  }
  return context;
};

export const OnboardingProvider = ({
  sidebarRef,
  children,
}: {
  sidebarRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation("onboarding");
  const onboardingSteps = useMemo(() => buildOnboardingSteps(t), [t]);
  const [currentStep, setCurrentStepState] = useState(0);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [onClickElement, setOnClickElement] = useState<() => void>(() => {});
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const setCurrentStep = useCallback((step: number, delayMs?: number) => {
    if (delayMs) {
      setTimeout(() => {
        setCurrentStepState(step);
      }, delayMs);
    } else {
      setCurrentStepState(step);
    }
  }, []);
  const router = useRouter();

  const startOnboarding = useCallback(() => {
    if (isOnboardingVisible) return;
    const setReady = async () => {
      const countResponse = await $JAWN_API.POST("/v1/request/count/query", {
        body: {
          filter: {},
        },
      });

      if (countResponse?.data?.data && countResponse.data.data > 6) {
        clearInterval(interval);
        setIsOnboardingVisible(true);
        setCurrentStep(0);
        router.push("/requests");
      }
    };

    const interval = setInterval(setReady, 1000);
    return () => clearInterval(interval);
  }, [setCurrentStep, isOnboardingVisible, router]);

  const endOnboarding = useCallback(() => {
    setCurrentStep(0);
    setIsOnboardingVisible(false);
    setIsOnboardingComplete(true);
  }, [setIsOnboardingComplete, setCurrentStep]);

  const getElementPosition = (element: Element) => {
    if (!element) return null;
    if (
      !element.getBoundingClientRect ||
      typeof element.getBoundingClientRect !== "function"
    )
      return null;
    const { top, left, width, height } = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    return {
      x: left + scrollLeft - (sidebarRef.current?.offsetWidth || 0),
      y: top + scrollTop,
      width,
      height,
    };
  };

  const [elementPointerPosition, setElementPointerPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (isOnboardingVisible) {
      let timeout: NodeJS.Timeout;
      const observer = new MutationObserver(() => {
        const element = document.querySelector(
          `[data-onboarding-step="${currentStep}"]`,
        );
        if (element) {
          const position = getElementPosition(element);
          const currentLabel = ONBOARDING_STEP_LABELS[currentStep];
          const delayMs = ONBOARDING_STEP_METADATA[currentLabel]?.delayBoxShiftMs;
          if (delayMs) {
            setTimeout(() => {
              if (position) {
                setElementPointerPosition(position);
              }
            }, delayMs);
          } else if (position) {
            setElementPointerPosition(position);
          }

          timeout = setTimeout(() => {
            updatePointerPosition();
          }, 1000);

          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isOnboardingVisible]);

  const updatePointerPosition = () => {
    if (isOnboardingVisible) {
      const element = document.querySelector(
        `[data-onboarding-step="${currentStep}"]`,
      );
      if (element) {
        const position = getElementPosition(element);
        if (position) {
          setElementPointerPosition(position);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", updatePointerPosition);
    window.addEventListener("resize", updatePointerPosition);
    return () => {
      window.removeEventListener("scroll", updatePointerPosition);
      window.removeEventListener("resize", updatePointerPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isOnboardingVisible]);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        closeOnboarding: () => setIsOnboardingVisible(false),
        startOnboarding,
        isOnboardingVisible,
        elementPointerPosition,
        onClickElement,
        setOnClickElement,
        isOnboardingComplete,
        setIsOnboardingComplete,
        endOnboarding,
        updatePointerPosition,
        onboardingSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default useOnboardingContext;

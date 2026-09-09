import { BeakerIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  MessageCircleQuestionIcon,
  ScrollTextIcon,
  SheetIcon,
  SparklesIcon,
  WorkflowIcon,
} from "lucide-react";
import { Trans } from "react-i18next";
import type { TFunction } from "i18next";
import { OnboardingPopoverAccordion } from "../templates/onboarding/OnboardingPopoverMore";
import { DiffHighlight } from "../templates/welcome/diffHighlight";
import {
  ONBOARDING_STEP_LABELS,
  type OnboardingStep,
  type OnboardingStepLabel,
} from "./onboardingContextTypes";

const HELICONE_SESSIONS_JS_CODE = `
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://oai.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": \`Bearer ${process.env.HELICONE_API_KEY}\`,
  },
});

const session = randomUUID();

openai.chat.completions.create(
  {
    messages: [
      {
        role: "user",
        content: "Generate an abstract for a course on space.",
      },
    ],
    model: "gpt-4",
  },
  {
    headers: {
      "Helicone-Session-Id": session,
      "Helicone-Session-Path": "/abstract",
      "Helicone-Session-Name": "Course Plan",
    },
  }
);
`;

const HELICONE_PROMPTS_JS_CODE = `
// 1. Add these lines
import { hpf, hpstatic } from "@helicone/prompts";

const chatCompletion = await openai.chat.completions.create(
  {
    messages: [
      {
        role: "system",
        // 2. Use hpstatic for static prompts
        content: hpstatic\`You are a creative storyteller.\`,
      },
      {
        role: "user",
        // 3: Add hpf to any string, and nest any variable in additional brackets \`{}\`
        content: hpf\`Write a story about \${{ character }}\`,
      },
    ],
    model: "gpt-3.5-turbo",
  },
  {
    // 3. Add Prompt Id Header
    headers: {
      "Helicone-Prompt-Id": "prompt_story",
    },
  }
);

`;

export const ONBOARDING_STEP_METADATA: Record<
  OnboardingStepLabel,
  { stepNumber: number; delayBoxShiftMs?: number }
> = {
  REQUESTS_TABLE: { stepNumber: 0 },
  REQUESTS_DRAWER: { stepNumber: 1 },
  SESSIONS_PAGE: { stepNumber: 2 },
  SESSIONS_CULPRIT: { stepNumber: 3 },
  PROMPTS_PAGE: { stepNumber: 4 },
  PROMPTS_EXPERIMENT: { stepNumber: 5, delayBoxShiftMs: 700 },
  EXPERIMENTS_TABLE: { stepNumber: 6 },
  EXPERIMENTS_ORIGINAL: { stepNumber: 7, delayBoxShiftMs: 700 },
  EXPERIMENTS_ADD: { stepNumber: 8 },
  EXPERIMENTS_ADD_CHANGE_PROMPT: { stepNumber: 9, delayBoxShiftMs: 700 },
  EXPERIMENTS_ADD_SAVE: { stepNumber: 10 },
  EXPERIMENTS_FIND_EXPERIMENT: { stepNumber: 11 },
  EXPERIMENTS_ADD_TEST_CASES: { stepNumber: 12 },
  EXPERIMENTS_RUN_EXPERIMENTS: { stepNumber: 13 },
  EXPERIMENTS_CLICK_SHOW_SCORES: { stepNumber: 14 },
  EXPERIMENTS_CLICK_ADD_EVAL: { stepNumber: 15 },
  EXPERIMENTS_SPECIFIC_EVAL: { stepNumber: 16 },
  EXPERIMENTS_RUN_EVAL: { stepNumber: 17 },
  EXPERIMENTS_BETTER_PROMPT: { stepNumber: 18 },
  DASHBOARD_SUCCESS: { stepNumber: 19 },
};

export const ONBOARDING_STEPS: Record<
  OnboardingStepLabel,
  Pick<OnboardingStep, "stepNumber">
> = Object.fromEntries(
  ONBOARDING_STEP_LABELS.map((label) => [
    label,
    { stepNumber: ONBOARDING_STEP_METADATA[label].stepNumber },
  ]),
) as Record<OnboardingStepLabel, Pick<OnboardingStep, "stepNumber">>;

export function buildOnboardingSteps(
  t: TFunction<"onboarding">,
): Record<OnboardingStepLabel, OnboardingStep> {
  return {
    REQUESTS_TABLE: {
      stepNumber: 0,
      popoverData: {
        icon: <SheetIcon className="h-4 w-4" />,
        title: t("tour.requestsTable.title"),
        stepNumber: 1,
        description: t("tour.requestsTable.description"),
        additionalData: (
          <OnboardingPopoverAccordion
            icon={<MessageCircleQuestionIcon className="h-4 w-4" />}
            title={t("tour.requestsTable.accordionTitle")}
            button={{
              text: t("tour.doc"),
              link: "https://docs.helicone.ai/getting-started/quick-start",
            }}
          >
            <p>
              {t("tour.requestsTable.accordionBody")}{" "}
              <span className="text-blue-700">
                {t("tour.requestsTable.accordionHighlight")}
              </span>
            </p>
          </OnboardingPopoverAccordion>
        ),
      },
    },
    REQUESTS_DRAWER: {
      stepNumber: 1,
      popoverData: {
        icon: <SheetIcon className="h-4 w-4" />,
        title: t("tour.requestsDrawer.title"),
        stepNumber: 1,
        description: t("tour.requestsDrawer.description"),
      },
    },
    SESSIONS_PAGE: {
      stepNumber: 2,
      popoverData: {
        icon: <WorkflowIcon className="h-6 w-6" />,
        title: t("tour.sessionsPage.title"),
        stepNumber: 2,
        description: t("tour.sessionsPage.description"),
      },
    },
    SESSIONS_CULPRIT: {
      stepNumber: 3,
      popoverData: {
        icon: <WorkflowIcon className="h-6 w-6" />,
        title: t("tour.sessionsCulprit.title"),
        stepNumber: 2,
        description: (
          <Trans
            i18nKey="tour.sessionsCulprit.description"
            ns="onboarding"
            components={{ strong: <strong /> }}
          />
        ),
        additionalData: (
          <OnboardingPopoverAccordion
            icon={<MessageCircleQuestionIcon className="h-4 w-4" />}
            title={t("tour.sessionsCulprit.accordionTitle")}
            button={{
              text: t("tour.doc"),
              link: "https://docs.helicone.ai/features/sessions",
            }}
          >
            <p>{t("tour.sessionsCulprit.accordionBody")}</p>
            <DiffHighlight
              code={HELICONE_SESSIONS_JS_CODE}
              language="javascript"
              newLines={[22, 23, 24]}
              oldLines={[]}
            />
          </OnboardingPopoverAccordion>
        ),
      },
    },
    PROMPTS_PAGE: {
      stepNumber: 4,
      popoverData: {
        icon: <ScrollTextIcon className="h-6 w-6" />,
        title: t("tour.promptsPage.title"),
        stepNumber: 3,
        description: (
          <Trans
            i18nKey="tour.promptsPage.description"
            ns="onboarding"
            components={{ strong: <strong /> }}
          />
        ),
        additionalData: (
          <OnboardingPopoverAccordion
            icon={<MessageCircleQuestionIcon className="h-4 w-4" />}
            title={t("tour.promptsPage.accordionTitle")}
            button={{
              text: t("tour.doc"),
              link: "https://docs.helicone.ai/features/prompts",
            }}
          >
            <p>{t("tour.promptsPage.accordionBody")}</p>
            <DiffHighlight
              code={HELICONE_PROMPTS_JS_CODE}
              language="javascript"
              newLines={[22, 23, 24]}
              oldLines={[]}
            />
          </OnboardingPopoverAccordion>
        ),
      },
    },
    PROMPTS_EXPERIMENT: {
      stepNumber: 5,
      delayBoxShiftMs: 700,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.promptsExperiment.title"),
        stepNumber: 3,
        description: t("tour.promptsExperiment.description"),
      },
    },
    EXPERIMENTS_TABLE: {
      stepNumber: 6,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.experimentsTable.title"),
        stepNumber: 4,
        description: t("tour.experimentsTable.description"),
      },
    },
    EXPERIMENTS_ORIGINAL: {
      stepNumber: 7,
      delayBoxShiftMs: 700,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.experimentsOriginal.title"),
        stepNumber: 4,
        description: (
          <Trans
            i18nKey="tour.experimentsOriginal.description"
            ns="onboarding"
            components={{ strong: <strong /> }}
          />
        ),
      },
    },
    EXPERIMENTS_ADD: {
      stepNumber: 8,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.experimentsAdd.title"),
        stepNumber: 4,
        description: t("tour.experimentsAdd.description"),
      },
    },
    EXPERIMENTS_ADD_CHANGE_PROMPT: {
      stepNumber: 9,
      delayBoxShiftMs: 700,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.experimentsAddChangePrompt.title"),
        stepNumber: 4,
        description: t("tour.experimentsAddChangePrompt.description"),
      },
    },
    EXPERIMENTS_ADD_SAVE: {
      stepNumber: 10,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.experimentsAddSave.title"),
        stepNumber: 4,
        description: t("tour.experimentsAddSave.description"),
      },
    },
    EXPERIMENTS_FIND_EXPERIMENT: {
      stepNumber: 11,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.experimentsFindExperiment.title"),
        stepNumber: 4,
        description: t("tour.experimentsFindExperiment.description"),
      },
    },
    EXPERIMENTS_ADD_TEST_CASES: {
      stepNumber: 12,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.experimentsAddTestCases.title"),
        stepNumber: 4,
        description: t("tour.experimentsAddTestCases.description"),
      },
    },
    EXPERIMENTS_RUN_EXPERIMENTS: {
      stepNumber: 13,
      popoverData: {
        icon: <BeakerIcon className="h-6 w-6" />,
        title: t("tour.experimentsRunExperiments.title"),
        stepNumber: 4,
        description: t("tour.experimentsRunExperiments.description"),
      },
    },
    EXPERIMENTS_CLICK_SHOW_SCORES: {
      stepNumber: 14,
      popoverData: {
        stepNumber: 4,
      },
    },
    EXPERIMENTS_CLICK_ADD_EVAL: {
      stepNumber: 15,
      popoverData: {
        stepNumber: 4,
      },
    },
    EXPERIMENTS_SPECIFIC_EVAL: {
      stepNumber: 16,
      popoverData: {
        icon: <SparklesIcon className="h-6 w-6" />,
        title: t("tour.experimentsSpecificEval.title"),
        stepNumber: 4,
        description: t("tour.experimentsSpecificEval.description"),
      },
    },
    EXPERIMENTS_RUN_EVAL: {
      stepNumber: 17,
      popoverData: {
        icon: <SparklesIcon className="h-6 w-6" />,
        title: t("tour.experimentsRunEval.title"),
        stepNumber: 4,
        description: t("tour.experimentsRunEval.description"),
      },
    },
    EXPERIMENTS_BETTER_PROMPT: {
      stepNumber: 18,
      popoverData: {
        stepNumber: 4,
      },
    },
    DASHBOARD_SUCCESS: {
      stepNumber: 19,
      popoverData: {
        icon: <HomeIcon className="h-6 w-6" />,
        title: t("tour.dashboardSuccess.title"),
        stepNumber: 5,
        description: t("tour.dashboardSuccess.description"),
      },
    },
  };
}

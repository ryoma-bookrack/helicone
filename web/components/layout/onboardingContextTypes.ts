export const ONBOARDING_STEP_LABELS = [
  "REQUESTS_TABLE",
  "REQUESTS_DRAWER",
  "SESSIONS_PAGE",
  "SESSIONS_CULPRIT",
  "PROMPTS_PAGE",
  "PROMPTS_EXPERIMENT",
  "EXPERIMENTS_TABLE",
  "EXPERIMENTS_ORIGINAL",
  "EXPERIMENTS_ADD",
  "EXPERIMENTS_ADD_CHANGE_PROMPT",
  "EXPERIMENTS_ADD_SAVE",
  "EXPERIMENTS_FIND_EXPERIMENT",
  "EXPERIMENTS_ADD_TEST_CASES",
  "EXPERIMENTS_RUN_EXPERIMENTS",
  "EXPERIMENTS_CLICK_SHOW_SCORES",
  "EXPERIMENTS_CLICK_ADD_EVAL",
  "EXPERIMENTS_SPECIFIC_EVAL",
  "EXPERIMENTS_RUN_EVAL",
  "EXPERIMENTS_BETTER_PROMPT",
  "DASHBOARD_SUCCESS",
] as const;

export type OnboardingStepLabel = (typeof ONBOARDING_STEP_LABELS)[number];

export interface OnboardingStep {
  stepNumber: number;
  delayBoxShiftMs?: number;
  popoverData: {
    icon?: React.ReactNode;
    title?: string;
    stepNumber: number;
    description?: string | React.ReactNode;
    additionalData?: React.ReactNode;
  };
}

/** Self-hosted: tier limits are not enforced in the UI. */
type UnauthorizedViewProps = {
  currentTier?: string;
  pageType?: string;
};

const UnauthorizedView = (_props: UnauthorizedViewProps) => null;

export default UnauthorizedView;

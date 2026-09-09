import { useTranslation } from "react-i18next";

const Webinar = () => {
  const { t } = useTranslation("marketing");
  return t("redirects.webinar");
};

export default Webinar;

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination:
        "https://www.eventbrite.com/e/empowering-developers-to-innovate-with-language-models-llms-in-your-org-tickets-802016060627?utm-campaign=social&utm-content=attendeeshare&utm-medium=discovery&utm-term=listing&utm-source=cp&aff=ebdsshcopyurl",
      permanent: false,
    },
  };
};

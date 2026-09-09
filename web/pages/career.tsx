import { useTranslation } from "react-i18next";

const Career = () => {
  const { t } = useTranslation("marketing");
  return t("redirects.career");
};

export default Career;

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "https://bit.ly/helicone-jobs",
      permanent: false,
    },
  };
};

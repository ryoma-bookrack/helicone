import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation("marketing");
  return t("redirects.blog");
};

export default Blog;

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "https://helicone.ai/blog",
      permanent: true,
    },
  };
};

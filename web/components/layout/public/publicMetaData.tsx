import Head from "next/head";
import { useTranslation } from "react-i18next";

interface PublicMetaDataProps {
  description?: string;
  ogImageUrl: string;
  children: React.ReactNode;
}

const FAQ_KEYS = ["latency", "selfHosted", "withoutProxy"] as const;

const PublicMetaData = (props: PublicMetaDataProps) => {
  const { description, ogImageUrl, children } = props;
  const { t } = useTranslation("marketing");

  const isLocalhost =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  const faviconPath = isLocalhost
    ? "/static/logo-dev.png"
    : "/static/logo.webp";

  const descriptionFinal = description ?? t("meta.notFoundDescription");
  const defaultTitle = t("meta.defaultTitle");
  const siteName = t("meta.siteName");

  const faqs = FAQ_KEYS.map((key) => ({
    question: t(`faqs.${key}.question`),
    answer: t(`faqs.${key}.answer`),
  }));

  return (
    <>
      <Head>
        <title>{defaultTitle}</title>
        <link rel="icon" href={faviconPath} />
        <link rel="canonical" href="https://www.helicone.ai/" />
        <meta property="og:title" content={siteName} />
        <meta content="https://helicone.ai" property="og:url" />
        <meta name="description" content={descriptionFinal} />
        <meta property="og:description" content={descriptionFinal} />
        <meta property="og:image" content={ogImageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            url: "https://www.helicone.ai",
            name: siteName,
            description: t("meta.siteDescription"),
            publisher: {
              "@type": "Organization",
              name: siteName,
              url: "https://www.helicone.ai",
              logo: "https://www.helicone.ai/static/logo.webp",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: t("meta.customerSupport"),
                email: "support@helicone.ai",
              },
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          })}
        </script>
      </Head>
      {children}
    </>
  );
};

export default PublicMetaData;

import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import MetaData from "../../components/layout/public/authMetaData";
import NavBarV2 from "../../components/layout/navbar/navBarV2";
import GridBackground from "../../components/layout/public/gridBackground";
import Link from "next/link";
import ContactForm from "../../components/shared/contactForm";
import Image from "next/image";
import Footer from "../../components/layout/footer";
import { useTranslation } from "react-i18next";

const CUSTOMER_PORTAL_BULLET_KEYS = [
  "billingUsageApis",
  "whiteLabeling",
  "embeddableDashboards",
  "alerts",
  "customerRateLimiting",
  "customerFacingApiTokens",
  "customDomains",
  "customProxyEndpoint",
] as const;

const CustomerPortal = () => {
  const { t } = useTranslation("marketing");

  return (
    <MetaData title={t("customerPortal.metaTitle")}>
      <NavBarV2 />
      <div className="h-full min-h-screen bg-white">
        <GridBackground>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 pb-24 pt-10 antialiased sm:flex-row sm:pb-32 md:px-8 lg:flex lg:py-24">
            <div className="flex w-full flex-col">
              <h1 className="max-w-4xl text-2xl font-semibold leading-tight sm:text-4xl sm:leading-snug">
                {t("customerPortal.badge")}{" "}
                <span className="border-dashed border-sky-500 text-sky-500 md:border-2 md:px-4 md:py-2">
                  {t("customerPortal.title")}
                </span>
                <p className="pt-4 text-sm font-normal text-gray-700 sm:text-lg">
                  {t("customerPortal.subtitle")}
                </p>
              </h1>

              <ul className="flex flex-col space-y-4 py-8">
                {CUSTOMER_PORTAL_BULLET_KEYS.map((key) => (
                  <li
                    className="sm:text-md flex items-center gap-2 text-sm text-gray-700"
                    key={key}
                  >
                    <CheckCircleIcon className="h-4 w-4 text-sky-500 sm:h-5 sm:w-5" />
                    {t(`customerPortal.bullets.${key}`)}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-sm text-black">
                {t("customerPortal.chatWithFounders")}
              </p>
              <Link
                href={"https://cal.com/team/helicone/helicone-discovery"}
                className="mt-2 flex w-fit flex-row items-center gap-1 text-sm text-gray-500 hover:text-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("customerPortal.contactUs")}{" "}
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <ContactForm
              contactTag={"customer-portal"}
              buttonText={t("customerPortal.formButton")}
              defaultPlaceholder={t("customerPortal.formPlaceholder")}
            />
          </div>
        </GridBackground>

        <div className="sm:py-18 mx-auto flex max-w-6xl flex-col items-center justify-center space-y-4 px-6 py-12 text-center antialiased md:space-y-8 lg:gap-x-10 lg:px-8">
          <div className="flex flex-col">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-2.5 lg:rounded-xl lg:p-2.5">
              <Image
                src="/assets/customer-portal/created-customer.png"
                alt={t("customerPortal.screenshotAlt")}
                width={2720}
                height={1844}
                className="w-[70rem] rounded-lg shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </MetaData>
  );
};

export default CustomerPortal;

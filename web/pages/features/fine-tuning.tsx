import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import MetaData from "../../components/layout/public/authMetaData";
import NavBarV2 from "../../components/layout/navbar/navBarV2";
import GridBackground from "../../components/layout/public/gridBackground";
import Link from "next/link";
import ContactForm from "../../components/shared/contactForm";
import Footer from "../../components/layout/footer";
import { useTranslation } from "react-i18next";

const FINE_TUNING_BULLET_KEYS = [
  "evaluations",
  "abTesting",
  "automatedFineTuning",
  "datasetCollection",
  "jsonlExports",
  "costComparisons",
  "performanceMeasurements",
  "driftAnalysis",
] as const;

const FineTuning = () => {
  const { t } = useTranslation("marketing");

  return (
    <MetaData title={t("fineTuning.metaTitle")}>
      <NavBarV2 />
      <div className="h-full min-h-screen bg-white">
        <GridBackground>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 pb-24 pt-10 antialiased sm:flex-row sm:pb-32 md:px-8 lg:flex lg:py-24">
            <div className="flex w-full flex-col">
              <h1 className="max-w-4xl text-2xl font-semibold leading-tight sm:text-4xl sm:leading-snug">
                {t("fineTuning.badge")}{" "}
                <span className="border-dashed border-rose-500 text-rose-500 md:border-2 md:px-4 md:py-2">
                  {t("fineTuning.title")}
                </span>
                <p className="pt-4 text-sm font-normal text-gray-700 sm:text-lg">
                  {t("fineTuning.subtitle")}
                </p>
              </h1>

              <ul className="flex flex-col space-y-4 py-8">
                {FINE_TUNING_BULLET_KEYS.map((key) => (
                  <li
                    className="sm:text-md flex items-center gap-2 text-sm text-gray-700"
                    key={key}
                  >
                    <CheckCircleIcon className="h-4 w-4 text-rose-500 sm:h-5 sm:w-5" />
                    {t(`fineTuning.bullets.${key}`)}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-sm text-black">
                {t("fineTuning.chatWithFounders")}
              </p>
              <Link
                href={"https://cal.com/team/helicone/helicone-discoveryl"}
                className="mt-2 flex w-fit flex-row items-center gap-1 text-sm text-gray-500 hover:text-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("fineTuning.contactUs")}{" "}
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <ContactForm
              contactTag={"fine-tuning"}
              buttonText={t("fineTuning.formButton")}
              defaultPlaceholder={t("fineTuning.formPlaceholder")}
            />
          </div>
        </GridBackground>
      </div>
      <Footer />
    </MetaData>
  );
};

export default FineTuning;

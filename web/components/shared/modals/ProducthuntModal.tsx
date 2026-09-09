import ThemedModal from "../themed/themedModal";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

interface ProducthuntModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  upgradeOpen: (open: boolean) => void;
}

const ProducthuntSupportModal: React.FC<ProducthuntModalProps> = ({
  open,
  setOpen,
}) => {
  const { t } = useTranslation("common");

  const handleProductHuntClick = () => {
    Cookies.set("visitedProductHunt", "true", { expires: 1 });
    window.open(
      "https://www.producthunt.com/leaderboard/daily/2024/8/22",
      "_blank",
    );
    setOpen(false);
  };

  return (
    <ThemedModal open={open} setOpen={setOpen}>
      <div className="flex w-[374px] flex-col items-start space-y-6 text-left">
        <div className="flex w-full items-center justify-between">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("modals.productHunt.helpTitle")}
          </div>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setOpen(false)}
          />
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          {t("modals.productHunt.launchedMessage")}
        </p>

        <p className="text-gray-600 dark:text-gray-300">
          {t("modals.productHunt.creditMessage")}
          <span className="font-semibold text-[#FF6154] dark:text-white">
            {" "}
            {t("modals.productHunt.upvoteMessage")}
          </span>
        </p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleProductHuntClick();
          }}
          tabIndex={-1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=475050&theme=light"
            alt="Helicone&#0032;AI - Open&#0045;source&#0032;LLM&#0032;Observability&#0032;for&#0032;Developers | Product Hunt"
            width="190"
            height="60"
          />
        </a>
      </div>
    </ThemedModal>
  );
};

const UpgradeOfferModal: React.FC<ProducthuntModalProps> = ({
  open,
  setOpen,
  upgradeOpen,
}) => {
  const { t } = useTranslation("common");

  const handleUpgradeClick = () => {
    Cookies.set("closedProductHuntPromo", "true", { expires: 365 });
    setOpen(false);
    upgradeOpen(true);
  };

  return (
    <ThemedModal open={open} setOpen={setOpen}>
      <div className="flex w-[374px] flex-col items-start space-y-6 text-left">
        <div className="flex w-full items-center justify-between">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("modals.productHunt.promoTitle")}
          </div>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setOpen(false)}
          />
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          {t("modals.productHunt.promoDescription")}{" "}
          <span className="font-semibold text-[#FF6154] dark:text-white">
            PHUNT500
          </span>{" "}
          at checkout.
        </p>

        <p className="text-sm italic text-gray-500 dark:text-gray-400">
          {t("modals.productHunt.creditExpires")}
        </p>

        <button
          onClick={handleUpgradeClick}
          tabIndex={-1}
          className="rounded-md bg-[#FF6154] px-6 py-3 text-white transition-colors hover:bg-[#E55A4D]"
        >
          {t("actions.upgrade")}
        </button>
      </div>
    </ThemedModal>
  );
};

export const ProducthuntLaunchCard: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div>
      <h2 className="mb-4 text-sm font-medium">
        {t("modals.productHunt.launchTitle")}
      </h2>
      <p className="mb-4 text-xs text-gray-600">
        {t("modals.productHunt.launchCardMessage")}
      </p>
      <a
        href="https://www.producthunt.com/leaderboard/daily/2024/8/22"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=475050&theme=light"
          alt="Helicone&#0032;AI - Open&#0045;source&#0032;LLM&#0032;Observability&#0032;for&#0032;Developers | Product Hunt"
          width="180"
          height="54"
        />
      </a>
    </div>
  );
};

export const ProducthuntLaunchPromoCard: React.FC<{
  setOpen: (_open: boolean) => void;
}> = ({ setOpen }) => {
  const { t } = useTranslation("common");

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <h2 className="mb-4 text-sm font-medium">
          {t("modals.productHunt.promoTitle")}
        </h2>
        <ArrowUpRightIcon
          className="mb-4 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setOpen(true)}
        />
      </div>

      <p className="mb-4 text-xs text-gray-600">
        {t("modals.productHunt.promoDescription")}{" "}
        <span className="font-semibold text-[#FF6154] dark:text-white">
          PHUNT500
        </span>{" "}
      </p>
      <a
        href="https://www.producthunt.com/leaderboard/daily/2024/8/22"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=475050&theme=light"
          alt="Helicone&#0032;AI - Open&#0045;source&#0032;LLM&#0032;Observability&#0032;for&#0032;Developers | Product Hunt"
          width="180"
          height="54"
        />
      </a>
    </div>
  );
};

const ProducthuntModal: React.FC<{
  setUpgradeOpen: (_open: boolean) => void;
}> = ({ setUpgradeOpen }) => {
  const [open, setOpen] = useState(false);
  const [visitedProductHunt, setVisitedProductHunt] = useState(false);
  const [closedPromo, setClosedPromo] = useState(false);

  useEffect(() => {
    setVisitedProductHunt(Cookies.get("visitedProductHunt") === "true");
    setClosedPromo(Cookies.get("closedProductHuntPromo") === "true");
  }, []);

  useEffect(() => {
    if (!visitedProductHunt && !closedPromo) {
      setOpen(true);
    }
  }, [visitedProductHunt, closedPromo]);

  const handleSupportModalClose = () => {
    Cookies.set("visitedProductHunt", "true", { expires: 1 });
    setVisitedProductHunt(true);
    setOpen(true);
  };

  const handlePromoModalClose = () => {
    Cookies.set("closedProductHuntPromo", "true", { expires: 1 });
    setClosedPromo(true);
    setOpen(false);
  };

  if (closedPromo) {
    return null;
  }

  return (
    <>
      {!visitedProductHunt ? (
        <ProducthuntSupportModal
          open={open}
          setOpen={handleSupportModalClose}
          upgradeOpen={setUpgradeOpen}
        />
      ) : (
        <UpgradeOfferModal
          open={open}
          setOpen={handlePromoModalClose}
          upgradeOpen={setUpgradeOpen}
        />
      )}
    </>
  );
};

export default ProducthuntModal;

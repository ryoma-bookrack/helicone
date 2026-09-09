import { Popover, Transition } from "@headlessui/react";
import {
  BugAntIcon,
  ChevronRightIcon,
  CodeBracketSquareIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import {
  ChartPieIcon,
  CircleStackIcon,
  UserGroupIcon,
  CommandLineIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const SOLUTION_KEYS = [
  "customerPortal",
  "fineTuning",
  "dataSegmentation",
  "debugging",
  "dataEtl",
  "internalAuditing",
  "githubActions",
] as const;

const SOLUTION_CONFIG: Record<
  (typeof SOLUTION_KEYS)[number],
  {
    href: string;
    icon: React.ForwardRefExoticComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
        titleId?: string | undefined;
      }
    >;
    color: string;
    new?: boolean;
    target?: string;
  }
> = {
  customerPortal: {
    href: "/features/customer-portal",
    icon: UserGroupIcon,
    color: "text-sky-500",
    new: true,
    target: "_self",
  },
  fineTuning: {
    href: "/features/fine-tuning",
    icon: CommandLineIcon,
    color: "text-rose-500",
    new: true,
    target: "_self",
  },
  dataSegmentation: {
    href: "https://docs.helicone.ai/use-cases/segmentation",
    icon: ChartPieIcon,
    color: "text-violet-500",
  },
  debugging: {
    href: "https://docs.helicone.ai/use-cases/debugging",
    icon: BugAntIcon,
    color: "text-pink-500",
  },
  dataEtl: {
    href: "https://docs.helicone.ai/use-cases/etl",
    icon: CircleStackIcon,
    color: "text-slate-500",
  },
  internalAuditing: {
    href: "https://docs.helicone.ai/use-cases/data-autonomy",
    icon: DocumentMagnifyingGlassIcon,
    color: "text-amber-500",
  },
  githubActions: {
    href: "https://docs.helicone.ai/use-cases/github-actions",
    icon: CodeBracketSquareIcon,
    color: "text-indigo-500",
  },
};

export default function SolutionsButton() {
  const { t } = useTranslation("marketing");

  return (
    <div className="">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="flex flex-row items-center rounded-md px-3 py-1.5 font-medium text-gray-700 hover:text-black focus:outline-none">
              <span>{t("nav.solutions")}</span>
              <ChevronRightIcon
                className={`${open ? "rotate-90" : "text-opacity-70"} ml-1 h-4 w-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 mt-2 w-[600px] transform px-4 sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-2xl ring-1 ring-black ring-opacity-10">
                  <div className="relative grid grid-cols-1 gap-8 bg-white p-7 lg:grid-cols-2">
                    <p className="col-span-2 -mb-2 text-sm font-medium text-gray-700">
                      {t("nav.useCases")}
                    </p>
                    {SOLUTION_KEYS.map((key) => {
                      const item = SOLUTION_CONFIG[key];
                      return (
                        <Link
                          key={key}
                          href={item.href}
                          target={item.target || "_blank"}
                          rel="noopener noreferrer"
                          className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center text-white">
                            <item.icon
                              aria-hidden="true"
                              className={item.color}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="items-center text-sm font-medium text-gray-900">
                              {t(`nav.solutionsItems.${key}.name`)}
                              {item.new && (
                                <span className="ml-1 text-xs font-semibold text-green-500">
                                  {t("nav.new")}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {t(`nav.solutionsItems.${key}.description`)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="bg-gray-100 p-4">
                    <Link
                      href="/blog"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-semibold text-gray-900">
                          {t("nav.checkoutBlog")}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        {t("nav.checkoutBlogDescription")}
                      </span>
                    </Link>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

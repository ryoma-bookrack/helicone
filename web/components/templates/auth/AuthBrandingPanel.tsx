/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const centerImages = [
  "/static/onboarding-design-1.svg",
  "/static/onboarding-design-2.svg",
];

const highlightText = (
  text: string,
  highlights: { text: string; color: string }[],
) => {
  if (!highlights || highlights.length === 0) return <>{text}</>;

  const result = [];
  let lastIndex = 0;

  const sortedHighlights = [...highlights].sort((a, b) => {
    return text.indexOf(a.text) - text.indexOf(b.text);
  });

  for (const highlight of sortedHighlights) {
    const index = text.indexOf(highlight.text, lastIndex);
    if (index === -1) continue;

    if (index > lastIndex) {
      result.push(
        <span key={`text-${lastIndex}`}>{text.substring(lastIndex, index)}</span>,
      );
    }

    result.push(
      <span key={`highlight-${index}`} className="text-slate-800">
        {highlight.text}
      </span>,
    );

    lastIndex = index + highlight.text.length;
  }

  if (lastIndex < text.length) {
    result.push(
      <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>,
    );
  }

  return <>{result}</>;
};

export const AuthBrandingPanel = () => {
  const { t } = useTranslation("auth");
  const [selectedImage, setSelectedImage] = useState(centerImages[0]);
  const [showQuote, setShowQuote] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const quotes = useMemo(
    () => [
      {
        text: t("branding.quote1.text"),
        highlights: [
          {
            text: t("branding.quote1.highlight"),
            color: "text-slate-800",
          },
        ],
        author: t("branding.quote1.author"),
        title: t("branding.quote1.title"),
        image: "/static/qawolf-logo.svg",
      },
      {
        text: t("branding.quote2.text"),
        highlights: [
          {
            text: t("branding.quote2.highlight"),
            color: "text-slate-800",
          },
        ],
        author: t("branding.quote2.author"),
        title: t("branding.quote2.title"),
        image: "/static/together-logo.svg",
      },
    ],
    [t],
  );

  const [selectedQuote, setSelectedQuote] = useState(quotes[0]);

  useEffect(() => {
    setSelectedQuote(quotes[0]);
  }, [quotes]);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = centerImages.map((src) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = resolve;
        });
      });

      const quoteImagePromises = quotes.map((quote) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = quote.image;
          img.onload = resolve;
        });
      });

      await Promise.all([...imagePromises, ...quoteImagePromises]);

      const randomImgIndex = Math.floor(Math.random() * centerImages.length);
      setSelectedImage(centerImages[randomImgIndex]);

      const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
      setSelectedQuote(quotes[randomQuoteIndex]);

      setShowQuote(Math.random() > 0.5);
      setIsContentLoaded(true);
    };

    preloadImages();
  }, [quotes]);

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-100 to-sky-100 p-10 md:m-4 md:flex md:w-1/2 md:rounded-3xl">
      <div className="relative z-20">
        <div className="flex items-center justify-between gap-4">
          <Link href="https://www.helicone.ai/" className="flex">
            <Image
              src="/static/logo-no-border.png"
              alt={t("branding.logoAlt")}
              height={100}
              width={100}
              priority={true}
            />
          </Link>
          <a
            href="https://www.producthunt.com/posts/helicone-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image
              src="/static/product-of-the-day.svg"
              alt={t("branding.productOfTheDayAlt")}
              width={120}
              height={26}
            />
          </a>
        </div>
      </div>

      {!showQuote && isContentLoaded && (
        <div className="absolute inset-0 z-10 transition-opacity duration-300">
          <Image
            src={selectedImage}
            alt={t("branding.featuredImageAlt")}
            fill
            style={{ objectFit: "cover" }}
            className="h-full w-full"
            priority={true}
          />
        </div>
      )}

      {showQuote && isContentLoaded ? (
        <>
          <div className="relative z-20 w-full space-y-3">
            <h1 className="text-4xl font-extrabold text-slate-300">&quot;</h1>
            <p className="w-full text-4xl font-medium text-slate-400">
              {highlightText(selectedQuote.text, selectedQuote.highlights)}
            </p>
            <h1 className="text-4xl font-bold text-slate-300">&quot;</h1>
          </div>

          <div className="relative z-20 flex items-center gap-3 space-y-1">
            <Image
              src={selectedQuote.image}
              alt={selectedQuote.author}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="text-md max-w-md text-slate-500">
                {selectedQuote.author}
              </p>
              <p className="max-w-md text-sm text-slate-400">
                {selectedQuote.title}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex-grow"></div>

          <div className="relative z-20 flex items-center gap-3 space-y-1">
            <div>
              <p className="text-md max-w-md text-slate-500">
                {t("branding.lifecycleTitle")}
              </p>
              <p className="max-w-md text-sm text-slate-400">
                {t("branding.lifecycleDescription")}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { H2, P } from "@/components/ui/typography";
import DOMPurify from "dompurify";
import {
  Archive,
  Bell,
  Database,
  GitBranch,
  Layers,
  Plus,
  Shield,
  SquareArrowOutUpRight,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import { useTranslation } from "react-i18next";

const highlighterPromise = createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: ["javascript", "python", "bash", "http", "plaintext", "sql"],
});

interface EmptyStateFeature {
  titleKey: string;
  descriptionKey: string;
  icon?: React.ElementType;
  featureImage: {
    type: "image" | "video" | "code" | "none";
    content: string;
    language?: string;
    maxWidth?: string;
  };
  cta?: {
    primary?: {
      ctaPrimaryKey?: string;
      link?: string;
      onClick?: boolean;
      showPlusIcon?: boolean;
    };
    secondary?: {
      ctaSecondaryKey: string;
      link: string;
    };
  };
}

export const EMPTY_STATE_FEATURES: Record<string, EmptyStateFeature> = {
  prompts: {
    titleKey: "emptyStates.prompts.title",
    descriptionKey: "emptyStates.prompts.description",
    icon: Tag,
    featureImage: {
      type: "code",
      content: `// Deploy your prompt template through the AI Gateway
const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  prompt_id: "customer-support",
  inputs: {
    customer_name: "Sarah",
    issue: "refund request",
    sentiment: "frustrated"
  }
});`,
      language: "typescript",
      maxWidth: "2xl",
    },
    cta: {
      primary: {
        ctaPrimaryKey: "emptyStates.prompts.ctaPrimary",
        onClick: true,
        showPlusIcon: true,
      },
      secondary: {
        ctaSecondaryKey: "emptyStates.prompts.ctaSecondary",
        link: "https://docs.helicone.ai/features/advanced-usage/prompts",
      },
    },
  },
  sessions: {
    titleKey: "emptyStates.sessions.title",
    descriptionKey: "emptyStates.sessions.description",
    icon: Layers,
    featureImage: {
      type: "code",
      content: `Helicone-Session-Id: chat-123
Helicone-Session-Path: /parent/child 
Helicone-Session-Name: Customer Support Flow`,
      language: "http",
    },
    cta: {
      secondary: {
        ctaSecondaryKey: "emptyStates.sessions.ctaSecondary",
        link: "https://docs.helicone.ai/features/sessions",
      },
    },
  },
  cache: {
    titleKey: "emptyStates.cache.title",
    descriptionKey: "emptyStates.cache.description",
    icon: Archive,
    featureImage: {
      type: "code",
      content: `Helicone-Cache-Enabled: "true",         // Required to enable caching
Cache-Control: "max-age=3600",          // Optional: Cache duration
Helicone-Cache-Bucket-Max-Size: "1000", // Optional: Max entries per bucket
Helicone-Cache-Seed: "user-123"         // Optional: Isolate cache by seed`,
      language: "http",
      maxWidth: "2xl",
    },
    cta: {
      secondary: {
        ctaSecondaryKey: "emptyStates.cache.ctaSecondary",
        link: "https://docs.helicone.ai/features/advanced-usage/caching",
      },
    },
  },
  "rate-limits": {
    titleKey: "emptyStates.rateLimits.title",
    descriptionKey: "emptyStates.rateLimits.description",
    icon: Shield,
    featureImage: {
      type: "code",
      content: `Helicone-RateLimit-Policy: "[quota];w=[time_window];u=[unit];s=[segment]"`,
      language: "http",
      maxWidth: "3xl",
    },
    cta: {
      secondary: {
        ctaSecondaryKey: "emptyStates.rateLimits.ctaSecondary",
        link: "https://docs.helicone.ai/features/advanced-usage/custom-rate-limits",
      },
      primary: {
        ctaPrimaryKey: "emptyStates.rateLimits.ctaPrimary",
        onClick: true,
        showPlusIcon: true,
      },
    },
  },
  users: {
    titleKey: "emptyStates.users.title",
    descriptionKey: "emptyStates.users.description",
    icon: User,
    featureImage: {
      type: "code",
      content: `Helicone-User-Id: john@doe.com`,
      language: "http",
    },
    cta: {
      secondary: {
        ctaSecondaryKey: "emptyStates.users.ctaSecondary",
        link: "https://docs.helicone.ai/features/advanced-usage/user-metrics",
      },
    },
  },
  properties: {
    titleKey: "emptyStates.properties.title",
    descriptionKey: "emptyStates.properties.description",
    icon: Tag,
    featureImage: {
      type: "code",
      content: `Helicone-Property-UserType: premium
Helicone-Property-Feature: content_generation
Helicone-Property-Department: marketing
Helicone-Property-Region: north_america
Helicone-Property-UseCase: email_campaign`,
      language: "http",
    },
    cta: {
      secondary: {
        ctaSecondaryKey: "emptyStates.properties.ctaSecondary",
        link: "https://docs.helicone.ai/features/advanced-usage/custom-properties",
      },
    },
  },
  datasets: {
    titleKey: "emptyStates.datasets.title",
    descriptionKey: "emptyStates.datasets.description",
    icon: GitBranch,
    featureImage: {
      type: "video",
      content:
        "https://marketing-assets-helicone.s3.us-west-2.amazonaws.com/datasets-empty-state.mp4",
    },
    cta: {
      primary: {
        ctaPrimaryKey: "emptyStates.datasets.ctaPrimary",
        link: "/requests",
      },
      secondary: {
        ctaSecondaryKey: "emptyStates.datasets.ctaSecondary",
        link: "https://docs.helicone.ai/features/fine-tuning",
      },
    },
  },
  webhooks: {
    titleKey: "emptyStates.webhooks.title",
    descriptionKey: "emptyStates.webhooks.description",
    icon: GitBranch,
    featureImage: {
      type: "none",
      content: "",
    },
    cta: {
      primary: {
        ctaPrimaryKey: "emptyStates.webhooks.ctaPrimary",
        onClick: true,
        showPlusIcon: true,
      },
      secondary: {
        ctaSecondaryKey: "emptyStates.webhooks.ctaSecondary",
        link: "https://docs.helicone.ai/features/webhooks",
      },
    },
  },
  alerts: {
    titleKey: "emptyStates.alerts.title",
    descriptionKey: "emptyStates.alerts.description",
    icon: Bell,
    featureImage: {
      type: "none",
      content: "",
    },
    cta: {
      primary: {
        ctaPrimaryKey: "emptyStates.alerts.ctaPrimary",
        onClick: true,
        showPlusIcon: true,
      },
    },
  },
  hql: {
    titleKey: "emptyStates.hql.title",
    descriptionKey: "emptyStates.hql.description",
    icon: Database,
    featureImage: {
      type: "code",
      content: `-- Find your most expensive requests in the last 7 days
SELECT 
  request_created_at,
  request_model,
  response_body,
  provider_total_cost
FROM request_response_rmt
WHERE request_created_at > now() - INTERVAL 7 DAY
ORDER BY provider_total_cost DESC
LIMIT 100`,
      language: "sql",
      maxWidth: "2xl",
    },
    cta: {
      primary: {
        ctaPrimaryKey: "emptyStates.hql.ctaPrimary",
        onClick: true,
        showPlusIcon: false,
      },
      secondary: {
        ctaSecondaryKey: "emptyStates.hql.ctaSecondary",
        link: "https://docs.helicone.ai/features/hql",
      },
    },
  },
} as const;

export type EmptyStateFeatureKey = keyof typeof EMPTY_STATE_FEATURES;

export interface EmptyStateCardProps {
  feature: keyof typeof EMPTY_STATE_FEATURES;
  onPrimaryClick?: () => void;
}

const ShikiHighlightedCode: React.FC<{
  code: string;
  language: string;
  maxWidth?: string;
}> = ({ code, language, maxWidth = "xl" }) => {
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    const highlightCode = async () => {
      const highlighter = await highlighterPromise;
      const html = highlighter.codeToHtml(code, {
        lang: language,
        theme: "github-dark",
      });
      const formattedHtml = html.replace(
        /<pre class="shiki"/,
        '<pre class="shiki rounded-lg" style="text-align: left;"',
      );
      setHighlightedCode(formattedHtml);
    };

    highlightCode();
  }, [code, language]);

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <div
        className={`overflow-x-auto rounded-lg bg-[#24292e] p-4 text-left max-w-${maxWidth} mx-auto`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedCode) }}
      />
    </div>
  );
};

export const EmptyStateCard = ({
  feature,
  onPrimaryClick,
}: EmptyStateCardProps) => {
  const { t } = useTranslation("common");

  const featureDefaults = feature
    ? EMPTY_STATE_FEATURES[feature]
    : ({
        titleKey: "emptyStates.default.title",
        descriptionKey: "emptyStates.default.description",
        icon: Tag,
        featureImage: {
          type: "image",
          content: "/static/empty-state-default.webp",
        },
        cta: {
          primary: {
            ctaPrimaryKey: "emptyStates.default.ctaPrimary",
            link: "https://docs.helicone.ai/getting-started",
          },
          secondary: {
            ctaSecondaryKey: "emptyStates.default.ctaSecondary",
            link: "https://docs.helicone.ai/getting-started",
          },
        },
      } as EmptyStateFeature);

  const title = t(featureDefaults.titleKey);
  const description = t(featureDefaults.descriptionKey);

  const renderCTA = () => {
    const cta = featureDefaults.cta;
    if (!cta) return null;

    return (
      <div className="flex gap-4">
        {cta.primary &&
          (cta.primary.onClick ? (
            <Button variant="default" onClick={onPrimaryClick}>
              {cta.primary.showPlusIcon && <Plus className="mr-2 h-4 w-4" />}
              {cta.primary.ctaPrimaryKey && t(cta.primary.ctaPrimaryKey)}
            </Button>
          ) : cta.primary.link ? (
            <Link href={cta.primary.link} target="_blank">
              <Button variant="default">
                {cta.primary.showPlusIcon && <Plus className="mr-2 h-4 w-4" />}
                {cta.primary.ctaPrimaryKey && t(cta.primary.ctaPrimaryKey)}
              </Button>
            </Link>
          ) : null)}
        {cta.secondary && (
          <Link href={cta.secondary.link} target="_blank">
            <Button variant="outline" className="gap-2">
              {t(cta.secondary.ctaSecondaryKey)}
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background py-16 dark:bg-sidebar-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 text-center">
        {featureDefaults.icon && (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-accent">
            {React.createElement(featureDefaults.icon, {
              size: 28,
              className: "text-accent-foreground",
            })}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <H2>{title}</H2>

          <P className="max-w-3xl text-muted-foreground">{description}</P>
        </div>

        {featureDefaults.featureImage.type !== "none" && (
          <div className="w-full">
            {featureDefaults.featureImage.type === "code" ? (
              <ShikiHighlightedCode
                code={featureDefaults.featureImage.content}
                language={featureDefaults.featureImage.language || "http"}
                maxWidth={featureDefaults.featureImage.maxWidth}
              />
            ) : featureDefaults.featureImage.type === "video" ? (
              <div
                className={`relative overflow-hidden rounded-lg border border-border max-w-${
                  featureDefaults.featureImage.maxWidth || "xl"
                } mx-auto`}
              >
                <video
                  className="max-h-[500px] w-full object-contain"
                  src={featureDefaults.featureImage.content}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
            ) : (
              featureDefaults.featureImage.type === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featureDefaults.featureImage.content}
                  alt={title}
                  className={`h-auto w-full rounded-lg border border-border max-w-${
                    featureDefaults.featureImage.maxWidth || "xl"
                  } mx-auto`}
                />
              )
            )}
          </div>
        )}

        {renderCTA()}
      </div>
    </div>
  );
};

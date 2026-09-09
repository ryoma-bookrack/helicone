import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import IntegrationCard from "./integrationCard";
import { Integration } from "./types";
import { useTranslation } from "react-i18next";

interface IntegrationSectionProps {
  title: string;
  items: Integration[];
  onIntegrationClick: (title: string) => void;
}

const IntegrationSection: React.FC<IntegrationSectionProps> = ({
  title,
  items,
  onIntegrationClick,
}) => {
  const { t } = useTranslation("connections");

  if (items.length === 0) return null;

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <Carousel>
        <CarouselContent className="gap-4">
          {items.map((item, index) => (
            <CarouselItem key={index} className="basis-[55%] lg:basis-[30%]">
              <IntegrationCard
                title={item.title}
                description={t("integration.description", { name: item.title })}
                enabled={item.enabled}
                onClick={() => onIntegrationClick(item.title)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length >= 3 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </>
  );
};

export default IntegrationSection;

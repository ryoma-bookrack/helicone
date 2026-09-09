import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useGetPropertiesV2 } from "@/services/hooks/propertiesV2";
import { ChevronsUpDown, Loader2, Plus, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPropertyFiltersV2 } from "@helicone-package/filters/frontendFilterDefs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface AddWebhookFormProps {
  onSubmit: (data: {
    destination: string;
    config: {
      sampleRate: number;
      propertyFilters: { key: string; value: string }[];
    };
    includeData: boolean;
  }) => void;
  isLoading: boolean;
  error?: string;
  onCancel?: () => void;
}

const AddWebhookForm = (props: AddWebhookFormProps) => {
  const { onSubmit, isLoading, error, onCancel } = props;
  const { t } = useTranslation("webhooks");
  const { t: tCommon } = useTranslation("common");
  const [destination, setDestination] = useState("");
  const [sampleRate, setSampleRate] = useState(100);
  const [includeData, setIncludeData] = useState(true);
  const [propertyFilters, setPropertyFilters] = useState<
    { key: string; value: string }[]
  >([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const properties = useGetPropertiesV2(getPropertyFiltersV2);

  const addPropertyFilter = () => {
    setPropertyFilters([...propertyFilters, { key: "", value: "" }]);
  };

  const removePropertyFilter = (index: number) => {
    setPropertyFilters(propertyFilters.filter((_, i) => i !== index));
  };

  const updatePropertyFilter = (index: number, key: string, value: string) => {
    const updatedFilters = [...propertyFilters];
    updatedFilters[index] = { key, value };
    setPropertyFilters(updatedFilters);
  };

  const validateForm = () => {
    if (!destination) {
      setValidationError(t("form.validation.destinationRequired"));
      return false;
    }

    if (
      !destination.startsWith("http://") &&
      !destination.startsWith("https://")
    ) {
      setValidationError(t("form.validation.destinationProtocol"));
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        destination,
        config: { sampleRate, propertyFilters },
        includeData,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("form.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("form.description")}
        </p>
      </div>

      {(error || validationError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || validationError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="webhook-url" className="text-sm font-medium">
            {t("form.endpointUrl")}
          </Label>
          <Input
            type="text"
            id="webhook-url"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (validationError) validateForm();
            }}
            placeholder={t("form.endpointPlaceholder")}
            className="w-full"
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="sample-rate" className="text-sm font-medium">
              {t("form.sampleRate")}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={sampleRate}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= 100) {
                    setSampleRate(value);
                  }
                }}
                className="h-8 w-16 text-sm"
              />
              <span className="text-sm">%</span>
            </div>
          </div>
          <Slider
            id="sample-rate"
            min={0.1}
            max={100}
            step={0.1}
            value={[sampleRate]}
            variant="default"
            onValueChange={(value) => setSampleRate(value[0])}
            className="mt-2"
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="include-data" className="text-sm font-medium">
                {t("form.includeEnhancedData")}
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("form.includeEnhancedDataHint")}
              </p>
            </div>
            <Switch
              id="include-data"
              checked={includeData}
              onCheckedChange={setIncludeData}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">{t("form.propertyFilters")}</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("form.propertyFiltersHint")}{" "}
                <a
                  href="https://docs.helicone.ai/features/advanced-usage/custom-properties#custom-properties"
                  target="_blank"
                  className="inline-flex items-center underline"
                  rel="noreferrer"
                >
                  {t("form.customProperties")}
                  <ExternalLink className="ml-0.5 h-3 w-3" />
                </a>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addPropertyFilter}
              className="h-8"
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> {t("form.addProperty")}
            </Button>
          </div>

          {propertyFilters.length > 0 && (
            <div className="mt-2 space-y-2">
              {propertyFilters.map((filter, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 items-center gap-2 rounded-md bg-muted/40 p-2"
                >
                  <div className="col-span-1">
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between truncate"
                          size="sm"
                        >
                          <span className="truncate">
                            {filter.key || t("form.selectProperty")}
                          </span>
                          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" sideOffset={4}>
                        <Command>
                          <CommandInput
                            placeholder={t("form.searchPlaceholder")}
                            onValueChange={(value) => {
                              updatePropertyFilter(index, value, filter.value);
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>{t("form.noResults")}</CommandEmpty>
                            <CommandGroup heading={t("form.suggestions")}>
                              {properties.properties?.map((property) => (
                                <CommandItem
                                  key={property}
                                  onSelect={() =>
                                    updatePropertyFilter(
                                      index,
                                      property,
                                      filter.value,
                                    )
                                  }
                                  value={property}
                                >
                                  {property}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <Input
                      placeholder={t("form.valuePlaceholder")}
                      value={filter.value}
                      onChange={(e) =>
                        updatePropertyFilter(index, filter.key, e.target.value)
                      }
                      className="h-9"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePropertyFilter(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          {tCommon("actions.cancel")}
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("addWebhook")}
        </Button>
      </div>
    </div>
  );
};

export default AddWebhookForm;

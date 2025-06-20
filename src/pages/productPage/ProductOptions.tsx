"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Attribute, Variation } from "@/types/product";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductOptionsProps {
  attributes: Attribute[];
  variations: Variation[];
  className?: string;
  onVariationChange?: (variation: Variation | null) => void;
}

/**
 * ProductOptions - Component for size and weight selection
 * Updates URL with selected options and maintains global state
 *
 * @param attributes - Available attribute options
 * @param variations - Available variation options
 * @param className - Additional classes
 * @param onVariationChange - Callback function to handle variation changes
 */
const ProductOptions = ({ attributes, variations, className, onVariationChange }: ProductOptionsProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Find matching variation only after user interaction
  useEffect(() => {
    if (!hasUserInteracted) return;

    const matchingVariation = findMatchingVariation();
    onVariationChange?.(matchingVariation || null);
  }, [selectedOptions, hasUserInteracted]);

  const findMatchingVariation = () => {
    return variations.find((variation) => {
      return Object.entries(selectedOptions).every(([attrId, optionId]) => {
        const matchingAttrOption = variation.attribute_options.find((ao) => ao.attribute_id === Number(attrId));
        return matchingAttrOption && matchingAttrOption.option_id === optionId;
      });
    });
  };

  const handleOptionSelect = (attributeId: number, optionId: string) => {
    setHasUserInteracted(true);

    // When selecting first attribute, clear second attribute selection
    if (attributes[0].id === attributeId) {
      setSelectedOptions({
        [attributeId]: Number(optionId),
      });
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [attributeId]: Number(optionId),
      }));
    }
  };

  const getAvailableOptionsForSecondAttribute = (attributeId: number): number[] => {
    const firstAttributeSelection = selectedOptions[attributes[0].id];
    if (!firstAttributeSelection) return [];

    return variations
      .filter((variation) => {
        // Find variations that match the first attribute selection
        return variation.attribute_options.some(
          (ao) => ao.attribute_id === attributes[0].id && ao.option_id === firstAttributeSelection
        );
      })
      .map((variation) => {
        // Get the option ID for the current attribute from these variations
        const attrOption = variation.attribute_options.find((ao) => ao.attribute_id === attributeId);
        return attrOption?.option_id || -1;
      })
      .filter((id) => id !== -1);
  };

  return (
    <div dir="rtl" className={cn("space-y-4", className)}>
      {attributes.map((attribute, index) => {
        const isFirstAttribute = index === 0;
        const availableOptions = isFirstAttribute
          ? attribute.options.map((opt) => opt.id)
          : getAvailableOptionsForSecondAttribute(attribute.id);

        return (
          <div key={attribute.id} className="space-y-2">
            <Select
              value={selectedOptions[attribute.id]?.toString()}
              onValueChange={(value) => handleOptionSelect(attribute.id, value)}
            >
              <SelectTrigger className="w-full border-gray-200 bg-white text-right">
                <SelectValue placeholder={`اختر ${attribute.title}`} />
              </SelectTrigger>
              <SelectContent>
                {attribute.options.map((option) => {
                  const isAvailable = isFirstAttribute || availableOptions.includes(option.id);
                  return (
                    <SelectItem
                      key={option.id}
                      value={option.id.toString()}
                      disabled={!isAvailable}
                      className={cn("cursor-pointer", !isAvailable && "text-gray-400 cursor-not-allowed")}
                    >
                      {option.title}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
};

export default ProductOptions;

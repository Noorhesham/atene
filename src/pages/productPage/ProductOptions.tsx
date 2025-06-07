"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Attribute, Variation } from "@/types/product";

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

  // Initialize with first option of each attribute
  useEffect(() => {
    const initialOptions: Record<number, number> = {};
    attributes.forEach((attr) => {
      if (attr.options.length > 0) {
        initialOptions[attr.id] = attr.options[0].id;
      }
    });
    setSelectedOptions(initialOptions);
  }, [attributes]);

  // Find matching variation whenever selected options change
  useEffect(() => {
    const matchingVariation = findMatchingVariation();
    onVariationChange?.(matchingVariation || null);
  }, [selectedOptions]);

  const findMatchingVariation = () => {
    return variations.find((variation) => {
      // Check if all selected options match the variation's attribute options
      return Object.entries(selectedOptions).every(([attrId, optionId]) => {
        const matchingAttrOption = variation.attribute_options.find((ao) => ao.attribute_id === Number(attrId));
        return matchingAttrOption && matchingAttrOption.option_id === optionId;
      });
    });
  };

  const handleOptionSelect = (attributeId: number, optionId: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: optionId,
    }));
  };

  const isOptionAvailable = (attributeId: number, optionId: number): boolean => {
    // Check if this option exists in any variation with current selections
    return variations.some((variation) => {
      const hasThisOption = variation.attribute_options.some(
        (ao) => ao.attribute_id === attributeId && ao.option_id === optionId
      );

      const matchesOtherSelections = Object.entries(selectedOptions)
        .filter(([attrId]) => Number(attrId) !== attributeId) // Exclude current attribute
        .every(([attrId, selectedOptId]) => {
          return variation.attribute_options.some(
            (ao) => ao.attribute_id === Number(attrId) && ao.option_id === selectedOptId
          );
        });

      return hasThisOption && matchesOtherSelections;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {attributes.map((attribute) => (
        <div key={attribute.id} className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block text-right">{attribute.title}</label>
          <div className="flex flex-wrap gap-2">
            {attribute.options.map((option) => {
              const isAvailable = isOptionAvailable(attribute.id, option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => isAvailable && handleOptionSelect(attribute.id, option.id)}
                  disabled={!isAvailable}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                    selectedOptions[attribute.id] === option.id
                      ? "bg-primary text-white border-primary"
                      : isAvailable
                      ? "border-gray-300 hover:border-primary"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {option.title}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductOptions;

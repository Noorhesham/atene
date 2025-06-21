"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SearchPageData, Attribute } from "@/types/product";
import { ListFilterPlus, Loader2 } from "lucide-react";
import Card from "./Card";
import { useState } from "react";
import { buttonVariants } from "./ui/button";

interface FilterSidebarProps {
  data?: SearchPageData;
  selectedCategories: number[];
  selectedSections: number[];
  onCategoryChange: (categoryId: number) => void;
  onSectionChange: (sectionId: number) => void;
  selectedTags: string[];
  onTagChange: (tagTitle: string) => void;
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  isLoading: boolean;
  isPriceEnabled: boolean;
  setIsPriceEnabled: (value: boolean) => void;
  selectedAttributes: Record<number, number[]>;
  onAttributeChange: (attributeId: number, optionId: number) => void;
}

export default function FilterSidebar({
  data,
  selectedCategories,
  selectedSections,
  onCategoryChange,
  onSectionChange,
  selectedTags,
  onTagChange,
  priceRange,
  onPriceChange,
  isLoading,
  isPriceEnabled,
  setIsPriceEnabled,
  selectedAttributes,
  onAttributeChange,
}: FilterSidebarProps) {
  const parentCategories = data?.categories.filter((c) => c.parent_id === null) || [];
  const getChildCategories = (parentId: number) => {
    return data?.categories.filter((c) => c.parent_id === parentId) || [];
  };

  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(priceRange);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col lg:gap-8 gap-4">
      <Card className="flex gap-2 items-center">
        <ListFilterPlus className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-gray-800">فلتر</h2>
      </Card>

      {/* Sections Filter */}
      <Card className="space-y-2">
        <h3 className="sub-heading  border-r-4 border-primary pr-2 ">الأقسام</h3>
        <div className="space-y-3 pr-4">
          {data?.sections?.map((section) => (
            <div key={section.id} className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id={`section-${section.id}`}
                checked={selectedSections.includes(section.id)}
                onCheckedChange={() => onSectionChange(section.id)}
              />
              <label
                htmlFor={`section-${section.id}`}
                className="text-sm  text-[#414141] mr-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {section.name}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories Filter */}
      <Card className="space-y-2">
        <h3 className="sub-heading  border-r-4 border-primary pr-2 ">فئات</h3>
        <Accordion type="multiple" className="w-full !border-none">
          {parentCategories.map((parent) => (
            <AccordionItem key={parent.id} value={`item-${parent.id}`}>
              <AccordionTrigger className="font-medium !border-none hover:no-underline">
                <div className="flex items-center gap-2">
                  {parent.image && (
                    <img src={parent.image} alt={parent.name} className="w-6 h-6 object-cover rounded" />
                  )}
                  <span>
                    {parent.name} ({parent.products_count})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pr-4">
                  {getChildCategories(parent.id).map((child) => (
                    <div key={child.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id={`cat-${child.id}`}
                        checked={selectedCategories.includes(child.id)}
                        onCheckedChange={() => onCategoryChange(child.id)}
                      />
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={`cat-${child.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {child.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Tags Filter */}
      <Card className="space-y-3">
        <h3 className="sub-heading  border-r-4 border-primary pr-2 ">العلامات</h3>
        <div className="flex flex-wrap gap-2">
          {data?.tags.map((tag) => (
            <Button
              key={tag.id}
              size="sm"
              className={`rounded-full border-primary ${buttonVariants({
                variant: "outline",
              })}  text-black !rounded-full ${
                selectedTags.includes(tag.id.toString()) ? "bg-primary text-white" : "  bg-[#0E0E0E17] "
              }`}
              onClick={() => onTagChange(tag.id.toString())}
            >
              {tag.title}
            </Button>
          ))}
        </div>
      </Card>

      {/* Attributes Filter */}
      {data?.attributes?.map((attribute: Attribute) => (
        <Card key={attribute.id} className="space-y-2">
          <h3 className="sub-heading border-r-4 border-primary pr-2">{attribute.title}</h3>
          <Select
            value={selectedAttributes[attribute.id]?.[0]?.toString()}
            onValueChange={(value) => {
              const optionId = parseInt(value);
              onAttributeChange(attribute.id, optionId);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`اختر ${attribute.title}`} />
            </SelectTrigger>
            <SelectContent>
              {attribute.options.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      ))}

      {/* Price Range Filter */}
      <Card className="space-y-4">
        <h3 className="sub-heading border-r-4 border-primary pr-2 ">النطاق السعري</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${tempPriceRange[0]}</span>
            <span>${tempPriceRange[1]}</span>
          </div>
          <div className="transition-opacity duration-300">
            <Slider
              min={data?.price_range.min || 0}
              max={data?.price_range.max || 1000}
              step={10}
              value={tempPriceRange}
              onValueChange={(value) => setTempPriceRange(value as [number, number])}
              dir="ltr" // Slider component works best in LTR mode
            />
          </div>
        </div>
      </Card>
      <button
        onClick={() => {
          setIsPriceEnabled(true);
          onPriceChange(tempPriceRange);
        }}
        className="w-full py-2 px-4 rounded-full text-white bg-gradient-to-r from-[#287CDA] to-[#154274] hover:opacity-90 transition-opacity"
      >
        {isPriceEnabled ? "تحديث فلتر السعر" : "تفعيل فلتر السعر"}
      </button>
      <Button
        variant="link"
        onClick={() => {
          setIsPriceEnabled(false);
          onPriceChange([0, 1000]);
          setTempPriceRange([0, 1000]);
          onAttributeChange(0, 0); // Reset all attribute filters
        }}
        className="w-full underline py-2 px-4 rounded-full text-primary  "
      >
        إعادة
      </Button>
    </div>
  );
}

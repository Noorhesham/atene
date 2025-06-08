"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import type { SearchPageData } from "@/types/product";
import { ListFilterPlus, Loader2 } from "lucide-react";
import Card from "./Card";

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
}: FilterSidebarProps) {
  const parentCategories = data?.categories.filter((c) => c.parent_id === null) || [];
  const getChildCategories = (parentId: number) => {
    return data?.categories.filter((c) => c.parent_id === parentId) || [];
  };

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
        <h3 className="font-semibold text-[#2D2D2D] text-xl border-r-2 border-primary pr-2 mt-4">الأقسام</h3>
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {section.name}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories Filter */}
      <Card className="space-y-2">
        <h3 className="font-semibold text-[#2D2D2D] text-xl border-r-2 border-primary pr-2 mt-4">فئات</h3>
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
        <h3 className="font-semibold text-[#2D2D2D] text-xl border-r-2 border-primary pr-2 mt-4">العلامات</h3>
        <div className="flex flex-wrap gap-2">
          {data?.tags.map((tag) => (
            <Button
              key={tag.id}
              variant={selectedTags.includes(tag.id.toString()) ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => onTagChange(tag.id.toString())}
            >
              {tag.title}
            </Button>
          ))}
        </div>
      </Card>

      {/* Price Range Filter */}
      <Card className="space-y-4">
        <h3 className="font-semibold text-[#2D2D2D] text-xl border-r-2 border-primary pr-2 mt-4">النطاق السعري</h3>
        <Slider
          min={data?.price_range.min || 0}
          max={data?.price_range.max || 1000}
          step={10}
          value={priceRange}
          onValueChange={onPriceChange}
          dir="ltr" // Slider component works best in LTR mode
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </Card>
    </div>
  );
}

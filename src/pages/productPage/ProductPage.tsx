"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Filter, Loader2, Search, ServerCrash } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import type { Product } from "@/types/product";
import { useDebounce } from "@/hooks/use-debounce";
import { searchProducts, getSearchPageData } from "@/utils/api/product";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import FilterSidebar from "@/components/FilterSidebar";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import ProductCard from "@/components/ProductCard";
import ProductTags from "@/components/ProductTags";
import { Pagination } from "./Pagination";
import TopNavBar from "@/components/TopNavBar";

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

const transformProductForCard = (product: Product) => ({
  id: String(product.id),
  title: product.name,
  price: product.price,
  originalPrice: product.cross_sells_price,
  discount:
    product.cross_sells_price > 0
      ? Math.round(((product.cross_sells_price - product.price) / product.cross_sells_price) * 100)
      : 0,
  images: product.gallery
    ? product.gallery.map((url) => ({ src: url, alt: product.name }))
    : product.cover
    ? [{ src: product.cover, alt: product.name }]
    : [],
  rating: product.review_rate || 0,
  reviewCount: product.review_count || 0,
  description: product.description || "",
  shortDescription: product.short_description || "",
  category: product.category,
  sku: product.sku || "",
  condition: product.condition,
  status: product.status,
  slug: product.slug || "",
});

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [isPriceEnabled, setIsPriceEnabled] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number[]>>({});
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    searchParams.get("category_id")?.split(",").map(Number).filter(Boolean) || []
  );
  const [selectedSections, setSelectedSections] = useState<number[]>(
    searchParams.get("section_id")?.split(",").map(Number).filter(Boolean) || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("min_price")) || 0,
    Number(searchParams.get("max_price")) || 1000,
  ]);

  // Debounce inputs to prevent excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    } else {
      params.delete("page");
    }

    // Add attributes to URL params
    Object.entries(selectedAttributes).forEach(([attributeId, optionIds]) => {
      if (optionIds.length > 0) {
        params.set(`attribute_${attributeId}`, optionIds.join(","));
      } else {
        params.delete(`attribute_${attributeId}`);
      }
    });

    if (selectedCategories.length > 0) {
      params.set("category_id", selectedCategories.join(","));
    } else {
      params.delete("category_id");
    }

    if (selectedSections.length > 0) {
      params.set("section_id", selectedSections.join(","));
    } else {
      params.delete("section_id");
    }

    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    } else {
      params.delete("tags");
    }

    if (priceRange[0] > 0) {
      params.set("min_price", priceRange[0].toString());
    } else {
      params.delete("min_price");
    }

    if (priceRange[1] < 1000) {
      params.set("max_price", priceRange[1].toString());
    } else {
      params.delete("max_price");
    }

    setSearchParams(params);
  }, [
    debouncedSearch,
    currentPage,
    selectedAttributes,
    selectedCategories,
    selectedSections,
    selectedTags,
    priceRange,
    setSearchParams,
  ]);

  // Query for filter data (categories, tags, price range) - fetches once
  const { data: searchData, isLoading: isLoadingSearchData } = useQuery({
    queryKey: ["searchPageData"],
    queryFn: getSearchPageData,
    staleTime: Number.POSITIVE_INFINITY, // This data is considered static
  });

  // Query for products - refetches when filters change
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: [
      "products",
      debouncedSearch,
      currentPage,
      selectedCategories,
      selectedSections,
      selectedTags,
      priceRange,
      selectedAttributes,
    ],
    queryFn: () =>
      searchProducts({
        query: debouncedSearch || undefined,
        page: currentPage,
        category_id: selectedCategories.length ? selectedCategories[0] : undefined,
        section_id: selectedSections.length ? selectedSections[0] : undefined,
        tags: selectedTags.length ? selectedTags : undefined,
        min_price: isPriceEnabled ? priceRange[0] : undefined,
        max_price: isPriceEnabled ? priceRange[1] : undefined,
        variation_options: Object.values(selectedAttributes).flat().filter(Boolean),
      }),
    enabled: !!searchData, // Only run this query after filter data is available
  });

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSectionChange = (sectionId: number) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleTagChange = (tagTitle: string) => {
    setSelectedTags((prev) => (prev.includes(tagTitle) ? prev.filter((t) => t !== tagTitle) : [...prev, tagTitle]));
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAttributeChange = (attributeId: number, optionId: number) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };
      if (optionId) {
        newAttributes[attributeId] = [optionId];
      } else {
        delete newAttributes[attributeId];
      }
      return newAttributes;
    });
  };

  // Check if we have a single category from URL and find its data
  const isOneCategory = selectedCategories.length === 1;
  const selectedCategory =
    isOneCategory && searchData?.categories?.find((cat: Category) => cat.id === selectedCategories[0]);
  console.log(searchData, "searchData", productsData, "productsData");
  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <TopNavBar />
      <MaxWidthWrapper>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 lg:hidden">
                    <Filter className="h-4 w-4" />
                    <span>فلتر</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0">
                  <FilterSidebar
                    data={searchData}
                    selectedCategories={selectedCategories}
                    selectedSections={selectedSections}
                    onCategoryChange={handleCategoryChange}
                    onSectionChange={handleSectionChange}
                    selectedTags={selectedTags}
                    onTagChange={handleTagChange}
                    priceRange={priceRange}
                    onPriceChange={handlePriceChange}
                    isLoading={isLoadingSearchData}
                    isPriceEnabled={isPriceEnabled}
                    setIsPriceEnabled={setIsPriceEnabled}
                    selectedAttributes={selectedAttributes}
                    onAttributeChange={handleAttributeChange}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <main className="grid grid-cols-12 gap-8">
            <aside className="hidden lg:block lg:col-span-3">
              <FilterSidebar
                data={searchData}
                selectedCategories={selectedCategories}
                selectedSections={selectedSections}
                onCategoryChange={handleCategoryChange}
                onSectionChange={handleSectionChange}
                selectedTags={selectedTags}
                onTagChange={handleTagChange}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                isLoading={isLoadingSearchData}
                isPriceEnabled={isPriceEnabled}
                setIsPriceEnabled={setIsPriceEnabled}
                selectedAttributes={selectedAttributes}
                onAttributeChange={handleAttributeChange}
              />
            </aside>

            <div className="col-span-12 lg:col-span-9">
              <div className="">
                <header className="flex flex-col gap-4 w-full">
                  {selectedCategory ? (
                    <div className="relative rounded-2xl w-full h-[392px] mb-2">
                      <div
                        className="absolute  rounded-2xl inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${selectedCategory.image})`,
                          filter: "brightness(0.5)",
                        }}
                      />
                      <div className="absolute inset-0  rounded-2xl bg-black/50" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                        <h1 className="text-4xl font-bold text-white mb-2">{selectedCategory.name}</h1>
                        <p className="text-white/80 text-sm mb-8">
                          إظهار 1- {productsData?.products.length} من {productsData?.products.length} عنصر (عدد النتائج)
                        </p>
                        <div className="w-full max-w-xl">
                          <div className="relative ">
                            <Input
                              type="search"
                              placeholder="بحث"
                              className="rounded-full w-full pl-12 pr-6 h-12 bg-white/20 border-[#287CDA] backdrop-blur-sm text-right"
                              value={searchQuery}
                              onChange={(e) => handleSearch(e.target.value)}
                            />
                            <button
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#287CDA] rounded-full p-2"
                              aria-label="بحث"
                            >
                              <Search className="h-5 w-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <h1 className="heading">استكشف المزيد من عمليات البحث ذات الصلة</h1>
                  )}
                  <>
                    {searchData?.tags && (
                      <ProductTags
                        tags={searchData.tags}
                        selectedTags={selectedTags}
                        handleTagChange={handleTagChange}
                      />
                    )}
                  </>
                  <div className="flex w-full">
                    {!selectedCategory && (
                      <div className="relative border-1 border-[#287CDA] rounded-full w-full">
                        <Input
                          type="search"
                          placeholder="ابحث..."
                          className="rounded-full w-full pl-12 pr-4 h-10 lg:h-12"
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div className="absolute bg-[#287CDA] rounded-full p-1 lg:p-2 left-1 lg:left-2 top-1/2 -translate-y-1/2">
                          <Search className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col text-base gap-2 mb-8">
                    <p className="font-bold text-base">
                      إظهار 1- {productsData?.products.length} من {productsData?.products.length} عنصر (عدد النتائج)
                    </p>
                    <p className="text-[#949494]">
                      يمكن للبائعين الذين يتطلعون إلى تنمية أعمالهم والوصول إلى المزيد من المشترين المهتمين استخدام منصة
                      A'atene الإعلانية لتسليط الضوء على منتجاتهم إلى جانب نتائج البحث العضوية. ستظهر نتائج البحث
                      النهائية بناءً على مدى الصلة، ومبلغ الدفع لكل نقرة.
                    </p>
                  </div>
                </header>

                {isLoadingProducts ? (
                  <div className="flex justify-center items-center h-96">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {productsError ? (
                      <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg flex flex-col items-center gap-4">
                        <ServerCrash className="h-10 w-10" />
                        <p>فشل تحميل المنتجات. يرجى المحاولة مرة أخرى.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 mt-4 gap-6">
                          {productsData?.products.map((product: Product) => (
                            <ProductCard key={product.id} product={transformProductForCard(product)} />
                          ))}
                        </div>
                        {productsData?.products.length === 0 && (
                          <div className="text-center text-gray-500 py-20">
                            <p>لم يتم العثور على منتجات تطابق بحثك.</p>
                          </div>
                        )}
                        {productsData?.products && productsData.products.length > 0 && (
                          <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil((productsData?.total || 0) / 15)}
                            onPageChange={handlePageChange}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

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
  }, [debouncedSearch, selectedCategories, selectedSections, selectedTags, priceRange, setSearchParams]);

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
    queryKey: ["products", debouncedSearch, selectedCategories, selectedSections, selectedTags, priceRange],
    queryFn: () =>
      searchProducts({
        query: debouncedSearch || undefined,
        category_id: selectedCategories.length ? selectedCategories[0] : undefined,
        section_id: selectedSections.length ? selectedSections[0] : undefined,
        tags: selectedTags.length ? selectedTags : undefined,
        min_price: priceRange[0],
        max_price: priceRange[1],
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

  const isLoading = isLoadingSearchData || isLoadingProducts;

  // Check if we have a single category from URL and find its data
  const isOneCategory = selectedCategories.length === 1;
  const selectedCategory =
    isOneCategory && searchData?.categories?.find((cat: Category) => cat.id === selectedCategories[0]);

  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <MaxWidthWrapper>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              إظهار {productsData?.products.length || 0} من {productsData?.products.length || 0} عنصر
            </p>
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
              />
            </aside>

            <div className="col-span-12 lg:col-span-9">
              {isLoading && (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              )}

              {productsError && (
                <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg flex flex-col items-center gap-4">
                  <ServerCrash className="h-10 w-10" />
                  <p>فشل تحميل المنتجات. يرجى المحاولة مرة أخرى.</p>
                </div>
              )}

              {!isLoading && !productsError && (
                <div className="space-y-4">
                  <header className="space-y-4 w-full">
                    {selectedCategory ? (
                      <div className="relative w-full h-[300px] rounded-2xl overflow-hidden mb-8">
                        <img
                          src={selectedCategory.image}
                          alt={selectedCategory.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-center p-6">
                          <h1 className="text-3xl font-bold text-white mb-8">{selectedCategory.name}</h1>
                          <div className="w-full max-w-2xl">
                            <div className="relative">
                              <Input
                                type="search"
                                placeholder="ابحث..."
                                className="rounded-full w-full pl-12 pr-4 h-12 bg-white/90 backdrop-blur-sm"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                              />
                              <div className="absolute bg-primary rounded-full p-2 left-4 top-1/2 -translate-y-1/2">
                                <Search className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-lg lg:text-3xl font-bold text-gray-800">
                          استكشف المزيد من عمليات البحث ذات الصلة
                        </h1>
                        <div className="flex w-full">
                          <div className="relative border-1 border-primary rounded-full w-full">
                            <Input
                              type="search"
                              placeholder="ابحث..."
                              className="rounded-full w-full pl-12 pr-4 h-10 lg:h-12"
                              value={searchQuery}
                              onChange={(e) => handleSearch(e.target.value)}
                            />
                            <div className="absolute bg-primary rounded-full p-1 lg:p-2 left-1 lg:left-4 top-1/2 -translate-y-1/2">
                              <Search className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {searchData?.tags && (
                      <ProductTags
                        tags={searchData.tags}
                        selectedTags={selectedTags}
                        handleTagChange={handleTagChange}
                      />
                    )}
                    <div className="flex flex-col text-base gap-2 mb-8">
                      <p className="font-bold">
                        إظهار 1- {productsData?.products.length} من {productsData?.products.length} عنصر (عدد النتائج)
                      </p>
                      <p className="text-[#949494]">
                        يمكن للبائعين الذين يتطلعون إلى تنمية أعمالهم والوصول إلى المزيد من المشترين المهتمين استخدام
                        منصة A'atene الإعلانية لتسليط الضوء على منتجاتهم إلى جانب نتائج البحث العضوية. ستظهر نتائج البحث
                        النهائية بناءً على مدى الصلة، ومبلغ الدفع لكل نقرة.
                      </p>
                    </div>
                  </header>
                  <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {productsData?.products.map((product: Product) => (
                      <ProductCard key={product.id} product={transformProductForCard(product)} />
                    ))}
                  </div>
                  {productsData?.products.length === 0 && (
                    <div className="text-center text-gray-500 py-20">
                      <p>لم يتم العثور على منتجات تطابق بحثك.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

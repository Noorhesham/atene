import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchProducts } from "@/utils/api/product";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { useDebounce } from "@/hooks/use-debounce";
import { Link } from "react-router-dom";

// Sample product data - in a real app, this would come from an API or database

/**
 * Product Detail Page
 * Displays a single product with all its details
 */
const ProductPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => searchProducts({ query: debouncedSearch }),
  });

  return (
    <MaxWidthWrapper>
      <div className="py-8 space-y-8">
        {/* Search Input */}
        <div className="flex justify-center">
          <Input
            type="search"
            placeholder="Search products..."
            className="max-w-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && <div className="text-center text-red-500">Failed to load products. Please try again.</div>}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.products.map((product: Product) => (
            <Link
              to={`/products/${product.slug}`}
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative">
                {product.cover ? (
                  <img src={product.cover} alt={product.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                {product.discount_present > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    {product.discount_present}% OFF
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    {product.price_after_discount < product.price ? (
                      <>
                        <span className="text-red-500 font-bold">${product.price_after_discount}</span>
                        <span className="text-gray-400 line-through ml-2">${product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold">${product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {data?.products.length === 0 && <div className="text-center text-gray-500">No products found</div>}
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductPage;

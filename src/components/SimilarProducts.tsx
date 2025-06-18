import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface SimilarProductsProps {
  products: Product[];
}

const SimilarProducts = ({ products }: SimilarProductsProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      {/* <h2 className="text-2xl font-bold mb-6 text-right">منتجات مشابهة</h2> */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id.toString(),
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
                : [], // DefaultProductImage will be shown if no images
              rating: product.review_rate || 0,
              reviewCount: product.review_count || 0,
              description: product.description || "",
              shortDescription: product.short_description || "",
              category: product.category,
              sku: product.sku || "",
              condition: product.condition,
              status: product.status,
              slug: product.slug,
              
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;

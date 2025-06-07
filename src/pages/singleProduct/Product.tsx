import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProduct } from "@/utils/api/product";
import ProductSection from "../productPage/product-section";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";

const SingleProduct = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MaxWidthWrapper>
    );
  }

  if (error) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center min-h-[60vh] text-red-500">
          Failed to load product. Please try again.
        </div>
      </MaxWidthWrapper>
    );
  }

  if (!data?.product) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center min-h-[60vh] text-gray-500">Product not found</div>
      </MaxWidthWrapper>
    );
  }

  // Prepare images array, starting with cover and then gallery
  const images = [
    { src: data.product.cover, alt: data.product.name },
    ...(data.product.gallery?.map((url) => ({ src: url, alt: data.product.name })) || []),
  ].filter((img) => img.src); // Filter out null images

  // Get color and storage attributes
  const colorAttribute = data.attributes.find((attr) => attr.title === "اللون");
  const storageAttribute = data.attributes.find((attr) => attr.title === "مساحة التخزين");
  console.log(data);
  return (
    <div className="font-display">
      <ProductSection
        product={{
          id: data.product.id.toString(),
          title: data.product.name,
          description: data.product.description,
          shortDescription: data.product.short_description,
          price: data.product.price,
          originalPrice: data.product.cross_sells_price,
          discount:
            data.product.cross_sells_price > 0
              ? Math.round(
                  ((data.product.cross_sells_price - data.product.price) / data.product.cross_sells_price) * 100
                )
              : 0,
          rating: data.product.review_rate || 0,
          reviewCount: data.product.review_count || 0,
          images,
          sizes: colorAttribute?.options.map((opt) => opt.title) || [],
          weights: storageAttribute?.options.map((opt) => opt.title) || [],
          reviews: [],
          specifications: data.product.specifications,
          store: data.store,
          similar: data.similar,
          variations: data.product.variations,
          category: data.product.category,
          attributes: data.attributes,
          sku: data.product.sku,
          condition: data.product.condition,
          status: data.product.status,
          categories: data.categories,
        }}
      />
    </div>
  );
};

export default SingleProduct;

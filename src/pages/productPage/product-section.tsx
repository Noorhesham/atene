import { HeartIcon, PhoneIcon, SendHorizonalIcon, Star } from "lucide-react";
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import MaxWidthWrapper from "../../components/MaxwidthWrapper";
import ProductSwiper from "../../components/ProductSwiper";
import ProductOptions from "./ProductOptions";
import { Button } from "../../components/ui/button";
import Price from "@/components/Price";
import Features from "@/components/Featuers";
import Seller from "@/components/Seller";
import { TabsProduct } from "@/components/TabsProduct";
import SimilarProducts from "@/components/SimilarProducts";
import CategoryScroll from "@/components/CategoryScroll";
import { ProductSectionProps } from "@/types";

/**
 * ProductSection - Main product display section
 * Combines gallery, options, and product information
 *
 * @param product - Product data object
\ */
const ProductSection = ({ product }: { product: ProductSectionProps }) => {
  // Breadcrumb items - would typically come from navigation context
  const breadcrumbItems = [
    { label: "قائمة المنتجات", href: "/products" },
    { label: product.title, href: `/products/${product.id}` },
  ];

  return (
    <section dir="rtl">
      {/* Breadcrumb */}
      <MaxWidthWrapper className="mb-4">
        <CustomBreadcrumb items={breadcrumbItems} />
      </MaxWidthWrapper>

      {/* Product Content */}
      <MaxWidthWrapper noPadding className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <div className="w-full">
            <ProductSwiper images={product.images} />
          </div>

          {/* Product Info and Options */}
          <div className={`flex flex-col text-right`}>
            <div className="flex lg:flex-row flex-col w-full items-center mb-6 gap-2">
              {/* Price */}
              <Price price={product.price} originalPrice={product.originalPrice} discount={product.discount} />
              <div className="flex mr-auto items-center">
                {/* Stars */}
                <div className="flex items-center gap-1 lg:border-r-2 border-gray-800 p-2  my-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4  ${i < product.rating ? "text-yellow-500" : "text-gray-300"}`}
                      fill={i < product.rating ? "oklch(79.5% 0.184 86.047)" : "#d1d5dc "}
                    />
                  ))}
                </div>
                {/* Review count */}
                {product.reviewCount > 0 ? (
                  <div>{`(  ${product.reviewCount} مراجعة  )`}</div>
                ) : (
                  <div>لا مراجعات حتي الان</div>
                )}
              </div>
            </div>
            {/* Title and Rating */}
            <div className="flex justify-between pb-6   border-b border-[#AEAEAE] items-start">
              <h1 className="text-3xl font-bold  mb-2">{product.title}</h1>
              <HeartIcon className=" text-[#AEAEAE] mt-3  w-8  h-8  font-normal" />
            </div>
            {/* Description */}
            <p className="text-muted-foreground mt-5 mb-6">{product.description}</p>
            {/* Product Options */}
            <ProductOptions sizes={product.sizes} weights={product.weights} className="mb-6" />
            {/* Add to Cart Button */}
            <Button size="lg" className="w-full  flex items-center gap-2 text-lg rounded-full  text-white mb-4">
              {" "}
              <span className=" text-right"> *** *** *** 912+</span>
              <PhoneIcon />
            </Button>
            {/* Call Button */}
            <Button variant="outline" size="lg" className="w-full text-lg rounded-full ">
              <span>دردش</span> <SendHorizonalIcon />
            </Button>
            <Features />
          </div>
        </div>
        <Seller />
        <TabsProduct product={product} />
        <SimilarProducts />
        <CategoryScroll />
      </MaxWidthWrapper>
    </section>
  );
};

export default ProductSection;

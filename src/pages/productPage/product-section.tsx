import { useState } from "react";
import { HeartIcon, Link, Phone, PhoneIcon, SendHorizonalIcon, Star } from "lucide-react";
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
import { ProductSectionProps, Variation } from "@/types/product";
import { formatPhoneNumber } from "@/utils/cn";
import CrossSellBundle from "@/components/cross-sell-bundle";
import ProductTags from "@/components/ProductTags";

/**
 * ProductSection - Main product display section
 * Combines gallery, options, and product information
 *
 * @param product - Product data object
\ */
const ProductSection = ({ product }: { product: ProductSectionProps }) => {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  console.log(product.cross_sells, "cross_sells");
  // Get the current price based on selected variation
  const currentPrice = selectedVariation?.price || product.price;
  const currentOriginalPrice = product.originalPrice;
  const currentDiscount =
    currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : 0;

  // Get current images based on selected variation
  const currentImages = selectedVariation
    ? [
        ...(selectedVariation.image ? [{ src: selectedVariation.image, alt: product.title }] : []),
        ...(selectedVariation.gallery?.map((img) => ({ src: img, alt: product.title })) || []),
      ]
    : product.images;

  // Breadcrumb items based on category hierarchy
  const breadcrumbItems = [
    { label: "الرئيسية", href: "/" },
    { label: product.category.name, href: `/category/${product.category.id}` },
    { label: product.title, href: `/products/${product.id}` },
  ];
  const formattedNumber = formatPhoneNumber(product.store.phone);

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
            <ProductSwiper images={currentImages} />
          </div>
          {/* Product Info and Options */}
          <div className="flex flex-col text-right">
            <div className="flex lg:flex-row flex-col w-full items-center mb-6 gap-2">
              {/* Price */}
              <Price price={currentPrice} originalPrice={currentOriginalPrice} discount={currentDiscount} />
              <div className="flex items-center">
                {/* Stars */}
                <div className="flex items-center gap-1 lg:border-r-2 border-gray-800 p-2 my-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < product.rating ? "text-yellow-500" : "text-gray-300"}`}
                      fill={i < product.rating ? "oklch(79.5% 0.184 86.047)" : "#d1d5dc"}
                    />
                  ))}
                </div>
                {/* Review count */}
                {product.reviewCount > 0 ? (
                  <div>{`(${product.reviewCount} مراجعة)`}</div>
                ) : (
                  <div>لا مراجعات حتي الان</div>
                )}
              </div>
            </div>

            {/* Title and Rating */}
            <div className="flex justify-between pb-6 border-b border-[#AEAEAE] items-start">
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <HeartIcon className="text-[#AEAEAE] mt-3 w-8 h-8 font-normal" />
            </div>

            {/* Description */}
            <p className="text-muted-foreground mt-5 mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />

            {/* Product Options */}
            <ProductOptions
              attributes={product.attributes}
              variations={product.variations}
              className="mb-6"
              onVariationChange={setSelectedVariation}
            />

            {/* Contact Buttons */}
            <div className="flex flex-col gap-2">
              {" "}
              <a href={`tel:${product.store.phone}`}>
                {" "}
                <Button
                  size="lg"
                  className="w-full flex items-center text-right justify-center gap-3 text-lg rounded-full  text-white px-8"
                >
                  <span className="font-medium tracking-wider">{formattedNumber}</span>
                  <Phone className="h-6 w-6" />
                </Button>
              </a>
              {/* Chat Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full border-primary text-primary  font-semibold text-lg rounded-full"
              >
                <span>دردش</span> <SendHorizonalIcon />
              </Button>
            </div>

            {/* Features */}
            <Features specifications={product.specifications} />
          </div>{" "}
        </div>

        {/* Seller Info */}
        <Seller store={product.store} />
        <div className="mt-5 flex justify-center">
          {" "}
          <CrossSellBundle bundle={product} />
        </div>
        {/* Product Tabs */}
        <TabsProduct product={product} />
        <div className="flex flex-col mt-6 gap-4 ">
          <h2 className="text-2xl font-bold text-right">استكشف المزيد من عمليات البحث ذات الصلة</h2>
          <ProductTags tags={product.tags} selectedTags={product.tags} handleTagChange={() => {}} />
        </div>
        {/* Similar Products */}
        <SimilarProducts products={product.similar} />

        {/* Category Scroll */}
        <div className="flex flex-col gap-2 mt-8">
          <h2 className="text-2xl font-bold text-right">استكشاف الفئات</h2>
          <CategoryScroll categories={product.categories} />
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ProductSection;

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Card from "./Card";
import { AnimatePresence, motion } from "framer-motion";
import ReviewSummary from "./reviews/ReviewSummary";
import ReviewForm from "./reviews/ReviewForm";
import ReviewCard from "./reviews/ReviewCard";
import { ProductSectionProps } from "@/types/product";
import StoreReviews from "./reviews/StoreReviews";

export function TabsProduct({ product }: { product: ProductSectionProps }) {
  console.log(product);

  // Convert rate_stats to the format expected by ReviewSummary
  const ratingLabels: Record<string, string> = {
    "5": "ممتاز",
    "4": "جيد",
    "3": "متوسط",
    "2": "ليس سيئًا",
    "1": "سيئ",
  };

  const formattedReviewCounts = product.rate_stats
    ? Object.entries(product.rate_stats).reduce((acc, [rating, count]) => {
        acc[ratingLabels[rating] || rating] = count;
        return acc;
      }, {} as Record<string, number>)
    : {};

  return (
    <Tabs defaultValue="product" className="w-full mt-5" dir="rtl">
      <TabsList className="grid w-full grid-cols-2 gap-4 md:grid-cols-2 sm:grid-cols-2">
        <TabsTrigger className="" value="product">
          وصف المنتج
        </TabsTrigger>
        <TabsTrigger value="reviews">تقييم و مراجعات</TabsTrigger>
        {/* <TabsTrigger value="shipping"> سياسة المتجر</TabsTrigger> */}
      </TabsList>
      <TabsContent value="product">
        <div className="overflow-hidden h-full min-h-[20vh] lg:min-h-[30vh] mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="grid gap-5 my-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 shadow-sm py-2 px-4 rounded-2xl border-gray-300 border">
                  <h2 className="font-bold my-4 text-xl">المعلومات</h2>
                  <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                    <div className="flex gap-4 flex-col">
                      <Card className="justify-between !border-none flex items-center">
                        <span className="font-bold">إعلان /نموذج رقم</span>
                        <span># {product.sku || "لا يوجد"}</span>
                      </Card>
                      <Card className="bg-[#EFF2F4] !border-none justify-between flex items-center">
                        <span className="font-bold">القسم الرئيسي</span>
                        <span>{product.category.name}</span>
                      </Card>

                      {/* <Card className="bg-[#DEE2E7] justify-between flex items-center">
                        <span className="font-bold">المدينة</span>
                        <span>القاهرة </span>
                      </Card> */}
                    </div>

                    <div className="flex flex-col">
                      <Card className="justify-between !border-none flex items-center">
                        <span className="font-bold">الحالة </span>
                        <span>{product.condition === "new" ? "جديد" : "مستعمل"}</span>
                      </Card>
                      {/* <Card className="justify-between flex items-center">
                        <span className="font-bold">النوع:</span>
                        <span>خواتم</span>
                      </Card>
                      <Card className="bg-[#DEE2E7] justify-between flex items-center">
                        <span className="font-bold">القسم الفرعي :</span>
                        <span>اكسسوارات - مجوهرات</span>
                      </Card> */}
                      {/* <Card className="justify-between flex items-center">
                        <span className="font-bold">هل لديك خدمة توصيل؟ </span>
                        <span>لا</span>
                      </Card>
                      <Card className="bg-[#DEE2E7] justify-between flex items-center">
                        <span className="font-bold">الحي / المنطقة:</span>
                        <span>التجمع الخامس </span>
                      </Card> */}
                    </div>
                  </div>
                </div>
                {/* <div className="col-span-1 flex flex-col gap-4 md:col-span-2 lg:col-span-2">
                  <Card className="bg-[#EFF2F4]">
                    <h2 className="font-bold my-2 text-xl">هل تريد مشاهدات أكثر لاعلانك ؟</h2>
                    <div className="flex bg-white px-4 py-2 rounded-xl justify-between items-center my-5">
                      <div className="flex gap-1 items-center">
                        <Medal className="w-5 text-yellow-400 h-5" />
                        ميز وأعد نشر إعلانك
                      </div>
                      <ChevronLeft />
                    </div>
                  </Card>
                  <Card className="bg-[#EFF2F4]">
                    <h2 className="font-bold my-2 text-xl">هل تود اضافة اعلان مماثل ؟</h2>
                    <div className="flex bg-white px-4 py-2 rounded-xl justify-between items-center my-5">
                      <div className="flex gap-1 items-center">
                        <Bell className="w-5 text-rose-400 h-5" />
                        أضف إعلانك الآن{" "}
                      </div>
                      <ChevronLeft />
                    </div>
                  </Card>
                </div> */}
              </div>
              {/* <p className="text-base text-muted-foreground my-4">
                لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود تينسيدونت أوت لاوريت
                دولور ماجن. لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود
                تينسيدونت أوت لاوريت دولور ماجن. لوريم إيبسوم ألم سيت أميت، أديبي سكينج إليت لوريم إيبسوم ألم سيت أميت،
                كونسيكتيتور أديبي سكينج إليت لوريم إيبسوم ألم سيت أميت، كونسيكتيتور أديبي سكينج إليت
              </p> */}
            </motion.div>
          </AnimatePresence>
        </div>
      </TabsContent>
      <TabsContent value="reviews">
        <div className="mt-6">
          <Tabs defaultValue="product-reviews">
            <TabsList className="w-full max-w-2xl ml-auto mb-6">
              <TabsTrigger value="store-reviews" className="bg-none flex-1">
                <span className="bg-[#FF00E5] text-white rounded-full px-3 py-0.5 text-sm mr-1">
                  {product.store.review_count || 0}
                </span>
                مراجعات المتجر{" "}
              </TabsTrigger>
              <TabsTrigger value="product-reviews" className="bg-none flex-1">
                <span className="bg-[#3B82F6] text-white rounded-full px-3 py-0.5 text-sm mr-1">
                  {product.reviewCount}
                </span>
                مراجعات المنتج{" "}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="product-reviews">
              <AnimatePresence mode="wait">
                <motion.div
                  key="product-reviews"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {/* Product Reviews */}
                  <ReviewSummary
                    reviews_counts={formattedReviewCounts}
                    review_count={product.reviewCount}
                    review_rate={product.rating}
                  />

                  {/* Reviews */}
                  <div className="my-6">
                    {product.reviews?.map((review) => (
                      <ReviewCard
                        productSlug={product.slug}
                        name={review.name}
                        avatar={review.avatar}
                        review={review.review}
                        images={review.images}
                        rating={review.rating}
                        date={review.date}
                        id={review.id.toString()}
                      />
                    ))}
                  </div>

                  {/* Write a review */}
                  <ReviewForm productId={product.id} />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="store-reviews">
              <AnimatePresence mode="wait">
                <motion.div
                  key="store-reviews"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <StoreReviews store={product.store} />
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </TabsContent>

      {/* <TabsContent value="shipping"></TabsContent> */}
    </Tabs>
  );
}

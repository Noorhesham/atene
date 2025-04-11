import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Medal } from "lucide-react";
import Card from "./Card";
import { AnimatePresence, motion } from "framer-motion";
import ReviewSummary from "./ReviewSummary";
import ReviewForm from "./ReviewForm";

export function TabsProduct() {
  return (
    <Tabs defaultValue="product" className="w-full mt-5" dir="rtl">
      <TabsList className="grid w-full grid-cols-3 gap-4 md:grid-cols-3 sm:grid-cols-2">
        <TabsTrigger className="" value="product">
          وصف المنتج
        </TabsTrigger>
        <TabsTrigger value="reviews">تفيم و مراجعات</TabsTrigger>
        <TabsTrigger value="shipping"> سياسة المتجر</TabsTrigger>
      </TabsList>
      <TabsContent value="product">
        <div className="overflow-hidden h-full min-h-[20vh] lg:min-h-[40vh] mt-8">
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
                    <div className="flex flex-col">
                      <Card className="justify-between flex items-center">
                        <span className="font-bold">إعلان /نموذج رقم</span>
                        <span># 8786867</span>
                      </Card>
                      <Card className="bg-[#DEE2E7] justify-between flex items-center">
                        <span className="font-bold">القسم الرئيسي</span>
                        <span>ازياء - موضة نسائية</span>
                      </Card>
                      <Card className="justify-between flex items-center">
                        <span className="font-bold">الحالة </span>
                        <span>جديد</span>
                      </Card>
                      <Card className="bg-[#DEE2E7] justify-between flex items-center">
                        <span className="font-bold">المدينة</span>
                        <span>القاهرة </span>
                      </Card>
                    </div>

                    <div className="flex flex-col">
                      <Card className="justify-between flex items-center">
                        <span className="font-bold">النوع:</span>
                        <span>خواتم</span>
                      </Card>
                      <Card className="bg-[#DEE2E7] justify-between flex items-center">
                        <span className="font-bold">القسم الفرعي :</span>
                        <span>اكسسوارات - مجوهرات</span>
                      </Card>
                      <Card className="justify-between flex items-center">
                        <span className="font-bold">هل لديك خدمة توصيل؟ </span>
                        <span>لا</span>
                      </Card>
                      <Card className="bg-[#DEE2E7] justify-between flex items-center">
                        <span className="font-bold">الحي / المنطقة:</span>
                        <span>التجمع الخامس </span>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                  <Card className="bg-[#EFF2F4]">
                    <h2 className="font-bold my-2 text-xl">هل تريد مشاهدات أكثر لاعلانك ؟</h2>
                    <div className="flex bg-white px-4 py-2 rounded-xl justify-between items-center my-5">
                      <div className="flex gap-1 items-center">
                        <Medal className="w-5 h-5" />
                        ميز وأعد نشر إعلانك
                      </div>
                      <ChevronLeft />
                    </div>
                  </Card>
                </div>
              </div>
              <p className="text-base text-muted-foreground my-4">
                لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود تينسيدونت أوت لاوريت
                دولور ماجن. لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود
                تينسيدونت أوت لاوريت دولور ماجن. لوريم إيبسوم ألم سيت أميت، أديبي سكينج إليت لوريم إيبسوم ألم سيت أميت،
                كونسيكتيتور أديبي سكينج إليت لوريم إيبسوم ألم سيت أميت، كونسيكتيتور أديبي سكينج إليت
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </TabsContent>
      <TabsContent value="reviews">
        <div className="mt-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="reviews-content"
              initial={{ opacity: 0 }}
              className="my-4"
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Ratings summary */}
              <ReviewSummary
                reviews_counts={{
                  ممتاز: 100,
                  جيد: 11,
                  متوسط: 3,
                  "ليس سيئًا": 8,
                  سيئ: 1,
                }}
                review_count={123}
                review_rate={4.8}
              />

              {/* Reviews */}
              {[1, 2].map((r) => (
                <Card key={r} className="p-4 my-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src="https://via.placeholder.com/40" alt="User avatar" className="w-10 h-10 rounded-full" />
                      <h5 className="text-sm">مايك جونسون</h5>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                  <div className="mr-12">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود تينسيدونت أوت
                      لاوريت دولور ماجن.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <div className="w-12 h-12 bg-gray-300 rounded-xl" />
                      <div className="w-12 h-12 bg-gray-300 rounded-xl" />
                      <div className="w-12 h-12 bg-gray-300 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500 mt-2">5M</div>
                      <div className="text-sm text-gray-500 mt-2">يحب</div>
                      <div className="text-sm text-gray-500 mt-2">يرد</div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Write a review */}
              {/* <ReviewForm /> */}
            </motion.div>
          </AnimatePresence>
        </div>
      </TabsContent>

      <TabsContent value="shipping"></TabsContent>
    </Tabs>
  );
}

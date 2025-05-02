import React, { useState } from "react";
import StoreProfile from "@/components/StoreProfile";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";

const StorePage = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("products");

  // Sample store data (in a real app, this would come from an API)
  const storeData = {
    id: "etnix-byron",
    name: "EtnixByron",
    avatar: "https://ui-avatars.com/api/?name=Etnix&background=FFF&color=000&bold=true&size=256",
    location: "خليج بايرون، أستراليا",
    bio: "زي الجينات، الجينات الأنيقة الرائع لمهرجان بوهيمي",
    rating: 4.5,
    reviewCount: 32,
    followers: 350,
    followersAvatars: [
      "https://randomuser.me/api/portraits/women/32.jpg",
      "https://randomuser.me/api/portraits/men/45.jpg",
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/men/22.jpg",
      "https://randomuser.me/api/portraits/women/54.jpg",
    ],
    coverImages: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <StoreProfile {...storeData} />

      <MaxWidthWrapper className="mt-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b text-right">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "products"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              المنتجات
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "reviews" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              التقييمات
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "about" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              حول المتجر
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="البحث في المنتجات..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-full py-2 px-4 text-right"
                />
              </div>
              <h2 className="text-xl font-bold text-right">منتجات المتجر</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for product cards */}
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 w-3/4 bg-gray-300 animate-pulse mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-300 animate-pulse mb-4"></div>
                      <div className="h-6 w-1/3 bg-gray-300 animate-pulse"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 text-right">تقييمات العملاء</h2>
            <div className="space-y-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-end mb-3">
                      <div className="text-right ml-3">
                        <div className="font-medium">اسم المستخدم {i + 1}</div>
                        <div className="text-sm text-gray-500">قبل {i + 1} أيام</div>
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${20 + i}.jpg`}
                          alt={`Reviewer ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex mb-2 justify-end">
                      {Array(5)
                        .fill(0)
                        .map((_, j) => (
                          <svg
                            key={j}
                            className={`w-4 h-4 ${j < 4 ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>
                    <p className="text-right text-gray-700">
                      تجربة رائعة مع هذا المتجر! المنتجات ذات جودة عالية والخدمة ممتازة. سأشتري منهم مرة أخرى بالتأكيد.
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 text-right">حول المتجر</h2>
            <div className="text-right">
              <p className="mb-4 text-gray-700">
                تأسس متجر EtnixByron في عام 2015 في خليج بايرون، أستراليا. نحن متخصصون في تصميم وإنتاج الملابس البوهيمية
                الفريدة والمميزة التي تعكس روح المهرجانات وأسلوب الحياة الحر.
              </p>
              <p className="mb-4 text-gray-700">
                جميع منتجاتنا مصنوعة يدويًا من مواد عالية الجودة ومستدامة، مع التركيز على التفاصيل والحرفية. نحن نؤمن
                بأن الموضة يمكن أن تكون جميلة ومسؤولة في نفس الوقت.
              </p>
              <div className="mt-6">
                <h3 className="font-bold mb-2">معلومات الاتصال:</h3>
                <p className="text-gray-700">البريد الإلكتروني: info@etnixbyron.com</p>
                <p className="text-gray-700">الهاتف: +61 2 1234 5678</p>
              </div>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default StorePage;

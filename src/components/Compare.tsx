"use client";

import Image from "next/image";
import { Heart, RotateCcw, Menu } from "lucide-react";

export default function CompareComponent() {
  return (
    <div className="max-w-6xl mx-auto p-4 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6" />
          <div className="flex flex-col gap-1">
            <div className="w-4 h-1 bg-gray-800 rounded"></div>
            <div className="w-4 h-1 bg-gray-800 rounded"></div>
            <div className="w-4 h-1 bg-gray-800 rounded"></div>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold text-gray-800">المقارنة</h1>
          <p className="text-sm text-gray-600">اختر أي منتج لإظهار تفاصيلها</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200">
          <div className="p-4 text-center font-medium text-gray-700 border-l border-gray-200">فعل</div>
          <div className="p-4 text-center font-medium text-gray-700 border-l border-gray-200">التقييمات</div>
          <div className="p-4 text-center font-medium text-gray-700 border-l border-gray-200">رسوم التوصيل</div>
          <div className="p-4 text-center font-medium text-gray-700 border-l border-gray-200">السعر</div>
          <div className="p-4 text-center font-medium text-gray-700 border-l border-gray-200">الوصف</div>
          <div className="p-4 text-center font-medium text-gray-700">المنتج</div>
        </div>

        {/* Product Row 1 */}
        <div className="grid grid-cols-6 border-b border-gray-200">
          {/* Action Column */}
          <div className="p-4 flex flex-col items-center gap-2 border-l border-gray-200">
            <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
              <div className="w-3 h-3 border border-gray-400"></div>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500">
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Rating Column */}
          <div className="p-4 text-center border-l border-gray-200">
            <div className="text-2xl font-bold text-orange-400 mb-1">4.0</div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-4 h-4 text-orange-400">
                  ★
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500">( 32 مراجعة )</div>
          </div>

          {/* Delivery Column */}
          <div className="p-4 text-center border-l border-gray-200">
            <div className="text-sm font-medium">190.54 ₪</div>
          </div>

          {/* Price Column */}
          <div className="p-4 text-center border-l border-gray-200">
            <div className="text-lg font-bold">190.54 ₪</div>
            <div className="relative inline-block">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">50% off</span>
              <span className="text-red-500 text-sm mr-2">249 ₪</span>
            </div>
          </div>

          {/* Description Column */}
          <div className="p-4 border-l border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed text-right">
              تشيرت حريمي بليستات مريح ذا القميص بأكمام طويلة وياقة دائرية مطبوع عليه شعار الشركة. مصنوع من قطن عالي
              الجودة ليوفر الراحة طوال اليوم. هذا القميص مناسب لجميع المناسبات اليومية. الألوان الكلاسيكية تجعله مناسباً
              لجميع الأذواق. يمكن ارتداؤه في جميع فصول السنة. عملي وأنيق، مصمم من أجل عمل أنيق، مصمم من أجل الراحة.
              مناسب لجميع الأعمار. يمكن تنسيقه مع جينز أو بنطلون قماش. الجودة المضمونة وطول العمر.
            </p>
          </div>

          {/* Product Column */}
          <div className="p-4 flex justify-center">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=120&width=90"
                alt="Men Black Solid Clothing Sweat Shirt Polyester Clothing Tees Shirt Men One Vertical Clothing Cotton Shirt Grey Tshirts One"
                width={90}
                height={120}
                className="rounded-lg object-cover"
              />
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">C</div>
            </div>
          </div>
        </div>

        {/* Product Row 2 */}
        <div className="grid grid-cols-6">
          {/* Action Column */}
          <div className="p-4 flex flex-col items-center gap-2 border-l border-gray-200">
            <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
              <div className="w-3 h-3 border border-gray-400"></div>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500">
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Rating Column */}
          <div className="p-4 text-center border-l border-gray-200">
            <div className="text-2xl font-bold text-orange-400 mb-1">4.0</div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-4 h-4 text-orange-400">
                  ★
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500">( 32 مراجعة )</div>
          </div>

          {/* Delivery Column */}
          <div className="p-4 text-center border-l border-gray-200">
            <div className="text-sm font-medium">190.54 ₪</div>
          </div>

          {/* Price Column */}
          <div className="p-4 text-center border-l border-gray-200">
            <div className="text-lg font-bold">190.54 ₪</div>
            <div className="relative inline-block">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">50% off</span>
              <span className="text-red-500 text-sm mr-2">249 ₪</span>
            </div>
          </div>

          {/* Description Column */}
          <div className="p-4 border-l border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed text-right">
              تشيرت حريمي بليستات مريح ذا القميص بأكمام طويلة وياقة دائرية مطبوع عليه شعار الشركة. مصنوع من قطن عالي
              الجودة ليوفر الراحة طوال اليوم. هذا القميص مناسب لجميع المناسبات اليومية. الألوان الكلاسيكية تجعله مناسباً
              لجميع الأذواق. يمكن ارتداؤه في جميع فصول السنة. عملي وأنيق، مصمم من أجل عمل أنيق، مصمم من أجل الراحة.
              مناسب لجميع الأعمار. يمكن تنسيقه مع جينز أو بنطلون قماش. الجودة المضمونة وطول العمر.
            </p>
          </div>

          {/* Product Column */}
          <div className="p-4 flex justify-center">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=120&width=90"
                alt="Men Black Solid Clothing Sweat Shirt Polyester Clothing Tees Shirt Men One Vertical Clothing Cotton Shirt Grey Tshirts One"
                width={90}
                height={120}
                className="rounded-lg object-cover"
              />
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

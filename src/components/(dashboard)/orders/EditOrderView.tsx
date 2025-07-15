"use client";

import React, { useState } from "react";
import ProductGrid from "./ProductList";
import { ChevronLeft } from "@/components/icons";
import ShoppingCartComponent from "./ShoppingCart";

// MOCK DATA
const productCategories = [
  { name: "جميع المنتجات", count: 12, active: true },
  { name: "ملابس", count: 12, active: false },
  { name: "مستلزمات تجميل", count: 2, active: false },
  { name: "اخرى", count: 0, active: false },
];

const productsData = [
  { id: "p1", name: "اسم المنتج", price: 927.0, image: "https://placehold.co/150x150/F3F4F6/9CA3AF?text=1" },
  { id: "p2", name: "اسم المنتج", price: 927.0, image: "https://placehold.co/150x150/F3F4F6/9CA3AF?text=2" },
  { id: "p3", name: "اسم المنتج", price: 100.0, image: "https://placehold.co/150x150/F3F4F6/9CA3AF?text=3" },
  { id: "p4", name: "اسم المنتج", price: 927.0, image: "https://placehold.co/150x150/F3F4F6/9CA3AF?text=4" },
  { id: "p5", name: "اسم المنتج", price: 927.0, image: "https://placehold.co/150x150/F3F4F6/9CA3AF?text=5" },
  { id: "p6", name: "اسم المنتج", price: 927.0, image: "https://placehold.co/150x150/F3F4F6/9CA3AF?text=6" },
];
export const ProductFilterPanel = ({ categories }: { categories: any[] }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-gray-800">
        جميع المنتجات ({categories.reduce((acc, cat) => acc + (cat.count || 0), 0)})
      </h2>
      <button className="p-1 rounded-md hover:bg-gray-100" title="Toggle Panel">
        <ChevronLeft size={20} />
      </button>
    </div>
    <ul>
      {categories.map((cat, index) => (
        <li
          key={index}
          className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
            cat.active ? "bg-blue-50 text-main font-bold" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center gap-2">{cat.name}</span>
          <ChevronLeft size={16} />
        </li>
      ))}
    </ul>
  </div>
);

const EditOrderLayout = ({ onBack }: { onBack: () => void }) => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product: any) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: any, newQuantity: any) => {
    if (newQuantity < 1) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
    }
  };

  return (
    <>
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="w-full lg:w-auto">
          <p className="text-gray-500 mt-1">الطلبات / طلب جديد</p>
        </div>
        {/* Optional: Add back button or other actions here */}
      </header>
      <div className="grid grid-cols-12 gap-6">
        {" "}
        <div className="col-span-12 lg:col-span-3">
          <ProductFilterPanel categories={productCategories} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <ProductGrid products={productsData} onAddToCart={handleAddToCart} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <ShoppingCartComponent
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={() => setCartItems([])}
          />
        </div>
      </div>
    </>
  );
};

export default EditOrderLayout;

import React, { useState, useEffect, useMemo } from "react";
import { ApiOrder, ApiProduct, ApiUser } from "@/types";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { VariantSelectionModal } from "./VariantSelectionModal";
import { Search, X, ChevronLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const EditOrderView = ({ orderToEdit, onBack }: { orderToEdit: ApiOrder; onBack: () => void }) => {
  const { data: products, isLoading: productsLoading } = useAdminEntityQuery("products");
  const { data: clients, isLoading: clientsLoading } = useAdminEntityQuery("order-clients");
  const { data: coupons, isLoading: couponsLoading } = useAdminEntityQuery("coupons");
  const { data: categories = [] } = useAdminEntityQuery("categories");
  const { update, isUpdating, create } = useAdminEntityQuery("orders");
  type CartItem = ApiOrder["items"][number] & { variation_id?: number };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productForVariants, setProductForVariants] = useState<ApiProduct | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1);
  // Step 2 form data
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: number; name: string; phone: string } | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "paid">("cash");
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    // Prefill cart with existing order items so they are visible/editable
    setCartItems(orderToEdit?.items || []);
    // Highlight those products in the product grid
    const existingProductIds = new Set((orderToEdit?.items || []).map((item) => item.product_id));
    setSelectedProducts(existingProductIds);
  }, [orderToEdit?.id, clients]);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    let filtered = products || [];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product: ApiProduct) => product.category_id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product: ApiProduct) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = (product: ApiProduct) => {
    if (product.type === "variation" && Array.isArray(product.variations) && product.variations.length > 0) {
      setProductForVariants(product);
      return;
    }

    const existingItem = cartItems.find((item) => item.product_id === product.id && !item.variation_id);
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: Date.now(), // Temporary ID for new item
        product_id: product.id,
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
        },
        quantity: 1,
        price: product.price,
        price_after_discount: product.price,
      };
      setCartItems((prev) => [...prev, newItem]);
      setSelectedProducts((prev) => new Set([...prev, product.id]));
    }
  };

  const handleAddVariantToCart = (product: ApiProduct, selectedVariants: Record<string, string>) => {
    const variantName = `${product.name} (${Object.values(selectedVariants).join(", ")})`;
    // Find matching variation by comparing selected variant titles with attributeOptions titles
    type VariationAO = { attribute?: { title?: string; name?: string }; option?: { title?: string; name?: string } };
    type Variation = { id: number; price?: number; attributeOptions?: VariationAO[] };
    const variations: Variation[] = Array.isArray(product.variations) ? (product.variations as Variation[]) : [];
    const matchedVariation = variations.find((v) => {
      const opts: VariationAO[] = v?.attributeOptions || [];
      // Every selected key must exist in this variation
      return Object.entries(selectedVariants).every(([attrTitle, optTitle]) =>
        opts.some(
          (ao) =>
            (ao?.attribute?.title || ao?.attribute?.name) === attrTitle &&
            (ao?.option?.title || ao?.option?.name) === optTitle
        )
      );
    });
    const variationId: number | undefined = matchedVariation?.id;
    const priceForVariation: number = Number(matchedVariation?.price ?? product.price);

    const existingItem = cartItems.find((item) => item.product_id === product.id && item.variation_id === variationId);
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product_id: product.id,
        variation_id: variationId,
        product: {
          id: product.id,
          name: variantName,
          sku: product.sku,
          price: priceForVariation,
        },
        quantity: 1,
        price: priceForVariation,
        price_after_discount: priceForVariation,
      };
      setCartItems((prev) => [...prev, newItem]);
      setSelectedProducts((prev) => new Set([...prev, product.id]));
    }
    setProductForVariants(null);
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      // Remove from selected products if quantity becomes 0
      const itemToRemove = cartItems.find((item) => item.id === itemId);
      if (itemToRemove) {
        setSelectedProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemToRemove.product_id);
          return newSet;
        });
      }
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
    }
  };

  const handleSaveChanges = () => {
    // Compute totals
    const shippingCost = Number(orderToEdit?.shipping_cost || 0);
    const subTotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const discountTotal = cartItems.reduce((sum, item) => {
      const priceAfter = Number(item.price_after_discount ?? item.price);
      const perUnitDiscount = Number(item.price) - priceAfter;
      return sum + perUnitDiscount * Number(item.quantity);
    }, 0);
    const total = subTotal - discountTotal + shippingCost;

    // Map items to expected API payload (no nested product).
    // Include id only for items that existed on the original order.
    const originalItemIds = new Set(orderToEdit?.items.map((i) => i.id));
    const itemsPayload = cartItems.map((item) => {
      const base = {
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        price: item.price,
        price_after_discount: item.price_after_discount ?? item.price,
      } as {
        id?: number;
        product_id: number;
        variation_id?: number;
        quantity: number;
        price: number;
        price_after_discount: number;
      };
      if (originalItemIds.has(item.id)) {
        base.id = item.id;
      }
      return base;
    });

    const updatedOrderData = {
      status: orderToEdit?.status,
      client_id: selectedCustomer?.id,
      name: orderToEdit?.name,
      email: orderToEdit?.email,
      phone: orderToEdit?.phone,
      notes: orderToEdit?.notes,
      address: orderToEdit?.address,
      sub_total: subTotal,
      discount_total: discountTotal,
      shipping_cost: shippingCost,
      total,
      items: itemsPayload,
    } as unknown as Partial<ApiOrder>;

    orderToEdit?.id ? update(orderToEdit.id, updatedOrderData) : create(updatedOrderData);
    onBack();
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const renderStep1 = () => (
    <div className="col-span-12 lg:col-span-4 h-full flex flex-col p-4">
      <div className="flex bg-white rounded-lg p-4 px-6 border border-input justify-between items-center mb-4">
        <h3 className="font-bold text-main">
          سلة الطلب <span className="text-sm font-normal text-[#717171]">({cartItems.length} قطع)</span>
        </h3>
        <button
          onClick={() => {
            setCartItems([]);
            setSelectedProducts(new Set());
          }}
          className="bg-red-50 text-red-600 px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 hover:bg-red-100"
        >
          <X className="w-4 h-4" /> تفريغ السلة
        </button>
      </div>
      <div className="flex-grow overflow-y-auto bg-white items-center flex flex-col rounded-lg p-4 px-6 border border-input">
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center my-auto h-fit justify-center text-gray-400">
            <img src="/car2t.svg" alt="" />
            <p className="text-[#555] text-[22px] font-[700]">لم يتم اختيار منتج</p>
            <p className="text-[#AAA] text-[16px] font-[400]">يمكنك إضافة أول منتج للسلة بالضغط عليه من القائمة</p>
          </div>
        ) : (
          <div className="flex-grow w-full overflow-y-auto space-y-3">
            {cartItems.map((item) => {
              // Find the original product data to get cover_url
              const originalProduct = products?.find((p) => p.id === item.product_id);
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={originalProduct?.cover_url || ""}
                    alt={item.product?.name}
                    className="w-16 h-16 rounded-md object-cover bg-gray-100"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-main text-sm">{item.product?.name}</p>
                    <p className="font-bold text-main">{item.price.toFixed(2)} ₪</p>
                  </div>
                  <div className="flex items-center border border-input rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                      title="زيادة الكمية"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </button>
                    <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                      title="تقليل الكمية"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="border-t border-input pt-4 mt-4 space-y-3">
        <div className="flex items-center gap-1 font-semibold text-base">
          <span className="text-[#1C1C1C]">الاجمالي:</span>
          <span className="text-[#393939]">{cartTotal.toFixed(2)} ₪</span>
        </div>
        <button
          onClick={() => setStep(2)}
          disabled={cartItems.length === 0}
          className="w-full bg-[#406896] text-center flex text-white hover:bg-main/90 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <span className="flex mx-auto items-center gap-2">
            التالي
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </button>
        <button
          onClick={onBack}
          className="w-full text-center py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
  console.log(coupons);
  const renderStep2 = () => (
    <div
      className="bg-gray-50 col-span-12 lg:col-span-4 h-full p-4 sm:p-6 flex items-center justify-center min-h-full"
      dir="rtl"
    >
      <div className="w-full h-full max-w-lg flex flex-col">
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm flex-grow">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-lg font-bold text-[#406896]">استكمال الطلب</h1>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-md"
            >
              الرجوع للخلف
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-8">
            {/* Customer Section */}
            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                العميل <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => {
                  const customer = clients.data.find((c: ApiUser) => c.id === parseInt(value));
                  if (customer) {
                    setSelectedCustomer({
                      id: customer.id,
                      name: `${customer.first_name} ${customer.last_name}`.trim() || customer.email,
                      phone: customer.phone || "",
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full bg-white text-right pr-4 pl-10 py-5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="ابحث عن العميل بالاسم أو الهاتف" />
                </SelectTrigger>
                <SelectContent>
                  {clientsLoading ? (
                    <SelectItem value="loading" disabled>
                      جاري التحميل...
                    </SelectItem>
                  ) : (
                    clients.data.map((customer: ApiUser) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {`${customer.first_name} ${customer.last_name}`.trim() || customer.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">الدفع</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value as "cash" | "paid")}
                    className="peer sr-only"
                  />
                  <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[#406896] peer-checked:bg-white transition">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#406896] opacity-0 peer-checked:opacity-100 transition-opacity"></span>
                  </span>
                  <span className="text-gray-700">الدفع عند الاستلام</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="paid"
                    checked={paymentMethod === "paid"}
                    onChange={(e) => setPaymentMethod(e.target.value as "cash" | "paid")}
                    className="peer sr-only"
                  />
                  <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[#406896] peer-checked:bg-white transition">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#406896] opacity-0 peer-checked:opacity-100 transition-opacity"></span>
                  </span>
                  <span className="text-gray-700">مدفوع</span>
                </label>
              </div>
            </div>

            {/* Discount Coupon Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">كوبون الخصم</h3>
              <Select onValueChange={setCouponCode}>
                <SelectTrigger className="w-full bg-white text-right pr-4 pl-10 py-5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="كود الكوبون" />
                </SelectTrigger>
                <SelectContent>
                  {couponsLoading ? (
                    <SelectItem value="loading" disabled>
                      جاري التحميل...
                    </SelectItem>
                  ) : (
                    coupons.map((coupon: any) => (
                      <SelectItem key={coupon.id} value={coupon.code}>
                        {coupon.code}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            onClick={handleSaveChanges}
            disabled={isUpdating || clientsLoading || productsLoading}
            className="w-full bg-[#406896] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3A5779] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                fill="white"
              />
            </svg>
            حفظ الطلب
          </button>
        </div>
      </div>
    </div>
  );
  if (clientsLoading || productsLoading)
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  return (
    <div className={` w-full ${!orderToEdit && "px-8 py-4"} grid grid-cols-12 gap-6 h-[calc(100vh-150px)]`}>
      {" "}
      {productForVariants && (
        <VariantSelectionModal
          product={productForVariants}
          onClose={() => setProductForVariants(null)}
          onConfirm={handleAddVariantToCart}
        />
      )}
      {/* Left: Product Categories Filter */}
      <div className="col-span-12 lg:col-span-3  bg-white rounded-md overflow-hidden">
        <div className=" overflow-hidden">
          {/* All Categories Option */}
          <button
            style={{
              backgroundColor: selectedCategory === null ? "rgba(91, 136, 186, 0.20)" : "transparent",
            }}
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-right px-4 py-4 text-sm font-medium flex justify-between items-center`}
          >
            <div className="flex items-center gap-2">
              <span className="text-main text-base">جميع المنتجات</span>
              <span className="text-xs text-gray-500">({products?.length || 0})</span>
            </div>
            {selectedCategory === null && <ChevronLeft size={16} />}
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              style={{
                backgroundColor: selectedCategory === category.id ? "rgba(91, 136, 186, 0.20)" : "transparent",
              }}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-right px-4 py-4 text-sm font-medium flex justify-between items-center`}
            >
              <div className="flex items-center gap-2">
                <span className="text-main text-base">{category.name}</span>
                <span className="text-xs text-gray-500">
                  ({products?.filter((p: ApiProduct) => p.category_id === category.id).length || 0})
                </span>
              </div>
              {selectedCategory === category.id && <ChevronLeft size={16} />}
            </button>
          ))}
        </div>
      </div>
      {/* Middle: Product List */}
      <div className="col-span-12 lg:col-span-5 bg-white rounded-lg border border-input h-full flex flex-col">
        <div className=" border-b border-input">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              placeholder="ابحث عن منتج"
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {productsLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product: ApiProduct) => {
                const isSelected = selectedProducts.has(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className={`border border-input rounded-lg p-2 cursor-pointer hover:shadow-md transition-all ${
                      isSelected ? "ring-2 ring-main bg-main/5" : ""
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={product.cover_url || ""}
                        alt={product.name}
                        className="w-full h-28 object-cover rounded-md mb-2 bg-gray-100"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-6 h-6 bg-main text-white rounded-full flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="font-[400] text-[#717171] truncate text-[12.174px]">{product.name}</p>
                    <p className="font-normal text-black">{product.price.toFixed(2)} ₪</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

export default EditOrderView;

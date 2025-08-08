import React, { useState, useEffect, useMemo } from "react";
import { ApiOrder, ApiProduct } from "@/types";
import Loader from "@/components/Loader";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { VariantSelectionModal } from "./VariantSelectionModal";
import { Search, X, Plus, Minus } from "lucide-react";
import { Loader2 } from "lucide-react";

const EditOrderView = ({ orderToEdit, onBack }: { orderToEdit: ApiOrder; onBack: () => void }) => {
  const { data: products, isLoading: productsLoading } = useAdminEntityQuery("products");
  const { update, isUpdating } = useAdminEntityQuery("orders");
  type CartItem = ApiOrder["items"][number] & { variation_id?: number };
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productForVariants, setProductForVariants] = useState<ApiProduct | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());

  // Selected product ids used only for UI highlighting

  useEffect(() => {
    // Prefill cart with existing order items so they are visible/editable
    setCartItems(orderToEdit?.items || []);
    // Highlight those products in the product grid
    const existingProductIds = new Set((orderToEdit?.items || []).map((item) => item.product_id));
    setSelectedProducts(existingProductIds);
  }, [orderToEdit?.id]);

  // Simple hash previously used for variant id; no longer needed after using real variation_id

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
    const shippingCost = Number(orderToEdit.shipping_cost || 0);
    const subTotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const discountTotal = cartItems.reduce((sum, item) => {
      const priceAfter = Number(item.price_after_discount ?? item.price);
      const perUnitDiscount = Number(item.price) - priceAfter;
      return sum + perUnitDiscount * Number(item.quantity);
    }, 0);
    const total = subTotal - discountTotal + shippingCost;

    // Map items to expected API payload (no nested product).
    // Include id only for items that existed on the original order.
    const originalItemIds = new Set(orderToEdit.items.map((i) => i.id));
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
      status: orderToEdit.status,
      client_id: orderToEdit.client_id,
      name: orderToEdit.name,
      email: orderToEdit.email,
      phone: orderToEdit.phone,
      notes: orderToEdit.notes,
      address: orderToEdit.address,
      sub_total: subTotal,
      discount_total: discountTotal,
      shipping_cost: shippingCost,
      total,
      items: itemsPayload,
    } as unknown as Partial<ApiOrder>;

    update(orderToEdit.id, updatedOrderData);
    onBack();
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-150px)]">
      {productForVariants && (
        <VariantSelectionModal
          product={productForVariants}
          onClose={() => setProductForVariants(null)}
          onConfirm={handleAddVariantToCart}
        />
      )}
      {/* Left: Product Categories (Placeholder) */}
      <div className="col-span-12 lg:col-span-3 bg-white rounded-lg border p-4">
        <h3 className="font-bold mb-4">جميع المنتجات</h3>
        {/* Category list can be implemented here */}
      </div>

      {/* Middle: Product List */}
      <div className="col-span-12 lg:col-span-5 bg-white rounded-lg border h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input placeholder="ابحث عن منتج" className="w-full pr-10 pl-4 py-2 border rounded-lg bg-gray-50" />
          </div>
        </div>
        {productsLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product: ApiProduct) => {
                const isSelected = selectedProducts.has(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className={`border rounded-lg p-2 cursor-pointer hover:shadow-md transition-all ${
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
                    <p className="font-semibold text-gray-800 truncate text-sm">{product.name}</p>
                    <p className="font-bold text-main">{product.price.toFixed(2)} ₪</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right: Shopping Cart */}
      <div className="col-span-12 lg:col-span-4 bg-white rounded-lg border h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-main">سلة الطلب ({cartItems.length} قطع)</h3>
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
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400">لم يتم اختيار منتج</div>
        ) : (
          <div className="flex-grow overflow-y-auto space-y-3">
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
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                      title="زيادة الكمية"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                      title="تقليل الكمية"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="border-t pt-4 mt-4 space-y-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>الاجمالي:</span>
            <span>{cartTotal.toFixed(2)} ₪</span>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={isUpdating}
            className="w-full bg-main text-white hover:bg-main/90 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {isUpdating ? <Loader /> : "حفظ التغييرات"}
          </button>
          <button
            onClick={onBack}
            className="w-full text-center py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderView;

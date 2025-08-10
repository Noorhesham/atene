import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, Package, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiProduct, ApiCategory, BaseEntity } from "@/types";
import { ProductCreationForm } from "@/components/productCreation";
import Actions from "@/components/Actions";
import ModalCustom from "@/components/ModalCustom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

import SectionsPopover from "@/components/SectionsPopover";
import { useLocation } from "react-router-dom";
import Loader from "@/components/Loader";
import { API_BASE_URL } from "@/constants/api";
import { PaginatedList } from "@/components/admin/PaginatedList";
import Order from "@/components/Order";
import StatusIndicator from "@/components/StatusIndicator";

const FILTER_CATEGORIES = [
  { name: "الكل", value: null },
  { name: "منشور", value: "active" },
  { name: "مغلق", value: "not-active" },
];

interface FilterCategory {
  name: string;
  value: string | null;
}

const FilterPanel = ({
  statusCategories,
  productCategories,
  activeStatusFilter,
  activeCategoryFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
}: {
  statusCategories: FilterCategory[];
  productCategories: ApiCategory[];
  activeStatusFilter: string | null;
  activeCategoryFilter: string | null;
  onStatusFilterChange: (filter: string | null) => void;
  onCategoryFilterChange: (filter: string | null) => void;
}) => (
  <div className="w-full space-y-6">
    {/* Status Filter */}
    <div className=" pt-5">
      <h3 className="font-bold text-gray-800 mb-4 px-2">تصفية حسب الحالة</h3>
      <ul>
        {statusCategories.map((cat, index) => (
          <li key={index}>
            <button
              style={{
                backgroundColor: activeStatusFilter === cat.value ? "rgba(91, 136, 186, 0.20)" : "transparent",
              }}
              onClick={() => onStatusFilterChange(cat.value)}
              className={`w-full text-right px-4 py-4 rounded-md text-sm font-medium flex justify-between items-center`}
            >
              <span>{cat.name}</span>
              {activeStatusFilter === cat.value && <ChevronLeft size={16} />}
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* Category Filter */}
    <div>
      <h3 className="font-bold text-gray-800 mb-4 px-2">تصفية حسب الفئة</h3>
      <ul>
        <li>
          <button
            style={{
              backgroundColor: activeCategoryFilter === null ? "rgba(91, 136, 186, 0.20)" : "transparent",
            }}
            onClick={() => onCategoryFilterChange(null)}
            className={`w-full text-right px-4 text-main py-2.5 rounded-md text-sm font-medium flex justify-between items-center`}
          >
            <span>جميع الفئات</span>
            {activeCategoryFilter === null && <ChevronLeft size={16} />}
          </button>
        </li>
        {productCategories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryFilterChange(category.id.toString())}
              className={`w-full text-right px-4 py-2.5 rounded-md text-sm font-medium flex justify-between items-center ${
                activeCategoryFilter === category.id.toString()
                  ? "bg-blue-50 text-[rgba(91, 136, 186, 0.20)]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{category.name}</span>
              {activeCategoryFilter === category.id.toString() && <ChevronLeft size={16} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default function ProductsPageDashboard() {
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ApiProduct | null>(null);
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  const handleOrderChange = (dir: "asc" | "desc") => {
    setOrderDir(dir);
  };

  // Get section from URL params
  const urlParams = new URLSearchParams(location.search);
  const sectionFilter = urlParams.get("section");

  // Fetch products with filters
  const {
    data: products,
    totalRecords,
    remove: deleteProduct,
    refetch,
  } = useAdminEntityQuery("products", {
    initialPerPage: 10,
    queryParams: {
      ...(statusFilter && { status: statusFilter }),
      ...(categoryFilter && { category_id: categoryFilter }),
      ...(sectionFilter && { section: sectionFilter }),
      order_dir: orderDir, // Add orderDir to affect the API endpoint
    },
  });

  // Fetch categories for filter
  const { data: categories = [], isLoading: isLoadingCategories } = useAdminEntityQuery("categories");
  const { data: stores = [], isLoading: isLoadingStores } = useAdminEntityQuery("stores");
  const { user } = useAuth();
  console.log(stores);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [searchInput, setSearchInput] = useState("");

  // Set the first product as selected by default once data loads
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  // Handle search input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // The search will be handled by PaginatedList component
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Refetch data when orderDir changes to affect the API endpoint
  useEffect(() => {
    refetch();
  }, [orderDir, refetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);

    if (e.target.value.trim() !== "") {
      setSelectedProduct(null);
    }
  };

  // Function to update product status
  const updateProductStatus = async (product: ApiProduct) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/admin/products/${product.id}/update-status`, {
        method: "POST",
        body: JSON.stringify({
          status: product.status === "active" ? "not-active" : "active",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update product status");
      }

      toast.success("تم تغيير حالة المنتج بنجاح");

      // Update the selected product state to reflect the new status
      setSelectedProduct((prev) =>
        prev
          ? ({
              ...prev,
              status: prev.status === "active" ? "inactive" : "active",
            } as ApiProduct)
          : null
      );

      refetch(); // Revalidate the products data
    } catch (error) {
      console.error("Failed to update product status:", error);
      toast.error("فشل تغيير حالة المنتج");
    }
  };

  const renderProductItem = (product: ApiProduct) => {
    // Filtering is now handled on the backend via queryParams

    const currentPrice = product.sale_price || product.price;
    console.log(product);
    return (
      <div className="flex items-center gap-3 p-3 border-b border-input">
        {/* Middle: Product Info */}
        <input
          checked={selectedProduct?.id === product.id}
          type="checkbox"
          className="w-5 h-5 rounded border-1 border-input text-main focus:ring-2 focus:ring-main focus:ring-offset-2 focus:ring-offset-white cursor-pointer transition-all duration-200 ease-in-out hover:border-main checked:bg-main checked:border-main checked:hover:bg-main/90"
          aria-label={`اختر المنتج ${product.name}`}
          title={`اختر المنتج ${product.name}`}
        />
        <div className="flex-1 flex items-center gap-4">
          {/* Image */}
          <div className="w-14 h-14 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden">
            {product.gallary_url && product.gallary_url.length > 0 ? (
              <img src={product.gallary_url[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={24} className="text-gray-400" />
              </div>
            )}
          </div>
          {/* Text Details */}
          <div className="flex flex-col items-start justify-center gap-1">
            <p className="font-semibold text-gray-900 text-sm text-right line-clamp-1">
              {product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Tag size={14} />
                <span>{product.category.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package size={14} />
                <span>{product.tags_count}</span>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Left Side: Price */}
        <div className="flex-shrink-0 flex flex-col">
          <p className="text-base font-semibold flex flex-row-reverse gap-1 text-[#393939] whitespace-nowrap">
            <span>₪ {"  "}</span> {currentPrice}
          </p>
          <StatusIndicator status={product.status} />
        </div>
      </div>
    );
  };
  if (!user || isLoadingCategories || isLoadingStores) return <Loader />;

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">المنتجات</h1>
      </header>

      <div className="flex justify-between  gap-4 items-center mb-4">
        <div className="relative flex-1  w-full">
          <Input
            type="text"
            placeholder="ابحث باسم المنتج أو رمز المنتج"
            className="w-full bg-white py-3 pr-10 pl-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchInput}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
        </div>
        <div className="flex gap-2">
          <SectionsPopover />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Right Panel: Filters */}
        <div className="col-span-12 lg:col-span-2">
          <Card className="p-0">
            <FilterPanel
              statusCategories={FILTER_CATEGORIES}
              productCategories={categories}
              activeStatusFilter={statusFilter}
              activeCategoryFilter={categoryFilter}
              onStatusFilterChange={setStatusFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
          </Card>
        </div>

        {/* Middle Panel: Products List */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="p-0 h-[calc(100vh-250px)]">
            {" "}
            <div className=" bg-white shadow-sm py-2 rounded-lg px-4 flex justify-between ">
              {" "}
              <div className="flex text-black font-bold items-center gap-2">
                <p className="text-sm ">الكل</p>
                <span className="text-sm ">({totalRecords})</span>
              </div>
              <Order orderDir={orderDir} setOrderDir={handleOrderChange} />
            </div>
            <PaginatedList<ApiProduct>
              entityName="products"
              selectedItem={selectedProduct}
              onSelectItem={setSelectedProduct}
              renderItem={renderProductItem}
              searchQuery={searchInput}
              pageSize={10}
              queryParams={{
                ...(statusFilter && { status: statusFilter }),
                ...(categoryFilter && { category_id: categoryFilter }),
                ...(sectionFilter && { section: sectionFilter }),
                order_dir: orderDir,
              }}
            />
          </Card>
        </div>

        {/* Left Panel: Product Details */}
        <div className="col-span-12 lg:col-span-7">
          {selectedProduct ? (
            <>
              <Actions
                isActive={selectedProduct.status === "active"}
                title="إجراءات المنتج"
                onApprove={
                  user?.user.user_type === "admin"
                    ? async () => {
                        await updateProductStatus(selectedProduct);
                      }
                    : undefined
                }
                editLink={`/admin/products/add/${selectedProduct.id}`}
                entity={selectedProduct as unknown as BaseEntity}
                entityType="products"
                deleteMessage={`هل أنت متأكد من حذف المنتج "${selectedProduct.name}"؟`}
                onDeleteSuccess={() => {
                  setProductToDelete(null);
                  setSelectedProduct(null);
                }}
                isUpdating={isDeleting}
              />
              <ProductCreationForm title=" " product={selectedProduct} disableCreate={true} />

              {/* Delete Confirmation Modal */}
              <ModalCustom
                isOpen={!!productToDelete}
                onOpenChange={(open) => !open && setProductToDelete(null)}
                title="تأكيد حذف المنتج"
                btn={<></>}
                content={
                  <div className="flex flex-col items-center justify-center py-8 px-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                      <Trash2 size={32} className="text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">هل أنت متأكد من حذف هذا المنتج؟</h3>
                    {productToDelete && (
                      <p className="text-gray-600 text-center mb-2">
                        سيتم حذف المنتج: <span className="font-medium">{productToDelete.name}</span>
                      </p>
                    )}
                    <p className="text-red-600 text-sm text-center mb-8">
                      لا يمكن التراجع عن هذا الإجراء وسيتم حذف المنتج نهائياً
                    </p>
                    <div className="flex gap-3 w-full max-w-sm">
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={async () => {
                          if (!productToDelete) return;
                          setIsDeleting(true);
                          try {
                            await deleteProduct(productToDelete.id);
                            toast.success("تم حذف المنتج بنجاح");
                            setProductToDelete(null);
                            setSelectedProduct(null);
                          } catch (error) {
                            console.error("Failed to delete product:", error);
                            toast.error("حدث خطأ أثناء حذف المنتج");
                          } finally {
                            setIsDeleting(false);
                          }
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setProductToDelete(null)}
                        disabled={isDeleting}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                }
              />
            </>
          ) : (
            <Card className="p-8 h-full">
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>الرجاء تحديد منتج لعرض التفاصيل</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

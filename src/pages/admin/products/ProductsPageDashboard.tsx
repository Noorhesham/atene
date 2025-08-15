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
import { PageHeader } from "../PageHeader";
import StoreSelector from "@/components/StoreSelector";

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
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Get store ID from localStorage on component mount
  useEffect(() => {
    const storedStoreId = localStorage.getItem("storeId");
    if (storedStoreId) {
      setSelectedStoreId(storedStoreId);
    }
  }, []);

  // Listen for store ID changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newStoreId = localStorage.getItem("storeId");
      if (newStoreId !== selectedStoreId) {
        console.log("Store ID changed via storage event:", newStoreId);
        setSelectedStoreId(newStoreId);
        // Reset selected product when store changes
        setSelectedProduct(null);
      }
    };

    const handleStoreChanged = (event: CustomEvent) => {
      const newStoreId = event.detail.storeId;
      console.log("Store ID changed via custom event:", newStoreId);
      if (newStoreId !== selectedStoreId) {
        setSelectedStoreId(newStoreId);
        setSelectedProduct(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storeChanged", handleStoreChanged as EventListener);

    // Also check periodically for changes as fallback
    const interval = setInterval(() => {
      const currentStoreId = localStorage.getItem("storeId");
      if (currentStoreId !== selectedStoreId) {
        console.log("Store ID changed via interval check:", currentStoreId);
        setSelectedStoreId(currentStoreId);
        setSelectedProduct(null);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storeChanged", handleStoreChanged as EventListener);
      clearInterval(interval);
    };
  }, [selectedStoreId]);

  // Log when selectedStoreId changes
  useEffect(() => {
    console.log("Selected store ID updated:", selectedStoreId);
  }, [selectedStoreId]);

  const handleOrderChange = (dir: "asc" | "desc") => {
    setOrderDir(dir);
  };

  // Get section from URL params
  const urlParams = new URLSearchParams(location.search);
  const sectionFilter = urlParams.get("section");

  // Fetch products with filters including store ID
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
      ...(selectedStoreId && { store_id: selectedStoreId }),
      order_dir: orderDir,
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

  // Refetch data when orderDir or selectedStoreId changes
  useEffect(() => {
    refetch();
  }, [orderDir, selectedStoreId, refetch]);

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
          onChange={() => setSelectedProduct(product)}
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
    <div>
      <PageHeader
        navLinks={[
          {
            label: "المنتجات",
            href: `${user.user.user_type === "admin" ? "/admin" : "dashboard"}/products`,
            isActive: true,
          },
        ]}
        addButton={{ label: "إضافة منتج", href: "/admin/products/add" }}
        customAdd={
          <div className="flex gap-2">
            <SectionsPopover />
          </div>
        }
        helpButton={{ label: "مساعدة", href: "/admin/products/help" }}
      />
      <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
        {" "}
        <div className="flex items-center gap-2 text-base text-[#8E8E8E]">
          <p>المنتجات</p>/{selectedProduct && <p className=" font-semibold">{selectedProduct.name}</p>}
        </div>
        <div className="flex justify-between  gap-4 items-center mb-4">
          <div className="relative flex-1  w-full">
            <Input
              type="text"
              placeholder="ابحث باسم المنتج أو رمز المنتج"
              className="w-full bg-white py-3 pr-10 pl-4 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchInput}
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
          </div>{" "}
          <div className="flex items-center gap-2">
            <StoreSelector
              trigger={
                <Button
                  size={"lg"}
                  variant="ghost"
                  className="flex items-center gap-2 px-4 !py-3  rounded-[4px] bg-white border-input  border"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.47217 8.74658V12.9149C2.47217 15.2732 2.47217 16.4516 3.20383 17.1841C3.93717 17.9174 5.11467 17.9174 7.47217 17.9174H12.4722C14.8288 17.9174 16.0072 17.9174 16.7397 17.1841C17.4722 16.4516 17.4722 15.2724 17.4722 12.9149V8.74658"
                      stroke="#393939"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.4724 14.1608C11.9024 14.6666 10.9949 14.9941 9.97237 14.9941C8.94987 14.9941 8.04237 14.6666 7.47237 14.1608M8.41987 7.01496C8.18487 7.86412 7.32987 9.32829 5.70654 9.53996C4.2732 9.72746 3.18487 9.10162 2.90737 8.83996C2.60154 8.62746 1.9032 7.94829 1.73237 7.52495C1.56154 7.09995 1.7607 6.18079 1.9032 5.80579L2.47237 4.15745C2.61154 3.74329 2.93737 2.76412 3.2707 2.43245C3.60404 2.10079 4.27904 2.08662 4.55737 2.08662H10.3957C11.8982 2.10829 15.184 2.07329 15.8332 2.08662C16.4832 2.09995 16.8732 2.64495 16.9874 2.87829C17.9565 5.22495 18.3332 6.56995 18.3332 7.14162C18.2065 7.75329 17.6832 8.90496 15.8332 9.41246C13.9107 9.93912 12.8207 8.91412 12.479 8.52079M7.62904 8.52079C7.89987 8.85329 8.74904 9.52245 9.97904 9.53912C11.2099 9.55579 12.2724 8.69745 12.6499 8.26662C12.7565 8.13912 12.9874 7.76162 13.2274 7.01412"
                      stroke="#393939"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  المتجر
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 9C18 9 13.581 15 12 15C10.419 15 6 9 6 9"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              }
            />
          </div>
          <div>
            <div className="flex text-base bg-white border border-input  py-3 px-4 rounded-[4px] text-[#555] items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5.83325 17.5V15M5.83325 15C5.05659 15 4.66825 15 4.36242 14.8733C4.16007 14.7896 3.97621 14.6668 3.82135 14.5119C3.6665 14.357 3.54368 14.1732 3.45992 13.9708C3.33325 13.665 3.33325 13.2767 3.33325 12.5C3.33325 11.7233 3.33325 11.335 3.45992 11.0292C3.54368 10.8268 3.6665 10.643 3.82135 10.4881C3.97621 10.3332 4.16007 10.2104 4.36242 10.1267C4.66825 10 5.05659 10 5.83325 10C6.60992 10 6.99825 10 7.30409 10.1267C7.50643 10.2104 7.69029 10.3332 7.84515 10.4881C8.00001 10.643 8.12282 10.8268 8.20658 11.0292C8.33325 11.335 8.33325 11.7233 8.33325 12.5C8.33325 13.2767 8.33325 13.665 8.20658 13.9708C8.12282 14.1732 8.00001 14.357 7.84515 14.5119C7.69029 14.6668 7.50643 14.7896 7.30409 14.8733C6.99825 15 6.60992 15 5.83325 15ZM14.1666 17.5V12.5M14.1666 5V2.5M14.1666 5C13.3899 5 13.0016 5 12.6958 5.12667C12.4934 5.21043 12.3095 5.33325 12.1547 5.4881C11.9998 5.64296 11.877 5.82682 11.7933 6.02917C11.6666 6.335 11.6666 6.72333 11.6666 7.5C11.6666 8.27667 11.6666 8.665 11.7933 8.97083C11.877 9.17318 11.9998 9.35704 12.1547 9.5119C12.3095 9.66675 12.4934 9.78957 12.6958 9.87333C13.0016 10 13.3899 10 14.1666 10C14.9433 10 15.3316 10 15.6374 9.87333C15.8398 9.78957 16.0236 9.66675 16.1785 9.5119C16.3333 9.35704 16.4562 9.17318 16.5399 8.97083C16.6666 8.665 16.6666 8.27667 16.6666 7.5C16.6666 6.72333 16.6666 6.335 16.5399 6.02917C16.4562 5.82682 16.3333 5.64296 16.1785 5.4881C16.0236 5.33325 15.8398 5.21043 15.6374 5.12667C15.3316 5 14.9433 5 14.1666 5ZM5.83325 7.5V2.5"
                  stroke="#393939"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium">تصفية</span>
            </div>
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
                  ...(selectedStoreId && { store_id: selectedStoreId }),
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
    </div>
  );
}

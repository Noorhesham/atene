import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, Plus, MoreHorizontal, Package, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { ApiProduct, ApiCategory, BaseEntity } from "@/types";
import EntityList from "@/components/EntityList";
import { Link } from "react-router-dom";
import { ProductCreationForm } from "@/components/productCreation";
import Actions from "@/components/Actions";
import ModalCustom from "@/components/ModalCustom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

import SectionsPopover from "@/components/SectionsPopover";
import { useLocation } from "react-router-dom";
import Loader from "@/components/Loader";

const FILTER_CATEGORIES = [
  { name: "الكل", value: null },
  { name: "منشور", value: "published" },
  { name: "مسودة", value: "draft" },
  { name: "نفذ من المخزون", value: "out_of_stock" },
  { name: "مميز", value: "featured" },
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
    <div>
      <h3 className="font-bold text-gray-800 mb-4 px-2">تصفية حسب الحالة</h3>
      <ul>
        {statusCategories.map((cat, index) => (
          <li key={index}>
            <button
              onClick={() => onStatusFilterChange(cat.value)}
              className={`w-full text-right px-4 py-2.5 rounded-md text-sm font-medium flex justify-between items-center ${
                activeStatusFilter === cat.value ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              }`}
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
            onClick={() => onCategoryFilterChange(null)}
            className={`w-full text-right px-4 py-2.5 rounded-md text-sm font-medium flex justify-between items-center ${
              activeCategoryFilter === null ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            }`}
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
                  ? "bg-blue-50 text-blue-700"
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

  // Get section from URL params
  const urlParams = new URLSearchParams(location.search);
  const sectionFilter = urlParams.get("section");

  // Fetch products with filters
  const {
    data: products,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    setSearchQuery,
    totalRecords,
    remove: deleteProduct,
    update: updateProduct,
  } = useAdminEntityQuery("products", {
    initialPerPage: 10,
    queryParams: {
      ...(statusFilter && { status: statusFilter }),
      ...(categoryFilter && { category_id: categoryFilter }),
      ...(sectionFilter && { section: sectionFilter }),
    },
  });

  // Fetch categories for filter
  const { data: categories = [], isLoading: isLoadingCategories } = useAdminEntityQuery("categories");
  const { data: stores = [], isLoading: isLoadingStores } = useAdminEntityQuery("stores");
  const { user, isLoading: isLoadingUser } = useAuth();
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
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, setSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);

    if (e.target.value.trim() !== "") {
      setSelectedProduct(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderProductItem = (product: ApiProduct) => {
    // Filtering is now handled on the backend via queryParams

    const getStatusInfo = (status: string) => {
      switch (status) {
        case "published":
          return { text: "منشور", class: "text-green-600" };
        case "draft":
          return { text: "مسودة", class: "text-yellow-600" };
        case "private":
          return { text: "خاص", class: "text-gray-600" };
        default:
          return { text: status, class: "text-gray-600" };
      }
    };

    const statusInfo = getStatusInfo(product.status);
    const currentPrice = product.sale_price || product.price;

    return (
      <div className="flex items-center gap-3 p-3 border-b">
        <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
          {product.gallary_url && product.gallary_url.length > 0 ? (
            <img src={product.gallary_url?.[0]} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
          ) : (
            <Package size={20} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm line-clamp-1">{product.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-main">{currentPrice.toLocaleString()} ر.س</span>
            {product.sale_price && (
              <span className="text-xs text-gray-500 line-through">{product.price.toLocaleString()} ر.س</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-semibold ${statusInfo.class}`}>● {statusInfo.text}</span>
            <span className="text-xs text-gray-500">المخزون: {product.stock_quantity}</span>
            {product.featured && <Star size={12} className="text-yellow-500 fill-current" />}
          </div>
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
            <EntityList
              entities={products}
              selectedEntity={selectedProduct}
              onSelectEntity={setSelectedProduct}
              isLoading={isLoading}
              error={error}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              renderEntity={renderProductItem}
              entityType="منتجات"
              totalRecords={totalRecords}
            />
          </Card>
        </div>

        {/* Left Panel: Product Details */}
        <div className="col-span-12 lg:col-span-7">
          {selectedProduct ? (
            <>
              <Actions
                title="إجراءات المنتج"
                isActive={selectedProduct.status === "active"}
                onApprove={
                  user?.user.user_type === "admin"
                    ? async () => {
                        try {
                          await updateProduct(selectedProduct.id, { status: "active" });
                          toast.success("تم تفعيل المنتج بنجاح");
                        } catch (error) {
                          console.error("Failed to update product status:", error);
                        }
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
              <ProductCreationForm product={selectedProduct} disableCreate={true} />

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

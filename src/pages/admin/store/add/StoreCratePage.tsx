import StoreCreationForm from "@/components/(dashboard)/Store/StoreCreation";
import { useAdminSingleEntity } from "@/hooks/useUsers";
import { useParams } from "react-router-dom";

const StoreCratePage = () => {
  const { id } = useParams();
  const { data: store, isLoading, error } = useAdminSingleEntity("stores", id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">جاري تحميل بيانات المتجر...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-medium">خطأ في تحميل بيانات المتجر</p>
          <p className="text-gray-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <StoreCreationForm store={store} />
    </>
  );
};

export default StoreCratePage;

import { Card } from "@/components/ui/card";
type RatedStoreItem = { id: number; name: string; reviews_count: number; logo_url?: string };
const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);
const TopRatedStores = ({ data, isLoading }: { data: RatedStoreItem[]; isLoading: boolean }) => {
  console.log(data);

  return (
    <Card className="p-6 max-h-96  overflow-y-auto w-full">
      <div className="flex w-fit gap-2   items-start mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.2929 4.7929C11.6834 4.40238 12.3165 4.40236 12.7071 4.79289L18.7071 10.7928C19.0976 11.1833 19.0976 11.8165 18.7071 12.207C18.3166 12.5975 17.6834 12.5975 17.2929 12.207L12 6.91421L6.7071 12.2071C6.31658 12.5976 5.68342 12.5976 5.29289 12.2071C4.90237 11.8165 4.90236 11.1834 5.29289 10.7929L11.2929 4.7929Z"
            fill="#1FC16B"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.2929 11.793C11.6834 11.4024 12.3165 11.4024 12.7071 11.7929L18.7071 17.7929C19.0976 18.1834 19.0976 18.8166 18.7071 19.2071C18.3166 19.5976 17.6834 19.5976 17.2929 19.2071L12 13.9143L6.7071 19.2072C6.31658 19.5977 5.68342 19.5977 5.29289 19.2072C4.90237 18.8166 4.90236 18.1835 5.29289 17.793L11.2929 11.793Z"
            fill="#1FC16B"
          />
        </svg>
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-800">المتاجر الأكثر تقييماً</h3>
          <p className="text-[#777] text-base font-semibold"> قائمة المتاجر التي حصلت علي اعلي تقييم</p>
        </div>
      </div>
      {isLoading ? (
        <SkeletonLoader className="h-32" />
      ) : (
        <div className="space-y-3 ">
          {data.map((store: RatedStoreItem, index: number) => (
            <div key={store.id} className="flex justify-between items-center ">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-400">{index + 1}</span>
                <img src={store.logo_url} className="w-10 object-cover h-10 rounded-full" alt={store.name} />
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{store.name}</span>
                  <div className="flex gap-2">
                    <p className=" text-[#777] text-sm font-semibold">عدد التقييمات</p>
                    <div className="text-sm  py-1 px-2 bg-[#F5F5F5] rounded-full text-gray-500">
                      {store.review_rate}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                <path
                  d="M11.25 4.25L6 9.5L11.25 14.75"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
export default TopRatedStores;

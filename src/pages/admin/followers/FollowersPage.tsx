import { useEffect, useState } from "react";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { FollowersDataTable } from "./FollowersDataTable";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FollowersPage = () => {
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");

  const storeId = localStorage.getItem("storeId");
  const headers = storeId ? { storeId } : undefined;
  const {
    data: followersData,
    isLoading: isLoadingFollowers,
    error: followersError,
  } = useAdminEntityQuery(
    "followers",
    {
      headers,
      queryParams: { page: followersPage.toString() },
    },
    "merchant"
  );

  const {
    data: followingData,
    isLoading: isLoadingFollowing,
    error: followingError,
    unfollow,
    isUnfollowing,
  } = useAdminEntityQuery(
    "following",
    {
      headers,
      queryParams: { page: followingPage.toString() },
    },
    "merchant"
  );

  const handleUnfollow = async (storeId: number) => {
    try {
      if (unfollow) {
        await unfollow("store", storeId);
      }
    } catch (error) {
      console.error("Error unfollowing store:", error);
    }
  };

  useEffect(() => {
    console.log("Followers Data:", followersData);
    console.log("Following Data:", followingData);
  }, [followersData, followingData]);

  if (!storeId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">الرجاء اختيار متجر أولاً</p>
        </div>
      </div>
    );
  }

  if (followersError || followingError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{followersError || followingError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-gray-100 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm text-gray-500">الرئيسية / المتابعين</h1>
      </div>

      <div className="bg-white w-full p-6 rounded-lg shadow-sm mx-auto">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "followers" | "following")}>
          <TabsList className="mb-4">
            <TabsTrigger value="followers">المتابعين</TabsTrigger>
            <TabsTrigger value="following">المتابَعون</TabsTrigger>
          </TabsList>
          <TabsContent value="followers">
            {isLoadingFollowers ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
              </div>
            ) : (
              <FollowersDataTable
                columns={columns({ showUnfollow: false })}
                data={followersData?.followers || []}
                pageCount={Math.ceil((followersData?.total || 0) / 10)}
                currentPage={followersPage}
                onPageChange={setFollowersPage}
              />
            )}
          </TabsContent>
          <TabsContent value="following">
            {isLoadingFollowing ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
              </div>
            ) : (
              <FollowersDataTable
                columns={columns({ showUnfollow: true, onUnfollow: handleUnfollow, isUnfollowing })}
                data={followingData?.followers || []}
                pageCount={Math.ceil((followingData?.total || 0) / 10)}
                currentPage={followingPage}
                onPageChange={setFollowingPage}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FollowersPage;

"use client";

import type { Store } from "@/types/product";
import { Button } from "./ui/button";
import { Star, Clock, ShieldCheck, ShoppingCart, Flag, Plus, UserMinus } from "lucide-react";
import type React from "react";
import { formatDate } from "@/utils/cn";
import ModalCustom from "./ModalCustom";
import AbuseReport from "./forms/AbuseRebort";
import { useState, useEffect } from "react";
import { followStore, unfollowStore, checkFollowing } from "@/utils/api/product";
import { useAuth } from "@/context/AuthContext";

interface SellerCardProps {
  store: Store;
}

const InfoItem: React.FC<{ icon: React.ElementType; text: string | number }> = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-[#414141]">
    <Icon className="h-4 w-4 text-[#414141]" />
    <span>{text}</span>
  </div>
);

export default function SellerCard({ store }: SellerCardProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user is following this store on component mount
  useEffect(() => {
    if (user && store.id) {
      checkFollowing({
        followed_type: "store",
        followed_id: store.id,
      })
        .then((response) => {
          setIsFollowing(response.is_following);
        })
        .catch((error) => {
          console.error("Error checking following status:", error);
        });
    }
  }, [user, store.id]);

  const handleFollowToggle = async () => {
    if (!user) {
      console.log("User must be logged in to follow stores");
      return;
    }

    if (!store.id) {
      console.error("Store ID is required");
      return;
    }

    setIsLoading(true);

    try {
      const followData = {
        followed_type: "store" as const,
        followed_id: store.id,
      };

      if (isFollowing) {
        await unfollowStore(followData);
        setIsFollowing(false);
      } else {
        await followStore(followData);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(store);
  return (
    <div
      dir="rtl"
      className="bg-white w-full dark:bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-full  mx-auto"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Seller Info */}
        <div className="flex items-center gap-4">
          <img
            src={store.logo || "/placeholder.svg?width=56&height=56&query=store+logo"}
            alt={`${store.name} logo`}
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800"
          />
          <div>
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">{store.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{store.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            onClick={handleFollowToggle}
            disabled={isLoading}
            variant="default"
            size="sm"
            className={`${
              isFollowing ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-full px-4 py-1.5 h-auto text-sm disabled:opacity-50`}
          >
            {isFollowing ? <UserMinus className="w-4 h-4 ml-1" /> : <Plus className="w-4 h-4 ml-1" />}
            {isFollowing ? "إلغاء المتابعة" : "تابع"}
          </Button>
          <ModalCustom
            btn={
              <Button
                variant="destructive"
                size="sm"
                className="bg-gradient-to-b from-[#FF0000] to-[#CC0000] hover:from-[#E60000] hover:to-[#B30000]
               text-white rounded-full px-4 py-1.5  h-auto text-sm  font-medium transition-all duration-200 flex items-center gap-2"
              >
                <Flag className="w-5 h-5" />
                بلغ عن إساءة
              </Button>
            }
            content={<AbuseReport closeModal={() => setIsModalOpen(false)} />}
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
          />
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      {/* Store Stats */}
      <div className="flex flex-wrap max-w-4xl items-center justify-start sm:justify-between gap-x-5 w-fit ml-auto gap-y-3">
        <InfoItem icon={Clock} text={`عضو منذ ${formatDate(store.created_at)}`} />
        <InfoItem icon={ShieldCheck} text="تاجر معتمد" />
        <InfoItem icon={Star} text={`تقييم التاجر ${store.review_rate.toFixed(1)}`} />
        <InfoItem icon={ShoppingCart} text={`عدد الطلبات المباعة ${store.orders_count}`} />
      </div>
    </div>
  );
}

import { AlertCircle, MessageCircle } from "lucide-react";
import React from "react";

const SellerActions = () => {
  return (
    <div className="flex justify-center mx-auto gap-2 mt-3">
      <button className="px-2 flex items-center gap-2 py-1 text-xs bg-gradient-to-r from-[#5E8CBE] to-[#3B5D80] text-white rounded-full border border-primary hover:bg-primary hover:text-white transition-colors">
        تواصل مع البائع
        <MessageCircle className="w-4 h-4" />
      </button>
      <button className="px-2  flex items-center gap-2 py-1 text-xs rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
        بلغ عن إساءة <AlertCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SellerActions;

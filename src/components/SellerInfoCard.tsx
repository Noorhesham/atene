import React from "react";
import { Star, MessageCircle, AlertCircle } from "lucide-react";
import SellerActions from "./SellerActions";

// A custom checkmark icon to match the design
const VerifiedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#3B82F6" />
    <path d="M9 12.75L11.25 15L15.75 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SellerInfoCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-center border border-gray-100">
      <div className="relative inline-block mb-3">
        <img
          src="/il_100x100.3400269364_k196.jpg.png"
          alt="Etnix Andras"
          className="w-28 h-28 rounded-full mx-auto object-cover"
        />
        <div className="absolute bottom-1 right-1">
          <VerifiedIcon />
        </div>
      </div>
      <h3 className="font-bold text-xl text-gray-800">Etnix Andras</h3>
      <div className="flex justify-center items-center my-2">
        <span className="text-xs text-gray-500 ml-1">100%</span>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-xs text-gray-500 my-4 leading-relaxed">
        لوريم إيبسوم ألم سيت أميت، كونسيكتيور أديبي سكينج إليت، سيد ديام نونومي نيبه إيسمود تينسيدونت أوت لاوريت
      </p>
      <SellerActions />
    </div>
  );
};

export default SellerInfoCard;

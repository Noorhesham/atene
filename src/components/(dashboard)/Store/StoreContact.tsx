import { Card } from "@/components/ui/card";
import PhoneNumberInput from "@/components/inputs/PhoneNumberInput";
import SocialLinkInput from "@/components/inputs/SocialLinkInput";
import { Phone, MessageSquare, Facebook, Youtube, Instagram } from "lucide-react";
const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 8.25H18.75V15.75C18.75 16.4435 18.4734 17.1092 17.9851 17.6237C17.4968 18.1382 16.8285 18.45 16.125 18.45C15.4215 18.45 14.7532 18.1382 14.2649 17.6237C13.7766 17.1092 13.5 16.4435 13.5 15.75V3H15.75V10.5C15.75 10.7984 15.8685 11.0853 16.0798 11.2966C16.2911 11.5079 16.578 11.6264 16.875 11.6264C17.172 11.6264 17.4589 11.5079 17.6702 11.2966C17.8815 11.0853 18 10.7984 18 10.5V3H21C21 4.5913 21 6.375 21 8.25Z"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 3V15.75C9 16.4435 8.72344 17.1092 8.23512 17.6237C7.74681 18.1382 7.07853 18.45 6.375 18.45C5.67147 18.45 5.00319 18.1382 4.51488 17.6237C4.02656 17.1092 3.75 16.4435 3.75 15.75C3.75 15.0565 4.02656 14.3908 4.51488 13.8763C5.00319 13.3618 5.67147 13.05 6.375 13.05H9"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const StoreContactInfo = () => {
  return (
    <Card className="p-6 space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">الاتصال والسوشيل</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <PhoneNumberInput name="mobile" label="الهاتف المحمول" icon={<Phone size={20} />} />
        <PhoneNumberInput name="whatsapp" label="الواتساب" icon={<MessageSquare size={20} />} />

        <SocialLinkInput
          name="facebook"
          label="فيسبوك"
          placeholder="https://www.facebook.com/aateofficial"
          icon={<Facebook size={20} />}
        />
        <SocialLinkInput name="tiktok" label="تيك توك" placeholder="ادخل رابط تيك توك" icon={<TikTokIcon />} />

        <SocialLinkInput name="youtube" label="يوتيوب" placeholder="ادخل رابط يوتيوب" icon={<Youtube size={20} />} />
        <SocialLinkInput
          name="instagram"
          label="إنستغرام"
          placeholder="https://www.instagram.com/aateofficial/"
          icon={<Instagram size={20} />}
        />
      </div>
    </Card>
  );
};

export default StoreContactInfo;

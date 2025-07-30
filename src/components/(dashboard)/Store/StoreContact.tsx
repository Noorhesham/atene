import { Card } from "@/components/ui/card";
import PhoneNumberInput from "@/components/inputs/PhoneNumberInput";
import SocialLinkInput from "@/components/inputs/SocialLinkInput";
import { MessageSquare, Facebook, Youtube, Instagram, Twitter } from "lucide-react";

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

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      fill="#6B7280"
    />
  </svg>
);

const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 0C5.374 0 0 5.372 0 12.017c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.001 12.001 24.001c6.624 0 11.999-5.373 11.999-12.017C24 5.372 18.626.001 12.001.001z"
      fill="#6B7280"
    />
  </svg>
);

const StoreContactInfo = () => {
  return (
    <Card className="p-6 space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">الاتصال والسوشيل</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <PhoneNumberInput name="whats_app" label="الواتساب" icon={<MessageSquare size={20} />} />

        <SocialLinkInput
          name="facebook"
          label="فيسبوك"
          placeholder="https://www.facebook.com/aateofficial"
          icon={<Facebook size={20} />}
        />

        <SocialLinkInput
          name="instagram"
          label="إنستغرام"
          placeholder="https://www.instagram.com/aateofficial/"
          icon={<Instagram size={20} />}
        />

        <SocialLinkInput name="tiktok" label="تيك توك" placeholder="ادخل رابط تيك توك" icon={<TikTokIcon />} />

        <SocialLinkInput name="youtube" label="يوتيوب" placeholder="ادخل رابط يوتيوب" icon={<Youtube size={20} />} />

        <SocialLinkInput
          name="twitter"
          label="تويتر"
          placeholder="https://www.twitter.com/aateofficial"
          icon={<Twitter size={20} />}
        />

        <SocialLinkInput
          name="linkedin"
          label="لينكد إن"
          placeholder="https://www.linkedin.com/company/aateofficial"
          icon={<LinkedInIcon />}
        />

        <SocialLinkInput
          name="pinterest"
          label="بينتيريست"
          placeholder="https://www.pinterest.com/aateofficial"
          icon={<PinterestIcon />}
        />
      </div>
    </Card>
  );
};

export default StoreContactInfo;

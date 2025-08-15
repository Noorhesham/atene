import PhoneNumberInput from "@/components/inputs/PhoneNumberInput";
import SocialLinkInput from "@/components/inputs/SocialLinkInput";
import { MessageSquare } from "lucide-react";

const StoreContactInfo = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <PhoneNumberInput
          name="phone"
          label="الهاتف"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M2.77801 10.942C1.83001 9.29001 1.37201 7.94001 1.09601 6.57201C0.688009 4.54801 1.62201 2.57101 3.16901 1.30901C3.82301 0.776007 4.57301 0.959007 4.96001 1.65201L5.83301 3.21901C6.52501 4.46101 6.87101 5.08101 6.80301 5.73901C6.73401 6.39801 6.26701 6.93401 5.33401 8.00601L2.77801 10.942ZM2.77801 10.942C4.69701 14.288 7.70801 17.302 11.058 19.222M11.058 19.222C12.711 20.17 14.06 20.628 15.428 20.904C17.452 21.312 19.429 20.378 20.69 18.831C21.224 18.177 21.041 17.427 20.348 17.04L18.781 16.167C17.539 15.475 16.919 15.129 16.261 15.197C15.602 15.266 15.066 15.733 13.994 16.666L11.058 19.222Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        />
        <PhoneNumberInput name="whats_app" label="الواتساب" icon={<MessageSquare size={20} />} />
        <SocialLinkInput
          name="tiktok"
          label="تيك توك"
          placeholder="ادخل رابط تيك توك"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M2.5 12C2.5 7.522 2.5 5.282 3.891 3.891C5.282 2.5 7.521 2.5 12 2.5C16.478 2.5 18.718 2.5 20.109 3.891C21.5 5.282 21.5 7.521 21.5 12C21.5 16.478 21.5 18.718 20.109 20.109C18.718 21.5 16.479 21.5 12 21.5C7.522 21.5 5.282 21.5 3.891 20.109C2.5 18.718 2.5 16.479 2.5 12Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.5359 11.0075C9.71589 10.8915 7.84589 11.0825 6.92989 12.7775C6.01389 14.4725 6.93689 16.2365 7.51389 16.9065C8.08289 17.5335 9.89189 18.7205 11.8109 17.5615C12.2869 17.2745 12.8799 17.0595 13.5519 14.8145L13.4739 5.98047C13.3439 6.95347 14.4189 9.23547 17.4779 9.50547"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        />
        <SocialLinkInput
          name="facebook"
          label="فيسبوك"
          placeholder="https://www.facebook.com/aateofficial"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.182 10.333C5.204 10.333 5 10.525 5 11.444V13.111C5 14.031 5.204 14.222 6.182 14.222H8.545V20.889C8.545 21.809 8.75 22 9.727 22H12.091C13.069 22 13.273 21.808 13.273 20.889V14.222H15.927C16.668 14.222 16.859 14.087 17.063 13.416L17.57 11.75C17.919 10.601 17.703 10.333 16.433 10.333H13.273V7.556C13.273 6.942 13.802 6.444 14.454 6.444H17.818C18.796 6.444 19 6.253 19 5.334V3.11C19 2.191 18.796 2 17.818 2H14.454C11.191 2 8.545 4.487 8.545 7.556V10.333H6.182Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        />

        <SocialLinkInput
          name="instagram"
          label="إنستغرام"
          placeholder="https://www.instagram.com/aateofficial/"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M2.5 12C2.5 7.522 2.5 5.282 3.891 3.891C5.282 2.5 7.521 2.5 12 2.5C16.478 2.5 18.718 2.5 20.109 3.891C21.5 5.282 21.5 7.521 21.5 12C21.5 16.478 21.5 18.718 20.109 20.109C18.718 21.5 16.479 21.5 12 21.5C7.522 21.5 5.282 21.5 3.891 20.109C2.5 18.718 2.5 16.479 2.5 12Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.508 6.5H17.498M16.5 12C16.5 13.1935 16.0259 14.3381 15.182 15.182C14.3381 16.0259 13.1935 16.5 12 16.5C10.8065 16.5 9.66193 16.0259 8.81802 15.182C7.97411 14.3381 7.5 13.1935 7.5 12C7.5 10.8065 7.97411 9.66193 8.81802 8.81802C9.66193 7.97411 10.8065 7.5 12 7.5C13.1935 7.5 14.3381 7.97411 15.182 8.81802C16.0259 9.66193 16.5 10.8065 16.5 12Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        />

        <SocialLinkInput
          name="youtube"
          label="يوتيوب"
          placeholder="ادخل رابط يوتيوب"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 20.5C13.81 20.5 15.545 20.321 17.153 19.993C19.163 19.583 20.167 19.379 21.083 18.201C22 17.022 22 15.669 22 12.963V11.037C22 8.331 22 6.977 21.083 5.799C20.167 4.621 19.163 4.416 17.153 4.007C15.4565 3.66696 13.7303 3.49711 12 3.5C10.19 3.5 8.455 3.679 6.847 4.007C4.837 4.417 3.833 4.621 2.917 5.799C2 6.978 2 8.331 2 11.037V12.963C2 15.669 2 17.023 2.917 18.201C3.833 19.379 4.837 19.584 6.847 19.993C8.455 20.321 10.19 20.5 12 20.5Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.962 12.313C15.814 12.919 15.024 13.353 13.445 14.224C11.727 15.171 10.868 15.644 10.173 15.461C9.94139 15.4012 9.72501 15.2932 9.538 15.144C9 14.709 9 13.806 9 12C9 10.194 9 9.291 9.538 8.856C9.72 8.709 9.938 8.59999 10.173 8.53899C10.868 8.35599 11.727 8.829 13.445 9.776C15.025 10.646 15.814 11.081 15.962 11.687C16.012 11.893 16.012 12.107 15.962 12.313Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default StoreContactInfo;

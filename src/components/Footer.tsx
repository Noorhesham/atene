import { FaApple, FaGooglePlay, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import MaxWidthWrapper from "./MaxwidthWrapper";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-right  text-gray-700 mt-12">
      {/* Newsletter */}
      <MaxWidthWrapper className="bg-gradient-to-l from-[#0A5DC2] to-[#052C5C] text-white p-6 md:p-10 rounded-lg max-w-6xl mx-auto text-center md:text-right">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="flex flex-col items-stretch gap-2">
            <div className="relative flex items-center gap-1">
              <input
                type="email"
                placeholder="اكتب بريدك الالكتروني"
                className="rounded-full bg-white placeholder:text-right px-4 py-2 text-black pr-10 focus:outline-none w-72"
              />
              <Mail className=" absolute right-4 text-black  w-5 h-5" />
            </div>
            <div className=" bg-white rounded-full px-4 py-2 text-center">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text font-bold text-lg hover:opacity-80 transition">
                اشترك الآن
              </button>
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold">
            ابق على اطلاع <br /> بأحدث عروضنا
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Footer links */}
      <MaxWidthWrapper
        noPaddingX
        noPadding
        className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-2 md:grid-cols-7 gap-6 text-sm"
      >
        {" "}
        <div>
          <h4 className="font-bold mb-2">احصل على التطبيق</h4>
          <div className="flex flex-col items-start ml-auto gap-2">
            <a className=" block w-full relative h-14" href="#">
              <img src="/Group.svg" alt="App Store" className="w-full absolute inset-0 object-contain rounded" />
            </a>{" "}
            <a className=" block w-full relative h-14" href="#">
              <img src="/apple.svg" alt="App Store" className="w-full absolute inset-0 object-contain rounded" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-2">عن</h4>
          <ul className="space-y-1">
            <li>معلومات عنا</li>
            <li>البحث عن المتجر</li>
            <li>فئات</li>
            <li>المدونات</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">شراكة</h4>
          <ul className="space-y-1">
            <li>معلومات عنا</li>
            <li>البحث عن المتجر</li>
            <li>فئات</li>
            <li>المدونات</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">معلومة</h4>
          <ul className="space-y-1">
            <li>مركز المساعدة</li>
            <li>استرداد الأموال</li>
            <li>شحن</li>
            <li>اتصل بنا</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">للمستخدمين</h4>
          <ul className="space-y-1">
            <li>تسجيل الدخول</li>
            <li>تسجيل</li>
            <li>إعدادات</li>
            <li>أوامري</li>
          </ul>
        </div>{" "}
        {/* Logo and social */}
        <div className="flex flex-col col-span-2 w-full justify-between items-end gap-4   mb-4">
          <div className="text-center md:text-right">
            <img src="/logo.svg" alt="A'atene" className=" w-full" />
            <p className="text-sm mt-1">
              أفضل معلومات حول الشركة gies هنا ولكن <br /> lorem ipsum الأن
            </p>
          </div>
          <div className="flex items-center gap-3 text-white text-lg">
            <a className=" p-2 bg-gray-500 rounded-full" href="#">
              <FaFacebookF />
            </a>
            <a className=" p-2 bg-gray-500 rounded-full" href="#">
              <FaTwitter />
            </a>
            <a className=" p-2 bg-gray-500 rounded-full" href="#">
              <FaLinkedinIn />
            </a>
            <a className=" p-2 bg-gray-500 rounded-full" href="#">
              <FaInstagram />
            </a>
            <a className=" p-2 bg-gray-500 rounded-full" href="#">
              <FaYoutube />
            </a>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Bottom bar */}
      <div className="bg-gray-100 text-gray-600 text-xs px-4 py-4 text-center md:text-right border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span>© 2025 A’atene , Inc.</span>
            <span>خصوصية</span>
            <span>شروط الاستخدام</span>
            <span>الإعلانات القائمة على الانضمام</span>
            <span>المتاجر المحلية</span>
            <span>المناطق</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>🇪🇬 مصر</span>
            <span>. ن.س (NIS)</span>
            <span>. عربي (AR)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

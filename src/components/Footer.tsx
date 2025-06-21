import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import MaxWidthWrapper from "./MaxwidthWrapper";
import { Earth, EarthIcon, Mail, WholeWord } from "lucide-react";

const Footer = () => {
  return (
    <footer dir="ltr" className="bg-white text-right text-gray-700 mt-12">
      {/* Newsletter */}
      <MaxWidthWrapper className="bg-gradient-to-l overflow-hidden relative from-[#0A5DC2] to-[#052C5C] text-white p-6 md:p-10 rounded-lg max-w-6xl mx-auto text-center md:text-right">
        {" "}
        <img
          className=" lg:block hidden  absolute w-96 right-0 bottom-0 lg:top-0"
          src="/334f03c99198ac744a17ed9b6b6a494ae460de7e.png"
          alt=""
        />
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 md:gap-4">
          <div className="flex flex-col items-stretch md:items-start gap-2 w-full md:w-[30%] ">
            <div className="relative flex items-center   w-full  gap-1 w-full justify-center md:justify-end">
              <input
                type="email"
                placeholder="اكتب بريدك الالكتروني"
                className="rounded-full w-full bg-white placeholder:text-right px-4 py-2 text-black pr-10 focus:outline-none w-full "
              />
              <Mail className="absolute right-4 text-black w-5 h-5" />
            </div>
            <div className="bg-white w-full rounded-full px-4 py-2 text-center">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text font-bold text-lg hover:opacity-80 transition">
                اشترك الآن
              </button>
            </div>
          </div>
          <div className="text-2xl md:text-[40px] lg:mr-72 font-bold mt-4 md:mt-0">
            ابق على اطلاع <br className="hidden md:block" /> بأحدث عروضنا
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Footer links */}
      <div className="bg-white shadow-lg">
        <MaxWidthWrapper
          noPaddingX
          noPadding
          className="  mx-auto mt-12 !w-full px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6 text-sm"
        >
          <div className="col-span-1 lg:block hidden sm:col-span-1">
            <h4 className="font-[900] mb-2">احصل على التطبيق</h4>
            <div className="flex flex-col items-start ml-auto gap-2">
              <a className="block w-full relative h-14" href="#">
                <img src="/Group.svg" alt="App Store" className="w-full absolute inset-0 object-contain rounded" />
              </a>
              <a className="block w-full relative h-14" href="#">
                <img src="/apple.svg" alt="App Store" className="w-full absolute inset-0 object-contain rounded" />
              </a>
            </div>
          </div>
          {/* Links sections */}
          {[...Array(4)].reverse().map((_, idx) => (
            <div key={idx}>
              <h4 className="font-[900] mb-[5px]">{["عن", "شراكة", "معلومة", "للمستخدمين"].reverse()[idx]}</h4>
              <ul className="space-y-1">
                {["معلومات عنا", "البحث عن المتجر", "فئات", "المدونات"].reverse().map((item, i) => (
                  <li className="text-[#8B96A5] text-[15px]" key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 lg:hidden block ml-auto sm:col-span-1">
            <h4 className="font-bold mb-2">احصل على التطبيق</h4>
            <div className="flex flex-col items-start ml-auto gap-2">
              <a className="block w-full relative h-14" href="#">
                <img src="/Group.svg" alt="App Store" className="w-full absolute inset-0 object-contain rounded" />
              </a>
              <a className="block w-full relative h-14" href="#">
                <img src="/apple.svg" alt="App Store" className="w-full absolute inset-0 object-contain rounded" />
              </a>
            </div>
          </div>
          {/* Logo and social */}
          <div className="flex flex-col col-span-2 sm:col-span-3 md:col-span-2 w-full justify-between items-center md:items-end gap-4 mb-4 text-center md:text-right">
            <div className="w-full flex flex-col items-start gap-2">
              <img
                src="/logoblack.svg"
                alt="A'atene"
                className=" w-fit object-cover  ml-[100px] object-right mx-auto   "
              />
              <p className="text-sm text-[#8B96A5] text-[15px] ml-auto mt-1">
                أفضل معلومات حول الشركة gies هنا ولكن <br className="hidden md:block" /> lorem ipsum الأن
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 text-white text-lg">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} className="p-2 bg-[#8B96A5] rounded-full" href="#">
                  <Icon />
                </a>
              ))}
            </div>
          </div>{" "}
        </MaxWidthWrapper>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-100 text-[#1C1C1C] font-semibold text-xs  py-4 text-center md:text-right ">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start text-center md:text-right">
            <span>© 2025 A’atene , Inc.</span>
            <span>خصوصية</span>
            <span>شروط الاستخدام</span>
            <span>الإعلانات القائمة على الانضمام</span>
            <span>المتاجر المحلية</span>
            <span>المناطق</span>
          </div>{" "}
          <div className="flex items-center flex-wrap justify-center md:justify-end gap-2 text-sm">
            {" "}
            <span> . ₪ (NIS) | </span>
            <span>عربي (AR) | </span>
            <div className="flex items-center gap-1">
              <span>مصر</span>
              <span>
                <Earth className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

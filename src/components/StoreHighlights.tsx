import React from "react";
import { ChevronRight } from "lucide-react";
import MaxWidthWrapper from "./MaxwidthWrapper";

interface StoryItem {
  id: string;
  username: string;
  imageUrl: string;
}

interface StoreHighlightsProps {
  stories: StoryItem[];
}

const StoreHighlights = ({ stories }: StoreHighlightsProps) => {
  return (
    <div dir="rtl" className=" mt-12">
      <MaxWidthWrapper noPadding className="bg-white   border-2 border-input rounded-2xl !py-4 px-4 shadow-lg">
        <div className="flex justify-between border-b border-input pb-2 items-center mb-6">
          <h3 className="font-bold text-[#232323] text-lg">أبرز الأحداث</h3>
          <button className="flex items-center text-primary text-sm hover:underline" aria-label="عرض الكل">
            <span className=" text-black font-bold">عرض الكل</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-2 min-w-fit cursor-pointer">
              <div className="w-[72px] h-[72px] rounded-full border-2 border-red-500 p-[2px]">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                  <img src={story.imageUrl} alt={story.username} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-xs text-gray-800 whitespace-nowrap">{story.username}</span>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default StoreHighlights;

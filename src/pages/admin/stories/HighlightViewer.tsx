import { useEffect, useState, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import type { ApiStory } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "@/styles/stories.css";

interface HighlightViewerProps {
  stories: ApiStory[];
  onClose: () => void;
  onDelete?: (storyId: number) => void;
}

const HighlightViewer = ({ stories, onClose, onDelete }: HighlightViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        if (swiperRef.current) {
          swiperRef.current.slidePrev();
        } else {
          setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
        }
      }
      if (e.key === "ArrowRight") {
        if (swiperRef.current) {
          swiperRef.current.slideNext();
        } else {
          setActiveIndex((prev) => (prev + 1) % stories.length);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, stories.length]);

  if (!stories?.length) {
    return null;
  }

  return (
    <div className="fixed inset-0 story-viewer z-50 flex items-center justify-center" dir="ltr">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-red-500 hover:bg-white/10"
            onClick={() => onDelete(stories[activeIndex].id)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:text-gray-200 hover:bg-white/10"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 flex gap-1.5 p-4 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full bg-white transition-all duration-300 ${
                index === activeIndex ? "story-progress" : index < activeIndex ? "w-full" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-[400px] aspect-[9/16]">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full h-full rounded-lg overflow-hidden"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          grabCursor={true}
          shortSwipes={true}
          touchRatio={1}
          threshold={20}
          initialSlide={activeIndex}
          allowTouchMove={true}
          resistance={true}
          resistanceRatio={0.85}
          watchSlidesProgress={true}
          onSlideChangeTransitionStart={() => {
            // Optional: Add any transition start logic
          }}
        >
          {stories.map((story, index) => (
            <SwiperSlide key={story.id}>
              {story.image ? (
                <img src={story.image} alt={`Story ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center p-8 story-text-container"
                  data-color={story.color || "#000000"}
                >
                  <p className="text-center text-2xl font-medium text-white story-text">{story.text}</p>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Single Navigation Button - Previous */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 story-navigation-button flex items-center justify-center w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          aria-label="السابق"
          onClick={() => {
            if (swiperRef.current) {
              swiperRef.current.slidePrev();
            } else {
              const newIndex = (activeIndex - 1 + stories.length) % stories.length;
              setActiveIndex(newIndex);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Single Navigation Button - Next */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 story-navigation-button flex items-center justify-center w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
          aria-label="التالي"
          onClick={() => {
            if (swiperRef.current) {
              swiperRef.current.slideNext();
            } else {
              const newIndex = (activeIndex + 1) % stories.length;
              setActiveIndex(newIndex);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HighlightViewer;

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import type { ApiStory } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/styles/stories.css";

interface StoryViewerProps {
  stories: ApiStory[];
  onClose: () => void;
  onDelete?: (storyId: number) => void;
}

const StoryViewer = ({ stories, onClose, onDelete }: StoryViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();

  // Use the stories query hook for deletion
  const userType = user?.user?.user_type === "admin" ? "admin" : "merchant";
  const { remove, isDeleting } = useAdminEntityQuery("stories", {}, userType);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowLeft") setActiveIndex((prev) => (prev + 1) % stories.length);
      if (e.key === "ArrowRight") setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, stories.length]);

  // Close viewer when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const currentStory = stories[activeIndex];
      await remove(currentStory.id);
      toast.success("تم حذف القصة بنجاح");
      setShowDeleteModal(false);
      onClose();
      // Call the parent's onDelete callback if provided
      onDelete?.(currentStory.id);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف القصة");
      console.error("Error deleting story:", error);
    }
  };

  if (!stories?.length) {
    return null;
  }

  const currentStory = stories[activeIndex];
  const storyName = currentStory.text || `القصة #${currentStory.id}`;

  return (
    <>
      <div
        className="fixed inset-0 story-viewer z-50 flex items-center justify-center"
        dir="ltr"
        onClick={handleBackdropClick}
      >
        <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-red-500 hover:bg-white/10"
            onClick={handleDeleteClick}
            aria-label="حذف القصة"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
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
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{ type: "progressbar" }}
            className="w-full h-full rounded-lg overflow-hidden"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            grabCursor={true}
            shortSwipes={true}
            touchRatio={1}
            threshold={20}
          >
            {stories.map((story, index) => (
              <SwiperSlide key={story.id}>
                {story.image ? (
                  <img src={story.image} alt={`Story ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-8 story-text-container"
                    style={{ backgroundColor: story.color || "#000000" }}
                  >
                    <p className="text-center text-2xl font-medium text-white story-text leading-relaxed">
                      {story.text || "قصة نصية"}
                    </p>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">تأكيد حذف القصة</DialogTitle>
            <DialogDescription className="text-center">هل أنت متأكد من حذف "{storyName}"؟</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <Trash2 size={32} className="text-red-600" />
            </div>

            <p className="text-gray-600 text-center mb-2">
              سيتم حذف: <span className="font-medium">{storyName}</span>
            </p>

            <p className="text-red-600 text-sm text-center mb-8">لا يمكن التراجع عن هذا الإجراء وسيتم الحذف نهائياً</p>

            <div className="flex gap-3 w-full max-w-sm">
              <Button variant="destructive" className="flex-1" onClick={handleDeleteConfirm} disabled={isDeleting}>
                {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryViewer;

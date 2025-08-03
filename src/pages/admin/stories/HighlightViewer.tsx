import { useEffect, useState } from "react";
import { X, Trash2, MoreVertical } from "lucide-react";
import type { ApiStory } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { useAuth } from "@/context/AuthContext";







interface HighlightViewerProps {
  stories: ApiStory[];
  onClose: () => void;
  onDelete?: (storyId: number) => void;
  highlightId?: number;
  highlightName?: string;
  onDeleteHighlight?: (highlightId: number) => void;
}

const HighlightViewer = ({
  stories,
  onClose,
  onDelete,
  highlightId,
  highlightName,
  onDeleteHighlight,
}: HighlightViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteHighlightModal, setShowDeleteHighlightModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const { user } = useAuth();

  const userType = user?.user?.user_type === "admin" ? "admin" : "merchant";
  const { remove: removeStory, isDeleting: isDeletingStory } = useAdminEntityQuery("stories", {}, userType);
  const { remove: removeHighlight, isDeleting: isDeletingHighlight } = useAdminEntityQuery("highlights", {}, userType);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Swiper handles arrow keys by default
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setShowOptionsMenu(false);
    setShowDeleteModal(true);
  };

  const handleDeleteHighlightClick = () => {
    setShowOptionsMenu(false);
    setShowDeleteHighlightModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const currentStory = stories[activeIndex];
      await removeStory(currentStory.id);
      setShowDeleteModal(false);
      onDelete?.(currentStory.id);
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const handleDeleteHighlightConfirm = async () => {
    try {
      if (highlightId) {
        await removeHighlight(highlightId);
        setShowDeleteHighlightModal(false);
        onClose();
        onDeleteHighlight?.(highlightId);
      }
    } catch (error) {
      console.error("Error deleting highlight:", error);
    }
  };

  if (!stories?.length) {
    return null;
  }

  const currentStory = stories[activeIndex];

  return (
    <>
      <div
        className="fixed inset-0 story-viewer z-50 flex items-center justify-center bg-black/80"
        dir="ltr"
        onClick={handleBackdropClick}
      >
        {/* Header Controls */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {/* Delete Highlight Button */}
          {highlightId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteHighlightClick}
              className="text-white rounded-full hover:bg-red-500/20 hover:text-red-400"
              aria-label="حذف المجموعة"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white rounded-full hover:bg-white/20"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="relative w-full max-w-[400px] aspect-[9/16]">
          {/* Header section within the story container */}
          <div className="absolute top-0 left-0 right-0 p-3 z-20">
            {/* Progress Bars */}
            <div className="flex items-center gap-1">
              {stories.map((_, index) => (
                <div key={index} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      index === activeIndex ? "story-progress" : index < activeIndex ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* User Info and Options Menu */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <p className="font-semibold text-white text-sm">{highlightName || currentStory.text || "عرض القصة"}</p>
              </div>

              {/* More Options Button and Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOptionsMenu((prev) => !prev)}
                  className="text-white h-8 w-8 rounded-full hover:bg-white/20"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>

                {showOptionsMenu && (
                  <div
                    className="absolute top-full right-0 mt-2 w-[180px] bg-white rounded-lg shadow-xl py-2 z-30"
                    dir="rtl"
                  >
                    <button
                      onClick={handleDeleteClick}
                      className="w-full flex items-center gap-3 text-right px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>حذف القصة</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".story-swiper-button-prev",
              nextEl: ".story-swiper-button-next",
            }}
            className="w-full h-full rounded-lg overflow-hidden"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            initialSlide={activeIndex}
            grabCursor={true}
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
                    <p className="text-center text-3xl font-bold text-white story-text leading-relaxed">{story.text}</p>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            className="story-swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
            aria-label="السابق"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            className="story-swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow-md"
            aria-label="التالي"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete Story Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">تأكيد حذف القصة</DialogTitle>
            <DialogDescription className="text-center text-gray-500 pt-2">
              هل أنت متأكد أنك تريد حذف هذه القصة نهائياً؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <p className="text-red-600 text-sm text-center font-semibold mb-8">لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-4 w-full">
              <Button variant="destructive" className="flex-1" onClick={handleDeleteConfirm} disabled={isDeletingStory}>
                {isDeletingStory ? "جاري الحذف..." : "نعم، قم بالحذف"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeletingStory}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Highlight Confirmation Modal */}
      <Dialog open={showDeleteHighlightModal} onOpenChange={setShowDeleteHighlightModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">تأكيد حذف المجموعة</DialogTitle>
            <DialogDescription className="text-center text-gray-500 pt-2">
              هل أنت متأكد أنك تريد حذف مجموعة "{highlightName}" نهائياً؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <p className="text-gray-600 text-center mb-2">
              سيتم حذف: <span className="font-medium">{highlightName}</span>
            </p>
            <p className="text-red-600 text-sm text-center font-semibold mb-8">
              سيتم حذف جميع القصص في هذه المجموعة ولا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-4 w-full">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteHighlightConfirm}
                disabled={isDeletingHighlight}
              >
                {isDeletingHighlight ? "جاري الحذف..." : "نعم، قم بالحذف"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteHighlightModal(false)}
                disabled={isDeletingHighlight}
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

export default HighlightViewer;

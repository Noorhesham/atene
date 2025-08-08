import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Type, Image as ImageIcon, X } from "lucide-react";
import ModalCustom from "@/components/ModalCustom";
import toast from "react-hot-toast";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import type { ApiStory } from "@/types";
import type { StoryFormData } from "./StoryForm";
import type { HighlightFormData } from "./HighLightForm";
import StoryForm from "./StoryForm";
import HighlightForm from "./HighLightForm";
import HighlightViewer from "./HighlightViewer";

const StoriesPage = () => {
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [highlightStep, setHighlightStep] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [selectedStories, setSelectedStories] = useState<number[]>([]);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [storyType, setStoryType] = useState<"text" | "media" | null>(null);
  const [highlightName, setHighlightName] = useState("");
  const [viewingHighlight, setViewingHighlight] = useState<{ stories: ApiStory[]; name: string } | null>(null);
  const [viewingStory, setViewingStory] = useState<ApiStory | null>(null);

  useEffect(() => {
    if (viewingHighlight && viewingHighlight.stories.length === 0) {
      setViewingHighlight(null);
    }
  }, [viewingHighlight]);

  const {
    data: stories,
    isLoading,
    create: createStory,
    remove: deleteStory,
    refetch,
  } = useAdminEntityQuery("stories", {}, "merchant");

  const { data: highlights, create: createHighlight, error } = useAdminEntityQuery("highlights", {}, "merchant");

  const handleAddStory = async (data: StoryFormData) => {
    try {
      console.log(data);
      const storyData: Partial<ApiStory> =
        storyType === "media" ? { image: data.image || null } : { text: data.text, color: data.color || "#000000" };

      await createStory(storyData);
      setIsAddStoryModalOpen(false);
      setStoryType(null);
      refetch();
    } catch (error: Error | unknown) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء القصة");
      console.error("Error creating story:", error);
    }
  };

  const handleCreateHighlight = async (data: HighlightFormData) => {
    try {
      console.log(data);
      if (highlightStep === 1) {
        setHighlightName(data.name);
        setHighlightStep(2);
        return;
      }

      await createHighlight({
        name: highlightName,
        stories: selectedStories,
      });
      setIsHighlightModalOpen(false);
      setSelectedStories([]);
      setHighlightStep(1);
      setHighlightName("");
    } catch (error: Error | unknown) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء المجموعة");
      console.error("Error creating highlight:", error);
    }
  };

  const handleStorySelect = (storyId: number) => {
    setSelectedStories((prev) => (prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]));
  };

  const handleDeleteStory = async (storyId: number) => {
    try {
      await deleteStory(storyId);
      setShowDeleteConfirm(null);
      setViewingStory(null);
    } catch (error: Error | unknown) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء حذف القصة");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }
  console.log(viewingHighlight);
  return (
    <div className="p-6 w-full bg-gray-100 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm text-gray-500">الرئيسية / القصص</h1>
      </div>

      <div className="bg-white w-full p-6 rounded-lg shadow-sm mx-auto">
        {/* Highlights */}
        <div className="mb-8">
          <div className="flex justify-start items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold">القصص المميزة (highlights)</h2>
            <Plus size={20} className="text-gray-600" />
          </div>
          <div className="flex items-center gap-6">
            <ModalCustom
              isOpen={isHighlightModalOpen}
              onOpenChange={(open) => {
                if (!open) {
                  setHighlightStep(1);
                  setSelectedStories([]);
                  setHighlightName("");
                }
                setIsHighlightModalOpen(open);
              }}
              title="إنشاء مجموعة جديدة"
              content={
                <HighlightForm
                  step={highlightStep}
                  stories={stories || []}
                  selectedStories={selectedStories}
                  onStorySelect={handleStorySelect}
                  onSubmit={handleCreateHighlight}
                />
              }
              functionalbtn={
                <div className="flex justify-end gap-2 w-full">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsHighlightModalOpen(false);
                      setHighlightStep(1);
                      setSelectedStories([]);
                      setHighlightName("");
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={() => handleCreateHighlight({ name: highlightName, stories: selectedStories })}>
                    {highlightStep === 1 ? "التالي" : "تم"}
                  </Button>
                </div>
              }
              btn={
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
                    <Plus size={30} className="text-gray-400" />
                  </div>
                  <span className="text-sm">جديدة</span>
                </div>
              }
            />
            {highlights?.map((highlight) => {
              const highlightStories = stories.filter((story) => highlight.stories.includes(story.id));
              return (
                <div
                  key={highlight.id}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => setViewingHighlight({ stories: highlightStories, name: highlight.name })}
                >
                  <div className="w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden">
                    {highlight.thumbnail ? (
                      <img src={highlight.thumbnail} alt={highlight.name} className="w-full h-full object-cover" />
                    ) : highlightStories[0]?.image ? (
                      <img
                        src={highlightStories[0].image}
                        alt={highlight.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm">{highlight.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stories */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">القصص ({stories?.length || 0})</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button>+ إضافة قصة</Button>
              </PopoverTrigger>
              <PopoverContent className="w-60" align="end">
                <div className="space-y-4 p-2 text-right">
                  <button
                    className="flex items-center gap-3 w-full text-right hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                      setStoryType("text");
                      setIsAddStoryModalOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-main/10">
                      <Type className=" text-main" size={20} />
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <p className="font-semibold text-main">نص</p>
                      <p className="text-xs text-[#8E8E8E]">قم بإضافة نص الى قصتك</p>
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-3 w-full text-right hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                      setStoryType("media");
                      setIsAddStoryModalOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-main/10">
                      <ImageIcon className=" text-main" size={20} />
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <p className="font-semibold text-main">صورة أو فيديو</p>
                      <p className="text-xs text-[#8E8E8E]">قم بإضافة صورة أو فيديو الى قصتك</p>
                    </div>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            {stories?.map((story) => (
              <div key={story.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setViewingStory(story)}>
                  {story.image ? (
                    <img
                      src={story.image}
                      alt={`Story ${story.id}`}
                      className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                    />
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-full border-2 border-gray-400 flex items-center justify-center ${
                        story.color ? "" : "bg-gray-100"
                      }`}
                      style={{ backgroundColor: story.color }}
                    >
                      <span className="text-sm overflow-hidden line-clamp-2 p-2 text-white">
                        {story.text || "No content"}
                      </span>
                    </div>
                  )}
                </div>
                <ModalCustom
                  isOpen={showDeleteConfirm === story.id}
                  onOpenChange={(isOpen) => !isOpen && setShowDeleteConfirm(null)}
                  btn={
                    <button
                      onClick={() => setShowDeleteConfirm(story.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="حذف القصة"
                    >
                      <Trash2 />
                    </button>
                  }
                  title="تأكيد الحذف"
                  content={
                    <p className="text-center">هل أنت متأكد أنك تريد حذف هذه القصة؟ لا يمكن التراجع عن هذا الإجراء.</p>
                  }
                  functionalbtn={
                    <div className="flex gap-2 w-full justify-end">
                      <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>
                        إلغاء
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteStory(story.id)}>
                        حذف
                      </Button>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Story Modal */}
      <ModalCustom
        isOpen={isAddStoryModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setStoryType(null);
          }
          setIsAddStoryModalOpen(open);
        }}
        title={storyType === "text" ? "إضافة قصة نصية" : "إضافة صورة أو فيديو"}
        content={<StoryForm storyType={storyType} onSubmit={handleAddStory} />}
        btn={<div />}
      />

      {/* Story Viewer Modal */}
      {viewingStory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md h-[80vh] bg-white rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setViewingStory(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              title="إغلاق"
            >
              <X size={20} />
            </button>

            {/* Story content */}
            <div className="w-full h-full flex items-center justify-center">
              {viewingStory.image ? (
                <img src={viewingStory.image} alt="Story" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center p-8"
                  style={{ backgroundColor: viewingStory.color }}
                >
                  <p className="text-white text-center text-2xl font-medium leading-relaxed">{viewingStory.text}</p>
                </div>
              )}
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDeleteStory(viewingStory.id)}
              className="absolute bottom-4 left-4 z-10 text-white bg-red-500 rounded-full p-2 hover:bg-red-600"
              title="حذف القصة"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Highlight Viewer */}
      {viewingHighlight && (
        <HighlightViewer
          stories={viewingHighlight.stories}
          onClose={() => setViewingHighlight(null)}
          onDelete={handleDeleteStory}
        />
      )}
    </div>
  );
};

export default StoriesPage;

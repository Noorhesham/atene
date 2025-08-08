import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Conversation, conversationAPI } from "@/utils/api/store";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export const CreateGroupModal = ({
  isOpen,
  onClose,
  conversation,
}: {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}) => {
  const queryClient = useQueryClient();
  const existingParticipantIds = useMemo(
    () => new Set(conversation.participants.map((p) => p.participant_data.id)),
    [conversation.participants]
  );
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(
    conversation.participants.map((p) => p.participant_data.id)
  );

  // Fetch previous participants list from API (users you've chatted with before)
  // Use the endpoint registered in the query hook; cast the generic to satisfy TS without changing the shared types map
  const { data: prevParticipants, isLoading: usersLoading } = useAdminEntityQuery<any>(
    "prev_participants" as unknown as any
  );

  type PrevParticipant = {
    id: number;
    conversation_id?: number;
    participant_data: { id: number; name: string; slug?: string; avatar?: string | null };
  };

  const { mutate: addParticipants, isPending: isCreating } = useMutation({
    mutationFn: async (payload: { participants: number[] }) => {
      const toAdd = payload.participants.filter((id) => !existingParticipantIds.has(id));
      if (toAdd.length === 0) return { status: true };
      await Promise.all(toAdd.map((id) => conversationAPI.addParticipant(conversation.id, { type: "user", id })));
      return { status: true };
    },
    onSuccess: () => {
      toast.success("تم إضافة المشاركين بنجاح");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      onClose();
    },
  });

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) return;
    addParticipants({ participants: selectedUserIds });
  };

  if (!isOpen) return null;
  console.log(prevParticipants);
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">إضافة مشاركين</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200" title="إغلاق" aria-label="إغلاق">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر المشاركين لإضافتهم <span className="text-red-500">*</span>
            </label>
            <div className="bg-white border border-gray-300 rounded-md h-64 overflow-y-auto">
              {usersLoading ? (
                <div className="p-4 text-center text-gray-500">جاري تحميل المستخدمين...</div>
              ) : (
                (prevParticipants as unknown as PrevParticipant[])?.data?.map((participant) => (
                  <div
                    key={participant.participant_data.id}
                    className="flex items-center justify-between p-3 border-b last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={participant.participant_data.avatar || "/placeholder.png"}
                        alt={participant.participant_data.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{participant.participant_data.name}</p>
                        <p className="text-xs text-gray-500">مستخدم</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">مشارك</span>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(participant.participant_data.id)}
                        onChange={() => handleToggleUser(participant.participant_data.id)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        title="تبديل اختيار المستخدم"
                        aria-label={`تبديل اختيار ${participant.participant_data.name}`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold flex items-center gap-2 disabled:bg-blue-300"
            >
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
              إضافة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

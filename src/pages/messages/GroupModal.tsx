import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Conversation } from "@/utils/api/store";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";
import { X, Loader2 } from "lucide-react";

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
  const [groupName, setGroupName] = useState(conversation.name || "");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(
    conversation.participants.map((p) => p.participant_data.id)
  );

  const { data: users, isLoading: usersLoading } = useAdminEntityQuery("users");

  const { mutate: addParticipants, isLoading: isCreating } = useMutation({
    mutationFn: async (payload: { name: string; participants: number[] }) => {
      console.log(`POST to /conversations/${conversation.id}/participants`, payload);
      await new Promise((res) => setTimeout(res, 1000));
      // Here you would make the actual API call
      // For example: await FetchFunction(`/conversations/${conversation.id}/participants`, 'POST', JSON.stringify(payload), headers);
      return { status: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      onClose();
    },
  });

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUserIds.length === 0) return;
    addParticipants({ name: groupName, participants: selectedUserIds });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">إنشاء مجموعة</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان المجموعة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="مجموعة جديدة"
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1 text-left">{groupName.length}/50</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المستخدمين <span className="text-red-500">*</span>
            </label>
            <div className="bg-white border border-gray-300 rounded-md h-64 overflow-y-auto">
              {usersLoading ? (
                <div className="p-4 text-center text-gray-500">جاري تحميل المستخدمين...</div>
              ) : (
                users.map((user: UserForGroup) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border-b last:border-none">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">السعر شامل التوصيل</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{user.type}</span>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleToggleUser(user.id)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
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
              إنشاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

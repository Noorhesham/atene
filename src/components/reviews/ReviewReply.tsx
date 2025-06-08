import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/constants/api";
import { Loader2 } from "lucide-react";

interface ReviewReplyProps {
  reviewId: string;
  productSlug: string;
  onClose: () => void;
}

interface Reply {
  id: string;
  user: {
    fullname: string;
    avatar: string | null;
  };
  content: string;
  created_at: string;
}

const ReviewReply = ({ reviewId, productSlug, onClose }: ReviewReplyProps) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user: userData, isAuthenticated } = useAuth();
  const user = userData?.user;

  useEffect(() => {
    fetchReplies();
  }, [reviewId, productSlug]);

  const fetchReplies = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`${API_BASE_URL}/reviews/product/${productSlug}/${reviewId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log(data, "data");
      setReplies(data.replies);
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content: replyText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post reply");
      }

      setReplyText("");
      await fetchReplies();
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      {/* Existing Replies */}
      <div className="space-y-4 mb-6">
        {isFetching ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : replies?.length > 0 ? (
          replies?.map((reply) => (
            <div key={reply.id} className="flex gap-3 items-start">
              {reply.user.avatar ? (
                <img src={reply.user.avatar} alt={reply.user.fullname} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                  {reply.user.fullname[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{reply.user.fullname}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(reply.created_at).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{reply.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-2">لا توجد ردود بعد</p>
        )}
      </div>

      {/* Reply Input */}
      {isAuthenticated && user && (
        <div className="flex gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.fullname} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
              {user.fullname[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="اكتب ردك هنا..."
              className="mb-2 resize-none"
              rows={3}
              disabled={isLoading}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                إلغاء
              </Button>
              <Button onClick={handleSubmitReply} disabled={isLoading || !replyText.trim()} className="min-w-[80px]">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "إرسال"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewReply;

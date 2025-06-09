import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/constants/api";
import { Loader2 } from "lucide-react";
import Card from "../Card";

interface ReviewReplyProps {
  reviewId: string;
  productSlug: string;
  onClose: () => void;
  type?: "product" | "store";
}

interface Reply {
  id: string;
  user: {
    name: string;
    avatar: string | null;
  };
  content: string;
  created_at: string;
}

const ReviewReply = ({ reviewId, productSlug, onClose, type = "product" }: ReviewReplyProps) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user: userData, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchReplies();
  }, [reviewId, productSlug, type]);

  const fetchReplies = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`${API_BASE_URL}/reviews/${type}/${productSlug}/${reviewId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setReplies(data.reviews);
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !userData) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${type}/${productSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content: replyText,
          parent_id: reviewId,
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

  if (!isAuthenticated || !userData) {
    return null;
  }
  console.log(userData, "userData");
  const { user } = userData;
  return (
    <div className="mt-6">
      {/* Existing Replies */}
      <Card className="space-y-4 mb-6 mr-10">
        {isFetching ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : replies?.length > 0 ? (
          replies?.map((reply) => (
            <div key={reply.id} className="flex gap-3 items-start">
              {reply.user.avatar ? (
                <img src={reply.user.avatar} alt={reply.user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                  {reply.user.name[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{reply.user.name}</h4>
                </div>
                <p className="text-gray-700 mt-1">{reply.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-2">لا توجد ردود بعد</p>
        )}
      </Card>

      {/* Reply Input */}
      <div className="flex gap-3">
        {user.avatar ? (
          <img src={user.avatar} alt={user.fullname} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
            {user?.fullname}
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
    </div>
  );
};

export default ReviewReply;

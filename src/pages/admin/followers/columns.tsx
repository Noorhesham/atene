import { ColumnDef, Row } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UserMinus } from "lucide-react";

export interface Follower {
  id: number;
  followed_type: "store";
  followed: {
    id: number;
    slug: string;
    name: string;
    status: "active" | "inactive";
    phone: string;
    whats_app: string | null;
    email: string;
    address: string;
    lat: number | null;
    lng: number | null;
    logo: string | null;
    cover: string | null;
    is_favorite: boolean;
    review_rate: number;
    review_count: number;
    open_status: string;
    am_i_following: boolean;
    created_at: string;
    updated_at: string;
    orders_count: number;
  };
}

interface ColumnsProps {
  onUnfollow?: (storeId: number) => void;
  showUnfollow?: boolean;
  isUnfollowing?: boolean;
}

export const columns = ({ onUnfollow, showUnfollow, isUnfollowing }: ColumnsProps): ColumnDef<Follower>[] => [
  {
    accessorKey: "followed",
    header: "المتجر",
    cell: ({ row }) => {
      const store = row.getValue("followed") as Follower["followed"];
      return (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={store.logo || ""} alt={store.name} />
            <AvatarFallback>{store.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{store.name}</p>
            <p className="text-xs text-gray-500">{store.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "followed.status",
    header: "الحالة",
    cell: ({ row }) => {
      const store = row.getValue("followed") as Follower["followed"];
      return (
        <div className={`text-sm ${store.status === "active" ? "text-green-600" : "text-red-600"}`}>
          {store.status === "active" ? "نشط" : "غير نشط"}
        </div>
      );
    },
  },
  {
    accessorKey: "followed.created_at",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => {
      const store = row.getValue("followed") as Follower["followed"];
      return <div className="text-sm">{format(new Date(store.created_at), "dd/MM/yyyy")}</div>;
    },
  },
  ...(showUnfollow
    ? [
        {
          id: "actions",
          header: "الإجراءات",
          cell: ({ row }: { row: Row<Follower> }) => {
            const store = row.getValue("followed") as Follower["followed"];
            return (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onUnfollow?.(store.id)}
                disabled={isUnfollowing}
              >
                <UserMinus className="w-4 h-4 ml-2" />
                إلغاء المتابعة
              </Button>
            );
          },
        },
      ]
    : []),
];

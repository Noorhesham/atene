import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "تاجر" | "عميل";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "اسم المستخدم",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
  },
  {
    accessorKey: "phone",
    header: "الهاتف",
  },
  {
    accessorKey: "type",
    header: "نوع المستخدم",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div
          className={`inline-block px-3 py-1 rounded-full text-sm ${
            type === "تاجر" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
          }`}
        >
          {type}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" dir="rtl" className="w-40">
            <DropdownMenuLabel className="text-[#395A7D]">الإجراءات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
              className="text-[#395A7D] focus:text-[#395A7D] focus:bg-[#F0F7FF]"
            >
              عرض الحساب
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#395A7D] focus:text-[#395A7D] focus:bg-[#F0F7FF]">
              تعديل الحساب
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">حذف الحساب</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

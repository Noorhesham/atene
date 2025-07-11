import { DataTable } from "@/components/(dashboard)/users/data-table";
import { columns } from "@/components/(dashboard)/users/columns";
import { Filter } from "lucide-react";

const data = [
  {
    id: "1",
    name: "محمد احمد سيد",
    email: "best@info.com",
    phone: "01558899660",
    type: "تاجر",
  },
  {
    id: "2",
    name: "محمد احمد سيد",
    email: "best@info.com",
    phone: "01558899660",
    type: "عميل",
  },
  {
    id: "3",
    name: "محمد احمد سيد",
    email: "best@info.com",
    phone: "01558899660",
    type: "عميل",
  },
  {
    id: "4",
    name: "محمد احمد سيد",
    email: "best@info.com",
    phone: "01558899660",
    type: "تاجر",
  },
  {
    id: "5",
    name: "محمد احمد سيد",
    email: "best@info.com",
    phone: "01558899660",
    type: "تاجر",
  },
];

export default function UsersManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {" "}
        <div className="text-sm text-[#395A7D]">
          اجمالي المستخدمين: <span className="font-medium">28 مستخدم</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#F0F7FF] p-2 rounded-lg">
            <Filter className="w-5 h-5 text-[#395A7D]" />
          </div>
          <span className="text-[#395A7D] text-sm">فلتر المستخدمين</span>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

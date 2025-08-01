import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useReactTable } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AddCouponForm } from "./CouponForm";
import { Plus } from "lucide-react";
import ModalCustom from "@/components/ModalCustom";
import { ApiCoupon } from "@/types";
import { CouponActions } from "./CouponActions";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";

const CouponsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<(ApiCoupon & { id: number }) | undefined>();

  const couponsQuery = useAdminEntityQuery("coupons");

  const columns: ColumnDef<ApiCoupon>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "كود الكوبون",
        cell: ({ row }) => {
          const coupon = row.original;
          const now = new Date();
          const endDate = new Date(coupon.end_date);
          const status = now > endDate ? "inactive" : "active";
          const statusColor = status === "active" ? "bg-green-500" : "bg-gray-400";

          return (
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></span>
              <span className="font-semibold text-gray-800 underline">{coupon.code}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "نوع الكوبون",
        cell: ({ row }) => {
          const type = row.original.type;
          return type === "percentage" ? "نسبة مئوية" : "قيمة ثابتة";
        },
      },
      {
        accessorKey: "value",
        header: "قيمة الخصم",
        cell: ({ row }) => {
          const { type, value } = row.original;
          return type === "percentage" ? `${value}%` : `${value} ريال`;
        },
      },
      {
        accessorKey: "start_date",
        header: "تاريخ بداية الكوبون",
        cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString("ar-SA"),
      },
      {
        accessorKey: "end_date",
        header: "تاريخ انتهاء الكوبون",
        cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString("ar-SA"),
      },
      {
        id: "actions",
        header: "عمليات",
        cell: ({ row }) => {
          const coupon = row.original;
          const now = new Date();
          const endDate = new Date(coupon.end_date);
          const isActive = now <= endDate;

          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={async (checked) => {
                  try {
                    await couponsQuery.update(coupon.id, {
                      code: coupon.code,
                      type: coupon.type,
                      value: coupon.value,
                      start_date: coupon.start_date,
                      end_date: checked ? "2025-12-31" : new Date().toISOString().split("T")[0],
                      store_id: coupon.store_id || 0,
                      categories: coupon.categories?.map((c) => c.id) || [],
                      products: coupon.products?.map((p) => p.id) || [],
                      status: checked ? "active" : "not-active",
                    } as any);
                  } catch (error) {
                    console.error("Failed to update coupon status:", error);
                  }
                }}
              />
              <CouponActions coupon={coupon} editLink={`/admin/coupons/edit/${coupon.id}`} />
            </div>
          );
        },
      },
    ],
    [couponsQuery]
  );

  const table = useReactTable({
    data: couponsQuery.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" dir="rtl">
      <header className="flex flex-col sm:flex-row justify-between w-full  items-start  gap-4 mb-6">
        <div className="flex items-center   gap-2">
          {" "}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9.50038 14.5L14.5004 9.5M9.50038 9.5H9.51138M14.4894 14.5H14.5004M2.46438 9.344C2.21638 9.344 1.98938 9.142 2.00038 8.879C2.06738 7.337 2.25538 6.333 2.78038 5.539C3.07984 5.08653 3.45539 4.68933 3.89038 4.365C5.05538 3.5 6.70038 3.5 9.99238 3.5H14.0064C17.2984 3.5 18.9434 3.5 20.1104 4.365C20.5414 4.685 20.9174 5.082 21.2194 5.539C21.7444 6.333 21.9324 7.337 21.9994 8.879C22.0104 9.142 21.7834 9.344 21.5344 9.344C20.1484 9.344 19.0244 10.533 19.0244 12C19.0244 13.467 20.1484 14.656 21.5344 14.656C21.7834 14.656 22.0104 14.858 21.9994 15.122C21.9324 16.663 21.7444 17.667 21.2194 18.462C20.9198 18.9141 20.5443 19.311 20.1094 19.635C18.9434 20.5 17.2984 20.5 14.0064 20.5H9.99338C6.70138 20.5 5.05638 20.5 3.88938 19.635C3.45475 19.3106 3.07954 18.9134 2.78038 18.461C2.25538 17.667 2.06738 16.663 2.00038 15.121C1.98938 14.858 2.21638 14.656 2.46438 14.656C3.85038 14.656 4.97438 13.467 4.97438 12C4.97438 10.533 3.85038 9.344 2.46438 9.344Z"
              stroke="#1C1C1C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div className="flex items-start flex-col gap-2">
            {" "}
            <div>
              <p className="text-[12.174px] text-black mt-1">كوبونات التخفيض</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>مفعل
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>منتهي الصلاحية
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>مغلق
              </span>
            </div>
          </div>{" "}
        </div>
        <div className="flex justify-end gap-3 mb-4">
          {" "}
          <ModalCustom
            isOpen={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) setEditingCoupon(undefined);
            }}
            btn={
              <Button
                className="bg-main text-white hover:bg-main/90"
                style={{ borderRadius: "4px", border: "1px solid #769AC0" }}
              >
                <Plus size={16} className="ml-2" /> إضافة كوبون
              </Button>
            }
            content={
              <AddCouponForm
                closeModal={() => {
                  setIsModalOpen(false);
                  setEditingCoupon(undefined);
                }}
                editingCoupon={editingCoupon}
              />
            }
          />
          <Button variant="outline" className="bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10.1088 12.2825V4.67383M10.1088 12.2825C9.57619 12.2825 8.58098 10.7653 8.20663 10.3803M10.1088 12.2825C10.6414 12.2825 11.6366 10.7653 12.011 10.3803M4.78271 15.326H15.4349"
                stroke="#2D496A"
                stroke-width="1.1413"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>{" "}
            تصدير
          </Button>
        </div>
      </header>

      <div className=" rounded-lg border border-gray-200 p-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className=" hover:bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-right text-gray-600 font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </tr>
              ))}
            </TableHeader>
            <TableBody className="bg-white">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    لا توجد نتائج.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;

"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const StoreWorkingHours = () => {
  const { control, watch, setValue } = useFormContext();

  const {
    fields: workingtimes,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: "workingtimes",
  });

  const openStatus = watch("open_status");

  const daysOfWeek = [
    { key: "saturday", label: "السبت" },
    { key: "sunday", label: "الأحد" },
    { key: "monday", label: "الاثنين" },
    { key: "tuesday", label: "الثلاثاء" },
    { key: "wednesday", label: "الأربعاء" },
    { key: "thursday", label: "الخميس" },
    { key: "friday", label: "الجمعة" },
  ];

  const openStatusOptions = [
    {
      value: "open_with_working_times",
      label: "مفتوح خلال ساعات عمل معينة",
      description: "أتبع جدول ساعات العمل المحدد أدناه",
    },
    { value: "temporarily_closed", label: "مغلق بشكل مؤقت", description: "لا تقبل طلبات جديدة حالياً" },
    { value: "permanently_closed", label: "مغلق بشكل دائم", description: "أتوقف عن استقبال الطلبات نهائياً" },
  ];

  // Initialize working times if empty
  React.useEffect(() => {
    if (workingtimes.length === 0) {
      daysOfWeek.forEach((day) => {
        append({
          day: day.key,
          from: "09:00",
          to: "18:00",
          open_always: false,
          closed_always: false,
        });
      });
    }
  }, [workingtimes.length, append]);

  const handleTimeChange = (index: number, field: string, value: string) => {
    const currentWorkingTime = workingtimes[index];
    update(index, {
      ...currentWorkingTime,
      [field]: value,
    });
  };

  const handleCheckboxChange = (index: number, field: string, value: boolean) => {
    const currentWorkingTime = workingtimes[index];
    const newWorkingTime = {
      ...currentWorkingTime,
      [field]: value,
    };

    // If "24 hours" is selected, uncheck "closed"
    if (field === "open_always" && value) {
      newWorkingTime.closed_always = false;
      newWorkingTime.from = "00:00";
      newWorkingTime.to = "23:59";
    }

    // If "closed" is selected, uncheck "24 hours"
    if (field === "closed_always" && value) {
      newWorkingTime.open_always = false;
    }

    update(index, newWorkingTime);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-gray-900">أوقات العمل و الطلبات</h3>
      </div>

      {/* Store Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">حالة المتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {openStatusOptions.map((option) => (
            <div
              key={option.value}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                openStatus === option.value ? "border-main bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setValue("open_status", option.value)}
            >
              <div className="flex items-center mt-1">
                <input
                  type="radio"
                  name="open_status"
                  value={option.value}
                  checked={openStatus === option.value}
                  onChange={() => setValue("open_status", option.value)}
                  aria-label={option.label}
                  className="w-4 h-4 text-main border-gray-300 focus:ring-main"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{option.label}</h4>
                  {option.value === "open_with_working_times" && <Info size={16} className="text-blue-500" />}
                </div>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Working Hours Table - Only show when store is open with working times */}
      {openStatus === "open_with_working_times" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">جدول أوقات العمل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3 font-medium text-gray-700">اليوم</th>
                    <th className="text-center p-3 font-medium text-gray-700">مغلق</th>
                    <th className="text-center p-3 font-medium text-gray-700">24 ساعة كاملة</th>
                    <th className="text-center p-3 font-medium text-gray-700">من</th>
                    <th className="text-center p-3 font-medium text-gray-700">إلى</th>
                  </tr>
                </thead>
                <tbody>
                  {workingtimes.map((workingTime: any, index: number) => {
                    const dayInfo = daysOfWeek.find((d) => d.key === workingTime.day);
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{dayInfo?.label || workingTime.day}</td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={workingTime.closed_always || false}
                            onChange={(e) => handleCheckboxChange(index, "closed_always", e.target.checked)}
                            aria-label={`مغلق ${dayInfo?.label}`}
                            className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={workingTime.open_always || false}
                            onChange={(e) => handleCheckboxChange(index, "open_always", e.target.checked)}
                            aria-label={`24 ساعة كاملة ${dayInfo?.label}`}
                            className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="time"
                            value={workingTime.from || "09:00"}
                            onChange={(e) => handleTimeChange(index, "from", e.target.value)}
                            disabled={workingTime.closed_always || workingTime.open_always}
                            aria-label={`من ${dayInfo?.label}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="time"
                            value={workingTime.to || "18:00"}
                            onChange={(e) => handleTimeChange(index, "to", e.target.value)}
                            disabled={workingTime.closed_always || workingTime.open_always}
                            aria-label={`إلى ${dayInfo?.label}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">ملاحظات مهمة:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• يمكنك تحديد "مغلق" لإغلاق المتجر في يوم معين</li>
                    <li>• اختر "24 ساعة كاملة" للأيام التي يعمل فيها المتجر طوال اليوم</li>
                    <li>• تأكد من تحديد أوقات العمل بدقة لتجنب الطلبات خارج ساعات العمل</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message for non-working status */}
      {openStatus !== "open_with_working_times" && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <h4 className="font-medium text-lg mb-2">
                {openStatus === "temporarily_closed" && "المتجر مغلق مؤقتاً"}
                {openStatus === "permanently_closed" && "المتجر مغلق نهائياً"}
              </h4>
              <p className="text-sm">
                {openStatus === "temporarily_closed" && "لن يتم قبول أي طلبات جديدة حتى يتم تغيير حالة المتجر"}
                {openStatus === "permanently_closed" && "تم إيقاف المتجر عن استقبال الطلبات نهائياً"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreWorkingHours;

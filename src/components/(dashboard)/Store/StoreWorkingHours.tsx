"use client";

import React from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface WorkingTime {
  id?: string;
  day: string;
  from: string;
  to: string;
  open_always: boolean;
  closed_always: boolean;
}

interface StoreFormValues extends FieldValues {
  workingtimes: WorkingTime[];
  open_status: string;
}

const StoreWorkingHours = () => {
  const { control, watch, setValue } = useFormContext<StoreFormValues>();

  const {
    fields: workingtimes,
    update,
    replace,
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
      value: "open_without_working_times",
      label: "مفتوح دائماً",
      description: "متجر مفتوح على مدار الساعة",
    },
    {
      value: "open_with_working_times",
      label: "مفتوح خلال ساعات عمل معينة",
      description: "أتبع جدول ساعات العمل المحدد أدناه",
    },
    { value: "temporary_closed", label: "مغلق بشكل مؤقت", description: "لا تقبل طلبات جديدة حالياً" },
    { value: "closed", label: "مغلق", description: "متجر مغلق" },
  ];

  // Initialize or ensure exactly 7 working times
  React.useEffect(() => {
    const currentWorkingTimes = workingtimes as WorkingTime[];

    // If we have no working times or incorrect number of days, initialize/fix them
    if (currentWorkingTimes.length !== 7) {
      const correctedWorkingTimes: WorkingTime[] = daysOfWeek.map((day) => {
        const existing = currentWorkingTimes.find((wt) => wt.day === day.key);
        return (
          existing || {
            day: day.key,
            from: "09:00",
            to: "18:00",
            open_always: false,
            closed_always: false,
          }
        );
      });
      replace(correctedWorkingTimes);
    }
  }, [workingtimes, daysOfWeek, replace]);

  const handleTimeChange = (index: number, field: "from" | "to", value: string) => {
    const currentWorkingTime = workingtimes[index] as WorkingTime;
    update(index, {
      ...currentWorkingTime,
      [field]: value,
    });
  };

  const handleCheckboxChange = (index: number, field: "open_always" | "closed_always", value: boolean) => {
    const currentWorkingTime = workingtimes[index] as WorkingTime;
    const newWorkingTime: WorkingTime = {
      ...currentWorkingTime,
      [field]: value,
    };

    // If "24 hours" is selected, uncheck "closed"
    if (field === "open_always" && value) {
      newWorkingTime.closed_always = false;
      newWorkingTime.from = "00:00";
      newWorkingTime.to = "23:59";
    }

    // If "closed" is selected, open_always "24 hours"
    if (field === "closed_always" && value) {
      newWorkingTime.open_always = false;
    }

    update(index, newWorkingTime);
  };

  return (
    <div className="w-full space-y-6">
      {/* Store Status Section */}
      <div>
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
      </div>

      {/* Working Hours Table - Show when store is open (with or without working times) */}
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
                  {workingtimes.map((workingTime, index) => {
                    const typedWorkingTime = workingTime as WorkingTime;
                    const dayInfo = daysOfWeek.find((d) => d.key === typedWorkingTime.day);
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{dayInfo?.label || typedWorkingTime.day}</td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={typedWorkingTime.closed_always || false}
                            onChange={(e) => handleCheckboxChange(index, "closed_always", e.target.checked)}
                            aria-label={`مغلق ${dayInfo?.label}`}
                            className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={typedWorkingTime.open_always || false}
                            onChange={(e) => handleCheckboxChange(index, "open_always", e.target.checked)}
                            aria-label={`24 ساعة كاملة ${dayInfo?.label}`}
                            className="w-4 h-4 text-main border-gray-300 rounded focus:ring-main"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="time"
                            value={typedWorkingTime.from || "09:00"}
                            onChange={(e) => handleTimeChange(index, "from", e.target.value)}
                            disabled={typedWorkingTime.closed_always || typedWorkingTime.open_always}
                            aria-label={`من ${dayInfo?.label}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="time"
                            value={typedWorkingTime.to || "18:00"}
                            onChange={(e) => handleTimeChange(index, "to", e.target.value)}
                            disabled={typedWorkingTime.closed_always || typedWorkingTime.open_always}
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

      {/* Message for closed status */}
      {(openStatus === "temporary_closed" || openStatus === "closed") && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <h4 className="font-medium text-lg mb-2">
                {openStatus === "temporary_closed" && "المتجر مغلق مؤقتاً"}
                {openStatus === "closed" && "المتجر مغلق"}
              </h4>
              <p className="text-sm">
                {openStatus === "temporary_closed" && "لن يتم قبول أي طلبات جديدة حتى يتم تغيير حالة المتجر"}
                {openStatus === "closed" && "تم إيقاف المتجر عن استقبال الطلبات"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreWorkingHours;

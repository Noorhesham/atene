"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useNavigation } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { format, setMonth, setYear } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const MonthDropdown: React.FC = () => {
  const { goToMonth, currentMonth } = useNavigation();

  const selectItems = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: format(setMonth(new Date(), i), "MMMM"),
  }));

  return (
    <Select
      onValueChange={(newval) => {
        const newMonth = parseInt(newval);
        goToMonth(setMonth(currentMonth, newMonth));
      }}
      value={currentMonth.getMonth().toString()}
    >
      <SelectTrigger>{format(currentMonth, "MMMM")}</SelectTrigger>
      <SelectContent className=" relative !z-[60] ">
        {selectItems.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const YearDropdown: React.FC = () => {
  const { goToMonth, currentMonth } = useNavigation();
  const startYear = 1950;
  const endYear = new Date().getFullYear() + 50; // Allow navigation up to 50 years in the future

  const selectItems = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return { label: year.toString(), value: year.toString() };
  });

  return (
    <Select
      onValueChange={(newval) => {
        const newYear = parseInt(newval);
        goToMonth(setYear(currentMonth, newYear));
      }}
      value={currentMonth.getFullYear().toString()}
    >
      <SelectTrigger>{currentMonth.getFullYear()}</SelectTrigger>
      <SelectContent className=" relative !z-[60] ">
        {selectItems.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

function Calendar({ className, classNames, showOutsideDays = true, fromYear = 1950, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:bg-sky-200 aria-selected:opacity-100"
        ),
        ...classNames,
      }}
      fromYear={fromYear}
      toYear={new Date().getFullYear() + 50}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        Dropdown: (props) =>
          props.name === "months" ? <MonthDropdown /> : props.name === "years" ? <YearDropdown /> : null,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };

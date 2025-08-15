const PeriodSelector = ({ period, setPeriod }: { period: Period; setPeriod: (p: Period) => void }) => {
  const periodOptions: { label: string; value: Period }[] = [
    { label: "الشهر الحالي", value: "current_month" },
    { label: "آخر شهر", value: "last_month" },
    { label: "الأسبوع الحالي", value: "current_week" },
    { label: "آخر أسبوع", value: "last_week" },
    { label: "اليوم", value: "current_day" },
  ];
  return (
    <div className="relative">
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value as Period)}
        className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="تحديد الفترة"
        title="تحديد الفترة"
      >
        {periodOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
      >
        <path
          d="M14.2112 2.17676V3.67676M5.21118 2.17676V3.67676"
          stroke="#252522"
          stroke-width="1.125"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          opacity="0.4"
          d="M9.70781 10.4268H9.71456M9.70781 13.4268H9.71456M12.7044 10.4268H12.7112M6.71118 10.4268H6.71791M6.71118 13.4268H6.71791"
          stroke="#252522"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3.33618 6.67676H16.0862"
          stroke="#252522"
          stroke-width="1.125"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.58618 9.85916C2.58618 6.59121 2.58618 4.95722 3.52527 3.94199C4.46436 2.92676 5.9758 2.92676 8.99868 2.92676H10.4237C13.4466 2.92676 14.958 2.92676 15.8971 3.94199C16.8362 4.95722 16.8362 6.59121 16.8362 9.85916V10.2444C16.8362 13.5123 16.8362 15.1463 15.8971 16.1616C14.958 17.1768 13.4466 17.1768 10.4237 17.1768H8.99868C5.9758 17.1768 4.46436 17.1768 3.52527 16.1616C2.58618 15.1463 2.58618 13.5123 2.58618 10.2444V9.85916Z"
          stroke="#252522"
          stroke-width="1.125"
          stroke-linejoin="round"
        />
        <path d="M2.96118 6.67676H16.4612" stroke="#252522" stroke-width="1.125" stroke-linejoin="round" />
      </svg>
    </div>
  );
};
export default PeriodSelector;

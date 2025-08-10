import React from "react";

const StatusIndicator = ({ status }: { status: string }) => (
  <span className={`text-xs font-semibold ${status === "active" ? "text-[#1FC16B]" : "text-yellow-600"}`}>
    ● {status === "active" ? "مفعل" : "معطل"}
  </span>
);

export default StatusIndicator;

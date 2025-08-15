import { Card } from "@/components/ui/card";
import React from "react";

const StatsCard = ({ icon, title, val,isLoading,color }: { icon: React.ReactNode; title: string; val: number; isLoading: boolean,color:string }) => {
  return (
    <Card className="flex  bg-white h-64 py-4 px-8 flex-col items-center gap-3">
      <div className="flex   m-auto h-fit flex-col items-center gap-3">
        {icon}
        <div>
          <p className="font-[400] text-[#1C1C1C] text-center text-[14.753px]">{title}</p>
          <p className={`text-[18px]  text-center font-bold ${color}`}>{isLoading ? "..." : val}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;

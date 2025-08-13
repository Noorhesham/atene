interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}
export const InfoItem = ({ icon, title, children }: InfoItemProps) => (
  <div className="flex items-start text-right justify-start gap-3">
    <div className="w-10 h-10 text-black p-2 rounded-xl border-input border flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs font-[400] text-[#717171]">{title}</p>
      <p className="text-sm font-medium text-[#1C1C1C]">{children}</p>
    </div>
  </div>
);

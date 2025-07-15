import { ActionButtonProps } from "@/types/orders";

export const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = "secondary", icon, onClick }) => {
  const baseStyle = "py-1 px-2 rounded-lg text-[12px] flex items-center justify-center gap-2 font-semibold w-full";
  const variants = {
    danger: "bg-red-50 text-red-500",
    primary: "bg-gray-100 text-main border border-gray-200",
    secondary: "bg-gray-100 text-main border border-gray-200",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]}`} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
};

export default ActionButton;

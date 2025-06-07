import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  text: string;
}

const LoadingButton = ({ isLoading = false, text, className, disabled, ...props }: LoadingButtonProps) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={cn(
        "w-full bg-primary text-white rounded-full py-3 font-medium relative",
        "hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          <span className="opacity-0">{text}</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default LoadingButton;

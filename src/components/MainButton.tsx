import React from "react";
import { Button } from "./ui/button";

const MainButton = ({
  children,
  className,
  text,
  type,
  onClick,
  disabled,
  bg,
}: {
  children?: React.ReactNode;
  className?: string;
  text?: string;
  type?: "submit" | "reset" | "button";
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  bg?: string;
}) => {
  return (
    <Button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={` ${className || ""} w-full ${bg || "bg-gradient-to-b from-[#5B89BA] to-[#5B89BA]"}
rounded-full hover:bg-[#3e5d89] text-white py-5 transition-colors`}
    >
      {text || children}
    </Button>
  );
};

export default MainButton;

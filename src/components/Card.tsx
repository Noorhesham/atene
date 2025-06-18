import React from "react";

const Card = ({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary";
}) => {
  return (
    <div
      dir="rtl"
      className={` ${className} ${
        variant === "secondary" ? "py-3" : "py-10"
      }  px-5 rounded-[20px] border-input border-1`}
    >
      {children}
    </div>
  );
};

export default Card;

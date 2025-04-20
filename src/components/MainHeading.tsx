import React from "react";

const MainHeading = ({
  text,
  className,
  variant = "lg",
}: {
  text?: string;
  className?: string;
  variant?: "sm" | "lg";
}) => {
  return (
    <h2 className={`${className} ${variant === "lg" ? "text-2xl lg:text-4xl" : "text-xl lg:text-3xl"} font-bold `}>
      {text}
    </h2>
  );
};

export default MainHeading;

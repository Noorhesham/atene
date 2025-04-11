import React from "react";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={` ${className} py-2 px-4 rounded-lg border-input`}>{children}</div>;
};

export default Card;

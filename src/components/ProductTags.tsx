import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { Link } from "react-router-dom";

interface ProductTagsProps {
  tags: { id: number; title: string }[];
  selectedTags: string[];
  handleTagChange: (tagId: string) => void;
  asLink?: boolean;
}

const ProductTags = ({ tags, selectedTags, handleTagChange, asLink = false }: ProductTagsProps) => {
  const Component = asLink ? Link : Button;
  return (
    <div className="flex w-full flex-wrap gap-2">
      <h2 className="flex flex-row-reverse items-center font-[400]  lg:text-[15px] text-[12px] gap-2">
        العلامات: <img src="/Vector (4).svg" alt="tag" className="w-6 h-6" />
      </h2>
      {tags?.map((tag) => (
        <Component
          key={tag.id}
          size="sm"
          className={`rounded-full border-primary ${buttonVariants({ variant: "outline" })}  text-black !rounded-full ${
            selectedTags.includes(tag.id.toString()) ? "bg-primary text-white" : "  bg-[#0E0E0E17] "
          }`}
          onClick={() => handleTagChange(tag.id.toString())}
          to={asLink ? `/products?tags=${tag.id}` : ""}
        >
          {tag.title}
        </Component>
      ))}
    </div>
  );
};

export default ProductTags;

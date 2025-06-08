import React from "react";
import { Button } from "./ui/button";

interface ProductTagsProps {
  tags: { id: number; title: string }[];
  selectedTags: string[];
  handleTagChange: (tagId: string) => void;
}

const ProductTags = ({ tags, selectedTags, handleTagChange }: ProductTagsProps) => {
  return (
    <div className="flex w-full flex-wrap gap-2">
      <h2 className="flex flex-row-reverse items-center gap-2">
        العلامات: <img src="/Vector (4).svg" alt="tag" className="w-6 h-6" />
      </h2>
      {tags?.map((tag) => (
        <Button
          key={tag.id}
          variant={"outline"}
          size="sm"
          className={`rounded-full  ${selectedTags.includes(tag.id.toString()) ? "bg-primary text-white" : "  bg-[#0E0E0E17] "}`}
          onClick={() => handleTagChange(tag.id.toString())}
        >
          {tag.title}
        </Button>
      ))}
    </div>
  );
};

export default ProductTags;

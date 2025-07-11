"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ToolBar from "./ToolBar";

interface RichTextProps {
  description: string;
  onChange: (value: string) => void;
  name: string;
  label: string;
  placeholder: string;
  rows: number;
  className?: string;
}

const RichText = ({ description, onChange, name, label, placeholder, rows, className }: RichTextProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold",
          levels: [2],
        },
      }),
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: className || "rounded-lg border min-h-[150px] p-2 border-input",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full mb-2 border border-input rounded-md">
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichText;

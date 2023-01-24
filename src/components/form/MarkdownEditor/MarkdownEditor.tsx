import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useRef } from "react";
import { BiImageAdd } from "react-icons/bi";
import { uploadImage } from "../../../services/imgur";
import { convertToBase64 } from "../../../utils/image";
import Icon from "../../ui/Icon";

type MarkdownEditorProps = {
  error?: boolean;
  value: string;
  onChange: (markdown: string) => void;
  editorRef?: React.LegacyRef<HTMLDivElement>;
};

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { error, editorRef, value, onChange } = props;

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleMarkdownChange = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerText);
  };

  const handleAddImageClick = () => {
    imageInputRef.current?.click();
  };

  const imageMutation = useMutation({
    mutationFn: (base64Image: string) => uploadImage(base64Image),
    onSuccess: (imageLink: string) => {
      onChange(`${value}\n![image](${imageLink})`);
    },
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const base64Image = await convertToBase64(file);

    imageMutation.mutate(base64Image);
  };

  return (
    <div
      className={clsx(
        error ? "border-red-500" : "border-gray-300",
        "flex min-h-[10em] w-full flex-col rounded-lg border"
      )}
    >
      <div className="flex w-full justify-start p-3">
        <button type="button" onClick={handleAddImageClick}>
          <Icon size="small">
            {(fontSize) => <BiImageAdd fontSize={fontSize} />}
          </Icon>
        </button>
        <input
          ref={imageInputRef}
          onChange={handleImageSelect}
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
        />
      </div>

      <div
        contentEditable
        suppressContentEditableWarning
        ref={editorRef}
        onChange={handleMarkdownChange}
        className="flex-grow rounded-b-lg border-t border-gray-300 bg-surface-light p-3 focus:outline-none"
      >
        {value}
      </div>
    </div>
  );
};

export default MarkdownEditor;

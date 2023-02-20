import Icon from "@/components/ui/Icon";
import { convertToBase64 } from "@/utils/image";
import { insertImageToMarkdown } from "@/utils/solution/markdown";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import React, { useRef } from "react";
import { BiImageAdd } from "react-icons/bi";

type MarkdownEditorProps = {
  error?: boolean;
  value: string;
  onChange: (markdown: string) => void;
  editorRef?: React.LegacyRef<HTMLTextAreaElement>;
};

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { error, editorRef, value, onChange } = props;

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleAddImageClick = () => {
    imageInputRef.current?.click();
  };

  const imageMutation = trpc.imgur.uploadImage.useMutation({
    onSuccess: (imageLink: string) => {
      onChange(
        insertImageToMarkdown({
          currentMarkdown: value,
          imageLink,
        })
      );
    },
    onError: () => alert("Can't upload image, try again later"),
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const base64Image = await convertToBase64(file);

    // imageMutation.mutate({ base64Image });
  };

  return (
    <div
      className={clsx(
        error ? "border-red-500" : "border-gray-300",
        "flex min-h-[10em]  flex-col rounded-lg border"
      )}
    >
      <div className="flex justify-start p-3">
        <button
          type="button"
          onClick={handleAddImageClick}
          disabled={imageMutation.isLoading}
        >
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

      <div className="relative flex flex-grow">
        <textarea
          ref={editorRef}
          onChange={handleMarkdownChange}
          value={value}
          className="flex-grow resize-none rounded-b-lg border-t border-gray-300 bg-surface-light p-3 outline-none focus:border-none"
        ></textarea>
        {imageMutation.isLoading && (
          <div
            className="absolute top-0 left-0 flex h-full w-full items-center justify-center whitespace-pre-wrap bg-gray-100 opacity-40 outline-none focus:border-primary-light"
            contentEditable={false}
          >
            <p className="text-black">Uploading image...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;

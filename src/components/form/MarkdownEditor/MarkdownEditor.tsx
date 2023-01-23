import clsx from "clsx";
import React, { useRef, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import Icon from "../../ui/Icon";

type MarkdownEditorProps = {
  error?: boolean;
};

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { error } = props;

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [markdown, setMarkdown] = useState("");

  const handleMarkdownChange = (e: React.FormEvent<HTMLDivElement>) => {
    setMarkdown(e.currentTarget.innerText);
  };

  const handleAddImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    console.log(file, typeof file);
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
        onChange={handleMarkdownChange}
        className="flex-grow rounded-b-lg border-t border-gray-300 bg-surface-light p-3 focus:outline-none"
      >
        {markdown}
      </div>
    </div>
  );
};

export default MarkdownEditor;

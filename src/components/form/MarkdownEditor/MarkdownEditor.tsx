import clsx from "clsx";
import { useRef } from "react";
import { BiImageAdd } from "react-icons/bi";
import Icon from "../../ui/Icon";

type MarkdownEditorProps = {
  error?: boolean;
};

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { error } = props;

  const imageInputRef = useRef<HTMLInputElement>(null);

  const onAddImageClick = () => {
    imageInputRef.current?.click();
  };

  return (
    <div
      className={clsx(
        error ? "border-red-500" : "border-gray-300",
        "flex min-h-[10em] w-full flex-col rounded-lg border"
      )}
    >
      <div className="flex w-full justify-start p-3">
        <button onClick={onAddImageClick}>
          <Icon size="small">
            {(fontSize) => <BiImageAdd fontSize={fontSize} />}
          </Icon>
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
        />
      </div>

      <div
        contentEditable
        className="flex-grow rounded-b-lg border-t border-gray-300 bg-surface-light p-3 focus:outline-none"
      ></div>
    </div>
  );
};

export default MarkdownEditor;

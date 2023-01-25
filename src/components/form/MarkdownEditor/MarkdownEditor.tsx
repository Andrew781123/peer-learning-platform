import { useMutation } from "@tanstack/react-query";
import "@uiw/react-markdown-preview/markdown.css";
import { MDEditorProps } from "@uiw/react-md-editor";
import {
  bold,
  code,
  codeBlock,
  divider,
  ICommand,
  image,
  italic,
  orderedListCommand,
  strikethrough,
  title2,
  unorderedListCommand,
} from "@uiw/react-md-editor/lib/commands";
import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { uploadImage } from "../../../services/imgur";
import { convertToBase64 } from "../../../utils/image";
import { insertImageToMarkdown } from "../../../utils/solution/markdown";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

type MarkdownEditorProps = {
  error?: boolean;
  editorRef: React.LegacyRef<HTMLDivElement>;
  onChange: (markdown: string) => void;
  value: string;
  isPreview: boolean;
} & MDEditorProps;

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { error, isPreview, editorRef, onChange, value, ...restProps } = props;

  const imageInputRef = useRef<HTMLInputElement>(null);

  const imageMutation = useMutation({
    mutationFn: (base64Image: string) => uploadImage(base64Image),
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

  const uploadImageCommand: ICommand = {
    ...image,
    execute: async () => {
      imageInputRef.current?.click();
    },
  };

  // const previewCommand: ICommand = {
  //   name: "preview",
  //   keyCommand: "preview",
  //   value: "preview",
  //   icon: (
  //     <button type="button" onClick={handlePreview}>
  //       Preview
  //     </button>
  //   ),
  // };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const base64Image = await convertToBase64(file);

    imageMutation.mutate(base64Image);
  };

  return (
    <div ref={editorRef} className="relative">
      {isPreview ? (
        <div className="min-h-[8rem] rounded-lg border border-gray-200 bg-surface-light p-2">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            className="prose dark:prose-invert"
          >
            {value.replace(/\n/, "  \n")}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="min-h-[8rem] rounded-lg border border-gray-200 bg-surface-light">
          <MDEditor
            className="whitespace-pre-wrap bg-surface-light"
            preview="edit"
            value={value}
            onChange={onChange}
            commands={[
              bold,
              italic,
              strikethrough,
              title2,
              divider,
              code,
              codeBlock,
              uploadImageCommand,
              divider,
              unorderedListCommand,
              orderedListCommand,
            ]}
            extraCommands={[]}
            {...restProps}
          />
        </div>
      )}

      <input
        ref={imageInputRef}
        onChange={handleImageSelect}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
      />
      {imageMutation.isLoading && (
        <div
          className="absolute top-0 left-0 flex h-full w-full items-center justify-center whitespace-pre-wrap bg-gray-100 opacity-60 outline-none focus:border-primary-light"
          contentEditable={false}
        >
          <p className="text-black">Uploading image...</p>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;

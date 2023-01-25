import { useMutation } from "@tanstack/react-query";
import "@uiw/react-markdown-preview/markdown.css";
import { MDEditorProps } from "@uiw/react-md-editor";
import {
  bold,
  codeBlock,
  ICommand,
  image,
  italic,
  link,
  strikethrough,
  unorderedListCommand,
} from "@uiw/react-md-editor/lib/commands";
import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useRef } from "react";
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
} & MDEditorProps;

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { error, editorRef, onChange, value, ...restProps } = props;

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
      <MDEditor
        className="whitespace-pre-wrap"
        preview="edit"
        value={value}
        onChange={onChange}
        commands={[
          bold,
          italic,
          strikethrough,
          link,
          codeBlock,
          uploadImageCommand,
          unorderedListCommand,
        ]}
        extraCommands={[]}
        {...restProps}
      />
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

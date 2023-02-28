// import "@uiw/react-markdown-preview/markdown.css";
import { MDEditorProps } from "@uiw/react-md-editor";
import {
  ICommand,
  bold,
  codeBlock,
  divider,
  image,
  italic,
  orderedListCommand,
  strikethrough,
  title2,
  unorderedListCommand,
} from "@uiw/react-md-editor/lib/commands";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { toast } from "react-hot-toast";

import Markdown from "@/components/ui/Markdown";
import { convertToBase64 } from "@/utils/image";
import { insertImageToMarkdown } from "@/utils/solution/markdown";
import { trpc } from "@/utils/trpc";

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

  const imageMutation = trpc.imgur.uploadImage.useMutation({
    onSuccess: (imageLink: string) => {
      onChange(
        insertImageToMarkdown({
          currentMarkdown: value,
          imageLink,
        })
      );
    },
    onError: () => toast.error("Can't upload image, try again later"),
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

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    const base64Image = await convertToBase64(file);

    imageMutation.mutate({ base64Image, name: file.name });
  };

  return (
    <div ref={editorRef} className="relative">
      {isPreview ? (
        <div className="min-h-[8rem] rounded-lg border border-gray-200 bg-surface-light p-2">
          <Markdown value={value} />
        </div>
      ) : (
        <div className="min-h-[8rem] rounded-lg border border-gray-200 bg-surface-light">
          <MDEditor
            className="whitespace-pre-wrap bg-surface-light"
            preview="edit"
            value={value}
            onChange={onChange}
            textareaProps={{
              placeholder:
                "**Answer of sub-questions**\na) \n```\nSelect * FROM Students\n```\nb) Solution of question b",
            }}
            commands={[
              bold,
              italic,
              strikethrough,
              title2,
              divider,
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

import "@uiw/react-markdown-preview/markdown.css";
import { MDEditorProps } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

type MarkdownEditorProps = {
  error?: boolean;
  editorRef: React.LegacyRef<HTMLDivElement>;
} & MDEditorProps;

const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { error, editorRef, ...restProps } = props;

  return (
    <div ref={editorRef}>
      <MDEditor {...restProps} />
    </div>
  );
};

export default MarkdownEditor;

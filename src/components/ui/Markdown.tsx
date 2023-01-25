import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";

type MarkdownProps = {
  value: string;
};

const Markdown = (props: MarkdownProps) => {
  const { value } = props;

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      className="prose dark:prose-invert"
      // components={{
      //   code({ node, inline, className, children, ...props }) {
      //     const match = /language-(\w+)/.exec(className || "");
      //     return !inline && match ? (
      //       <SyntaxHighlighter
      //         style={dark as any}
      //         language={match[1]}
      //         PreTag="div"
      //         {...props}
      //       >
      //         {String(children).replace(/\n$/, "")}
      //       </SyntaxHighlighter>
      //     ) : (
      //       <code className={className} {...props}>
      //         {children}
      //       </code>
      //     );
      //   },
      // }}
    >
      {value.replace(/\n/, "  \n")}
    </ReactMarkdown>
  );
};

export default Markdown;

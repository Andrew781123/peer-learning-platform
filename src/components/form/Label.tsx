import clsx from "clsx";

type LabelProps = {
  text: string | React.ReactNode;
  error?: boolean;
  className?: string;
};

const Label = (props: LabelProps) => {
  const { text, error, className } = props;

  return (
    <>
      <label
        className={clsx(error ? "text-red-500" : "text-gray-200", className)}
      >
        {typeof text === "string" && text}
      </label>
      {typeof text !== "string" && text}
    </>
  );
};

export default Label;

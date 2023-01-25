import clsx from "clsx";

type LabelProps = {
  text: string | React.ReactNode;
  error?: boolean;
};

const Label = (props: LabelProps) => {
  const { text, error } = props;

  return (
    <label className={clsx(error ? "text-red-500" : "text-gray-200")}>
      {text}
    </label>
  );
};

export default Label;

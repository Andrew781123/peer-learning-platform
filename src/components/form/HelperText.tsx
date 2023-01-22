import clsx from "clsx";

type HelperTextProps = {
  error?: boolean;
  children: string;
};

const HelperText = (props: HelperTextProps) => {
  const { children, error } = props;

  return (
    <p className={clsx(error ? "text-red-500" : "text-gray-200")}>{children}</p>
  );
};

export default HelperText;

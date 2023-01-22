import clsx from "clsx";

type ErrorTextProps = {
  error?: boolean;
  children?: string;
};

const ErrorText = (props: ErrorTextProps) => {
  const { error = false, children } = props;

  return (
    <p
      className={clsx(
        error ? "text-red-500" : "text-gray-200",
        "absolute text-sm"
      )}
    >
      {children}
    </p>
  );
};

export default ErrorText;

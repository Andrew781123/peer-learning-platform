import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
import ErrorText from "./ErrorText";

type InputProps = {
  error?: boolean;
  errorText?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { error, errorText, ...rest } = props;

  return (
    <div>
      <input
        ref={ref}
        className={clsx(
          error ? "border-red-500" : "border-gray-300",
          "relative min-h-[2.5rem] rounded-lg border bg-surface-light p-2 focus:border-primary-dark focus:ring-primary-dark"
        )}
        {...rest}
      />
      <ErrorText error={error}>{errorText}</ErrorText>
    </div>
  );
});

export default Input;

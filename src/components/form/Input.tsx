import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react";

import ErrorText from "./ErrorText";

type InputProps = {
  error?: boolean;
  errorText?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { error, errorText, className, ...rest } = props;

  return (
    <div className={clsx(className)}>
      <input
        ref={ref}
        className={clsx(
          error ? "border-red-500" : "border-gray-300",
          "relative min-h-[2.5rem] rounded-lg border bg-surface-light p-2 focus:border-primary-dark focus:ring-primary-dark w-full"
        )}
        {...rest}
      />
      <ErrorText error={error}>{errorText}</ErrorText>
    </div>
  );
});

export default Input;

import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

type InputProps = {
  error?: boolean;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { error } = props;

  return (
    <input
      ref={ref}
      className={clsx(
        error ? "border-red-500" : "border-gray-300",
        "rounded-lg border bg-surface-light focus:border-primary-dark focus:ring-primary-dark"
      )}
      {...props}
    />
  );
});

export default Input;

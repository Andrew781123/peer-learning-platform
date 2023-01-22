import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

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
          "relative rounded-lg border bg-surface-light focus:border-primary-dark focus:ring-primary-dark"
        )}
        {...rest}
      />
      <p
        className={clsx(
          error ? "text-red-500" : "text-gray-200",
          "absolute text-sm"
        )}
      >
        {errorText}
      </p>
    </div>
  );
});

export default Input;

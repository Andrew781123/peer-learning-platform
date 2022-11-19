import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {} = props;

  return (
    <input
      ref={ref}
      className={clsx(
        "rounded-lg border  border-gray-300 bg-surface-light focus:border-primary-dark focus:ring-primary-dark"
      )}
      {...props}
    />
  );
});

export default Input;

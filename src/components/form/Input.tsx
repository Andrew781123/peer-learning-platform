import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = (props: InputProps) => {
  const {} = props;

  return (
    <input
      className={clsx(
        "rounded-lg border  border-gray-300 bg-surface-light focus:border-primary-dark focus:ring-primary-dark"
      )}
      {...props}
    />
  );
};

export default Input;

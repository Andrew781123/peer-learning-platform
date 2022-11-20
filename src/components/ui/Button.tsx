import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  primary?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
  const { primary, className, children, ...otherProps } = props;

  const classes = clsx(
    primary
      ? "bg-primary-default hover:bg-primary-light text-onPrimary text-lg"
      : "bg-none hover:bg-surface-light text-onSurface border border-onSurface",
    "rounded-full py-2 px-4 w-fit transition-colors duration-300",
    className
  );

  return (
    <button {...otherProps} className={classes}>
      {children}
    </button>
  );
};

export default Button;

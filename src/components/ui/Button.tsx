import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

type ButtonProps = {
  primary?: boolean;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
  const {
    primary,
    className,
    children,
    isLoading = false,
    disabled = false,
    ...otherProps
  } = props;

  const classes = clsx(
    primary
      ? "bg-primary-default hover:bg-primary-light text-onPrimary text-lg"
      : "bg-none hover:bg-surface-light text-onSurface border border-onSurface",
    "rounded-full py-2 px-4 w-fit transition-colors duration-300",
    className
  );

  return (
    <button
      disabled={disabled || isLoading}
      {...otherProps}
      className={classes}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;

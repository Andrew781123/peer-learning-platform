import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  primary?: boolean;
  isLoading?: boolean;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ICON_SIZE_TO_FONT_SIZE_MAP: Record<ButtonSize, string> = {
  small: "1.3rem",
  medium: "2.2rem",
  large: "3rem",
};

const Button = (props: ButtonProps) => {
  const {
    primary,
    className,
    children,
    isLoading = false,
    disabled = false,
    size = "medium",
    ...otherProps
  } = props;

  const classes = clsx(
    primary
      ? "bg-primary-default hover:bg-primary-light text-onPrimary text-lg"
      : "bg-none hover:bg-surface-light text-onSurface border border-onSurface",
    "rounded-full py-2 px-4 w-fit transition-colors duration-300",
    size === "large" ? "text-lg" : size === "medium" ? "text-md" : "text-xs",
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

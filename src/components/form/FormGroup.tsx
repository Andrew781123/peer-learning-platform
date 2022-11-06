import clsx from "clsx";
import { ReactNode } from "react";

type FormGroupProps = {
  labelPosition?: "top" | "left";
  className?: string;
  children: ReactNode;
};

const FormGroup = (props: FormGroupProps) => {
  const { labelPosition = "left", className, children } = props;

  const classes = clsx(
    "flex gap-2",
    labelPosition === "top" ? "flex-col" : "flex-row items-center",
    className
  );

  return <div className={classes}>{children}</div>;
};

export default FormGroup;

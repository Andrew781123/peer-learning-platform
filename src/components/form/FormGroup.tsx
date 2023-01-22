import clsx from "clsx";
import React, { ReactNode } from "react";

type FormGroupProps = {
  labelPosition?: "top" | "left";
  className?: string;
  children: ReactNode;
  error?: boolean;
};

const FormGroup = (props: FormGroupProps) => {
  const { labelPosition = "left", className, children, error } = props;

  const classes = clsx(
    "flex gap-2",
    labelPosition === "top" ? "flex-col" : "flex-row items-center",
    className
  );

  return (
    <div className={classes}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            error: error ? 1 : 0,
          });
        }

        return child;
      })}
    </div>
  );
};

export default FormGroup;

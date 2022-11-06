import clsx from "clsx";
import { ReactNode } from "react";

type SelectProps = { children: ReactNode };

const Select = (props: SelectProps) => {
  const { children } = props;

  return (
    <select
      className={clsx(
        "rounded-lg border  border-gray-300 bg-surface-light focus:border-primary-dark focus:ring-primary-dark"
      )}
    >
      {children}
    </select>
  );
};

export default Select;

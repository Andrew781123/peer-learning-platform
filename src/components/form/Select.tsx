import clsx from "clsx";
import { DetailedHTMLProps, ReactNode, SelectHTMLAttributes } from "react";

type SelectProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & { children: ReactNode };

const Select = (props: SelectProps) => {
  const { children, ...otherProps } = props;

  return (
    <select
      className={clsx(
        "rounded-lg border  border-gray-300 bg-surface-light focus:border-primary-dark focus:ring-primary-dark"
      )}
      {...otherProps}
    >
      {children}
    </select>
  );
};

export default Select;

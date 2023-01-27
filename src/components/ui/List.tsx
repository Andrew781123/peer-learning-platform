import clsx from "clsx";
import React from "react";

type ListProps = {
  children?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
};

const List = (props: ListProps) => {
  const { children, emptyMessage, className } = props;

  if (React.Children.count(children) === 0)
    return <h2>{emptyMessage ?? "Empty"}</h2>;

  return (
    <div className={clsx("flex flex-col gap-3", className)}>{children}</div>
  );
};

export default List;

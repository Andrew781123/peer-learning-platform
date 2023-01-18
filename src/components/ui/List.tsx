import React from "react";

type ListProps = {
  children?: React.ReactNode;
  emptyMessage?: string;
};

const List = (props: ListProps) => {
  const { children, emptyMessage } = props;

  if (React.Children.count(children) === 0)
    return <h2>{emptyMessage ?? "Empty"}</h2>;

  return <div className="flex flex-col gap-3">{children}</div>;
};

export default List;

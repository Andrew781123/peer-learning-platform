type ListProps = {
  children: React.ReactNode;
};

const List = (props: ListProps) => {
  const { children } = props;

  return <div className="flex flex-col gap-3">{children}</div>;
};

export default List;

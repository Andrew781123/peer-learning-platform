type PageHeaderProps = {
  title: string;
};

const PageHeader = (props: PageHeaderProps) => {
  const { title } = props;

  return <h1 className="text-xl font-bold">{title}</h1>;
};

export default PageHeader;

import clsx from "clsx";

type PageHeaderProps = {
  title: string;
  className?: string;
};

const PageHeader = (props: PageHeaderProps) => {
  const { title, className } = props;

  return <h1 className={clsx("mb-2 text-xl font-bold", className)}>{title}</h1>;
};

export default PageHeader;

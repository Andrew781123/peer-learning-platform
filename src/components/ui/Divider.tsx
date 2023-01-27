import clsx from "clsx";

type DividerProps = {
  className?: string;
};

const Divider = (props: DividerProps) => {
  const { className } = props;

  return (
    <div className={clsx("h-[0.05rem] w-full bg-gray-500", className)}></div>
  );
};

export default Divider;

import clsx from "clsx";

type CrossButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

const CrossButton = (props: CrossButtonProps) => {
  const { onClick, className } = props;

  return (
    <button
      onClick={(e) => onClick(e)}
      className={clsx(className, "cursor-pointer focus:text-onBackground")}
    >
      &times;
    </button>
  );
};

export default CrossButton;

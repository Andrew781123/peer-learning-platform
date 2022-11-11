type CrossButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const CrossButton = (props: CrossButtonProps) => {
  const { onClick } = props;

  return (
    <button
      onClick={(e) => onClick(e)}
      className="cursor-pointer focus:text-onBackground"
    >
      &times;
    </button>
  );
};

export default CrossButton;

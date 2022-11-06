type LabelProps = {
  text: string;
};

const Label = (props: LabelProps) => {
  const { text } = props;

  return <label>{text}</label>;
};

export default Label;

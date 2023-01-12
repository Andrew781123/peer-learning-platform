import { VoteIconType } from "./types";

type VoteIconProps = {
  type: typeof VoteIconType[keyof typeof VoteIconType];
};

const VoteIcon = (props: VoteIconProps) => {
  const { type } = props;

  return <div>VoteIcon</div>;
};

export default VoteIcon;

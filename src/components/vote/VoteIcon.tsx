import DownVoteIcon from "./DownVoteIcon";
import UpVoteIcon from "./UpVoteIcon";

type VoteIconProps = {
  type: "upVote" | "downVote";
};

const VoteIcon = (props: VoteIconProps) => {
  const { type } = props;

  return type === "upVote" ? <UpVoteIcon /> : <DownVoteIcon />;
};

export default VoteIcon;

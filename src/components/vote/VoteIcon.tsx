import { IconSize } from "../types/icon-size";
import DownVoteIcon from "./DownVoteIcon";
import UpVoteIcon from "./UpVoteIcon";

type VoteIconProps = {
  size?: IconSize;
  type: "upVote" | "downVote";
  voted?: boolean;
};

const VoteIcon = (props: VoteIconProps) => {
  const { type, voted = false, size = "small" } = props;

  return type === "upVote" ? (
    <UpVoteIcon size={size} color={voted ? "#4caf50" : undefined} />
  ) : (
    <DownVoteIcon size={size} color={voted ? "#f44336" : undefined} />
  );
};

export default VoteIcon;

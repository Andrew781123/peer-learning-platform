import { VoteIconType } from "./types";
import VoteIcon from "./VoteIcon";

type VoteInfoProps = {
  voteCount: number;
};

const VoteInfo = (props: VoteInfoProps) => {
  const { voteCount } = props;

  const voteIconType =
    voteCount >= 0 ? VoteIconType.UP_VOTE : VoteIconType.DOWN_VOTE;

  return (
    <div className="flex  items-center justify-between">
      <p className="mr-3">{voteCount}</p>
      <VoteIcon type={voteIconType} />
    </div>
  );
};

export default VoteInfo;

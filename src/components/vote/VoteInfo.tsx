import VoteIcon from "./VoteIcon";

type VoteInfoProps = {
  voteCount: number;
};

const VoteInfo = (props: VoteInfoProps) => {
  const { voteCount } = props;

  return (
    <div className="flex items-center">
      <p className="mr-2">{voteCount}</p>
      <VoteIcon type={voteCount >= 0 ? "upVote" : "downVote"} voted />
    </div>
  );
};

export default VoteInfo;

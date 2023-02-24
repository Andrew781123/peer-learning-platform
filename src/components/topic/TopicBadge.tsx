type TopicBadgeProps = { topic: string };

const TopicBadge = (props: TopicBadgeProps) => {
  const { topic } = props;

  return (
    <p
      key={topic}
      className="rounded-full bg-primary-default py-1 px-3 text-xs text-black"
    >
      {topic}
    </p>
  );
};

export default TopicBadge;

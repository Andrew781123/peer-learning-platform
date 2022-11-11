import { ReactNode } from "react";

type MultiSelectBadgeProps = {
  optionLabel: string;
  crossButton?: ReactNode;
};

const MultiSelectBadge = (props: MultiSelectBadgeProps) => {
  const { optionLabel, crossButton } = props;

  return (
    <div
      key={optionLabel}
      className=" flex items-center gap-2 rounded-lg bg-secondary-default p-1 text-onSecondary"
    >
      <span className="hover:cursor-default">{optionLabel}</span>
      {crossButton}
    </div>
  );
};

export default MultiSelectBadge;

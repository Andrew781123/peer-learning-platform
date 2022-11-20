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
      className=" flex items-center gap-2 rounded-lg  bg-onSurface px-2 py-1 text-onPrimary"
    >
      <span className="hover:cursor-default">{optionLabel}</span>
      {crossButton}
    </div>
  );
};

export default MultiSelectBadge;

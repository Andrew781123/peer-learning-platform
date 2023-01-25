import clsx from "clsx";
import { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

const Section = (props: SectionProps) => {
  const { children, className } = props;

  return (
    <div
      className={clsx("rounded-lg border border-onBackground p-3", className)}
    >
      {children}
    </div>
  );
};

export default Section;

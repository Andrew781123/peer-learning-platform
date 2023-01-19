import { IconSize } from "../types/icon-size";

type IconProps = {
  size: IconSize;
  children: (fontSize: string) => JSX.Element;
};

const ICON_SIZE_TO_FONT_SIZE_MAP: Record<IconSize, string> = {
  small: "1.5rem",
  medium: "2.2rem",
  large: "3rem",
};

const Icon = (props: IconProps) => {
  const { size } = props;

  return props.children(ICON_SIZE_TO_FONT_SIZE_MAP[size]);
};

export default Icon;

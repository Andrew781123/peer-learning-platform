import { GoTriangleDown } from "react-icons/go";
import { IconSize } from "../types/icon-size";
import Icon from "../ui/Icon";

type DownVoteIconProps = {
  size?: IconSize;
  color?: string;
};

const DownVoteIcon = (props: DownVoteIconProps) => {
  const { size = "small", color = "white" } = props;

  return (
    <Icon size={size}>
      {(fontSize) => <GoTriangleDown fontSize={fontSize} color={color} />}
    </Icon>
  );
};

export default DownVoteIcon;

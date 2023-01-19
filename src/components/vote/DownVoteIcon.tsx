import { GoTriangleDown } from "react-icons/go";
import { IconSize } from "../types/icon-size";
import Icon from "../ui/Icon";

type DownVoteIconProps = {
  size?: IconSize;
};

const DownVoteIcon = (props: DownVoteIconProps) => {
  const { size = "small" } = props;

  return (
    <Icon size={size}>
      {(fontSize) => <GoTriangleDown fontSize={fontSize} />}
    </Icon>
  );
};

export default DownVoteIcon;

import { GoTriangleUp } from "react-icons/go";
import { IconSize } from "../types/icon-size";
import Icon from "../ui/Icon";

type UpVoteIconProps = {
  size?: IconSize;
  color?: string;
};

const UpVoteIcon = (props: UpVoteIconProps) => {
  const { size = "small", color = "white" } = props;

  return (
    <Icon size={size}>
      {(fontSize) => <GoTriangleUp fontSize={fontSize} color={color} />}
    </Icon>
  );
};

export default UpVoteIcon;

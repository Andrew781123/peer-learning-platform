import { GoTriangleUp } from "react-icons/go";
import { IconSize } from "../types/icon-size";
import Icon from "../ui/Icon";

type UpVoteIconProps = {
  size?: IconSize;
};

const UpVoteIcon = (props: UpVoteIconProps) => {
  const { size = "small" } = props;

  return (
    <Icon size={size}>
      {(fontSize) => <GoTriangleUp fontSize={fontSize} />}
    </Icon>
  );
};

export default UpVoteIcon;

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const getTimeFromX = ({
  fromDate = new Date(),
  toDate,
}: {
  fromDate?: Date;
  toDate: Date | number;
}) => {
  return dayjs(toDate).from(dayjs(fromDate));
};

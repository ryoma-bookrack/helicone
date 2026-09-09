import { formatStandardDate, formatStandardDateTime } from "@/lib/i18n/format";
import { TimeIncrement } from "./fetchTimeData";

const INC_TO_TIME: {
  [_key in TimeIncrement]: (_startDate: Date, _nextDate?: Date) => string;
} = {
  min: (date) => formatStandardDateTime(date),
  hour: (date) => formatStandardDateTime(date),
  day: (date) => formatStandardDate(date),
  week: (startDate, nextDate) => {
    if (!nextDate) {
      throw new Error("nextDate is required for week");
    }
    return `${formatStandardDate(startDate)} - ${formatStandardDate(nextDate)}`;
  },
  month: (date) => formatStandardDate(date),
  year: (date) => formatStandardDate(date),
};

export function getTimeMap(inc: TimeIncrement) {
  return INC_TO_TIME[inc];
}

export function getIncrementAsMinutes(inc: TimeIncrement) {
  switch (inc) {
    case "min":
      return 1;
    case "hour":
      return 60;
    case "day":
      return 60 * 24;
    case "week":
      return 60 * 24 * 7;
    case "month":
      return 60 * 24 * 30;
    case "year":
      return 60 * 24 * 365;
  }
}

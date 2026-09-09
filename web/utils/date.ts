import {
  formatRelativeTime,
  formatStandardDateTime,
} from "@/lib/i18n/format";

export const formatDate = (
  dateStr: string,
  locale = "zh",
  labels = {
    justNow: "刚刚",
    minutesAgo: "{{count}} 分钟前",
    hoursAgo: "{{count}} 小时前",
  },
) => {
  return formatRelativeTime(dateStr, locale, labels);
};

export const formatDateAbsolute = (dateStr: string) => {
  return formatStandardDateTime(dateStr);
};

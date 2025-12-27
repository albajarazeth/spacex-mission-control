/**
 * SpaceX dates are ISO strings (UTC).
 * This utility formats them in a way that feels natural to users,
 * while respecting launch date precision.
 */

type DateFormat = "short" | "long" | "relative";
type DatePrecision = "year" | "month" | "day" | "hour";

interface FormatDateOptions {
  format?: DateFormat;
  includeTime?: boolean;
  precision?: DatePrecision;
  locale?: string;
}

export const formatDate = (
  dateString: string,
  {
    format = "short",
    includeTime = false,
    precision,
    locale = "en-US",
  }: FormatDateOptions = {}
): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Date TBD";
  }

  if (format === "relative") {
    return getRelativeTime(date);
  }

  if (precision === "year") {
    return date.getFullYear().toString();
  }

  if (precision === "month") {
    return date.toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    });
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: format === "long" ? "long" : "short",
    day: "numeric",
  };

  if (includeTime || precision === "hour") {
    options.hour = "numeric";
    options.minute = "2-digit";
    options.timeZoneName = "short";
  }

  return date.toLocaleDateString(locale, options);
};

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  const intervals: Record<string, number> = {
    year: 31_536_000,
    month: 2_592_000,
    week: 604_800,
    day: 86_400,
    hour: 3_600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const value = Math.floor(absSeconds / seconds);
    if (value >= 1) {
      return diffSeconds < 0
        ? `${value} ${unit}${value > 1 ? "s" : ""} ago`
        : `in ${value} ${unit}${value > 1 ? "s" : ""}`;
    }
  }

  return "just now";
};

export const formatLaunchCardDate = (
  dateString: string,
  precision?: DatePrecision
) =>
  formatDate(dateString, {
    format: "short",
    precision,
  });

export const formatDashboardDateTime = (dateString: string) =>
  formatDate(dateString, {
    format: "short",
    includeTime: true,
  });

export const formatUpcomingLaunchDate = (
  dateString: string,
  precision?: DatePrecision
) =>
  formatDate(dateString, {
    format: "relative",
    precision,
  });

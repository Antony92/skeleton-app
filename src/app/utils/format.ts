/**
 * Format bytes to user readable
 * @param bytes
 * @param decimals
 * @returns pretty string
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Format a date string using Intl.DateTimeFormat with configurable options
 * @param date - The date string to format
 * @param options - Optional custom Intl.DateTimeFormatOptions to override defaults
 * @param locale - Optional locale string (defaults to 'en-GB')
 * @returns The formatted date string
 */
export const formatDate = (
  date?: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  },
  locale = 'en-GB',
) => {
  if (!date) {
    return '';
  }
  const formatted = new Intl.DateTimeFormat(locale, options).format(new Date(date));
  return formatted;
};

/**
 * Format a date string or Date object into a localized relative time string
 * @param date - The target date (string or Date object)
 * @param style - The relative time format style (default: 'long')
 * @param locale - Optional locale string (defaults to 'en-GB')
 * @returns The localized relative time string (e.g., "5 minutes ago", "yesterday")
 */
export const formatRelativeTime = (
  date?: string | Date,
  style: 'long' | 'short' | 'narrow' = 'long',
  locale = 'en-GB',
): string => {
  if (!date) return '';

  const targetDate = new Date(date);
  const now = new Date();

  // Get the difference in milliseconds
  const diffInSeconds = Math.round((targetDate.getTime() - now.getTime()) / 1000);

  // Define time thresholds in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  // Choose the best unit and calculate the amount
  let amount = diffInSeconds;
  let unit: Intl.RelativeTimeFormatUnit = 'second';

  if (Math.abs(diffInSeconds) >= year) {
    amount = Math.round(diffInSeconds / year);
    unit = 'year';
  } else if (Math.abs(diffInSeconds) >= month) {
    amount = Math.round(diffInSeconds / month);
    unit = 'month';
  } else if (Math.abs(diffInSeconds) >= week) {
    amount = Math.round(diffInSeconds / week);
    unit = 'week';
  } else if (Math.abs(diffInSeconds) >= day) {
    amount = Math.round(diffInSeconds / day);
    unit = 'day';
  } else if (Math.abs(diffInSeconds) >= hour) {
    amount = Math.round(diffInSeconds / hour);
    unit = 'hour';
  } else if (Math.abs(diffInSeconds) >= minute) {
    amount = Math.round(diffInSeconds / minute);
    unit = 'minute';
  }

  // Create the formatter with `numeric: 'auto'` to get "yesterday" / "tomorrow" automatically
  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    style,
  });

  return rtf.format(amount, unit);
};

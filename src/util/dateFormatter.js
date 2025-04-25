export function formatToUserLocalTime(utcTimestamp, options = {}) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date(utcTimestamp);

  const defaultOptions = {
    timeZone: userTimeZone,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", { ...defaultOptions, ...options });
}

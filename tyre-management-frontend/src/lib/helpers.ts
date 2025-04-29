export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric" as const,
    month: "short" as const,
    day: "numeric" as const,
  };
  return new Date(dateString).toLocaleString("en-US", options);
};

export const getQueryParams = (url: string): Record<string, string> => {
  const urlObj = new URL(url);

  const result: Record<string, string> = {};
  urlObj.searchParams.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

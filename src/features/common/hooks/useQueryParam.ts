import { useRouter } from "next/router";

export const useQueryParam = <
  TParam extends Record<string, string | string[]>
>() => {
  const { query = {} } = useRouter();

  return {
    query: query as TParam,
  };
};

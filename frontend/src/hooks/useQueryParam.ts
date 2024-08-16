import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useQueryParam = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get(key) || "");

  const updateQuery = useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (value) {
        newSearchParams.set(key, value);
        setQuery(value);
      } else {
        newSearchParams.delete(key);
        setQuery("");
      }
      setSearchParams(newSearchParams);
    },
    [searchParams, key]
  );

  return [query, updateQuery] as const;
};

export default useQueryParam;

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useQueryParam = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get(key) || "");

  useEffect(() => {
    const newQuery = searchParams.get(key) || "";
    if (newQuery !== query) {
      updateQuery(newQuery);
    }
  }, [searchParams, key]);

  const updateQuery = useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (!value) {
        newSearchParams.delete(key);
        setSearchParams(newSearchParams);
        setQuery("");
        return;
      }

      newSearchParams.set(key, value);
      setQuery(value);
      setSearchParams(newSearchParams);
    },
    [searchParams, key]
  );

  return [query, updateQuery] as const;
};

export default useQueryParam;

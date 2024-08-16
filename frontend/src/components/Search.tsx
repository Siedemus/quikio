import React, { useState } from "react";

const Search = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") ? searchParams.get("q") : "";
  const [query, setQuery] = useState(initialQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;

    setQuery(newQuery);

    searchParams.set("q", newQuery);
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  return (
    <section className="max-w-[350px] p-4 flex justify-center border-r border-b border-periwinkleGray">
      <input
        className="placeholder:text-gray-500 bg-aliceBlue pl-4 py-2 w-full border border-hippieBlue rounded-2xl "
        placeholder="Search users or channels..."
        value={query ? query : ""}
        onChange={handleInputChange}
      />
    </section>
  );
};

export default Search;

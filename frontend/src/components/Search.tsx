import useQueryParam from "../hooks/useQueryParam";

const Search = () => {
  const [query, updateQuery] = useQueryParam("q");

  return (
    <section className="max-w-[350px] p-4 flex justify-center items-center border-r border-b border-periwinkleGray min-h-[8vh]">
      <input
        className="placeholder:text-gray-500 bg-aliceBlue pl-4 py-2 w-full h-11 border border-hippieBlue rounded-2xl"
        placeholder="Search users or channels..."
        value={query ? query : ""}
        onChange={(e) => updateQuery(e.target.value)}
      />
    </section>
  );
};

export default Search;

import useQueryParam from "../hooks/useQueryParam";

const Search = () => {
  const [query, updateQuery] = useQueryParam("q");

  return (
    <section className="max-w-[350px] p-4 grid lg:grid-cols-1 grid-cols-6 gap-1 border-r border-b border-periwinkleGray min-h-[8vh]">
      <input
        className="placeholder:text-gray-500 bg-aliceBlue col-span-5 pl-4 py-2 w-full h-11 mr-4 border border-hippieBlue rounded-2xl"
        placeholder="Search users or channels..."
        value={query ? query : ""}
        onChange={(e) => updateQuery(e.target.value)}
      />
      <button
        className="w-14 h-full bg-vanillaIce
       lg:hidden rounded-2xl"
      >
        x
      </button>
    </section>
  );
};

export default Search;

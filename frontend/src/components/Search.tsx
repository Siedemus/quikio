import useQueryParam from "../hooks/useQueryParam";

const Search = () => {
  const [query, updateQuery] = useQueryParam("q");

  return (
    <section className="bg-aliceBlue p-4 flex gap-2 border-b border-periwinkleGray row-span-1">
      <input
        className="border border-hippieBlue rounded-2xl bg-aliceBlue placeholder:text-gray-500 pl-4 py-2 w-full"
        placeholder="Search users or channels..."
        value={query ? query : ""}
        onChange={(e) => updateQuery(e.target.value)}
      />
      <button className="bg-vanillaIce rounded-2xl lg:hidden w-12 hover:brightness-110">
        X
      </button>
    </section>
  );
};

export default Search;

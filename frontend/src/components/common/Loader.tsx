import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <HashLoader size={50} color="#EEC3E8" speedMultiplier={2} />
    </div>
  );
};

export default Loader;

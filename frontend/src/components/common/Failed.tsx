const Failed = () => {
  const onClick = () => {
    location.reload();
  };

  return (
    <section
      aria-label="Error message"
      className="flex justify-center items-center h-screen"
    >
      <div className="flex flex-col gap-6 items-center justify-center max-w-96 min-h-80 p-2 m-2 border rounded-lg shadow-lg">
        <h1 className="font-extrabold text-2xl text-center">
          Oops! Something went wrong
        </h1>
        <p className=" text-center">
          We encountered an error while processing your request. Please follow
          the instructions in the error message or try again later.
        </p>
        <button
          className="p-2 bg-vanillaIce rounded-md hover:brightness-110 active:brightness-75 duration-300"
          onClick={onClick}
        >
          Try again
        </button>
      </div>
    </section>
  );
};

export default Failed;

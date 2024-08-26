const Failed = ({ content }: { content: string }) => {
  return (
    <article className="flex justify-center items-center h-screen">
      <p>{content}</p>
    </article>
  );
};

export default Failed;

import withHeader from "@root/components/wrappers/withHeader";

function Home() {
  return (
    <>
      <main>
        <h1>Home</h1>
      </main>
    </>
  );
}

const HomeWithHeader = () =>
  withHeader(Home)({
    title: "Home",
    meta: [],
    links: [],
  });

export default HomeWithHeader;

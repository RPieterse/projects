import withHeader from "@root/components/withHeader";
import styles from "@root/styles/index.module.css";

function Home() {
  return (
    <>
      <main>
        <h1 className={styles.header}>Home</h1>
      </main>
    </>
  );
}

const HomeWithHeader = () =>
  withHeader(Home)({
    title: "JWT Auth",
    meta: [],
    links: [],
  });
export default HomeWithHeader;

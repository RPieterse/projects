import withHeader from "@root/components/wrappers/withHeader";
import { GetServerSidePropsContext } from "next";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@root/hooks/useAuth";

function Home() {
  const router = useRouter();
  const { logout } = useAuth();
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (localStorage.getItem("data")) {
      setUser(JSON.parse(localStorage.getItem("data")!));
    }
  }, []);

  async function handleSignOut() {
    await logout((err) => {
      if (err) {
        console.error(err);
        return;
      }
      localStorage.removeItem("data");
      router.push("/");
    });
  }

  return (
    <>
      <main className="flex flex-column">
        <h1>Home</h1>
        <p>Welcome {user.username}</p>
        <p>Email Address: {user.email}</p>

        <button
          style={{ marginTop: 16 }}
          className="text-center"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // check if auth_token httpOnly cookie is set
  // if not, redirect to login page
  const cookie = getCookie("auth_token", { req: context.req, httpOnly: true });

  if (!cookie) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}
export default HomeWithHeader;

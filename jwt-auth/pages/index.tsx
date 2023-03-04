import withHeader from "@root/components/wrappers/withHeader";
import useAuth from "@root/hooks/useAuth";
import { useMemo, useState } from "react";
import { IAuthCredentials } from "@root/types/auth.types";
import AuthForm from "@root/components/forms/authForm";
import { useRouter } from "next/router";

function Index() {
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const [auth, setAuth] = useState("Login");
  const router = useRouter();

  const handleLogin = async (credentials: IAuthCredentials) => {
    await login(credentials, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      localStorage.setItem("data", data);
      router.push("/home");
    });
  };

  const handleRegister = async (credentials: IAuthCredentials) => {
    await register(credentials, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      localStorage.setItem("data", data);
      router.push("/home");
    });
  };

  async function handleSubmit(credentials: IAuthCredentials) {
    setLoading(true);
    if (auth === "Login") {
      await handleLogin(credentials);
    } else {
      await handleRegister(credentials);
    }
    setLoading(false);
  }

  const authSwitcher = useMemo(() => {
    if (auth === "Login") {
      return (
        <a
          className="btn-text text-center flex"
          href="#"
          onClick={() => setAuth("Register")}
        >
          Register Instead ?
        </a>
      );
    } else {
      return (
        <a
          className="btn-text text-center flex"
          href="#"
          onClick={() => setAuth("Login")}
        >
          Login Instead ?
        </a>
      );
    }
  }, [auth]);

  return (
    <>
      <main>
        <h1>{auth}</h1>
        <AuthForm text={auth} loading={loading} handleSubmit={handleSubmit} />
        {authSwitcher}
      </main>
    </>
  );
}

const HomeWithHeader = () =>
  withHeader(Index)({
    title: "JWT Auth",
    meta: [],
    links: [],
  });

export default HomeWithHeader;

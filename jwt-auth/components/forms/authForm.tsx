import { useCallback } from "react";
import { IAuthCredentials } from "../../types/auth.types";

interface AuthFormProps {
  text: string;
  handleSubmit: (data: IAuthCredentials) => void;
  loading?: boolean;
}

function AuthForm(props: AuthFormProps) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const target = event.currentTarget as typeof event.currentTarget & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    props.handleSubmit({ email, password });
  }

  const submitBtnText = useCallback(() => {
    if (props.loading) {
      return "Loading...";
    }
    return props.text;
  }, [props.loading, props.text]);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email Address</label>
      <input type="email" placeholder="Email Address" name="email" id="email" />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        name="password"
        id="password"
      />
      <button type="submit">{submitBtnText()}</button>
    </form>
  );
}

export default AuthForm;

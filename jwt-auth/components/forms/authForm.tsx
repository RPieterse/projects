import ValidateInputs from "@root/utils/validateInputs";
import { useCallback } from "react";
import { IAuthCredentials } from "../../types/auth.types";

interface AuthFormProps {
  text: string;
  handleSubmit: (data: IAuthCredentials) => void;
  loading?: boolean;
}

const ValidationUtil = new ValidateInputs("base-auth-form", [
  {
    inputName: "email",
    validation: ["isEmail", "isRequired"],
    errorMessage: "Email is not valid",
  },
  {
    inputName: "password",
    validation: ["isValidPassword", "isRequired"],
    errorMessage: "Password is not valid",
  },
]);

function AuthForm(props: AuthFormProps) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    ValidationUtil.validate((passed, errors) => {
      if (passed) {
        const target = event.currentTarget as typeof event.currentTarget & {
          email: { value: string };
          password: { value: string };
        };
        const email = target.email.value;
        const password = target.password.value;
        props.handleSubmit({ email, password });
      } else {
        console.log(errors);
      }
    });
  }

  const submitBtnText = useCallback(() => {
    if (props.loading) {
      return "Loading...";
    }
    <button type="submit">Register</button>;
    return props.text;
  }, [props.loading, props.text]);

  return (
    <form noValidate id="base-auth-form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email Address</label>
      <input
        onBlur={() => ValidationUtil.validateField("email")}
        type="email"
        placeholder="Email Address"
        name="email"
        id="email"
      />
      <label htmlFor="password">Password</label>
      <input
        onBlur={() => ValidationUtil.validateField("password")}
        type="password"
        placeholder="Password"
        name="password"
        id="password"
      />
      <button disabled={props.loading} type="submit">
        {submitBtnText()}
      </button>
    </form>
  );
}

export default AuthForm;

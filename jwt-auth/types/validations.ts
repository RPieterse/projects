export type ValidationTypes = "isEmail" | "isValidPassword" | "isRequired";

export type ValidationErrors = {
  name: string;
  validation: string;
  message: string;
};

export type ValidationItem = {
  inputName: string;
  validation: ValidationTypes[];
  errorMessage: string;
};

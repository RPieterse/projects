import {
  isEmail,
  isValidPassword,
  isRequired,
  ValidationTypes,
} from "@root/helpers/strings";

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

export default class ValidateInputs {
  constructor(private formId: string, private validations: ValidationItem[]) {}

  private checkValidations(
    validation: ValidationTypes,
    value: string,
    errors: ValidationErrors[],
    item: ValidationItem,
    skip?: ValidationTypes[]
  ) {
    if (validation == "isRequired" && !skip?.includes("isRequired")) {
      if (!isRequired(value)) {
        errors.push({
          name: item.inputName,
          validation: validation,
          message: item.errorMessage,
        });
      }
    }

    if (value && validation == "isEmail" && !skip?.includes("isEmail")) {
      if (!isEmail(value)) {
        errors.push({
          name: item.inputName,
          validation: validation,
          message: item.errorMessage,
        });
      }
    }

    if (
      value &&
      validation == "isValidPassword" &&
      !skip?.includes("isValidPassword")
    ) {
      if (!isValidPassword(value)) {
        errors.push({
          name: item.inputName,
          validation: validation,
          message: item.errorMessage,
        });
      }
    }
  }

  private createErrorDiv(input: HTMLInputElement, item: ValidationItem) {
    const divToTarget = document.createElement("div") as HTMLDivElement;
    divToTarget.classList.add("invalid-field");
    divToTarget.dataset.field = item?.inputName;
    divToTarget.dataset.errorMessage = item?.errorMessage;
    input.parentNode!.insertBefore(divToTarget, input);
    input.setCustomValidity("Invalid field.");
  }

  private getValidationItem(inputName: string) {
    return this.validations.find((i) => i.inputName === inputName);
  }

  private cleanup(inputName: string) {
    const formEl = document.getElementById(this.formId) as HTMLFormElement;
    formEl.querySelector(`div[data-field="${inputName}"]`)?.remove();
  }

  private getInputAndValue(inputName: string): [HTMLInputElement, string] {
    const formEl = document.getElementById(this.formId) as HTMLFormElement;
    const input = formEl.querySelector(
      `input[name='${inputName}']`
    ) as HTMLInputElement;
    input.setCustomValidity("");
    const value = input.value;
    return [input, value];
  }

  validateField(inputName: string, cb?: (passed: boolean) => void) {
    const item = this.getValidationItem(inputName);
    // cleanup
    if (item) {
      const errors: ValidationErrors[] = [];
      this.cleanup(inputName);
      const [input, value] = this.getInputAndValue(inputName);
      item.validation.forEach((i) => {
        this.checkValidations(i, value, errors, item, ["isRequired"]);
      });

      if (errors.length === 0) {
        if (typeof cb === "function") {
          cb(true);
        }
        return;
      }
      this.createErrorDiv(input, item);
    }
    if (typeof cb === "function") {
      cb(false);
    }
  }

  validate(cb?: (passed: boolean, errors: ValidationErrors[]) => void) {
    let hasPassedAll = true;
    const allErrors: ValidationErrors[] = [];

    this.validations.forEach((item) => {
      const errors: ValidationErrors[] = [];
      const [input, value] = this.getInputAndValue(item.inputName);

      // cleanup

      if (input) {
        // get value of input
        this.cleanup(item.inputName);

        item.validation.forEach((i) => {
          this.checkValidations(i, value, errors, item);
        });
      }

      // set data-field on input
      if (errors.length > 0) {
        hasPassedAll = false;
        this.createErrorDiv(input, item);
      }
      allErrors.push(...errors);
    });
    if (typeof cb === "function") {
      cb(hasPassedAll, allErrors);
    }
  }
}

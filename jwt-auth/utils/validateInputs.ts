import {
  ValidationErrors,
  ValidationItem,
  ValidationTypes,
} from "@root/types/validations";
import { isEmail, isValidPassword, isRequired } from "@root/helpers/strings";

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

  validateField(inputName: string, cb?: (passed: boolean) => void) {
    const errors: ValidationErrors[] = [];
    const formEl = document.getElementById(this.formId) as HTMLFormElement;
    const input = formEl.querySelector(
      `input[name='${inputName}']`
    ) as HTMLInputElement;
    const value = input.value;
    const item = this.validations.find((i) => i.inputName === inputName);
    // cleanup
    formEl.querySelector(`div[data-field="${item?.inputName}"]`)?.remove();
    input.setCustomValidity("");
    if (item) {
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
    const formEl = document.getElementById(this.formId) as HTMLFormElement;
    formEl.querySelectorAll('div[class="invalid-field"]').forEach((el) => {
      el.remove();
    });

    let hasPassedAll = true;
    const allErrors: ValidationErrors[] = [];

    this.validations.forEach((item) => {
      const errors: ValidationErrors[] = [];

      const input = formEl.querySelector(
        `input[name='${item.inputName}']`
      ) as HTMLInputElement;

      // cleanup

      if (input) {
        // get value of input
        const value = input.value;
        item.validation.forEach((i) => {
          this.checkValidations(i, value, errors, item);
        });
      }

      // set data-error-message on input
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

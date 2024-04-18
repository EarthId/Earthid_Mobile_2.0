import { isEmpty } from "lodash";
import { Alert } from "react-native";
import { IInputValidationResult } from "../typings/IInputValidationResult";

const REGEX = {
  ADDRESS_LINE: /^[\\\\0-9a-zA-Z\\/, ]*$/,
  BUSINESS_NAME: /^[0-9a-zA-Z ]*$/,
  PINCODE: /(^\d{6}$)/,
 // USERNAME:/^[a-zA-Z\\s[0-9]*$/,
  USERNAME:/^[a-zA-Z\\s]*$/,
 // USERNAMENUMERIC:/^[0-9a-zA-Z]+$/,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const nameValidator = (
  value: string,
  isRequired: boolean
): IInputValidationResult => {
  if (isEmpty(value) || value===' ' && isRequired) {
    return {
      hasError: true,
      errorMessage: "Please enter your First Name",
    };
  }
 else if(!REGEX.USERNAME.test(value)){
  return {
    hasError: true,
    errorMessage: "Special or Numeric characters are not allowed",
  };
 }
//  else if(!REGEX.USERNAMENUMERIC.test(value)){
//   return {
//     hasError: true,
//     errorMessage: "Numeric characters are not allowed",
//   };
//  }

  if (REGEX.ADDRESS_LINE.test(value)) {
    return { hasError: false, errorMessage: "" };
  } else {
    return {
      hasError: true,
      errorMessage: "Special characters are not allowed",
    };
  }
};

export const nameValidators = (
  value: string,
  isRequired: boolean
): IInputValidationResult => {
  if (isEmpty(value) || value===' ' && isRequired) {
    return {
      hasError: true,
      errorMessage: "Please enter your Last Name",
    };
  }
 else if(!REGEX.USERNAME.test(value)){
  return {
    hasError: true,
    errorMessage: "Special or Numeric characters are not allowed",
  };
 }
//  else if(!REGEX.USERNAMENUMERIC.test(value)){
//   return {
//     hasError: true,
//     errorMessage: "Numeric characters are not allowed",
//   };
//  }

  if (REGEX.ADDRESS_LINE.test(value)) {
    return { hasError: false, errorMessage: "" };
  } else {
    return {
      hasError: true,
      errorMessage: "Special characters are not allowed",
    };
  }
};
export const emailValidator = (
  value: string,
  isRequired: boolean
): IInputValidationResult => {
  if (isEmpty(value) && isRequired) {
    return {
      hasError: true,
      errorMessage: "Please fill the details",
    };
  }
  if (REGEX.EMAIL.test(value)) {
    return { hasError: false, errorMessage: "" };
  } else {
    return {
      hasError: true,
      errorMessage: "Please enter your Email Address",
    };
  }
};

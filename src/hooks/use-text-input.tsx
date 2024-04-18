import { useReducer } from "react";
import { IInputValidationResult } from "../typings/IInputValidationResult";

interface ITextInputState {
  value: string;
  isFocused: boolean;
}

const initialInputState = {
  value: "",
  isFocused: true,
};

const inputStateReducer = (
  state = initialInputState,
  action: any
): ITextInputState => {
  if (action.type === "INPUT") {
    return {
      value: action.value,
      isFocused: state.isFocused,
    };
  }
  if (action.type === "BLUR") {
    return {
      isFocused: false,
      value: state.value,
    };
  }
  if (action.type === "FOCUS") {
    return {
      isFocused: true,
      value: state.value,
    };
  }

  return state;
};

const useTextInput = (
  value: string,
  isRequired: boolean,
  validateValue: any
) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, {
    ...initialInputState,
    value,
  });
  const valueIsValid = validateValue(inputState.value, isRequired);
  const hasError = valueIsValid.hasError && !inputState.isFocused;
  const errorMessage = valueIsValid.errorMessage;
  const validationResult: IInputValidationResult = { hasError, errorMessage };
  const valueChangeHandler = (event: any) => {
    dispatch({ type: "INPUT", value: event });
  };
  const inputBlurHandler = () => {
    dispatch({ type: "BLUR" });
  };
  const inputFocusHandler = () => {
    dispatch({ type: "FOCUS" });
  };

  return {
    value: inputState.value,
    isFocused: inputState.isFocused,
    validationResult,
    valueChangeHandler,
    inputBlurHandler,
    inputFocusHandler,
  };
};

export default useTextInput;

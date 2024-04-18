export interface ITextInputProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: (text: string) => void;
  value?: string;
  isFocused?: boolean;
  isEditable?: boolean;
  isNumeric?: boolean;
  rightIcon?: any;
  maxLength?: number;
  isError?: boolean;
  errorText?: string;
  testId?: string;
  placeholder?: string;
  style?: any;
  leftIcon?: any;
  disabled?: boolean;
  onPressRightIcon?: any;
}

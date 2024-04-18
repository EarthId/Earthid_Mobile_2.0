export interface ILinearGradientProps {
  startColor: string;
  middleColor: string;
  endColor: string;
  style?: any; // Overriding options for styling.
  children?: JSX.Element;
  horizontalGradient: boolean;
}

import styled, { keyframes } from "styled-components";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export type SpinnerProps = {
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const SizeMap = new Map([
  ["sm", "15px"],
  ["md", "20px"],
  ["lg", "45px"],
  ["xl", "60px"],
]);

/*
NOTE: Spinner is not identical to the design but I decided to keep it like this
for time management. Alternatively, we could use either a sgv or an font icon
such as font-awesome or material-icons.
*/
export const Spinner = styled.div<SpinnerProps>`
  border: 2px solid #f0f0f0;
  width: ${({ size = "md" }) => SizeMap.get(size)};
  height: ${({ size = "md" }) => SizeMap.get(size)};
  border-radius: 50%;
  border-left-color: ${(props) => props.color || props.theme.color.secondary};

  animation: ${rotate360} 1.5s linear infinite;
`;

Spinner.defaultProps = {
  size: "md",
};

export default Spinner;

import React, { ReactElement } from "react";
import styled, { ThemedStyledProps } from "styled-components";
import { theme, StyleVariant } from "@common";

export type ButtonProps = {
  variant?: StyleVariant;
  disabled?: boolean;
  decorator?: ReactElement;
};

function getColor(props: ThemedStyledProps<ButtonProps, typeof theme>) {
  if (props.disabled) {
    return props.theme.color.primary;
  }

  return props.variant
    ? props.theme.color[props.variant]
    : props.theme.color.primary;
}

/*
@TODO: Improvement, implement design tokens.
It would help standardize the way we specify
visual styles for our components.
e.g.
<MyComponent size="sm|md|lg|xl" />
*/
export const StyledButton = styled.button<ButtonProps>`
  background-color: ${(props) => props.theme.color.background};
  border: 3px solid ${getColor};
  padding: 15px;
  color: ${getColor};
  border-radius: 0;
  font-weight: 400;
  font-size: ${(props) => props.theme.font.size.md};
  line-height: 14px;
  min-width: 130px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &:hover {
    border-color: ${getColor};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }

  &:active {
    border-color: ${getColor};
  }

  &:focus,
  &:focus-visible {
    outline: 0;
  }

  .decorator {
    margin-left: 10px;
  }
`;

export const Button = React.forwardRef(
  (
    {
      variant,
      disabled,
      decorator,
      children,
      ...rest
    }: React.ComponentPropsWithoutRef<"button"> & ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <StyledButton
        variant={variant}
        disabled={disabled}
        decorator={decorator}
        ref={ref}
        tabIndex={disabled ? -1 : 0}
        {...rest}
      >
        {children}
        {decorator && <div className="decorator">{decorator}</div>}
      </StyledButton>
    );
  }
);

export default Button;

import styled from "styled-components";
import { StyleVariant } from "@common";

type Props = {
  variant?: StyleVariant;
};

export const StyledTooltip = styled.div<Props>`
  background-color: ${(props) =>
    props.variant
      ? props.theme.color[props.variant]
      : props.theme.color.primary};
  padding: 10px;
  color: #fff;
  font-weight: 500;
  min-width: 110px;
  text-align: center;
  font-family: ${(props) => props.theme.font.family.default};
  font-size: ${(props) => props.theme.font.size.md};
`;

export const Arrow = styled.div<Props>`
  background-color: ${(props) =>
    props.variant
      ? props.theme.color[props.variant]
      : props.theme.color.primary};
  width: 22px;
  height: 22px;
  position: absolute;
`;

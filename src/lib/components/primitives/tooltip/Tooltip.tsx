import React, { ReactElement, useState, useMemo, useRef } from "react";
import { mergeRefs } from "react-merge-refs";

import {
  useFloating,
  offset,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  arrow,
  autoUpdate,
} from "@floating-ui/react-dom-interactions";

import { Arrow, StyledTooltip } from "./Tooltip.styled";
import { StyleVariant } from "@common/types";

export type TooltipState = "opened" | "closed" | "auto";

export type TooltipProps = {
  children: ReactElement;
  text: string;
  placement?: "top" | "bottom";
  offset?: number;
  state?: TooltipState;
  variant?: StyleVariant;
};

export function Tooltip({
  children,
  state = "auto",
  text,
  placement = "bottom",
  offset: offsetValue = 10,
  variant = "primary",
}: TooltipProps) {
  const arrowRef = useRef(null);
  const [open, setOpen] = useState(false);

  const shouldBeOpened = useMemo(() => {
    if (state === "auto") {
      return open;
    }

    return state === "opened";
  }, [open, state]);

  let { x, y, reference, floating, strategy, context, middlewareData } =
    useFloating({
      placement,
      open,
      onOpenChange: setOpen,
      whileElementsMounted: autoUpdate,
      middleware: [offset(offsetValue), arrow({ element: arrowRef })],
    });

  const ref = useMemo(
    () => mergeRefs([reference, (children as any).ref]),
    [reference, children]
  );

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useHover(context),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
  ]);

  const contextElement = React.Children.only(
    React.cloneElement(children, getReferenceProps({ ref, ...children.props }))
  );

  const arrowPositioningStyles = useMemo(() => {
    // @TODO: Top placement is not always correctly calculated depending on the
    // dimensions of the ref element. Needs further investigation.
    switch (placement) {
      case "top":
        return {
          left: middlewareData.arrow?.x ?? 0,
          top: "33px",
          transform: "rotate(-45deg)",
        };
      case "bottom":
        return {
          left: middlewareData.arrow?.x ?? 0,
          top: "-11px",
          transform: "rotate(45deg)",
        };
      default:
        return {};
    }
  }, [middlewareData.arrow, placement]);

  return (
    <>
      {contextElement}
      {shouldBeOpened && (
        <StyledTooltip
          role="tooltip"
          variant={variant}
          {...getFloatingProps({
            ref: floating,
            style: {
              position: strategy,
              left: x ?? 0,
              top: y ?? 0,
            },
          })}
        >
          <span>{text}</span>
          <Arrow
            ref={arrowRef}
            variant={variant}
            style={{ ...arrowPositioningStyles }}
          />
        </StyledTooltip>
      )}
    </>
  );
}

export default Tooltip;

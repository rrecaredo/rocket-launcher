import { MouseEventHandler, useMemo } from "react";
import { Button, Spinner, Tooltip, TooltipState } from "@components/primitives";
import { StyleVariant } from "@common";

export type ButtonState = "ready" | "working" | "error" | "disabled";

export type SmartButtonProps = {
  state?: ButtonState;
  tooltip: string;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const SmartButton = ({
  tooltip,
  label,
  state = "ready",
  onClick,
}: SmartButtonProps) => {
  const { state: newState, variant } = useMemo(() => {
    switch (state) {
      case "disabled":
        return { state: "closed", variant: "primary" };
      case "working":
        return { state: "auto", variant: "secondary" };
      case "error":
        return { state: "opened", variant: "faulted" };
      default:
        return { state: "auto", variant: "primary" };
    }
  }, [state]);

  return (
    <Tooltip
      text={tooltip}
      state={newState as TooltipState}
      placement="bottom"
      variant={variant as StyleVariant}
    >
      <Button
        onClick={(e) => onClick && onClick(e)}
        disabled={state === "disabled"}
        variant={variant as StyleVariant}
        decorator={state === "working" ? <Spinner /> : undefined}
      >
        {label}
      </Button>
    </Tooltip>
  );
};

export default SmartButton;

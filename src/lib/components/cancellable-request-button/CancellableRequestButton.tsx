import { useMemo, useState } from "react";
import { monotonicFactory } from "ulid";
import { useCancellableFetch } from "@hooks/useCancellableFetch";

import {
  ButtonState,
  SmartButton,
  SmartButtonProps,
} from "@components/smart-button";

const ulid = monotonicFactory();

type CancellableRequestButtonProps = {
  key?: string;
  url: string;
  timeout?: number;
  state?: ButtonState;
  defaultLabel: string;
  workingLabel: string;
  errorLabel: string;
  defaultTooltip: string;
  workingTooltip: string;
  errorTooltip: string;
  onSuccess?: <TData = any>(data: TData) => void;
  onFailure?: (e: Error) => void;
  onInProgress?: () => void;
};

export const CancellableRequestButton = ({
  url,
  key,
  state = "ready",
  onSuccess,
  onFailure,
  onInProgress,
  defaultLabel,
  defaultTooltip,
  workingLabel,
  workingTooltip,
  errorLabel,
  errorTooltip,
}: CancellableRequestButtonProps) => {
  // @TODO: Potentially add URL format validation

  // queryKey is used to cancel the request if it's already in progress
  const queryKey = useMemo(() => key || ulid(), [key]);
  const [currentState, setCurrentState] = useState(state);

  const { request, abort, isFetching, isAborted } = useCancellableFetch({
    url,
    queryKey,
  });

  /**
   * Based on the current state, determine the label and tooltip to use for the
   * SmartComponent
   */
  const { label, tooltip } = useMemo<
    Omit<SmartButtonProps, "onClick" | "state">
  >(() => {
    switch (currentState) {
      case "ready":
        return {
          label: defaultLabel,
          tooltip: defaultTooltip,
        };
      case "working":
        return {
          label: workingLabel,
          tooltip: workingTooltip,
        };
      case "error":
        return {
          label: errorLabel,
          tooltip: errorTooltip,
        };
      default:
        return {
          label: defaultLabel,
          tooltip: defaultTooltip,
        };
    }
  }, [currentState]);

  // If this function grows in complexity, it would make sense to use a
  // useCallback hook here to memoize it and avoid unnecessary redeclarations.
  const makeRequest = async () => {
    try {
      setCurrentState("working");
      onInProgress && onInProgress();

      const response = await request();

      if (response.isSuccess) {
        setCurrentState("ready");
        onSuccess && onSuccess(response.data);
      } else {
        throw new Error("Rocket launch failed, it took to long to ignition.");
      }
    } catch (e: any) {
      setCurrentState("error");
      onFailure && onFailure(e.message);
    }
  };

  const abortRequest = () => {
    abort();
    setCurrentState("error");
  };

  const onClickHandler = () => {
    const isReady = currentState === "ready" && !isFetching;
    const wasRequestAborted = currentState === "error" && isAborted;

    if (isReady || wasRequestAborted) {
      makeRequest();
    } else if (currentState === "working") {
      abortRequest();
    }
  };

  return (
    <>
      <SmartButton
        label={label}
        tooltip={tooltip}
        state={currentState}
        onClick={() => state !== "disabled" && onClickHandler()}
      />
    </>
  );
};

export default CancellableRequestButton;

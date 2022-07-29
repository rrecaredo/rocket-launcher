import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { rest } from "msw";
import { setupServer } from "msw/node";
import "whatwg-fetch";

import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { CancellableRequestButton } from "./CancellableRequestButton";
import { theme } from "@common/theme";
import { ButtonState } from "@components/smart-button";

global.ResizeObserver = require("resize-observer-polyfill");

const server = setupServer(
  rest.get("/api/rocket-launcher", (req, res, ctx) => {
    return res(
      ctx.json({
        count: 500,
        firstName: "Foo",
        lastName: "Bar",
      })
    );
  }),
  rest.get("/api/timeout", (req, res, ctx) => {
    return res(
      ctx.delay(2000),
      ctx.json({
        count: 500,
        firstName: "Foo",
        lastName: "Bar",
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export const STRINGS = {
  LaunchRocketLabel: "Launch Rocket",
  LaunchRocketTooltip: "Ignites the fuel",
  IgnitionErrorTooltip: "Ignition error",
  LaunchingLabel: "Launching",
  CancelLaunchTooltip: "Cancel launch",
};

const queryClient = new QueryClient();

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ThemeProvider>
);

const labelProps = {
  defaultLabel: STRINGS.LaunchRocketLabel,
  workingLabel: STRINGS.LaunchingLabel,
  errorLabel: STRINGS.LaunchRocketLabel,
  defaultTooltip: STRINGS.LaunchRocketTooltip,
  workingTooltip: STRINGS.CancelLaunchTooltip,
  errorTooltip: STRINGS.IgnitionErrorTooltip,
};

const onSuccess = jest.fn();

const renderButton = (state: ButtonState, url: string) => {
  render(
    <CancellableRequestButton
      url={url}
      state={state}
      onSuccess={onSuccess}
      {...labelProps}
    />,
    {
      wrapper,
    }
  );
};

const fastApiUrl = "/api/rocket-launcher";
const slowApiUrl = "http://localhost/api/timeout";

describe("Components > CancellableRequestButton", () => {
  afterAll(cleanup);

  beforeEach(jest.resetAllMocks);

  test("It should make a network request to a URL passed as props", async () => {
    renderButton("ready", fastApiUrl);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  test("It should show the 'Working' state for the duration of the network request", async () => {
    renderButton("ready", slowApiUrl);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.queryByText(/Launching/)).toBeInTheDocument()
    );
  });

  test("It should optionally timeout the network request after a max duration passed as props", async () => {
    jest.useFakeTimers();
    const onSuccess = jest.fn();

    renderButton("ready", slowApiUrl);

    fireEvent.click(screen.getByRole("button"));

    jest.advanceTimersByTime(3000);

    expect(onSuccess).not.toHaveBeenCalled();

    jest.useRealTimers();

    await waitFor(() => expect(onSuccess).not.toHaveBeenCalled());

    /* @TODO: There is an async operation causing an update to CancellableRequestButton
              after the component unmounts, likely coming from React Query
              which is causing a warning and potentially a memory leak that needs further investigation.
     */
  });

  test("It should show the error state after the max duration is exceeded and the network request is cancelled", async () => {
    jest.useFakeTimers();

    renderButton("ready", slowApiUrl);

    fireEvent.click(screen.getByRole("button"));

    jest.advanceTimersByTime(3000);

    await waitFor(() =>
      expect(screen.queryByText(/Ignition error/)).toBeInTheDocument()
    );

    jest.useRealTimers();
  });

  test("It should return to the default state after the network request completes", async () => {
    renderButton("ready", fastApiUrl);

    fireEvent.click(screen.getByRole("button"));

    // This is a bit of a hack. An enhancement would be to have a data-state attribute on the button
    // and verify that it is set back to 'ready' after the network request completes.
    userEvent.hover(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.queryByText(/Ignites the fuel/)).toBeInTheDocument()
    );
  });
  test("A second click of the button should abort a request that is in-flight and show the error state", async () => {
    jest.useFakeTimers();

    renderButton("ready", slowApiUrl);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    jest.advanceTimersByTime(500);

    // Second click while the response has not yet been received
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.queryByText(/Ignition error/)).toBeInTheDocument()
    );

    jest.useRealTimers();
  });

  describe("It should be possible to put the button into each state via props", () => {
    test("ready", async () => {
      renderButton("ready", slowApiUrl);

      expect(screen.queryByText(/Launch Rocket/)).toBeInTheDocument();
      expect(screen.queryByText(/Ignites the fuel/)).toBeNull();
    });

    test("working", async () => {
      renderButton("working", slowApiUrl);

      expect(screen.queryByText(/Launching/)).toBeInTheDocument();
    });

    test("errored", async () => {
      renderButton("error", slowApiUrl);

      expect(screen.queryByText(/Ignition error/)).toBeInTheDocument();
    });

    test("disabled", async () => {
      renderButton("disabled", slowApiUrl);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  test("The tooltip should not show if the button is disabled ", () => {
    renderButton("disabled", slowApiUrl);
    userEvent.hover(screen.getByRole("button"));
    expect(screen.queryByText(/Ignites the fuel/)).toBeNull();
  });

  test("The tooltip should always show when in the error state ", () => {
    renderButton("error", slowApiUrl);
    expect(screen.queryByText(/Ignition error/)).toBeInTheDocument();
  });
});

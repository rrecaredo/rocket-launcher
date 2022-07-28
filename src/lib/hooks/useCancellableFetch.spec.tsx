import { enableFetchMocks, FetchMock } from "jest-fetch-mock";
import { useCancellableFetch } from "./useCancellableFetch";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

enableFetchMocks();

const queryClient = new QueryClient();

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Hooks > useCancellableFetch", () => {
  beforeEach(() => (fetch as FetchMock).resetMocks());
  test("It returns initial state when mounted", async () => {
    (fetch as FetchMock).mockResponseOnce(JSON.stringify({ data: "test" }));

    const { result } = renderHook(() =>
      useCancellableFetch({ queryKey: "test", url: "test" })
    );

    await act(() => {
      result.current.request();
    });

    expect(fetch).toHaveBeenCalledWith({ a: 1 });
  });

  test("It fetches data from the provided URL", () => {
    throw new Error("Not implemented");
  });

  test("The request can be aborted", () => {
    throw new Error("Not implemented");
  });

  test("It timesout if the request is not fulfilled in less time than defined by the timeout prop", () => {
    throw new Error("Not implemented");
  });
});

import { FC, ReactNode } from "react";
import { enableFetchMocks, FetchMock } from "jest-fetch-mock";
import { useCancellableFetch } from "./useCancellableFetch";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

enableFetchMocks();

const queryClient = new QueryClient();

const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Hooks > useCancellableFetch", () => {
  beforeEach(() => (fetch as FetchMock).resetMocks());

  test("It returns initial state when mounted", async () => {
    (fetch as FetchMock).mockResponseOnce(JSON.stringify({ data: "test" }));

    const { result } = renderHook(
      () => useCancellableFetch({ queryKey: "test", url: "test" }),
      { wrapper }
    );

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "abort": [Function],
        "data": undefined,
        "error": null,
        "isAborted": false,
        "isError": false,
        "isFetched": false,
        "isFetching": false,
        "request": [Function],
      }
    `);
  });

  test("It fetches data from the provided URL", async () => {
    (fetch as FetchMock).mockResponseOnce(JSON.stringify({ data: "test" }));

    const { result } = renderHook(
      () => useCancellableFetch({ queryKey: "test", url: "test" }),
      { wrapper }
    );

    await act(async () => {
      await result.current.request();
    });

    expect(fetch).toHaveBeenCalledWith("test", expect.anything());

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "abort": [Function],
        "data": undefined,
        "error": null,
        "isAborted": false,
        "isError": false,
        "isFetched": false,
        "isFetching": false,
        "request": [Function],
      }
    `);
  });

  test("The request can be aborted", async () => {
    (fetch as FetchMock).mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ body: "ok" }), 1000)
        )
    );

    const { result } = renderHook(
      () => useCancellableFetch({ queryKey: "fail", url: "test" }),
      { wrapper }
    );

    await act(() => {
      result.current.request();
    });

    await act(() => {
      result.current.abort();
    });

    expect(result.current.isAborted).toBeTruthy();
    expect(result.current.data).not.toBeDefined();
  });

  test("It timeouts if the request is not fulfilled in less time than defined by the timeout prop", async () => {
    jest.useFakeTimers();

    (fetch as FetchMock).mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ body: "ok" }), 1000)
        )
    );

    const { result } = renderHook(
      () =>
        useCancellableFetch({ queryKey: "fail", url: "test", timeout: 100 }),
      { wrapper }
    );

    await act(() => {
      result.current.request();
    });

    jest.advanceTimersByTime(200);

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "abort": [Function],
        "data": undefined,
        "error": null,
        "isAborted": false,
        "isError": false,
        "isFetched": false,
        "isFetching": false,
        "request": [Function],
      }
    `);

    jest.useRealTimers();
  });
});

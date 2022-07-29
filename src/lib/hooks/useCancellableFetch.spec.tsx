import { FC, ReactNode } from "react";
import { enableFetchMocks, FetchMock } from "jest-fetch-mock";
import { useCancellableFetch } from "./useCancellableFetch";
import { act, renderHook } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

enableFetchMocks();

const queryClient = new QueryClient();

const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const getResponsePromise = (delay = 0): Promise<string> => new Promise((resolve) =>
    setTimeout(() => resolve(JSON.stringify({ data: "test" })), delay)
);

const renderUseCancellableFetch = () => {
  return renderHook(
      () => useCancellableFetch({ queryKey: "", url: "http://fakeurl/api" }),
      { wrapper }
  );
};

describe("Hooks > useCancellableFetch", () => {
  beforeEach(() => (fetch as FetchMock).resetMocks());

  test("It returns initial state when mounted", async () => {
    const response = getResponsePromise();
    (fetch as FetchMock).mockResponseOnce(() => response);

    const { result } = renderUseCancellableFetch();

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

    await act(() => response as any);
  });

  test("It fetches data from the provided URL", async () => {
    const response = getResponsePromise();
    (fetch as FetchMock).mockResponseOnce(() => response);

    const { result, waitForNextUpdate } = renderHook(
      () => useCancellableFetch({ queryKey: "test", url: "test" }),
      { wrapper }
    );

    act(() => {
      result.current.request();
    });

    await waitForNextUpdate();

    expect(fetch).toHaveBeenCalledWith("test", expect.anything());
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "abort": [Function],
        "data": Object {
          "data": "test",
        },
        "error": null,
        "isAborted": false,
        "isError": false,
        "isFetched": true,
        "isFetching": false,
        "request": [Function],
      }
    `);

    await act(() => response as any);
  });

  test("The request can be aborted", async () => {
    const response = getResponsePromise(1000);
    (fetch as FetchMock).mockResponseOnce(() => response);

    const { result, waitForNextUpdate } = renderUseCancellableFetch();

    act(() => {
      result.current.request();
    });

    act(() => {
      result.current.abort();
    });

    await waitForNextUpdate();

    expect(result.current.isAborted).toBeTruthy();
    expect(result.current.data).not.toBeDefined();

    await act(() => response as any);
  });

  test("It timeouts if the request is not fulfilled in less time than defined by the timeout prop", async () => {
    const response = getResponsePromise();
    (fetch as FetchMock).mockResponseOnce(() => response);

    jest.useFakeTimers();

    const { result } = renderUseCancellableFetch();

    act(() => {
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

    await act(() => response as any);
  });
});

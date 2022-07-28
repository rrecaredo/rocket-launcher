import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import "whatwg-fetch";

global.ResizeObserver = require('resize-observer-polyfill')

const worker = setupServer(
  rest.get("/api/rocket-launcher", (req, res, ctx) => {
    return res(
      ctx.json({
        count: 500,
        firstName: "Foo",
        lastName: "Bar",
      })
    );
  }),
  rest.post("/api/timeout", (req, res, ctx) => {
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

beforeAll(() => worker.listen());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.close());

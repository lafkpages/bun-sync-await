import { test, expect } from "bun:test";
import { awaitSync } from ".";

test("simple", () => {
  expect(awaitSync("Promise.resolve(42)")).toBe(42);
  expect(awaitSync("Promise.resolve('hi')")).toBe("hi");
});

test("fetch", () => {
  expect(
    awaitSync(`
      fetch('https://httpbin.org/user-agent', {
        headers: {
          'user-agent': 'bun-sync-await-unit-test'
        }
      }).then(r => r.json())`)
  ).toEqual({
    "user-agent": "bun-sync-await-unit-test",
  });
});

import { expect, test } from "vitest";
import { foo } from "./main";

test("testing", () => {
  expect(foo()).toEqual(42);
});

test("testing2", () => {
  expect(foo() - 1).toEqual(41);
});

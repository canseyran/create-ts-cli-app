import { expect, test } from "vitest";
import { addTwoNumbers } from "./helper";

test("correct result for adding two numbers", () => {
  expect(addTwoNumbers(21, 7)).toEqual(28);
});

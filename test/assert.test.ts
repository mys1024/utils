import { AssertionError, assertRejects } from "@std/assert";
import { delay } from "../src/main.ts";
import { assertDurationMeets } from "../src/assert.ts";

Deno.test("assertDurationMeets()", async (t) => {
  await t.step("meets", async () => {
    await Promise.all([
      assertDurationMeets(delay(100), { min: 100, max: 120 }),
      assertDurationMeets(delay(200), { min: 200, max: 220 }),
    ]);
  });

  await t.step("min & max", async () => {
    await assertRejects(
      () => assertDurationMeets(delay(100), { min: 200, max: 210 }),
      AssertionError,
      "which is less than the minimum duration of 200ms",
    );
    await assertRejects(
      () => assertDurationMeets(delay(200), { min: 100, max: 110 }),
      AssertionError,
      "which is more than the maximum duration of 110ms",
    );
  });

  await t.step("timeout", async () => {
    let timeoutId: number | undefined;
    const promise = new Promise<void>((resolve) => {
      timeoutId = setTimeout(resolve, 2000);
    });
    await assertRejects(
      () => assertDurationMeets(promise, { min: 100, max: 110 }),
      AssertionError,
      "The promise is taking too long to resolve or reject.",
    );
    clearTimeout(timeoutId);
  });

  await t.step("promise rejects", async () => {
    let timeoutId: number | undefined;
    const promise = new Promise<void>((_resolve, reject) => {
      timeoutId = setTimeout(() => reject("Reject!"), 120);
    });
    await assertRejects(
      () => assertDurationMeets(promise, { min: 100, max: 110 }),
      AssertionError,
      "which is more than the maximum duration of 110ms",
    );
    clearTimeout(timeoutId);
  });
});

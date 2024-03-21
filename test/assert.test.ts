import { AssertionError, assertRejects } from "@std/assert";
import { delay } from "../src/main.ts";
import { assertDurationIsWithin } from "../src/assert.ts";

Deno.test("assertDurationIsWithin()", async () => {
  await Promise.all([
    assertDurationIsWithin(delay(100), { min: 100, max: 120 }),
    assertDurationIsWithin(delay(200), { min: 200, max: 220 }),
  ]);
  await assertRejects(
    () => assertDurationIsWithin(delay(100), { min: 200, max: 210 }),
    AssertionError,
    "which is less than the minimum duration of 200ms",
  );
  await assertRejects(
    () => assertDurationIsWithin(delay(200), { min: 100, max: 110 }),
    AssertionError,
    "which is more than the maximum duration of 110ms",
  );
});

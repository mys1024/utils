import { assertEquals } from "@std/assert";
import { delay } from "../src/main.ts";

Deno.test("delay()", async (t) => {
  await t.step("case 1", async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();
    const duration = end - start;
    assertEquals(duration > 90, true);
    assertEquals(duration < 110, true);
  });

  await t.step("case 2", async () => {
    const start = Date.now();
    await delay(200);
    const end = Date.now();
    const duration = end - start;
    assertEquals(duration > 200, true);
    assertEquals(duration < 220, true);
  });
});

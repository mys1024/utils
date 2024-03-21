import { AssertionError } from "@std/assert";

export async function assertDurationIsWithin(
  promise: Promise<any>,
  options: {
    min?: number;
    max?: number;
  } = {},
) {
  const { min = -1, max = -1 } = options;
  let timeoutId: number | undefined;
  if (max !== -1) {
    timeoutId = setTimeout(() => {
      throw new AssertionError(
        "The promise is taking too long to resolve or reject.",
      );
    }, max + 100);
  }
  const start = Date.now();
  try {
    await promise;
  } catch {
    // ignore
  }
  clearTimeout(timeoutId);
  const end = Date.now();
  const duration = end - start;
  if (min !== -1 && duration < min) {
    throw new AssertionError(
      `The promise took ${duration}ms to resolve or reject, which is less than the minimum duration of ${min}ms.`,
    );
  }
  if (max !== -1 && duration > max) {
    throw new AssertionError(
      `The promise took ${duration}ms to resolve or reject, which is more than the maximum duration of ${max}ms.`,
    );
  }
}

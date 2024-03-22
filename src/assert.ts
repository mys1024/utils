/**
 * This module provides utils for assertions.
 */

import { AssertionError } from "@std/assert";

export function assertDurationMeets(
  promise: Promise<any>,
  options: {
    min?: number;
    max?: number;
  } = {},
) {
  return new Promise<void>((resolve, reject) => {
    const { min = -1, max = -1 } = options;
    let timeoutId: number | undefined;
    if (max !== -1) {
      timeoutId = setTimeout(() => {
        reject(
          new AssertionError(
            "The promise is taking too long to resolve or reject.",
          ),
        );
      }, max + 100);
    }
    const start = Date.now();
    promise
      .catch(() => {})
      .finally(() => {
        const end = Date.now();
        clearTimeout(timeoutId);
        const duration = end - start;
        if (min !== -1 && duration < min) {
          reject(
            new AssertionError(
              `The promise took ${duration}ms to resolve or reject, which is less than the minimum duration of ${min}ms.`,
            ),
          );
        }
        if (max !== -1 && duration > max) {
          reject(
            new AssertionError(
              `The promise took ${duration}ms to resolve or reject, which is more than the maximum duration of ${max}ms.`,
            ),
          );
        }
        resolve();
      });
  });
}

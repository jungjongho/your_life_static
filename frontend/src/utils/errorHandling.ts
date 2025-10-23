/**
 * Error Handling Utilities
 * Provides standardized error message extraction and handling
 *
 * @module utils/errorHandling
 */

/**
 * Extracts a user-friendly error message from various error types
 * Handles Error objects, strings, and unknown error types
 *
 * @param error - The error to extract a message from
 * @param fallbackMessage - Default message if error message cannot be determined
 * @returns Human-readable error message
 *
 * @example
 * try {
 *   await someAsyncOperation();
 * } catch (err) {
 *   const message = getErrorMessage(err, 'Operation failed');
 *   showToast(message);
 * }
 */
export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallbackMessage;
}

/**
 * Type guard to check if an error is an Error instance
 * Useful for TypeScript type narrowing
 *
 * @param error - Value to check
 * @returns True if error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

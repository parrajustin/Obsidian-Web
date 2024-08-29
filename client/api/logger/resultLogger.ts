import { Err } from "../../lib/result";
import type { StatusError } from "../../lib/status_error";

/**
 * Creates a failure message and logs it, returns the full message.
 * @param fail the result fail message to log
 * @param context the context if any
 */
export function logFailure(fail: Err<StatusError>, context?: string): string {
  let fullContext = "";
  if (context !== undefined) {
    fullContext = `[${context}]: `;
  }
  const logMessage = `${fullContext}${fail.val.toString()}`;
  console.error(logMessage);
  return logMessage;
}

export function LogCreateFailure(fail: StatusError, context?: string): Error {
  logFailure(Err(fail), context);
  return new Error(fail.toString());
}

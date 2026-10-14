import axios from "axios";

import { appConfig } from "../../config/appConfig";

const api = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: 20_000,
});

// ========================================
// ERROR MESSAGE
//
// Every API failure comes back as
// { message }, so this pulls out
// something worth showing the visitor.
// ========================================

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return "We could not reach the server. Please check your connection and try again.";
    }

    return error.response.data?.message || fallback;
  }

  return fallback;
}

export default api;

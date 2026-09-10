import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export function isValidationError(error: unknown): error is { response: { status: 422; data: ApiValidationError } } {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 422 &&
    typeof error.response?.data?.errors === "object"
  );
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === "string") {
    return error.response.data.message;
  }

  return fallback;
}

import axios from "axios";
import type { LoginCredentials, AuthResponse } from "@/types/type"; // Assuming you have a types file

// Create a configured axios instance (optional but good practice)
const apiClient = axios.create({
  baseURL: "http://localhost:4000/auth", // Your auth service URL
  // baseURL: "http://localhost:8080/api/auth", // Your auth service URL
  //
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sends login credentials to the auth service.
 * @param credentials - The user's email and password.
 * @returns A promise that resolves to the authentication response (token and user).
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  // TanStack Query handles try/catch automatically.
  // We just need to make the request and return the data.
  const response = await apiClient.post<AuthResponse>("/login", credentials);
  return response.data;
};

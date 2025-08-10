import axios from "axios";
import type { IUser, INewUser } from "@/types/type";

// Create a configured axios instance for the Admin Service
const adminApiClient = axios.create({
  baseURL: "http://localhost:4003/admin", // Your admin service URL
  // baseURL: "http://localhost:8080/api/admin",
});

// VERY IMPORTANT: Use an interceptor to automatically add the auth token
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API Functions ---

/**
 * Fetches all users from the admin service.
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  const response = await adminApiClient.get("/users");
  return response.data;
};

/**
 * Creates a new user.
 * @param userData - The data for the new user (email, password, role, name).
 */
export const addUser = async (userData: INewUser): Promise<IUser> => {
  const response = await adminApiClient.post("/users", userData);
  return response.data;
};

/**
 * Updates an existing user's details.
 * @param id - The ID of the user to update.
 * @param userData - The fields to update.
 */
export const updateUser = async (
  id: string | number,
  userData: Partial<INewUser>
): Promise<IUser> => {
  const response = await adminApiClient.put(`/users/${id}`, userData);
  return response.data;
};

/**
 * Deletes a user by their ID.
 * @param id - The ID of the user to delete.
 */
export const deleteUser = async (id: string | number): Promise<void> => {
  await adminApiClient.delete(`/users/${id}`);
};

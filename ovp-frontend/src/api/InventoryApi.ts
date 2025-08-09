import axios from "axios";
import type { IInventoryItem, INewInventoryItem } from "@/types/type";

// Create a configured axios instance for the Inventory Service
const inventoryApiClient = axios.create({
  baseURL: "http://localhost:4001/inventory", // Your inventory service URL
});

// IMPORTANT: Use an interceptor to automatically add the auth token to every request
inventoryApiClient.interceptors.request.use(
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

/** Fetches all inventory items. */
export const getAllItems = async (): Promise<IInventoryItem[]> => {
  const response = await inventoryApiClient.get("/items");
  return response.data;
};

/** Creates a new inventory item. */
export const addItem = async (
  itemData: INewInventoryItem
): Promise<IInventoryItem> => {
  const response = await inventoryApiClient.post("/items", itemData);
  return response.data;
};

/** Updates an existing inventory item. */
export const updateItem = async (
  id: string | number,
  itemData: Partial<INewInventoryItem>
): Promise<IInventoryItem> => {
  const response = await inventoryApiClient.put(`/items/${id}`, itemData);
  return response.data;
};

/** Deletes an inventory item by its ID. */
export const deleteItem = async (id: string | number): Promise<void> => {
  await inventoryApiClient.delete(`/items/${id}`);
};

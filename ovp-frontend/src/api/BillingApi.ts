import axios from "axios";
import type { INewSalePayload, ISaleReceipt } from "@/types/type";

// Create a configured axios instance for the Billing Service
const billingApiClient = axios.create({
  baseURL: "http://localhost:4002/billing",
});

// IMPORTANT: Use an interceptor to automatically add the auth token
billingApiClient.interceptors.request.use(
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
 * Creates a new sales transaction.
 * @param saleData - The payload containing items, tax, and discount.
 */
export const createSale = async (
  saleData: INewSalePayload
): Promise<ISaleReceipt> => {
  console.log("sent data to backend : ", saleData);
  const response = await billingApiClient.post("/sales", saleData);
  return response.data;
};

/**
 * Fetches the history of all sales.
 * NOTE: Your backend needs an endpoint like GET /sales for this to work.
 * If it doesn't exist, you'll need to add it.
 */
export const getSalesHistory = async (): Promise<ISaleReceipt[]> => {
  // Assuming a GET /sales endpoint exists on your billing service
  const response = await billingApiClient.get("/sales");
  return response.data;
};

/**
 * Fetches a single receipt by its ID.
 * @param receiptId - The ID of the receipt to fetch.
 */
export const getReceiptById = async (
  receiptId: string | number
): Promise<ISaleReceipt> => {
  const response = await billingApiClient.get(`/receipts/${receiptId}`);
  return response.data;
};

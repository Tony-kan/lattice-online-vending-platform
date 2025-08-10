export type UserProps = {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "inventory_manager" | "billing_clerk";
};

export type HeaderProps = {
  user: User | null;
  onLogout: () => void;
};

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
};

export type Module = {
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
  roles: User["role"][];
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: "admin" | "inventory_manager" | "billing_clerk";
  };
};

// ... other types

export type UserRole = "ADMIN" | "INVENTORY_MANAGER" | "BILLING_CLERK";

export interface IUser {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// For creating a new user
export interface INewUser {
  email: string;
  password?: string; // Password is required for new users, but optional for updates
  role: UserRole;
  name: string;
}

// ... other types

export interface IInventoryItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

// For the "add/edit" form
export interface INewInventoryItem {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

// ... (your existing types)

// An item within a sale request or receipt
export interface ISaleItem {
  item_id: number | string;
  quantity: number;
  name?: string; // Optional: For display purposes on the frontend
  price?: number; // Optional: For display purposes on the frontend
}

// The payload sent to the backend to create a new sale
export interface INewSalePayload {
  items: {
    item_id: number | string;
    quantity: number;
  }[];
  tax: number;
  discount: number;
}

// The receipt object returned by the backend after a sale is created
export interface ISaleReceipt {
  id: number | string;
  receipt: string;
  total: number;
  tax: number;
  discount: number;
  items: ISaleItem[];
  created_at: string;
}

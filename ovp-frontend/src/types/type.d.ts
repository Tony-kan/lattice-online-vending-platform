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

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
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: "admin" | "inventory_manager" | "billing_clerk";
  };
};

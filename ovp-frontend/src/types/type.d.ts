// Represents a logged-in user
export type UserProps = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

// Props for the Header component
export type HeaderProps = {
  user: User | null; // null means not logged in
  onLogout: () => void;
};

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

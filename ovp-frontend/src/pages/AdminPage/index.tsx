import ModuleLayout from "@/components/layout/ModuleLayout";
import type { BreadcrumbItem } from "@/types/type";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Modules", href: "/modules" },
  { label: "Admin", href: "/admin" },
];

const AdminPage = () => {
  return (
    <ModuleLayout title="Admin : User Management" breadcrumbs={breadcrumbItems}>
      <div>AdminPage</div>
    </ModuleLayout>
  );
};

export default AdminPage;

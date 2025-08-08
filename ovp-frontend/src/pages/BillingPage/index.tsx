import ModuleLayout from "@/components/layout/ModuleLayout";
import type { BreadcrumbItem } from "@/types/type";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Modules", href: "/modules" },
  { label: "Billing", href: "/billing" },
];

const BillingPage = () => {
  return (
    <ModuleLayout title="Billing Management" breadcrumbs={breadcrumbItems}>
      <div>BillingPage</div>
    </ModuleLayout>
  );
};

export default BillingPage;

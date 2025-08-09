import { useEffect, useState } from "react";
import ModuleLayout from "@/components/layout/ModuleLayout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import type { BreadcrumbItem, Module, UserProps } from "@/types/type";
import { Building, DollarSign, Users, Monitor } from "lucide-react";

// Define the breadcrumbs for this specific page
const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/modules" }];

const ALL_MODULES: Module[] = [
  {
    name: "Inventory",
    path: "/inventory",
    icon: <Building className="h-8 w-8 text-amber-500" />,
    description: "Manage stock, monitor levels, and handle items.",
    roles: ["admin", "inventory_manager"],
  },
  {
    name: "Billing",
    path: "/billing",
    icon: <DollarSign className="h-8 w-8 text-amber-500" />,
    description: "Process sales transactions and generate receipts.",
    roles: ["admin", "billing_clerk"],
  },
  {
    name: "Admin Center",
    path: "/admin",
    icon: <Users className="h-8 w-8 text-amber-500" />,
    description: "Manage system users, roles, and permissions.",
    roles: ["admin"],
  },
];

const ModulePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("user data ", userData);
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const availableModules = user
    ? ALL_MODULES.filter((module) =>
        module.roles.includes(user.role?.toLowerCase())
      )
    : [];

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Monitor className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <ModuleLayout title="Application Modules" breadcrumbs={breadcrumbs}>
      <main>
        <div className="max-w-10xl mx-auto gap-6 py-8 sm:px-6 lg:px-0">
          <div className="px-4 pb-4 sm:px-0">
            <h2 className="text-xl font-semibold text-slate-800">
              Available Modules
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Select a module to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
            {availableModules.map((module) => (
              <Link
                to={module.path}
                key={module.name}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
              >
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full border">
                  <CardHeader>{module.icon}</CardHeader>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-3xl font-bold">
                      {module.name}
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="px-6 pb-6">
                    {module.description}
                  </CardDescription>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </ModuleLayout>
  );
};

export default ModulePage;

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Header from "@/components/common/Header";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Building, DollarSign, Users, Monitor } from "lucide-react";

interface User {
  id: number;
  email: string;
  name?: string;
  role: "admin" | "inventory_manager" | "billing_clerk";
}

interface Module {
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
  roles: User["role"][];
}

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const availableModules = ALL_MODULES;

  // Show a loading state until the user is verified
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Monitor className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }
  console.log("available modules", availableModules);
  return (
    <div className="min-h-screen bg-slate-100">
      {/* 1. Header: Using your existing shared component */}
      <Header user={user} onLogout={handleLogout} />

      {/* 2. Separator: The visual divider you requested */}
      <Separator className="bg-amber-500/20" />

      <main>
        <div className="max-w-7xl mx-auto gap-6 py-8 sm:px-6 lg:px-8">
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
    </div>
  );
};

export default ModulePage;

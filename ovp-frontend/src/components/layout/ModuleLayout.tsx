// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../common/Header";
// import { Separator } from "@/components/ui/separator";

// interface User {
//   id: number;
//   email: string;
//   role: "admin" | "inventory_manager" | "billing_clerk";
// }

// interface ModuleLayoutProps {
//   children: React.ReactNode;
//   title: string;
//   description: string;
// }

// const ModuleLayout: React.FC<ModuleLayoutProps> = ({
//   children,
//   title,
//   description,
// }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<User | null>(null);

//   // This effect ensures user is authenticated on module pages
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (!userData) {
//       navigate("/login");
//     } else {
//       setUser(JSON.parse(userData));
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   if (!user) {
//     return null; // or a loading spinner
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header with user info and logout */}
//       <Header user={user} onLogout={handleLogout} />

//       {/* The separator you wanted */}
//       <Separator className="bg-amber-500/30" />

//       {/* Main content area for the specific module */}
//       <main>
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ModuleLayout;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Import the new Breadcrumbs component and its type
// import Breadcrumbs, { BreadcrumbItem } from "../common/Breadcrumbs";
import Breadcrumbs from "../common/Breadcrumbs";
import type { BreadcrumbItem } from "@/types/type";

interface User {
  id: number;
  email: string;
  name?: string; // Add name as optional for the Header
  role: "admin" | "inventory_manager" | "billing_clerk";
}

// Update props to accept a breadcrumbs array
interface ModuleLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs: BreadcrumbItem[]; // This is the new prop
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  children,
  title,
  breadcrumbs, // Destructure the new prop
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header user={null} onLogout={() => {}} />
        <Separator className="bg-amber-500/30" />
        <main>
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Skeleton for Breadcrumbs */}
            <Skeleton className="h-5 w-48 mb-4" />
            {/* Skeleton for Title */}
            <Skeleton className="h-8 w-64 mb-6" />
            {/* Skeleton for Content */}
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={handleLogout} />
      <Separator className="bg-amber-500/30" />
      <main>
        <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          {/* Render the breadcrumbs here */}
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* The module title */}
          <h1 className="text-3xl font-bold text-slate-900 mb-6">{title}</h1>

          {/* The module-specific content */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default ModuleLayout;

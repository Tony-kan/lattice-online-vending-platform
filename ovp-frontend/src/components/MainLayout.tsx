import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header"; 
import type { UserProps } from "@/types/type";
import { Separator } from "./ui/separator";

const MainLayout = () => {
  const [user, setUser] = useState<UserProps | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return null; 
  }

  return (
    <div className="h-full w-full bg-slate-50">
      <Header user={user} onLogout={handleLogout} />

      <Separator className="bg-amber-500/20" />

      <main className="min-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8 h-[calc(100vh_-_16vh)]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

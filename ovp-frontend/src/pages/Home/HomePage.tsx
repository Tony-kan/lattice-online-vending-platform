import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import { Separator } from "@/components/ui/separator";
import type { UserProps } from "@/types/type";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, setUser] = useState<UserProps | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // Update the UI immediately
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      <Separator className="bg-amber-500/50" />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Lattice Online Vending Platform
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          A seamless, AI-powered platform for managing vending operations.
          Monitor sales , manage inventory and users.
        </p>
      </main>
    </div>
  );
};

export default HomePage;

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import { Separator } from "@/components/ui/separator";
import type { UserProps } from "@/types/type";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      <Separator className="bg-amber-500/50" />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 ">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Lattice Online Vending Platform
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          A seamless, Online platform for managing vending operations. Monitor
          sales , manage inventory and manage users.
        </p>
        {user ? (
          <Button
            variant="default"
            className="mt-6 bg-amber-500 border-2 rounded-sm border-transparent font-extrabold text-white hover:text-amber-500 hover:border-amber-500 hover:bg-transparent active:bg-amber-600 active:text-white"
            onClick={() => navigate("/modules")}
          >
            Go to Modules Page
          </Button>
        ) : null}
      </main>
    </div>
  );
};

export default HomePage;

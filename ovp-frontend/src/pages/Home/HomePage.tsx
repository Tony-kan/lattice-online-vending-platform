import React, { useState } from "react";
import Header from "@/components/common/Header";
import { Separator } from "@/components/ui/separator";
import type { UserProps } from "@/types/type";

const HomePage = () => {
  const [user, setUser] = useState<UserProps | null>({
    id: "1",
    name: "Tony Kanyamuka",
    email: "tony@example.com",
  });

  const handleLogout = () => {
    setUser(null);
    console.log("User logged out");
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

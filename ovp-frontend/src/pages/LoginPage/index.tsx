import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, Eye, EyeOff, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      //   const response = await axios.post("http://localhost:3001/login", {
      //     email,
      //     password,
      //   });
      const response = {
        data: {
          accessToken: "mk",
          user: {
            id: "1",
            email: "tonykanyamuka@gmail.com",
            role: "admin",
          },
        },
      };
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response?.data?.user));
      navigate("/modules");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-amber-500 text-white p-12 text-center">
        <Monitor size={100} className="mb-6" />
        <h1 className="text-4xl font-bold mb-4">Welcome to Lattice OVP</h1>
        <p className="text-lg text-amber-100">
          Your one-stop solution for managing vending operations seamlessly.
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent pb-2">
              Lattice Vending Platform
            </h1>
            <CardDescription>
              Enter your credentials to access your Modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full h-12 bg-amber-500 border-2 border-transparent  text-white font-extrabold text-md hover:bg-transparent hover:border-amber-500 hover:text-amber-500"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

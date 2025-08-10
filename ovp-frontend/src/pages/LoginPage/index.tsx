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
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/AuthApi";
import type { AuthResponse, LoginCredentials } from "@/types/type";
import type { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiError {
  error: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // --- TanStack Query Mutation ---

  const loginMutation = useMutation<
    AuthResponse,
    AxiosError<ApiError>, // We specify that the error is an AxiosError with our custom ApiError shape
    LoginCredentials
  >({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name || "User"}!`);
      navigate("/modules");
    },
    onError: (error) => {
      toast.error("Login Failed", {
        description:
          error.response?.data?.error || "Invalid credentials or server error.",
        duration: 5000, // Keep the error on screen a bit longer
      });
    },
  });

  // The new submit handler simply calls the mutation.
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-amber-500 text-white p-12 text-center">
        <Link to="/">
          <Monitor size={100} className="mb-6" />
        </Link>
        <h1 className="text-4xl font-bold mb-4">Welcome to Lattice OVP</h1>
        <p className="text-lg text-amber-100">
          Your one-stop solution for managing vending operations seamlessly.
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <Link to="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent pb-2">
                Lattice Vending Platform
              </h1>
            </Link>
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

              {loginMutation.isError && (
                <p className="text-sm text-center text-red-500 capitalize">
                  {loginMutation.error.response?.data?.error ||
                    "An unexpected error occurred. Please try again."}
                </p>
              )}
              <Button
                type="submit"
                className="w-full h-12 bg-amber-500 border-2 border-transparent  text-white font-extrabold text-md hover:bg-transparent hover:border-amber-500 hover:text-amber-500 active:bg-amber-600 active:text-white"
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

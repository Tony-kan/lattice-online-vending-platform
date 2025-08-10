// import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/LoginPage";
import ModulePage from "./pages/ModulePage";
import InventoryPage from "./pages/InventoryPage";
import BillingPage from "./pages/BillingPage";
import AdminPage from "./pages/AdminPage";

import ProtectedRoute from "./components/ProtectedRoutes";
import AccessDeniedPage from "./pages/AccessDeniedPage";

import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            <Route element={<MainLayout />}>
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "admin",
                      "inventory_manager",
                      "billing_clerk",
                    ]}
                  />
                }
              >
                <Route path="/modules" element={<ModulePage />} />
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "inventory_manager"]}
                  />
                }
              >
                <Route path="/inventory" element={<InventoryPage />} />
              </Route>

              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin", "billing_clerk"]} />
                }
              >
                <Route path="/billing" element={<BillingPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>

            {/* == Catch-all Route == */}
            {/* Redirects any invalid URL to a safe default page */}
            <Route path="*" element={<Navigate to="/modules" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors duration={3000} />
      </QueryClientProvider>
    </>
  );
}

export default App;

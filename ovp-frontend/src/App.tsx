// import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/Home/HomePage";

import LoginPage from "./pages/LoginPage";
import ModulePage from "./pages/ModulePage";
import InventoryPage from "./pages/InventoryPage";
import BillingPage from "./pages/BillingPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import AccessDeniedPage from "./pages/AccessDeniedPage";

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

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "inventory_manager", "billing_clerk"]}
                />
              }
            >
              <Route path="/modules" element={<ModulePage />} />
            </Route>

            {/* Routes for Inventory staff and Admins */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "inventory_manager"]} />
              }
            >
              <Route path="/inventory" element={<InventoryPage />} />
            </Route>

            {/* Routes for Billing staff and Admins */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "billing_clerk"]} />
              }
            >
              <Route path="/billing" element={<BillingPage />} />
            </Route>

            {/* Routes for Admins ONLY */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* == Catch-all Route == */}
            {/* Redirects any invalid URL to a safe default page */}
            <Route path="*" element={<Navigate to="/modules" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Layout from "./Layout";
import Home from "./assets/component/shared/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import FarmerDashboard from "./pages/farmer/Dashboard";
import FarmerLayout from "./layouts/FarmerLayout";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";

// Get the Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Custom error fallback
function ErrorFallback({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-4">

        {/* Admin routes - protected by AdminLayout */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        {/* Farmer routes - protected by FarmerLayout */}
        <Route
          path="/farmer"
          element={
            <FarmerLayout>
              <FarmerDashboard />
            </FarmerLayout>
          }
        />
      </Routes>

      <Toaster richColors />
    </ClerkProvider>
  );
}

export default App;

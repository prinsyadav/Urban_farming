import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Layout from "./Layout";
import Home from "./assets/component/shared/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import FarmerDashboard from "./pages/farmer/Dashboard";
import FarmerLayout from "./layouts/FarmerLayout";
import { Toaster } from "sonner";
import ErrorPage from "./pages/ErrorPage";

// Get the Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  // Function to handle routing after sign-in
  const redirectAfterSignIn = (userData) => {
    const userRole = userData.publicMetadata?.role;

    if (userRole === "admin") return "/admin";
    if (userRole === "farmer") return "/farmer";
    return "/"; // Default redirect
  };

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => (window.location.href = to)}
      afterSignInUrl={(userData) => redirectAfterSignIn(userData)}
    >
      <Routes>
        <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
          <Route index element={<Home />} />

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
        </Route>
      </Routes>

      <Toaster position="top-right" richColors />
    </ClerkProvider>
  );
}

export default App;

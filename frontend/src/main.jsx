import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./assets/component/shared/Home.jsx";
import About from "./assets/component/shared/About.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import FarmerLayout from "./layouts/FarmerLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import FarmerDashboard from "./pages/farmer/Dashboard.jsx";
import { PlotProvider } from "./contexts/PlotContext.jsx";
import { Toaster } from "sonner";
import ErrorPage from "./pages/ErrorPage.jsx";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />

      {/* Admin Routes */}
      <Route
        path="admin"
        element={
          <AdminLayout>
            <PlotProvider>
              <AdminDashboard />
            </PlotProvider>
          </AdminLayout>
        }
      />

      {/* Farmer Routes */}
      <Route
        path="farmer"
        element={
          <FarmerLayout>
            <FarmerDashboard />
          </FarmerLayout>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
      {/* <Toaster position="top-right" richColors /> */}
    </ClerkProvider>
  </StrictMode>
);

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
// import FarmerLayout from "./layouts/FarmerLayout.jsx"; // We'll create this
import AdminDashboard from "./pages/admin/Dashboard.jsx";
// import FarmerDashboard from "./pages/farmer/FarmerDashboard.jsx"; // Our new component
import { PlotProvider } from "./contexts/PlotContext.jsx";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <PlotProvider>
              <AdminDashboard />
            </PlotProvider>
          </AdminLayout>
        }
      />
      {/* <Route
        path="/farmer-dashboard"
        element={
          <FarmerLayout>
            <FarmerDashboard />
          </FarmerLayout>
        }
      /> */}
      <Route path="/about" element={<About />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);

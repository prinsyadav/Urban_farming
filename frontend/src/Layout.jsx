import { Outlet } from "react-router-dom";
import Navbar from "./assets/component/shared/Navbar";
import Footer from "./assets/component/shared/Footer";
import { Toaster } from "sonner";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default Layout;

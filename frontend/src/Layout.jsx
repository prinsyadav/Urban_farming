import { Outlet } from "react-router-dom";
import Footer from "./assets/component/shared/Footer";
import Header from "./assets/component/shared/Header";
import { Toaster } from "sonner";

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
      <Toaster richColors />
    </div>
  );
}

export default Layout;

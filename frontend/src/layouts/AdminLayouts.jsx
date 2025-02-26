import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Toaster } from "sonner";

function AdminLayout({ children }) {
  const { user, isLoaded } = useUser();

  // Show loading state while clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect if not admin
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}

export default AdminLayout;

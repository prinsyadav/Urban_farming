import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function FarmerLayout({ children }) {
  const { isLoaded, user } = useUser();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if the user is a farmer
  const isFarmer = user?.publicMetadata?.role === "farmer";

  // If not a farmer, redirect to home page
  if (!isFarmer) {
    return <Navigate to="/" replace />;
  }

  // User is a farmer, render the children (farmer dashboard)
  return <>{children}</>;
}

export default FarmerLayout;

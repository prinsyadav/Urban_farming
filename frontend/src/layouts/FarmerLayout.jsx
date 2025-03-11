import { useUser } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

function FarmerLayout({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Once Clerk has loaded, verify the user
    if (isLoaded) {
      // If user isn't signed in, redirect to sign in
      if (!isSignedIn) {
        navigate("/sign-in");
        return;
      }

      // Check if user has farmer role and an owner_id
      const isFarmer = user?.publicMetadata?.role === "farmer";
      const hasOwnerId = !!user?.publicMetadata?.owner_id;

      if (!isFarmer) {
        navigate("/");
      } else if (!hasOwnerId) {
        console.warn("User has farmer role but no owner_id in metadata");
        // We'll still allow access but the dashboard will show a warning
      }

      setIsVerifying(false);
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  // Show loading state while clerk is loading or while we verify permissions
  if (!isLoaded || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}

export default FarmerLayout;

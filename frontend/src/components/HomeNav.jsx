import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Farm,
  LogIn,
  UserPlus,
  LogOut,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";

export function HomeNav() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setUserRole(user?.publicMetadata?.role);
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin";
      case "farmer":
        return "/farmer";
      default:
        return "/";
    }
  };

  if (!isLoaded) {
    return null; // Don't render anything while loading
  }

  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <>
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to={getDashboardLink()}>
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
          </Button>

          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/sign-in">
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </Link>
          </Button>
          <Button variant="default" asChild className="flex items-center gap-2">
            <Link to="/sign-up">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign up
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

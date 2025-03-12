import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { LayoutDashboard, Home, Info, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine user role
  const userRole = user?.publicMetadata?.role || "user";

  // Dashboard link based on user role
  const getDashboardLink = () => {
    if (userRole === "admin") return "/admin";
    if (userRole === "farmer") return "/farmer";
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-bold text-xl text-green-600">
                UrbanFarm
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link
                to="/"
                className="flex items-center gap-1 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              <Link
                to="/about"
                className="flex items-center gap-1 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Info className="h-4 w-4" />
                About
              </Link>

              {/* Show dashboard link only if user has a role with a dashboard */}
              {isSignedIn && dashboardLink && (
                <Link
                  to={dashboardLink}
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <SignedOut>
              <div className="flex space-x-2">
                <SignInButton
                  mode="modal"
                  afterSignInUrl={dashboardLink || "/"}
                >
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-500">
                  Welcome, {user?.firstName || user?.username || "User"}
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-4 w-4" />
              About
            </Link>

            {/* Show dashboard link only if user has a role with a dashboard */}
            {isSignedIn && dashboardLink && (
              <Link
                to={dashboardLink}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <SignedOut>
              <div className="flex flex-col space-y-2 px-3">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full justify-center">Sign Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center">
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.firstName || user?.username || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.primaryEmailAddress?.emailAddress || ""}
                    </div>
                  </div>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

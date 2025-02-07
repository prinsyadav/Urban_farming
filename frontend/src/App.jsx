import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignUpButton,
  useUser,
  useOrganization,
} from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function App() {
  const [greeting, setGreeting] = useState("");
  const { user } = useUser();
  const { organization } = useOrganization();

  // Handle role assignment during sign in
  const handleSignIn = async (selectedRole) => {
    try {
      // Update user metadata with role
      await user?.update({
        publicMetadata: { role: selectedRole },
      });

      // Fetch greeting after role is set
      const response = await fetch("http://localhost:3000/api/greeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          userId: user.id,
        }),
      });
      const data = await response.json();
      setGreeting(data.message);
    } catch (error) {
      console.error("Error setting role:", error);
    }
  };

  useEffect(() => {
    // Moved checkUserRole inside useEffect
    const checkUserRole = async () => {
      if (!user) return null;
      try {
        const role = user.publicMetadata.role;
        return role;
      } catch (error) {
        console.error("Error checking role:", error);
        return null;
      }
    };

    if (user) {
      checkUserRole().then((role) => {
        if (role) {
          fetch("http://localhost:3000/api/greeting", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              role,
              userId: user.id,
            }),
          })
            .then((response) => response.json())
            .then((data) => setGreeting(data.message))
            .catch((error) => console.error("Error fetching greeting:", error));
        }
      });
    }
  }, [user]); // Now we only need user in dependencies

  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        {/* Left section (empty for now) */}
        <div></div>

        {/* Center navigation */}
        <nav className="flex gap-6">
          <a href="/" className="hover:text-gray-600">
            Home
          </a>
          <a href="/about" className="hover:text-gray-600">
            About
          </a>
        </nav>

        {/* Right authentication section */}
        <div className="flex gap-4">
          <SignedOut>
            <div className="flex gap-4">
              <SignInButton mode="modal">
                <button
                  onClick={() => handleSignIn("user")}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
                >
                  Sign in as User
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button
                  onClick={() => handleSignIn("admin")}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded"
                >
                  Sign in as Admin
                </button>
              </SignInButton>
            </div>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded">
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Main content area */}
      <main className="p-4">
        <SignedIn>
          {greeting && (
            <div className="text-center text-xl font-bold">{greeting}</div>
          )}
        </SignedIn>
      </main>

      <footer className="p-4 bg-white shadow-sm mt-auto">
        <div className="text-center">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

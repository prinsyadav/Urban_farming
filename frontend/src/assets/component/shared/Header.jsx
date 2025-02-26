import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignUpButton,
  useUser,
  useOrganization,
} from "@clerk/clerk-react";
// import { useState, useEffect } from "react";

function Header() {
  return (
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
              <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded">
                Sign in
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
  );
}

export default Header;

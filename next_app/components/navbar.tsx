"use client";
import { useContext } from "react";
import { AuthContext } from "./providers/auth-provider";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <h1 className="text-2xl font-bold">My App Navbar</h1>
      {user ? (
        <div>
          <span>Welcome, {user.email}</span>
          <button onClick={logout} className="ml-4 underline">
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link href="/auth/login">Log in</Link>
        </div>
      )}
    </nav>
  );
}

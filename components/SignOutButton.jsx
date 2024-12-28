"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const handleSignOut = async () => {
  try {
    await signOut("google", { callbackUrl: "/" });
  } catch (error) {
    throw new Error("Failed to sign out");
  }
};

export default function SignOutButton() {
  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-all duration-200 w-full mt-auto border-y"
    >
      <LogOut size={24} className="text-white" />
      <span className="font-medium">Sign Out</span>
    </button>
  );
}

"use client";
import button from "@/components/ui/button";
import { signOut } from "next-auth/react";

const handleSignOut = async () => {
  try {
    await signOut("google", { callbackUrl: "/" });
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export default function Component() {
  return (
    <button
      onClick={handleSignOut}
      className="bg-primary text-primary-foreground shadow hover:bg-primary/90"
      style={{
        height: "20%",
        width: "50%",
        borderRadius: "10px",
        color: "white",
      }}
    >
      <span>Sign Out</span>
    </button>
  );
}

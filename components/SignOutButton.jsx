"use client";
import button from "@/components/ui/button";
import { signOut } from "next-auth/react";

const handleSignOut = async () => {
  try {
    await signOut("google", { callbackUrl: "/" });
  } catch (error) {
    throw new Error("Failed to sign out");
  }
};

export default function Component() {
  return (
    <button
      onClick={handleSignOut}
      className="text-primary-foreground signoutbutton"
      style={{
        height: "20%",
        width: "50%",
        fontFamily: "inherit",
      }}
    >
      SIGN OUT
    </button>
  );
}

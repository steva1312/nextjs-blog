"use client";

import { signOut } from "@/lib/auth";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export default function SignOutButton() {
  async function onClick() {
    const wait = signOut();

    toast.promise(wait, {
      loading: "Signing out...",
      success: "Signed out",
      error: "Something went wrong."
    });
  }

  return (
    <Button className="text-base" onClick={onClick}>
      Sign out
    </Button>
  );
}
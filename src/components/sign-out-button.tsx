"use client";

import { signOut } from "@/lib/auth";
import { Button } from "./ui/button";

export default function SignOutButton() {
  return (
    <Button className="text-base" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
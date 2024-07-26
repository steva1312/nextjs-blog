"use client";

import { signOut } from "@/lib/auth";

export default function SignOutButton() {
  return (
    <button className="bg-black text-white text-lg p-2" onClick={() => signOut()}>
      Sign out
    </button>
  );
}
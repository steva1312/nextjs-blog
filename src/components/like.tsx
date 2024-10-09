"use client";

import { UserSelect } from "@/lib/schema-types";
import { RiHeartLine } from "@remixicon/react";
import { useRouter } from "next/navigation";

export default function Like({ user } : { user: UserSelect | null }) {
  const router = useRouter();

  function onClick() {
    if (!user) {
      router.push("/auth");
    }
  }

  return (
    <button onClick={onClick} className="flex gap-[2px]">
      <RiHeartLine />21
    </button>
  );
}